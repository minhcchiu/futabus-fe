<script setup lang="ts">
import { toast } from "vue-sonner";
import { useUploadStore } from "~/stores/pre-built/upload.store";
import {
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
} from "~/validations/admin/booking.validation";

const router = useRouter();
const route = useRoute();
const bookingStore = useBookingStore();
const uploadStore = useUploadStore();

const booked = computed(() => bookingStore.selected);

onMounted(async () => {
  const bookingId = route.query.booking_id as string;
  await bookingStore.fetchById(bookingId!, {
    _populate:
      "fromStopId,toStopId,tripId,tripId.routeId,tripId.routeId.startStopId endStopId,seatIds",
  });

  checkExpire();
  timer = window.setInterval(checkExpire, 1000);
});

const paymentMethod = ref<PaymentMethod>(
  booked.value?.paymentInfo.method || PaymentMethod.VNPAY,
);

const isExpired = ref(false);

let timer: number | undefined;

const checkExpire = () => {
  isExpired.value = Date.now() >= booked.value!.expireAt;
};

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const onPayment = async (input: {
  filePayment: File | null;
  bookingId: string;
  paymentMethod: PaymentMethod;
}) => {
  if (booked.value?.status === BookingStatus.CONFIRMED) {
    toast.error("Chuyến đi đã được xác nhận");
    return;
  }

  const paymentInfo = {
    status:
      input.paymentMethod === PaymentMethod.CASH
        ? PaymentStatus.PENDING
        : PaymentStatus.PAID,
    amount: booked.value!.amount,
    method: input.paymentMethod,
    image: undefined as unknown as string,
  };

  // TODO: Implement confirm logic
  if (input.paymentMethod !== PaymentMethod.CASH && !input.filePayment) {
    toast.error("Vui lòng tải hình thanh toán");

    const res = await uploadStore.uploadFile({
      file: input.filePayment!,
    });

    paymentInfo.image = res.url;
    return;
  }

  const confirmed = await bookingStore.updateStatus(input.bookingId, {
    status: BookingStatus.CONFIRMED,
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
    <div class="mx-auto hidden px-4 py-6 md:block">
      <div class="grid grid-cols-12 gap-6">
        <!-- LEFT -->
        <div class="col-span-4 space-y-4 rounded-xl bg-white">
          <PaymentMethodList v-model="paymentMethod" />
        </div>

        <!-- CENTER -->
        <div class="col-span-4">
          <div v-if="booked && !isExpired">
            <PaymentQRCode
              v-if="paymentMethod !== PaymentMethod.CASH"
              :amount="booked.amount"
              :expire="booked.expireAt"
              :method="paymentMethod"
            />

            <CounterPaymentInfo v-else />
          </div>

          <div v-else class="rounded-xl bg-red-50 p-6 text-center text-red-600">
            ⛔ Thời gian thanh toán đã hết hiệu lực
            <br />
            Vui lòng đặt vé lại
          </div>
        </div>

        <!-- RIGHT -->
        <div class="col-span-4 space-y-4">
          <PassengerInfoCard :customer-info="booked?.customerInfo" />
          <TripInfoCard v-if="booked" :booked="booked" />
          <PriceDetailCard v-if="booked" :booked="booked" />
        </div>
      </div>

      <BankTransferConfirm
        v-if="booked"
        :amount="booked?.amount"
        :expire="booked.expireAt"
        :disabled="isExpired"
        :booking-id="booked._id"
        :payment-method="paymentMethod"
        :is-submitting="bookingStore.loading"
        @payment="onPayment"
      />
    </div>

    <div
      class="fixed inset-0 z-[99] flex min-h-screen flex-col bg-gray-100 md:hidden"
    >
      <MobilePayment
        v-if="booked"
        :booked="booked"
        :is-submitting="bookingStore.loading"
        @payment="onPayment"
      />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
