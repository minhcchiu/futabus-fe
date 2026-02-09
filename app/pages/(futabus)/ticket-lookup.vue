<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBookingStore } from "~/stores/booking.store";
import { formatDateTime, formatMoney } from "~/utils/helpers/data.helper";
import { PaymentStatus } from "~/validations/admin/booking.validation";

const router = useRouter();
const route = useRoute();
const bookingStore = useBookingStore();

const phone = ref<string>((route.query.phone as string) || "");
const code = ref<string>((route.query.code as string) || "");
const loading = ref(false);
const showNotFound = ref(false);

/* ================= TIMER ================= */
const now = ref(Date.now());
setInterval(() => {
  now.value = Date.now();
}, 1000);

/* ================= FETCH ================= */
const findTickets = async () => {
  loading.value = true;
  showNotFound.value = false;

  if (code.value) {
    await bookingStore.fetchAll({
      code: code.value,
      _populate:
        "fromStopId.stopId,toStopId.stopId,tripId,tripId.routeId,tripId.routeId.startStopId endStopId,seatIds",
      _sort: "-createdAt",
    });
  } else if (phone.value) {
    await bookingStore.fetchAll({
      "customerInfo.phone": phone.value,
      _populate:
        "fromStopId.stopId,toStopId.stopId,tripId,tripId.routeId,tripId.routeId.startStopId endStopId,seatIds",
      _sort: "-createdAt",
    });
  }

  loading.value = false;
  showNotFound.value = true;

  router.push({
    path: "/ticket-lookup",
    query: {
      phone: phone.value,
      code: code.value,
    },
  });
};

onMounted(() => {
  if (phone.value || code.value) {
    findTickets();
  }
});

const bookedList = computed(() => bookingStore.list);

/* ================= HELPERS ================= */
const paymentBadgeClass = (status: string) => {
  switch (status) {
    case PaymentStatus.PAID:
      return "bg-green-100 text-green-700";
    case PaymentStatus.PENDING:
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const isExpired = (expireAt?: number) => {
  if (!expireAt) return true;
  return now.value > expireAt;
};

const canCancel = (ticket: any) => {
  return ticket.status === "PENDING" && !isExpired(ticket.expireAt);
};
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-6">
    <!-- SEARCH -->
    <div class="mb-8 rounded-xl bg-white p-6 text-center shadow-sm">
      <h2 class="mb-6 text-lg font-semibold text-emerald-600">
        TRA CỨU THÔNG TIN ĐẶT VÉ
      </h2>

      <div class="space-y-4">
        <input
          v-model="phone"
          placeholder="Nhập số điện thoại"
          class="w-full rounded-lg border px-4 py-3 text-sm focus:border-emerald-500"
        >

        <input
          v-model="code"
          placeholder="Nhập mã vé"
          class="w-full rounded-lg border px-4 py-3 text-sm focus:border-emerald-500"
        >

        <button
          class="rounded-full bg-emerald-500 px-8 py-2 text-sm font-medium text-white hover:bg-emerald-600"
          @click="findTickets"
        >
          Tra cứu
        </button>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="py-10 text-center">
      <div
        class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"
      />
      <p class="mt-3 text-sm text-gray-500">Đang tra cứu thông tin vé...</p>
    </div>

    <!-- NOT FOUND -->
    <div
      v-else-if="!bookedList.length && showNotFound"
      class="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
    >
      <p class="font-semibold text-red-600">❌ Không tìm thấy vé</p>
      <p class="mt-2 text-sm text-gray-500">Vui lòng kiểm tra lại thông tin</p>
    </div>

    <!-- LIST -->
    <div v-else class="space-y-5">
      <div
        v-for="ticket in bookedList"
        :key="ticket._id"
        class="rounded-xl border bg-white p-5 shadow-sm"
      >
        <!-- HEADER -->
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500">Mã vé</p>
            <p class="font-mono font-semibold text-emerald-600">
              {{ ticket.code }}
            </p>
          </div>

          <span
            class="rounded-full px-3 py-1 text-xs font-medium"
            :class="paymentBadgeClass(ticket.paymentInfo?.status)"
          >
            {{ ticket.paymentInfo?.status }}
          </span>
        </div>

        <!-- BODY -->
        <div class="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <p class="text-xs text-gray-500">Tuyến</p>
            <p class="font-medium">
              {{ ticket.tripId.routeId.startStopId.name }} →
              {{ ticket.tripId.routeId.endStopId.name }}
            </p>
          </div>

          <div>
            <p class="text-xs text-gray-500">Khởi hành</p>
            <p class="font-medium">
              {{ formatDateTime(ticket.departureTime) }}
            </p>
          </div>

          <div>
            <p class="text-xs text-gray-500">Ghế</p>
            <p class="font-medium">
              {{ ticket.seatIds.map((s) => s.name).join(", ") }}
            </p>
          </div>

          <div>
            <p class="text-xs text-gray-500">Tổng tiền</p>
            <p class="font-semibold text-emerald-600">
              {{ formatMoney(ticket.amount) }}
            </p>
          </div>
        </div>

        <!-- FOOTER -->
        <div
          class="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p
            v-if="ticket.expireAt"
            class="text-xs"
            :class="
              isExpired(ticket.expireAt) ? 'text-red-600' : 'text-yellow-600'
            "
          >
            ⏳
            {{
              isExpired(ticket.expireAt)
                ? "Đã hết hạn giữ chỗ"
                : "Đang giữ chỗ – có thể hủy"
            }}
          </p>

          <div class="flex gap-2">
            <button
              class="btn-outline"
              @click="router.push(`/admin/bookings/${ticket._id}`)"
            >
              Xem chi tiết
            </button>

            <button v-if="canCancel(ticket)" class="btn-danger">Hủy vé</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-outline {
  @apply rounded-lg border border-emerald-500 px-4 py-2 text-sm text-emerald-500 hover:bg-emerald-50;
}

.btn-danger {
  @apply rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600;
}
</style>
