<script setup lang="ts">
import AdminTable from "@/components/admin/AdminTable.vue";
import { computed, ref, watch } from "vue";

definePageMeta({ layout: "admin" });

const vehicles = DATA.Vehicle;

/* UI STATE */
const keyword = ref("");
const statusFilter = ref("ALL");
const page = ref(1);
const pageSize = 5;

/* SEARCH + FILTER */
const filteredVehicles = computed(() => {
  return vehicles.filter((v) => {
    const matchKeyword =
      v.plateNumber.toLowerCase().includes(keyword.value.toLowerCase()) ||
      (v.company?.name || "")
        .toLowerCase()
        .includes(keyword.value.toLowerCase());

    const matchStatus =
      statusFilter.value === "ALL" || v.status === statusFilter.value;

    return matchKeyword && matchStatus;
  });
});

/* PAGINATION */
const pagedVehicles = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredVehicles.value.slice(start, start + pageSize);
});

/* TOTAL PAGES */
const totalPages = computed(() =>
  Math.ceil(filteredVehicles.value.length / pageSize),
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
      <h1 class="text-2xl font-semibold">Vehicles</h1>
      <p class="text-sm text-gray-500">
        Manage all vehicles in the transportation system
      </p>
    </div>

    <!-- SEARCH + FILTER -->
    <div class="mb-4 flex items-center gap-3">
      <input
        v-model="keyword"
        placeholder="Search plate or company..."
        class="w-64 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >

      <select
        v-model="statusFilter"
        class="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="ALL">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
        <option value="MAINTENANCE">Maintenance</option>
      </select>
    </div>

    <!-- TABLE -->
    <AdminTable
      :columns="['Plate', 'Company', 'Seats', 'Status']"
      :data="pagedVehicles"
      :page="page"
      :page-size="pageSize"
      @prev="prevPage"
      @next="nextPage"
    >
      <tr
        v-for="v in pagedVehicles"
        :key="v._id"
        class="border-b border-b-gray-100 transition hover:bg-gray-50"
      >
        <!-- PLATE -->
        <td class="px-4 py-3 font-medium text-gray-700">
          {{ v.plateNumber }}
        </td>

        <!-- COMPANY -->
        <td class="px-4 py-3 text-gray-600">
          {{ v.company?.name || "-" }}
        </td>

        <!-- SEATS -->
        <td class="px-4 py-3 text-gray-600">
          {{ v.totalSeat }}
        </td>

        <!-- STATUS -->
        <td class="px-4 py-3">
          <span
            :class="[
              'rounded-full px-3 py-1 text-xs font-medium',
              v.status === 'ACTIVE' && 'bg-green-100 text-green-600',
              v.status === 'INACTIVE' && 'bg-gray-100 text-gray-600',
              v.status === 'MAINTENANCE' && 'bg-yellow-100 text-yellow-600',
            ]"
          >
            {{ v.status }}
          </span>
        </td>
      </tr>
    </AdminTable>

    <!-- EMPTY -->
    <p
      v-if="!pagedVehicles.length"
      class="mt-6 text-center text-sm text-gray-400"
    >
      No vehicles found
    </p>
  </div>
</template>
