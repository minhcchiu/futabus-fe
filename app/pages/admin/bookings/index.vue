<script setup lang="ts">
import AdminTable from "@/components/admin/AdminTable.vue";
import { computed, ref, watch } from "vue";

definePageMeta({ layout: "admin" });

const bookings = DATA.Booking;

/* UI STATE */
const keyword = ref("");
const statusFilter = ref("ALL");
const page = ref(1);
const pageSize = 5;

/* FILTER + SEARCH */
const filteredBookings = computed(() => {
  return bookings.filter((b) => {
    const matchKeyword =
      b.trip._id.toLowerCase().includes(keyword.value.toLowerCase()) ||
      b.seat.code.toLowerCase().includes(keyword.value.toLowerCase());

    const matchStatus =
      statusFilter.value === "ALL" || b.status === statusFilter.value;

    return matchKeyword && matchStatus;
  });
});

/* PAGINATION */
const pagedBookings = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredBookings.value.slice(start, start + pageSize);
});

/* TOTAL PAGES */
const totalPages = computed(() =>
  Math.ceil(filteredBookings.value.length / pageSize),
);

/* HANDLERS */
function prevPage() {
  if (page.value > 1) page.value--;
}
function nextPage() {
  if (page.value < totalPages.value) page.value++;
}

/* RESET PAGE WHEN FILTER CHANGES */
watch([keyword, statusFilter], () => {
  page.value = 1;
});
</script>

<template>
  <div>
    <!-- HEADER -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">Bookings</h1>
      <p class="text-sm text-gray-500">
        Manage all ticket bookings in the system
      </p>
    </div>

    <!-- SEARCH + FILTER -->
    <div class="mb-4 flex items-center gap-3">
      <input
        v-model="keyword"
        placeholder="Search trip or seat..."
        class="w-64 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <select
        v-model="statusFilter"
        class="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="ALL">All Status</option>
        <option value="PENDING">Pending</option>
        <option value="PAID">Paid</option>
        <option value="CANCELLED">Cancelled</option>
        <option value="REFUNDED">Refunded</option>
      </select>
    </div>

    <!-- TABLE -->
    <AdminTable
      :columns="['Trip', 'Seat', 'Amount', 'Status']"
      :data="pagedBookings"
      :page="page"
      :page-size="pageSize"
      @prev="prevPage"
      @next="nextPage"
    >
      <tr
        v-for="b in pagedBookings"
        :key="b._id"
        class="border-b border-b-gray-100 transition hover:bg-gray-50"
      >
        <!-- TRIP -->
        <td class="px-4 py-3 font-medium text-gray-700">
          {{ b.trip._id }}
        </td>

        <!-- SEAT -->
        <td class="px-4 py-3">
          <span
            class="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
          >
            {{ b.seat.code }}
          </span>
        </td>

        <!-- AMOUNT -->
        <td class="px-4 py-3 font-semibold text-primary">
          {{ b.amount.toLocaleString() }} đ
        </td>

        <!-- STATUS -->
        <td class="px-4 py-3">
          <span
            :class="[
              'inline-flex rounded-full px-3 py-1 text-xs font-medium',
              b.status === 'PAID' && 'bg-green-100 text-green-600',
              b.status === 'PENDING' && 'bg-yellow-100 text-yellow-600',
              b.status === 'CANCELLED' && 'bg-red-100 text-red-600',
              b.status === 'REFUNDED' && 'bg-gray-100 text-gray-600',
            ]"
          >
            {{ b.status }}
          </span>
        </td>
      </tr>
    </AdminTable>

    <!-- EMPTY STATE -->
    <p
      v-if="!pagedBookings.length"
      class="mt-6 text-center text-sm text-gray-400"
    >
      No bookings found
    </p>
  </div>
</template>
