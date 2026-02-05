<script setup lang="ts">
import { ref } from "vue";
import { toast } from "vue-sonner";
import { formatDate } from "~/utils/helpers/data.helper";
import {
  BookingStatus,
  type Booking,
} from "~/validations/admin/booking.validation";
import type { Sepay } from "~/validations/admin/sepay.validation";
import type { Setting } from "~/validations/admin/setting.validation";

const props = defineProps<{
  setting: Setting;
  booked: Booking;
  banks: Sepay[];
  loading: boolean;
  getQrCode: (method?: string) => Promise<string | undefined>;
}>();
const router = useRouter();

const submitting = computed(() => props.loading);
const methodSelected = ref<string | undefined>(
  props.booked.paymentInfo?.method,
);
const bookingStore = useBookingStore();

const showMethodSheet = ref(false);
const showQRModal = ref(false);

const canConfirm = ref(false);
let confirmTimer: number | undefined;

const selectMethod = (m: string) => {
  methodSelected.value = m;
  showMethodSheet.value = false;
  showQRModal.value = true;

  canConfirm.value = false;

  if (confirmTimer) clearTimeout(confirmTimer);

  confirmTimer = window.setTimeout(() => {
    canConfirm.value = true;
  }, 2000);
};

watch(showQRModal, (val) => {
  if (!val) {
    canConfirm.value = false;
    if (confirmTimer) clearTimeout(confirmTimer);
  }
});

const qrCodeUrl = ref<string | undefined>();

const generateQRCode = async () => {
  qrCodeUrl.value = await props.getQrCode(methodSelected.value);
};

watch(methodSelected, async () => {
  if (methodSelected.value && methodSelected.value !== "CASH") {
    await generateQRCode();
  } else {
    qrCodeUrl.value = undefined;
  }
});

const bankSelected = computed(() => {
  return props.banks.find((m) => m.code === methodSelected.value);
});

const isExpired = ref(false);
let timer: number | undefined;

const checkExpire = () => {
  isExpired.value = Date.now() >= props.booked!.expireAt;
};

