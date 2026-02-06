<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBookingStore } from "~/stores/booking.store";
import { formatMoney } from "~/utils/helpers/data.helper";
import type { Booking } from "~/validations/admin/booking.validation";

const { setHeaderHeight } = useHeightHeader();
setHeaderHeight("h-20 md:h-36");

definePageMeta({
  layout: "default",
});

const route = useRoute();
const router = useRouter();
const store = useBookingStore();

const bookingId = route.params.id as string;
const loading = ref(false);

/* ================= TEXT MAP ================= */
const bookingStatusText: Record<string, string> = {
  PENDING: "Giữ chỗ",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã huỷ",
  EXPIRED: "Hết hạn",
  CHECKED_IN: "Đã lên xe",
  NO_SHOW: "Không lên xe",
  COMPLETED: "Hoàn thành",
};

const paymentStatusText: Record<string, string> = {
  UNPAID: "Chưa thanh toán",
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thanh toán lỗi",
  REFUNDED: "Đã hoàn tiền",
};

const paymentMethodText: Record<string, string> = {
  CASH: "Tiền mặt",
  BANK_TRANSFER: "Chuyển khoản",
  VNPay: "VNPay",
  MBBank: "MB Bank",
};

/* ================= FETCH ================= */
const booking = ref<Booking | null>(null);

