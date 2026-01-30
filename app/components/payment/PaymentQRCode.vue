<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { PaymentMethod } from "~/validations/admin/booking.validation";

const props = defineProps<{
  amount: number;
  expire: number; // timestamp ms
  method: string;
}>();

const remainingSeconds = ref(0);
let timer: number | undefined;

const updateRemaining = () => {
  const diffMs = props.expire - Date.now();
  remainingSeconds.value = Math.max(Math.floor(diffMs / 1000), 0);
};

onMounted(() => {
  updateRemaining(); // init
  timer = window.setInterval(updateRemaining, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const time = computed(() => {
  const m = Math.floor(remainingSeconds.value / 60);
  const s = remainingSeconds.value % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
});
</script>

<template>
  <div class="rounded-xl bg-white p-4 text-center shadow">
    <div class="text-sm text-gray-500">Tổng thanh toán</div>
    <div class="mb-2 text-3xl font-bold text-green-500">
      {{ amount!.toLocaleString() }}đ
    </div>

    <div class="mb-3 text-sm text-green-500">
      Thời gian giữ chỗ còn lại {{ time }}
    </div>

    <div class="flex justify-center">
      <img
        src="https://img.vietqr.io/image/TPB-0387776243-compact.png"
        class="h-56 w-56 rounded-lg border"
      />
    </div>

    <div class="mt-4 text-left text-sm">
      <p class="font-semibold text-green-600">
        Hướng dẫn thanh toán bằng
        {{ method === PaymentMethod.BANK_TRANSFER ? "Chuyển khoản" : method }}
      </p>
      <ol class="mt-2 list-decimal space-y-1 pl-5 text-gray-600">
        <li>
          Mở ứng dụng
          {{
            method === PaymentMethod.BANK_TRANSFER
              ? "Ngân hàng (bất kỳ)"
              : method
          }}
        </li>
        <li>Dùng biểu tượng quét mã QR</li>
        <li>Quét mã và thanh toán</li>
      </ol>
    </div>
  </div>
</template>
