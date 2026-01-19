<script setup lang="ts">
import { ref } from "vue";

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
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gray-50">
    <!-- HEADER -->
    <div
      class="sticky top-0 z-20 flex items-center gap-2 bg-orange-600 px-4 py-3 text-white"
    >
      <button class="text-lg" @click="$router.back()">←</button>
      <div class="flex-1 text-center font-semibold">Đắk Nông - Đà Nẵng</div>
    </div>

    <!-- CONTENT -->
    <div class="flex-1 space-y-4 overflow-y-auto p-4 pb-32">
      <PassengerInfoCard />
      <TripInfoCard />
      <PriceDetailCard />

      <button
        class="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white"
        @click="showMethodSheet = true"
      >
        Chọn phương thức thanh toán
      </button>
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
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      >
        <div class="w-[90%] max-w-sm rounded-2xl bg-white p-4">
          <div class="mb-2 flex items-center justify-between">
            <h3 class="font-semibold">Thanh toán ví điện tử</h3>
            <button @click="showQRModal = false">✕</button>
          </div>

          <PaymentQRCode
            :amount="400000"
            :expire="1199"
            :method="method || 'FUTAPAY'"
          />

          <button
            class="mt-4 w-full rounded-xl bg-orange-100 py-2 font-medium text-orange-600"
            @click="
              showQRModal = false;
              showMethodSheet = true;
            "
          >
            Chọn phương thức khác
          </button>
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
