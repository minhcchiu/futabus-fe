<script setup lang="ts">
import { toast } from "vue-sonner";
import {
  BookingStatus,
  PaymentStatus,
} from "~/validations/admin/booking.validation";

const router = useRouter();
const route = useRoute();
const bookingStore = useBookingStore();
const sepayStore = useSepayStore();
const settingStore = useSettingStore();

const booked = computed(() => bookingStore.selected);
const banks = computed(() => sepayStore.list);
const setting = computed(() => settingStore.selected);

const methodSelected = ref<string | undefined>(
  booked.value?.paymentInfo.method,
);
const bankSelected = computed(() => getSepayByMethod(methodSelected.value));

onMounted(async () => {
  const bookingId = route.query.booking_id as string;
  await bookingStore.fetchById(bookingId!, {
    _populate:
      "fromStopId,toStopId,tripId,tripId.routeId,tripId.routeId.startStopId endStopId,seatIds",
  });

  checkExpire();
  timer = window.setInterval(checkExpire, 1000);
  await sepayStore.fetchAll({ isUse: true });
  await settingStore.fetchOne();

  methodSelected.value =
    booked.value?.paymentInfo.method || banks.value[0]?.code || "CASH";

  await generateQRCode();
});

const getSepayByMethod = (method?: string) => {
  if (!method) return;

  return banks.value.find((s) => s.code === method);
};

const isExpired = ref(false);

let timer: number | undefined;

const checkExpire = () => {
  isExpired.value = Date.now() >= booked.value!.expireAt;
};

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const getQRCode = async (method?: string) => {
  if (!method) return;

  const bankInfo = getSepayByMethod(method);
  if (!bankInfo) return;

  const { url } = await sepayStore.generateQRCode({
    amount: booked.value?.amount || 0,
    bankInfo: {
      bankName: bankInfo!.code!,
      accountNumber: bankInfo!.bankInfo.accountNumber!,
    },
    orderCode: booked.value!.code!,
  });

  return url;
};

const qrCodeUrl = ref<string | undefined>();

const generateQRCode = async () => {
  qrCodeUrl.value = await getQRCode(methodSelected.value);
};

watch(methodSelected, async () => {
  if (methodSelected.value && methodSelected.value !== "CASH") {
    await generateQRCode();
  } else {
    qrCodeUrl.value = undefined;
  }
});

const onPayment = async () => {
  if (booked.value?.status !== BookingStatus.PENDING) {
    toast.error("Chuyến đi đã được xác nhận rồi");
    return;
  }

  const paymentInfo = {
    status: PaymentStatus.PAID,
    amount: booked.value!.amount,
    method: methodSelected.value,
  };

  if (!methodSelected.value) {
    toast.error("Vui lòng chọn phương thức thanh toán");
    return;
  }

  const confirmed = await bookingStore.updateStatus(booked.value!._id, {
    status: BookingStatus.CONFIRMED,
    // @ts-ignore
    paymentInfo,
  });

  toast.success("Đã xác nhận chuyến đi");

  router.push({
    path: "/ticket-lookup",
    query: {
      phone: confirmed?.customerInfo.phone,
    },
  });
};
</script>

<template>
  <div>
    <!-- ===== LOADING ===== -->
    <div
      v-if="bookingStore.loading"
      class="flex min-h-[60vh] items-center justify-center"
    >
      <div class="flex flex-col items-center gap-3 text-gray-500">
        <svg
          class="h-8 w-8 animate-spin text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>

        <span class="text-sm">Đang tải thông tin đặt vé...</span>
      </div>
    </div>

    <!-- ===== DESKTOP ===== -->
    <DesktopPayment
      v-if="booked"
      :booked="booked"
      :banks="banks"
      :setting="setting"
      :method-selected="methodSelected"
      :qr-code-url="qrCodeUrl"
      :is-expired="isExpired"
      :loading="bookingStore.loading"
      @update:method="methodSelected = $event"
      @payment="onPayment"
    />

    <!-- ===== MOBILE ===== -->
    <div
      v-if="booked"
      class="fixed inset-0 z-[99] flex min-h-screen flex-col bg-gray-100 md:hidden"
    >
      <MobilePayment
        v-if="booked"
        :booked="booked"
        :banks="banks"
        :setting="setting!"
        :getQrCode="getQRCode"
        :loading="bookingStore.loading"
      />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
