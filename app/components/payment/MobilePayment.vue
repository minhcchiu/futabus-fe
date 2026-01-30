<script setup lang="ts">
import { ref } from "vue";
import BankTransferConfirm from "~/components/payment/BankTransferConfirm.vue";
import { METHODS_DATA } from "~/utils/data";
import {
  PaymentMethod,
  type Booking,
} from "~/validations/admin/booking.validation";

const props = defineProps<{
  booked: Booking;
  isSubmitting: boolean;
}>();
const emit = defineEmits<{
  (
    e: "payment",
    input: {
      filePayment: File | null;
      bookingId: string;
      paymentMethod: PaymentMethod;
    },
  ): void;
}>();
const submitting = computed(() => props.isSubmitting);
const method = ref<PaymentMethod | null>(
  props.booked.paymentInfo.method || null,
);

const showMethodSheet = ref(false);
const showQRModal = ref(false);

const selectMethod = (m: PaymentMethod) => {
  paymentMethod.value = m;
  showMethodSheet.value = false;

  // CASH thì KHÔNG mở QR
  if (m !== PaymentMethod.CASH) {
    showQRModal.value = true;
  }
};

const paymentMethod = ref<PaymentMethod>(
  props.booked?.paymentInfo.method || PaymentMethod.BANK_TRANSFER,
);

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

const onPayment = (data: {
  filePayment: File | null;
  bookingId: string;
  paymentMethod: PaymentMethod;
}) => {
  emit("payment", data);
};
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
          {{ new Date(booked?.departureTime).toLocaleDateString() }}
        </p>
      </div>
      <div />
    </div>

    <!-- CONTENT -->
    <div class="h-full flex-1 space-y-4 overflow-y-auto p-4 pb-32">
      <h3 class="text-center text-lg font-semibold">Thông tin thanh toán</h3>
      <PassengerInfoCard :customer-info="booked?.customerInfo" />
      <TripInfoCard v-if="booked" :booked="booked" />
      <PriceDetailCard v-if="booked" :booked="booked" />

      <div
        class="flex cursor-pointer items-center justify-between rounded-xl border bg-white p-4"
        @click="
          () => {
            if (isExpired) return;
            showMethodSheet = true;
          }
        "
      >
        <div class="flex items-center gap-3">
          <img
            v-if="method"
            :src="METHODS_DATA.find((m) => m.key === method)?.icon"
            class="h-6 w-6"
          >
          <div>
            <p class="text-sm text-gray-500">Phương thức thanh toán</p>
            <p class="font-medium">
              {{ method ? method : "Chọn phương thức" }}
            </p>
          </div>
        </div>

        <span class="text-gray-400">›</span>
      </div>

      <BankTransferConfirm
        v-if="booked"
        :amount="booked?.amount"
        :expire="booked.expireAt"
        :disabled="isExpired"
        :booking-id="booked._id"
        :payment-method="paymentMethod"
        :is-submitting="submitting"
        @payment="onPayment"
      />
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
            v-model="method"
            @update:model-value="selectMethod"
          />
        </div>
      </div>
    </transition>

    <!-- QR MODAL -->
    <transition name="fade">
      <div
        v-if="showQRModal"
        class="fixed inset-0 z-[999] flex items-center justify-center bg-black/40"
      >
        <div class="w-[90%] max-w-sm rounded-2xl bg-white p-4">
          <!-- Header -->
          <div class="mb-2 flex items-center justify-between">
            <h3 class="font-semibold">Thanh toán ví điện tử</h3>
            <button
              class="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              @click="showQRModal = false"
            >
              ✕
            </button>
          </div>

          <PaymentQRCode
            v-if="booked && !isExpired"
            :amount="booked?.amount"
            :expire="booked.expireAt"
            :method="paymentMethod"
          />

          <!-- Footer buttons -->
          <div class="mt-4 space-y-2">
            <button
              class="w-full rounded-xl border border-gray-300 py-2 font-medium text-gray-600 hover:bg-gray-50"
              :disabled="isExpired"
              @click="
                showQRModal = false;
                showMethodSheet = true;
              "
            >
              Chọn phương thức khác
            </button>

            <button
              class="w-full rounded-xl bg-green-100 py-2 font-medium text-green-600 hover:bg-orange-200"
              @click="showQRModal = false"
            >
              Quay lại xác nhận
            </button>
          </div>
        </div>
      </div>
    </transition>
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
