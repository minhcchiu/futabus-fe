<script setup lang="ts">
import AdminTable from "@/components/admin/AdminTable.vue";
import { computed, onMounted, ref, watch } from "vue";
import { toast } from "vue-sonner";
import { useBookingStore } from "~/stores/booking.store";
import { formatMoney } from "~/utils/helpers/data.helper";
import {
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
} from "~/validations/admin/booking.validation";

definePageMeta({ layout: "admin", middleware: "auth" });

const store = useBookingStore();

/* ================= TEXT ================= */
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
};

/* ================= COLOR ================= */
const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CHECKED_IN: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-indigo-100 text-indigo-700",
  NO_SHOW: "bg-orange-100 text-orange-700",
  CANCELLED: "bg-gray-200 text-gray-600",
  EXPIRED: "bg-red-100 text-red-600",
  REFUNDED: "bg-purple-100 text-purple-700",

  UNPAID: "bg-gray-100 text-gray-600",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-600",
};

/* ================= FLOW ================= */
const BOOKING_STATUS_FLOW: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.PENDING]: [
    BookingStatus.CONFIRMED,
    BookingStatus.CANCELLED,
    BookingStatus.EXPIRED,
  ],
  [BookingStatus.CONFIRMED]: [
    BookingStatus.CHECKED_IN,
    BookingStatus.NO_SHOW,
    BookingStatus.COMPLETED,
    BookingStatus.CANCELLED,
  ],
  [BookingStatus.CHECKED_IN]: [BookingStatus.COMPLETED],
  [BookingStatus.NO_SHOW]: [],
  [BookingStatus.COMPLETED]: [],
  [BookingStatus.CANCELLED]: [],
  [BookingStatus.EXPIRED]: [],
  [BookingStatus.REFUNDED]: [],
};

const PAYMENT_STATUS_FLOW: Record<PaymentStatus, PaymentStatus[]> = {
  [PaymentStatus.UNPAID]: [PaymentStatus.PENDING, PaymentStatus.PAID],
  [PaymentStatus.PENDING]: [PaymentStatus.PAID, PaymentStatus.FAILED],
  [PaymentStatus.PAID]: [PaymentStatus.REFUNDING, PaymentStatus.REFUNDED],
  [PaymentStatus.FAILED]: [],
  [PaymentStatus.REFUNDING]: [PaymentStatus.REFUNDED],
  [PaymentStatus.REFUNDED]: [],
};

const canChangeBookingStatus = (current: BookingStatus, next: BookingStatus) =>
  BOOKING_STATUS_FLOW[current]?.includes(next);

const canChangePaymentStatus = (current: PaymentStatus, next: PaymentStatus) =>
  PAYMENT_STATUS_FLOW[current]?.includes(next);

/* ================= UI STATE ================= */
const keyword = ref("");
const statusFilter = ref("ALL");
const page = ref(1);
const pageSize = ref(5);
const previewImage = ref<string | null>(null);

/* ================= FETCH ================= */
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

watch([keyword, statusFilter, pageSize], () => {
  page.value = 1;
  fetchData();
});
watch(page, fetchData);

/* ================= COMPUTED ================= */
const bookings = computed(() => store.paginate?.data || []);
const pagination = computed(() => store.paginate?.paginationInfo);
const totalPages = computed(() => pagination.value?._totalPages || 1);

/* ================= HANDLER ================= */
function prevPage() {
  if (page.value > 1) page.value--;
}
function nextPage() {
  if (page.value < totalPages.value) page.value++;
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Đã sao chép mã đặt vé");
  } catch (err) {
    toast.error("Không thể sao chép mã");
  }
};