const fetchDetail = async () => {
  try {
    loading.value = true;
    booking.value = await store.fetchById(bookingId, {
      _populate:
        "tripId.routeId.startStopId endStopId,seatIds,customerInfo,paymentInfo",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDetail);

/* ================= TIMER (REALTIME) ================= */
const now = ref(Date.now());
const timer = setInterval(() => {
  now.value = Date.now();
}, 1000);

onUnmounted(() => clearInterval(timer));

/* ================= COMPUTED ================= */
const isExpired = computed(() => {
  if (!booking.value?.expireAt) return false;
  return now.value > booking.value.expireAt;
});

const remainMinutes = computed(() => {
  if (!booking.value?.expireAt) return null;
  const diff = booking.value.expireAt - now.value;
  if (diff <= 0) return 0;
  return Math.ceil(diff / 60000);
});

/* ================= PAYMENT LOGIC ================= */
const isPaymentExpired = computed(() => {
  if (!booking.value?.expireAt) return true;
  return now.value > booking.value.expireAt;
});

const showPaymentAction = computed(() => {
  if (!booking.value?.paymentInfo) return false;

  return (
    booking.value.status === "PENDING" &&
    booking.value.paymentInfo.status === "PENDING" &&
    booking.value.paymentInfo.method !== "CASH" &&
    !isPaymentExpired.value
  );
});

const goToPayment = () => {
  router.push({
    path: `/payment/${bookingId}`,
  });
};
</script>

<template>
  <div class="my-6">
    <!-- HEADER -->
    <div
      class="sticky top-0 z-30 mb-6 flex items-center justify-between rounded-xl border-b bg-white px-4 py-3"
    >
      <div>
        <h1 class="text-2xl font-semibold">Chi tiết đặt vé</h1>
        <p class="text-sm text-gray-500">
          Booking code:
          <span class="font-mono font-medium text-gray-800">
            {{ booking?.code }}
          </span>
        </p>
      </div>

      <button
        class="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
        @click="router.back()"
      >
        ← Quay lại
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="py-20 text-center text-gray-400">
      Đang tải dữ liệu...
    </div>

    <!-- CONTENT -->
    <div
      v-else-if="booking"
      class="grid auto-rows-fr grid-cols-1 gap-6 lg:grid-cols-2"
    >
      <!-- TRẠNG THÁI -->
      <div class="rounded-xl border bg-white p-5">
        <h2 class="mb-4 font-semibold">Trạng thái</h2>

        <div class="flex items-center gap-3">
          <span
            class="rounded-full px-4 py-1 text-sm font-medium"
            :class="[
              booking.status === 'CONFIRMED' && 'bg-green-100 text-green-700',
              booking.status === 'PENDING' && 'bg-yellow-100 text-yellow-700',
              booking.status === 'CANCELLED' && 'bg-gray-200 text-gray-600',
              booking.status === 'EXPIRED' && 'bg-red-100 text-red-600',
            ]"
          >
            {{ bookingStatusText[booking.status] }}
          </span>

          <span
            v-if="booking.status === 'PENDING'"
            class="text-sm"
            :class="isExpired ? 'text-red-600' : 'text-yellow-700'"
          >
            {{ isExpired ? "Đã hết hạn" : `Còn ${remainMinutes} phút` }}
          </span>
        </div>
      </div>

      <!-- KHÁCH HÀNG -->
      <div class="rounded-xl border bg-white p-5">
        <h2 class="mb-4 font-semibold">Khách hàng</h2>

        <div v-if="booking.customerInfo?.name" class="text-sm">
          <div><b>Tên:</b> {{ booking.customerInfo.name }}</div>
          <div><b>Phone:</b> {{ booking.customerInfo.phone }}</div>
        </div>

        <p v-else class="text-sm italic text-gray-400">
          Không có thông tin khách hàng
        </p>
      </div>

      <!-- HÀNH TRÌNH -->
      <div class="rounded-xl border bg-white p-5">
        <h2 class="mb-4 font-semibold">Hành trình</h2>

        <div class="space-y-1 text-sm">
          <div>
            <span class="text-gray-500">Từ:</span>
            {{ booking.tripId?.routeId?.startStopId?.name || "—" }}
          </div>
          <div>
            <span class="text-gray-500">Đến:</span>
            {{ booking.tripId?.routeId?.endStopId?.name || "—" }}
          </div>
          <div class="pt-1">
            <span class="text-gray-500">Giờ khởi hành:</span>
            {{ new Date(booking.departureTime).toLocaleString() }}
          </div>
        </div>
      </div>

      <!-- THANH TOÁN -->
      <div class="rounded-xl border bg-white p-5">
        <h2 class="mb-4 font-semibold">Thanh toán</h2>

        <div v-if="booking.paymentInfo" class="space-y-1 text-sm">
          <div>
            <b>Trạng thái:</b>
            {{ paymentStatusText[booking.paymentInfo.status] }}
          </div>
          <div>
            <b>Phương thức:</b>
            {{ paymentMethodText[booking.paymentInfo.method] || "—" }}
          </div>
          <div>
            <b>Số tiền:</b>
            {{ formatMoney(booking.amount) }}
          </div>
        </div>

        <!-- PAYMENT ACTION -->
        <div v-if="booking.paymentInfo?.status === 'PENDING'" class="mt-4">
          <!-- CÒN HẠN -->
          <div
            v-if="showPaymentAction"
            class="rounded-xl border border-amber-200 bg-amber-50 p-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1">
                <p class="text-sm font-semibold text-amber-900">
                  ⏳ Chờ thanh toán
                </p>
                <p class="text-sm text-amber-800">
                  Vui lòng hoàn tất trong
                  <b>{{ remainMinutes }} phút</b>
                </p>
                <p class="text-xs text-amber-700">
                  Hết thời gian, booking sẽ tự động huỷ
                </p>
              </div>

              <button
                class="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                @click="goToPayment"
              >
                Thanh toán ngay
              </button>
            </div>
          </div>

          <!-- HẾT HẠN -->
          <div v-else class="rounded-xl border border-red-200 bg-red-50 p-4">
            <p class="text-sm font-semibold text-red-700">
              ⛔ Đã hết thời gian thanh toán
            </p>
            <p class="text-xs text-red-600">
              Booking này không còn hiệu lực để thanh toán
            </p>
          </div>
        </div>
      </div>

      <!-- GHẾ -->
      <div class="rounded-xl border bg-white p-5">
        <h2 class="mb-4 font-semibold">Ghế</h2>

        <div v-if="booking.seatIds?.length" class="flex flex-wrap gap-2">
          <span
            v-for="s in booking.seatIds"
            :key="s._id"
            class="rounded bg-gray-100 px-3 py-1 text-xs"
          >
            {{ s.name }}
          </span>
        </div>

        <p v-else class="text-sm italic text-gray-400">Chưa chọn ghế</p>
      </div>

      <!-- SYSTEM -->
      <div class="rounded-xl border bg-white p-5">
        <h2 class="mb-4 font-semibold">Thông tin hệ thống</h2>

        <div class="space-y-1 text-sm">
          <div><b>ID:</b> {{ booking.code }}</div>
          <div>
            <b>Ngày tạo:</b>
            {{ new Date(booking.createdAt).toLocaleString() }}
          </div>
          <div>
            <b>Cập nhật:</b>
            {{ new Date(booking.updatedAt).toLocaleString() }}
          </div>
        </div>
      </div>
    </div>

    <!-- NOT FOUND -->
    <div v-else class="py-20 text-center text-gray-400">
      Không tìm thấy booking
    </div>
  </div>
</template>