onMounted(() => {
  checkExpire();
  timer = window.setInterval(checkExpire, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const onPayment = async () => {
  if (props.booked?.status !== BookingStatus.PENDING) {
    toast.error("Chuyến đi đã được xác nhận rồi");
    return;
  }

  if (!methodSelected.value) {
    toast.error("Vui lòng chọn phương thức thanh toán");
    return;
  }

  const confirmed = await bookingStore.holdSlot(props.booked!._id, {
    paymentInfo: {
      method: methodSelected.value,
    },
  });

  toast.success("Đã giữ chỗ");
  showQRModal.value = false;

  router.push({
    path: "/ticket-lookup",
    query: {
      phone: confirmed?.customerInfo.phone,
    },
  });
};

const remainingMs = ref(0);

let expireTimer: number | undefined;

const updateRemainingTime = () => {
  const diff = props.booked.expireAt - Date.now();
  remainingMs.value = diff > 0 ? diff : 0;
};

const formatRemaining = computed(() => {
  if (remainingMs.value <= 0) return "00:00";

  const totalSeconds = Math.floor(remainingMs.value / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

onMounted(() => {
  updateRemainingTime();
  expireTimer = window.setInterval(updateRemainingTime, 1000);
});

onUnmounted(() => {
  if (expireTimer) clearInterval(expireTimer);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- HEADER -->
    <div
      class="flex items-center justify-between bg-green-500 px-4 py-3 text-white"
    >
      <button @click="$router.back()">←</button>
      <div class="text-center">
        <p class="font-semibold">
          {{ booked?.tripId?.routeId?.startStopId?.name }} -
          {{ booked?.tripId?.routeId?.endStopId?.name }}
        </p>
        <p class="text-xs opacity-80">
          {{ formatDate(booked?.departureTime) }}
        </p>
      </div>
      <div />
    </div>

    <!-- CONTENT -->
    <div class="h-full flex-1 space-y-4 overflow-y-auto p-4 pb-40">
      <h3 class="text-center text-lg font-semibold">Thông tin thanh toán</h3>
      <PassengerInfoCard :customer-info="booked?.customerInfo" />
      <TripInfoCard v-if="booked" :booked="booked" />
      <PriceDetailCard v-if="booked" :booked="booked" />
    </div>

    <!-- PAYMENT METHOD SHEET -->
    <transition name="slide-up">
      <div
        v-if="showMethodSheet"
        class="fixed inset-0 z-40 bg-black/40"
        @click.self="showMethodSheet = false"
      >
        <div
          class="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-4"
        >
          <div class="mb-3 flex items-center justify-between">
            <h3 class="font-semibold">Chọn phương thức thanh toán</h3>
            <button @click="showMethodSheet = false">✕</button>
          </div>

          <PaymentMethodList
            v-model="methodSelected"
            :banks="banks"
            :cash="setting?.bankInfo"
            @update:model-value="selectMethod"
          />
        </div>
      </div>
    </transition>

    <!-- PAYMENT MODAL -->
    <transition name="fade">
      <div
        v-if="showQRModal"
        class="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-3"
      >
        <div
          class="flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-white"
        >
          <!-- HEADER (fixed) -->
          <div class="flex items-center justify-between border-b px-4 py-3">
            <h3 class="font-semibold">
              {{
                methodSelected === "CASH"
                  ? "Thanh toán tại quầy"
                  : "Thanh toán ví điện tử"
              }}
            </h3>
            <button
              class="rounded-full p-1 text-gray-400 hover:bg-gray-100"
              @click="showQRModal = false"
            >
              ✕
            </button>
          </div>

          <!-- BODY (SCROLLABLE) -->
          <div class="flex-1 overflow-y-auto px-4 py-3">
            <!-- CASH -->
            <CounterPaymentInfo v-if="methodSelected === 'CASH'" />

            <!-- QR -->
            <PaymentQRCode
              v-else-if="booked && !isExpired"
              :amount="booked.amount"
              :expire="booked.expireAt"
              :method="methodSelected"
              :qr-code="qrCodeUrl"
              :bank-name="bankSelected?.shortName || bankSelected?.short_name"
            />
          </div>

          <!-- FOOTER (fixed bottom) -->
          <div class="space-y-2 border-t px-4 py-3">
            <button
              class="w-full rounded-xl border py-2 font-medium text-gray-600 hover:bg-gray-50"
              @click="
                showQRModal = false;
                showMethodSheet = true;
              "
            >
              Chọn phương thức khác
            </button>

            <button
              class="w-full rounded-xl py-2 font-semibold transition"
              :disabled="!canConfirm || isExpired"
              :class="[
                !canConfirm || isExpired
                  ? 'bg-gray-200 text-gray-400'
                  : 'bg-green-500 text-white hover:bg-green-600',
              ]"
              @click="onPayment"
            >
              <span v-if="!canConfirm">Đang kiểm tra…</span>
              <span v-else>Xác nhận thanh toán</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- BOTTOM PAYMENT BAR -->
    <div class="fixed bottom-0 left-0 right-0 z-30 border-t bg-white px-4 py-3">
      <!-- Remaining time -->
      <div v-if="!isExpired" class="mb-2 text-center text-sm text-gray-500">
        ⏳ Thời gian giữ chỗ còn
        <span class="font-semibold text-green-600">
          {{ formatRemaining }}
        </span>
      </div>

      <button
        class="w-full rounded-xl py-3 text-lg font-semibold transition"
        :class="[
          isExpired
            ? 'cursor-not-allowed bg-gray-300 text-gray-500'
            : 'bg-green-500 text-white hover:bg-green-600',
        ]"
        :disabled="isExpired"
        @click="showMethodSheet = true"
      >
        <template v-if="isExpired"> ⛔ Đã hết hạn thanh toán </template>
        <template v-else> Thanh toán </template>
      </button>
    </div>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease;
}
.slide-up-enter-from {
  transform: translateY(100%);
}
.slide-up-leave-to {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
