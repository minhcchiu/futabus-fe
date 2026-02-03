<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  expire: number; // timestamp ms
  isSubmitting: boolean;
}>();

const emit = defineEmits<{
  (e: "payment"): void;
}>();

/* ======================
 * COUNTDOWN
 * ====================== */
const remainingSeconds = ref(0);
let timer: number | undefined;

const updateRemaining = () => {
  const diff = props.expire - Date.now();
  remainingSeconds.value = Math.max(Math.floor(diff / 1000), 0);
};

onMounted(() => {
  updateRemaining();
  timer = window.setInterval(updateRemaining, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const isExpired = computed(() => remainingSeconds.value === 0);

/* ======================
 * ACTION
 * ====================== */
const onConfirm = () => {
  if (isExpired.value) return;

  emit("payment");
};
</script>

<template>
  <div class="my-6 mb-20 rounded-xl bg-white p-6 shadow-sm">
    <!-- EXPIRED STATE -->
    <div v-if="isExpired" class="text-center">
      <div class="mb-2 text-lg font-semibold text-red-500">
        ⛔ Đơn hàng đã hết thời gian giữ chỗ
      </div>
      <p class="text-sm text-gray-500">
        Vui lòng thực hiện đặt vé lại để tiếp tục.
      </p>
    </div>

    <!-- ACTION -->
    <button
      v-else
      class="w-full rounded-xl bg-green-500 py-4 text-base font-semibold text-white transition hover:bg-green-600 active:bg-green-700"
      :disabled="isSubmitting"
      @click="onConfirm"
    >
      {{ isSubmitting ? "ĐANG XÁC NHẬN..." : "XÁC NHẬN ĐẶT" }}
    </button>
  </div>
</template>
