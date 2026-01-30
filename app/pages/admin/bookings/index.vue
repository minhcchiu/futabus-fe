<script setup lang="ts">
import AdminTable from "@/components/admin/AdminTable.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useBookingStore } from "~/stores/booking.store";
import type { PaymentMethod } from "~/validations/admin/booking.validation";

definePageMeta({ layout: "admin" });

const store = useBookingStore();

const paymentStatusText: Record<string, string> = {
  UNPAID: "Chưa thanh toán",
  PENDING: "Đang xử lý",
  PAID: "Đã thanh toán",
  FAILED: "Thanh toán lỗi",
  REFUNDING: "Đang hoàn tiền",
  REFUNDED: "Đã hoàn tiền",
};

const bookingStatusText: Record<string, string> = {
  PENDING: "Giữ chỗ",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã huỷ",
  EXPIRED: "Hết hạn",
  CHECKED_IN: "Đã lên xe",
  NO_SHOW: "Không lên xe",
  COMPLETED: "Hoàn thành",
  REFUNDED: "Đã hoàn tiền",
};

const paymentMethodText: Record<PaymentMethod, string> = {
  CASH: "Tiền mặt tại quầy",
  BANK_TRANSFER: "Thanh toán VNPay",
  VNPay: "Chuyển khoản ngân hàng",
  MBBank: "Chuyển khoản MB Bank",
};

/* UI STATE */
const keyword = ref("");
const statusFilter = ref("ALL");
const page = ref(1);
const pageSize = ref(5);

/* FETCH */
const fetchData = async () => {
  await store.fetchPaginate({
    _page: page.value,
    _limit: pageSize.value,
    code: keyword.value || undefined,
    "paymentInfo.status":
      statusFilter.value !== "ALL" ? statusFilter.value : undefined,
    _sort: "-createdAt",
    _populate:
      "tripId.routeId.startStopId endStopId,seatIds,customerInfo,paymentInfo",
  });
};

onMounted(fetchData);

/* WATCH */
watch([keyword, statusFilter, pageSize], () => {
  page.value = 1;
  fetchData();
});
watch(page, fetchData);

/* COMPUTED */
const bookings = computed(() => store.paginate?.data || []);
const pagination = computed(() => store.paginate?.paginationInfo);
const totalPages = computed(() => pagination.value?._totalPages || 1);

/* HANDLERS */
function prevPage() {
  if (page.value > 1) page.value--;
}
function nextPage() {
  if (page.value < totalPages.value) page.value++;
}

const previewImage = ref<string | null>(null);
</script>

