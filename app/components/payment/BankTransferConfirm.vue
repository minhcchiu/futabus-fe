<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  amount: {
    type: Number,
    default: 75000,
  },
  expire: {
    type: Number,
    default: 339, // giây
  },
});

const seconds = ref(props.expire);
const filePayment = ref(null);
const fileProof = ref(null);

onMounted(() => {
  setInterval(() => {
    if (seconds.value > 0) seconds.value--;
  }, 1000);
});

const time = computed(() => {
  const m = Math.floor(seconds.value / 60);
  const s = seconds.value % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
});
</script>

<template>
  <div class="my-6 mb-20 rounded-xl bg-white p-6 shadow-sm">
    <!-- COUNTDOWN -->
    <div class="mb-4 text-center">
      <div class="text-sm text-gray-600">
        Đơn của bạn còn được giữ chỗ trong
      </div>
      <div class="mt-1 text-xl font-bold text-gray-900">
        {{ time }}
      </div>
    </div>

    <!-- UPLOAD AREA -->
    <div class="mx-auto mb-8 max-w-xl">
      <UploadBox
        label="Nhấn vào để tải hình thanh toán (*)"
        required
        @change="filePayment = $event"
      />
    </div>

    <!-- SUBMIT -->
    <button
      class="mt-8 hidden w-full rounded-lg bg-green-500 py-4 text-center font-semibold text-white hover:bg-green-600 md:block"
    >
      XÁC NHẬN ĐẶT
    </button>
  </div>
</template>