/* ================= OPTIONS ================= */
const BOOKING_STATUS_OPTIONS = [
  { value: BookingStatus.PENDING, label: "Giữ chỗ" },
  { value: BookingStatus.CONFIRMED, label: "Đã xác nhận" },
  { value: BookingStatus.CHECKED_IN, label: "Đã lên xe" },
  { value: BookingStatus.NO_SHOW, label: "Không lên xe" },
  { value: BookingStatus.COMPLETED, label: "Hoàn thành" },
  { value: BookingStatus.CANCELLED, label: "Đã huỷ" },
  { value: BookingStatus.EXPIRED, label: "Hết hạn" },
  { value: BookingStatus.REFUNDED, label: "Đã hoàn tiền" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: PaymentStatus.UNPAID, label: "Chưa thanh toán" },
  { value: PaymentStatus.PENDING, label: "Đang xử lý" },
  { value: PaymentStatus.PAID, label: "Đã thanh toán" },
  { value: PaymentStatus.FAILED, label: "Thanh toán lỗi" },
  { value: PaymentStatus.REFUNDED, label: "Đã hoàn tiền" },
];

/* ================= UPDATE ================= */
const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
) => {
  const booking = bookings.value.find((b) => b._id === bookingId);
  if (!booking) return;

  if (!canChangeBookingStatus(booking.status, status)) {
    toast.error("Không thể chuyển sang trạng thái này");
    return;
  }

  await store.updateStatus(bookingId, { status });
  toast.success("Đã cập nhật trạng thái đơn");
  fetchData();
};

const updatePaymentStatus = async (
  bookingId: string,
  status: PaymentStatus,
) => {
  const booking = bookings.value.find((b) => b._id === bookingId);
  if (!booking) return;

  if (!canChangePaymentStatus(booking.paymentInfo.status, status)) {
    toast.error("Không thể chuyển trạng thái thanh toán này");
    return;
  }

  await store.updateStatus(bookingId, {
    paymentInfo: {
      status,
      amount: booking.amount,
      method: booking.paymentInfo.method || PaymentMethod.CASH,
    },
  });

  toast.success("Đã cập nhật trạng thái thanh toán");
  fetchData();
};
</script>

<template>
  <div>
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
        <td class="px-4 py-3 font-mono text-xs">
          <button
            class="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
            :title="
              'Click to view details, right-click to copy: ' +
              (b.code || b._id.slice(-8))
            "
            @click="navigateTo(`/admin/bookings/${b._id}`)"
            @click.right="copyToClipboard(b.code || b._id.slice(-8))"
          >
            {{ b.code || b._id.slice(-8) }}
          </button>
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
            {{
              b.paymentInfo?.method
                ? b.paymentInfo?.method === "CASH"
                  ? "Tiền mặt tại quầy"
                  : `Thanh toán bằng ${b.paymentInfo?.method}`
                : "—"
            }}
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
          {{ formatMoney(b.amount) }}
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
          <div class="flex flex-col items-end gap-2">
            <!-- BOOKING STATUS -->
            <select
              class="rounded border px-2 py-1 text-xs font-medium"
              :class="STATUS_COLOR[b.status]"
              :disabled="BOOKING_STATUS_FLOW[b.status].length === 0"
              :value="b.status"
              @change="
                updateBookingStatus(
                  b._id,
                  ($event.target as HTMLSelectElement).value as BookingStatus,
                )
              "
            >
              <option
                v-for="s in BOOKING_STATUS_OPTIONS"
                :key="s.value"
                :value="s.value"
                :disabled="!canChangeBookingStatus(b.status, s.value)"
              >
                {{ s.label }}
              </option>
            </select>

            <!-- PAYMENT STATUS -->
            <select
              v-if="b.paymentInfo"
              class="rounded border px-2 py-1 text-xs font-medium"
              :class="STATUS_COLOR[b.paymentInfo.status]"
              :disabled="PAYMENT_STATUS_FLOW[b.paymentInfo.status].length === 0"
              :value="b.paymentInfo.status"
              @change="
                updatePaymentStatus(
                  b._id,
                  ($event.target as HTMLSelectElement).value as PaymentStatus,
                )
              "
            >
              <option
                v-for="s in PAYMENT_STATUS_OPTIONS"
                :key="s.value"
                :value="s.value"
                :disabled="
                  !canChangePaymentStatus(b.paymentInfo.status, s.value)
                "
              >
                {{ s.label }}
              </option>
            </select>
          </div>
        </td>
      </tr>
    </AdminTable>
  </div>
</template>
