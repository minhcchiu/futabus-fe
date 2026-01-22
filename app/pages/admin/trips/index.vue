<script setup lang="ts">
import AdminTable from "@/components/admin/AdminTable.vue";
import { formatDate } from "date-fns";
import { computed, ref, watch } from "vue";

definePageMeta({ layout: "admin" });

const trips = DATA.Trip;

/* UI STATE */
const keyword = ref("");
const statusFilter = ref("ALL");
const page = ref(1);
const pageSize = 5;

/* SEARCH + FILTER */
const filteredTrips = computed(() => {
  return trips.filter((t) => {
    const routeText =
      `${t.route.startStop.name} ${t.route.endStop.name}`.toLowerCase();

    const matchKeyword =
      routeText.includes(keyword.value.toLowerCase()) ||
      t.vehicle.plateNumber.toLowerCase().includes(keyword.value.toLowerCase());

    const matchStatus =
      statusFilter.value === "ALL" || t.status === statusFilter.value;

    return matchKeyword && matchStatus;
  });
});

/* PAGINATION */
const pagedTrips = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredTrips.value.slice(start, start + pageSize);
});

/* TOTAL PAGES */
const totalPages = computed(() =>
  Math.ceil(filteredTrips.value.length / pageSize),
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
      <h1 class="text-2xl font-semibold">Trips</h1>
      <p class="text-sm text-gray-500">
        Manage all trips in the transportation system
      </p>
    </div>

    <!-- SEARCH + FILTER -->
    <div class="mb-4 flex items-center gap-3">
      <input
        v-model="keyword"
        placeholder="Search route or vehicle..."
        class="w-64 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >

      <select
        v-model="statusFilter"
        class="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="ALL">All Status</option>
        <option value="READY">Ready</option>
        <option value="RUNNING">Running</option>
        <option value="DONE">Done</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
    </div>

    <!-- TABLE -->
    <AdminTable
      :columns="['Route', 'Vehicle', 'Departure', 'Status']"
      :data="pagedTrips"
      :page="page"
      :page-size="pageSize"
      @prev="prevPage"
      @next="nextPage"
    >
      <tr
        v-for="t in pagedTrips"
        :key="t._id"
        class="border-b border-b-gray-100 transition hover:bg-gray-50"
      >
        <!-- ROUTE -->
        <td class="px-4 py-3 font-medium text-gray-700">
          {{ t.route.startStop.name }} → {{ t.route.endStop.name }}
        </td>

        <!-- VEHICLE -->
        <td class="px-4 py-3 text-gray-600">
          {{ t.vehicle.plateNumber }}
        </td>

        <!-- DEPARTURE -->
        <td class="px-4 py-3 text-gray-600">
          {{ formatDate(new Date(t.departureTime), "dd-MM-yyyy HH:mm") }}
        </td>

        <!-- STATUS -->
        <td class="px-4 py-3">
          <span
            :class="[
              'rounded-full px-3 py-1 text-xs font-medium',
              t.status === 'READY' && 'bg-green-100 text-green-600',
              t.status === 'RUNNING' && 'bg-blue-100 text-blue-600',
              t.status === 'DONE' && 'bg-gray-100 text-gray-600',
              t.status === 'CANCELLED' && 'bg-red-100 text-red-600',
            ]"
          >
            {{ t.status }}
          </span>
        </td>
      </tr>
    </AdminTable>

    <!-- EMPTY -->
    <p v-if="!pagedTrips.length" class="mt-6 text-center text-sm text-gray-400">
      No trips found
    </p>
  </div>
</template>
