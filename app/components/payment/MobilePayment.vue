<script setup lang="ts">
import { ref } from "vue";
import BankTransferConfirm from "~/components/payment/BankTransferConfirm.vue";

const method = ref<string | null>(null);

const showMethodSheet = ref(false);
const showQRModal = ref(false);

const selectMethod = (m: string) => {
  method.value = m;
  showMethodSheet.value = false;
  showQRModal.value = true;
};

const submitOrder = () => {
  // TODO: Implement order submission
};

const methods = [
  {
    key: "VNPay",
    label: "Thanh toán VietQR",
    icon: "https://storage.googleapis.com/futa-busline-web-cms-prod/VNPAY_payment_f70a6c71dc/VNPAY_payment_f70a6c71dc.png",
    note: "Nhập VNPAYFUTA26 - Giảm 15K đơn từ 300K, giảm 30K đơn từ 750K",
  },
  {
    key: "ZaloPay",
    label: "ZaloPay",
    icon: "https://storage.googleapis.com/futa-busline-web-cms-prod/zalopay_fcfdae0580/zalopay_fcfdae0580.svg",
    note: "Giảm 25% tối đa 20k cho khách hàng lần đầu thanh toán; giảm 10k cho cho tất cả các giao dịch.",
  },
  {
    key: "MAI_LINH",
    label: "Mai Linh",
    icon: "https://storage.googleapis.com/futa-busline-web-cms-prod/futapay_db8da73dc3/futapay_db8da73dc3.svg",
    note: "Thanh toán qua Mai Linh",
  },
  {
    key: "MBBANK",
    label: "MB Bank",
    icon: "https://storage.googleapis.com/futa-busline-web-cms-prod/viet_QR_e6b170910a/viet_QR_e6b170910a.png",
    note: "QR chuyển khoản, quét mã thanh toán an toàn và tiện lợi.",
  },
];
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- HEADER -->
    <div
      class="flex items-center justify-between bg-green-500 px-4 py-3 text-white"
    >
      <button @click="$router.back()">←</button>
      <div class="text-center">
        <p class="font-semibold">Đà Nẵng - Đăk Lăk</p>
        <p class="text-xs opacity-80">Thứ 2, 19/01</p>
      </div>
      <div />
    </div>

    <!-- CONTENT -->
    <div class="h-full flex-1 space-y-4 overflow-y-auto p-4 pb-32">
      <h3 class="text-center text-lg font-semibold">Thông tin thanh toán</h3>
      <PassengerInfoCard />
      <TripInfoCard />
      <PriceDetailCard />

      <div
        class="flex cursor-pointer items-center justify-between rounded-xl border bg-white p-4"
        @click="showMethodSheet = true"
      >
        <div class="flex items-center gap-3">
          <img
            v-if="method"
            :src="methods.find((m) => m.key === method)?.icon"
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

      <BankTransferConfirm :amount="75000" :expire="339" />
    </div>

    <!-- BOTTOM CONFIRM -->
    <div class="fixed bottom-0 left-0 right-0 z-30 bg-green-500 px-4 py-3">
      <button
        class="w-full rounded-xl py-3 font-bold text-white"
        @click="submitOrder"
      >
        XÁC NHẬN ĐẶT
      </button>
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
            :amount="400000"
            :expire="1199"
            :method="method || 'FUTAPAY'"
          />

          <!-- Footer buttons -->
          <div class="mt-4 space-y-2">
            <button
              class="w-full rounded-xl border border-gray-300 py-2 font-medium text-gray-600 hover:bg-gray-50"
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
