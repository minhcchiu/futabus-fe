<script setup lang="ts">
import { useRouter } from "vue-router";
import { formatDateTime, formatMoney } from "~/utils/helpers/data.helper";
import { PaymentStatus } from "~/validations/admin/booking.validation";

const router = useRouter();
const loading = ref(false);
function statusClass(status: string) {
  return status === PaymentStatus.PAID
    ? "bg-green-100 text-green-700"
    : "bg-green-100 text-green-700";
}

const bookingStore = useBookingStore();
const showNotFound = ref(false);
const findTickets = async () => {
  if (code.value) {
    await bookingStore.fetchAll({
      code: code.value,
      _populate:
        "fromStopId,toStopId,tripId,tripId.routeId,tripId.routeId.startStopId endStopId,seatIds",
      _sort: "-createdAt",
    });

    showNotFound.value = true;
  } else if (phone.value) {
    await bookingStore.fetchAll({
      "customerInfo.phone": phone.value,
      _populate:
        "fromStopId,toStopId,tripId,tripId.routeId,tripId.routeId.startStopId endStopId,seatIds",
      _sort: "-createdAt",
    });

    showNotFound.value = true;
  }

  router.push({
    path: "/ticket-lookup",
    query: {
      phone: phone.value,
      code: code.value,
    },
  });
};

const bookedList = computed(() => bookingStore.list);

const route = useRoute();
const phone = ref<string>((route.query.phone as string) || "");
const code = ref<string>("");

onMounted(() => {
  if (route.query.code) {
    findTickets();
  } else if (route.query.phone) {
    findTickets();
  }
});
</script>

<template>
  <div class="mx-auto px-4 py-6">
    <div class="flex items-center justify-center bg-white py-6">
      <div class="w-full max-w-xl text-center">
        <!-- Title -->
        <h2 class="mb-8 text-lg font-semibold text-emerald-600">
          TRA CỨU THÔNG TIN ĐẶT VÉ
        </h2>

        <!-- Form -->
        <div class="space-y-4 px-4 md:px-0">
          <input
            v-model="phone"
            type="text"
            placeholder="Vui lòng nhập số điện thoại"
            class="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-emerald-500"
          />

          <input
            v-model="code"
            type="text"
            placeholder="Vui lòng nhập mã vé"
            class="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-emerald-500"
          />

          <!-- Button -->
          <div class="pt-4">
            <button
              class="rounded-full bg-green-100 px-10 py-2 text-sm font-medium text-green-600 transition hover:bg-green-200"
              @click="findTickets"
            >
              Tra cứu
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10">
      <!-- LOADING -->
      <div v-if="loading" class="py-10 text-center">
        <div
          class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"
        />
        <p class="mt-3 text-sm text-gray-500">Đang tra cứu thông tin vé...</p>
      </div>

      <!-- NOT FOUND -->
      <div
        v-else-if="!bookedList.length && showNotFound"
        class="rounded-lg border border-red-200 bg-red-50 p-6 text-center"
      >
        <p class="font-semibold text-red-600">❌ Không tìm thấy thông tin vé</p>
        <p class="mt-2 text-sm text-gray-500">
          Vui lòng kiểm tra lại số điện thoại hoặc mã vé
        </p>
      </div>

      <!-- FOUND -->

      <div v-else>
        <div
          v-for="ticket in bookedList"
          :key="ticket._id"
          class="mb-4 space-y-4 rounded-xl border bg-white p-4 shadow-sm sm:p-6"
        >
          <!-- Header -->
          <div
            class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <h3 class="font-semibold text-green-600">✅ Đã tìm thấy vé</h3>

            <span
              class="self-start rounded-full px-3 py-1 text-xs sm:self-auto"
              :class="statusClass(ticket.paymentInfo.status)"
            >
              {{ ticket.paymentInfo.status }}
            </span>
          </div>

          <!-- Info grid -->
          <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <p class="text-xs text-gray-500">Mã vé</p>
              <p class="font-medium">{{ ticket.departureTime }}</p>
            </div>

            <div>
              <p class="text-xs text-gray-500">Tuyến</p>
              <p class="break-words font-medium">
                {{ ticket.tripId.routeId.startStopId.name }} -
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
              <p class="break-words font-medium">
                {{ ticket.seatIds.map((s) => s.name).join(", ") }}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <p class="font-semibold text-green-600">
              Tổng tiền: {{ formatMoney(ticket.amount) }}
            </p>

            <div class="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <button class="btn-outline w-full sm:w-auto">Xem chi tiết</button>
              <button class="btn-danger w-full sm:w-auto">Hủy vé</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.btn-outline {
  @apply rounded-lg border border-green-500 px-4 py-2 text-sm text-green-500 hover:bg-green-50;
}

.btn-danger {
  @apply rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600;
}
</style>
