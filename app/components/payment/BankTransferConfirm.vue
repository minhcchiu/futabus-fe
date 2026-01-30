<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { PaymentMethod } from "~/validations/admin/booking.validation";

const props = defineProps<{
  amount: number;
  expire: number; // timestamp ms
  bookingId: string;
  paymentMethod: PaymentMethod;
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
const remainingSeconds = ref(0);
const filePayment = ref<File | null>(null);
let timer: number | undefined;

const isCashPayment = computed(
  () => props.paymentMethod === PaymentMethod.CASH,
);

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

const time = computed(() => {
  const m = Math.floor(remainingSeconds.value / 60);
  const s = remainingSeconds.value % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
});

const onConfirm = async () => {
  emit("payment", {
    filePayment: filePayment.value,
    bookingId: props.bookingId,
    paymentMethod: props.paymentMethod!,
  });
};
</script>

<template>
  <div class="my-6 mb-20 rounded-xl bg-white p-6 shadow-sm">
    <!-- COUNTDOWN -->
    <div class="mb-4 text-center">
      <div class="text-sm text-gray-600">
        Đơn của bạn còn được giữ chỗ trong
      </div>

      <div
        class="mt-1 text-xl font-bold"
        :class="isExpired ? 'text-red-500' : 'text-gray-900'"
      >
        {{ isExpired ? "00:00" : time }}
      </div>

      <div v-if="isExpired" class="mt-2 text-sm text-red-500">
        ⛔ Thời gian thanh toán đã hết hiệu lực
      </div>
    </div>

    <!-- UPLOAD / NOTICE -->
    <div class="mx-auto mb-8 max-w-xl">
      <!-- TRƯỜNG HỢP TIỀN MẶT -->
      <div
        v-if="isCashPayment"
        class="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700"
      >
        <p class="mb-1 font-medium">📌 Lưu ý thanh toán</p>
        <ul class="list-disc space-y-1 pl-4">
          <li>
            Chúng tôi sẽ liên hệ với bạn qua số điện thoại đã đăng ký trong
            <b>khoảng 1 giờ</b>.
          </li>
          <li>Vui lòng chú ý điện thoại để xác nhận thông tin đơn hàng.</li>
          <li>
            Sau <b>1 giờ</b> nếu không thể kết nối, hệ thống sẽ
            <b>tự động huỷ đơn</b>.
          </li>
        </ul>
      </div>

      <!-- CÁC PHƯƠNG THỨC KHÁC -->
      <UploadBox
        v-else
        v-model="filePayment"
        label="Nhấn vào để tải hình thanh toán (*)"
        :disabled="isExpired"
      />
    </div>

    <!-- SUBMIT -->
    <button
      class="mt-8 w-full rounded-lg py-4 text-center font-semibold text-white"
      :class="
        isExpired
          ? 'cursor-not-allowed bg-gray-400'
          : 'bg-green-500 hover:bg-green-600'
      "
      :disabled="isExpired || submitting"
      @click="onConfirm"
    >
      {{
        submitting ? "XÁC NHẬN..." : isExpired ? "ĐÃ HẾT HẠN" : "XÁC NHẬN ĐẶT"
      }}
    </button>
  </div>
</template>