<template>
  <div>
    <!-- HEADER -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">Danh sách đặt vé</h1>
      <p class="text-sm text-gray-500">
        Quản lý toàn bộ đơn đặt vé trong hệ thống
      </p>
    </div>

    <!-- SEARCH + FILTER -->
    <div class="mb-4 flex items-center gap-3">
      <input
        v-model="keyword"
        placeholder="Search code..."
        class="w-72 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
      />

      <select
        v-model="statusFilter"
        class="rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
      >
        <option value="ALL">Tất cả trạng thái</option>
        <option value="PENDING">Giữ chỗ</option>
        <option value="CONFIRMED">Đã xác nhận</option>
        <option value="CANCELLED">Đã huỷ</option>
        <option value="EXPIRED">Hết hạn</option>
      </select>
    </div>

    <!-- TABLE -->
    <AdminTable
      :columns="[
        'Booking',
        'Route',
        'Seats',
        'Customer',
        'Payment',
        'Amount',
        'Status',
        'Expire',
        'Proof',
        'Actions',
      ]"
      :data="bookings"
      :page="page"
      :page-size="pageSize"
      :total-pages="totalPages"
      @prev="prevPage"
      @next="nextPage"
    >
      <tr v-for="b in bookings" :key="b._id" class="border-b hover:bg-gray-50">
        <!-- BOOKING -->
        <td class="px-4 py-3 font-mono text-xs text-gray-600">
          {{ b.code || b._id.slice(-8) }}
        </td>

        <!-- ROUTE -->
        <td class="px-4 py-3 text-sm">
          {{ b.tripId.routeId.startStopId.name }}
          →
          {{ b.tripId.routeId.endStopId.name }}
        </td>

        <!-- SEATS -->
        <td class="px-4 py-3">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="s in b.seatIds"
              :key="s._id"
              class="rounded bg-gray-100 px-2 py-0.5 text-xs"
            >
              {{ s.name }}
            </span>
          </div>
        </td>

        <!-- CUSTOMER -->
        <td class="px-4 py-3 text-sm">
          <div class="font-medium">{{ b.customerInfo?.name }}</div>
          <div class="text-xs text-gray-500">
            {{ b.customerInfo?.phone }}
          </div>
        </td>

        <!-- PAYMENT -->
        <td class="px-4 py-3 text-xs">
          <div class="mb-1 font-medium">
            {{ paymentMethodText[b.paymentInfo?.method] || "—" }}
          </div>

          <span
            :class="[
              'rounded-full px-2 py-0.5 text-xs font-medium',
              b.paymentInfo?.status === 'PAID' && 'bg-green-100 text-green-600',
              b.paymentInfo?.status === 'PENDING' &&
                'bg-yellow-100 text-yellow-600',
              b.paymentInfo?.status === 'FAILED' && 'bg-red-100 text-red-600',
            ]"
          >
            {{ paymentStatusText[b.paymentInfo?.status] }}
          </span>
        </td>

        <!-- AMOUNT -->
        <td class="px-4 py-3 font-semibold text-primary">
          {{ b.amount.toLocaleString() }} đ
        </td>

        <!-- BOOKING STATUS -->
        <td class="px-4 py-3">
          <span
            :class="[
              'rounded-full px-3 py-1 text-xs font-medium',
              b.status === 'PENDING' && 'bg-yellow-100 text-yellow-700',
              b.status === 'CONFIRMED' && 'bg-green-100 text-green-700',
              b.status === 'CANCELLED' && 'bg-gray-200 text-gray-600',
              b.status === 'EXPIRED' && 'bg-red-100 text-red-600',
              b.status === 'COMPLETED' && 'bg-blue-100 text-blue-600',
            ]"
          >
            {{ bookingStatusText[b.status] }}
          </span>
        </td>

        <!-- EXPIRE -->
        <td class="px-4 py-3 text-xs">
          <!-- Chỉ giữ chỗ mới có hạn -->
          <template v-if="b.status === 'PENDING'">
            <span
              v-if="Date.now() > b.expireAt"
              class="font-medium text-red-600"
            >
              Hết hạn
            </span>

            <span v-else class="text-yellow-700">
              Còn {{ Math.ceil((b.expireAt - Date.now()) / 60000) }} phút
            </span>
          </template>

          <!-- Các trạng thái khác -->
          <span v-else class="italic text-gray-400"> — </span>
        </td>

        <!-- PAYMENT PROOF -->
        <td class="px-4 py-3">
          <div v-if="b.paymentInfo?.image" class="group relative">
            <img
              :src="b.paymentInfo.image"
              alt="Payment proof"
              class="h-12 w-12 cursor-pointer rounded-lg border object-cover"
              @click="previewImage = b.paymentInfo.image"
            />

            <!-- hover preview -->
            <div
              class="pointer-events-none absolute left-14 top-0 z-20 hidden rounded-xl border bg-white p-2 shadow-lg group-hover:block"
            >
              <img
                :src="b.paymentInfo.image"
                class="max-h-60 max-w-60 rounded-lg object-contain"
              />
            </div>
          </div>

          <span v-else class="text-xs italic text-gray-400"> No image </span>
        </td>

        <!-- ACTION -->
        <td class="px-4 py-3 text-right">
          <NuxtLink
            :to="`/admin/bookings/${b._id}`"
            class="text-sm text-primary hover:underline"
          >
            View
          </NuxtLink>
        </td>
      </tr>
    </AdminTable>

    <!-- EMPTY -->
    <p v-if="!bookings.length" class="mt-6 text-center text-sm text-gray-400">
      Không tìm thấy đơn đặt vé nào
    </p>

    <div
      v-if="previewImage"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      @click="previewImage = null"
    >
      <img
        :src="previewImage"
        class="max-h-[90vh] max-w-[90vw] rounded-xl bg-white p-2"
      />
    </div>
  </div>
</template>
