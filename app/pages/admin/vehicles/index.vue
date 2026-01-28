<script setup lang="ts">
import AdminTable from "@/components/admin/AdminTable.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useVehicleStore } from "~/stores/vehicle.store";

definePageMeta({ layout: "admin" });

const store = useVehicleStore();

/* UI STATE */
const keyword = ref("");
const statusFilter = ref<"ALL" | "ACTIVE" | "INACTIVE" | "MAINTENANCE">("ALL");
const page = ref(1);
const pageSize = ref(5);

/* FETCH DATA */
const fetchData = async () => {
  await store.fetchPaginate({
    _page: page.value,
    _limit: pageSize.value,
    keyword: keyword.value || undefined,
    _status: statusFilter.value !== "ALL" ? statusFilter.value : undefined,
  });
};

onMounted(fetchData);

/* RESET PAGE WHEN FILTER CHANGE */
watch([keyword, statusFilter, pageSize], () => {
  page.value = 1;
  fetchData();
});

/* FETCH WHEN PAGE CHANGE */
watch(page, fetchData);

/* COMPUTED */
const pagedVehicles = computed(() => store.paginate?.data || []);
const pagination = computed(() => store.paginate?.paginationInfo);
const totalPages = computed(() => pagination.value?._totalPages || 1);

/* HANDLERS */
function prevPage() {
  if (page.value > 1) page.value--;
}
function nextPage() {
  if (page.value < totalPages.value) page.value++;
}

async function handleDeleted() {
  await fetchData();
}
</script>

<template>
  <div>
    <!-- HEADER -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Vehicles</h1>
        <p class="text-sm text-gray-500">
          Manage all vehicles in the transportation system
        </p>
      </div>

      <NuxtLink
        to="/admin/vehicles/create"
        class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90"
      >
        + Add Vehicle
      </NuxtLink>
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

    <!-- LOADING -->
    <div v-if="store.loading" class="py-10 text-center text-sm text-gray-500">
      Loading vehicles...
    </div>

    <!-- TABLE -->
    <AdminTable
      v-else
      :columns="['Plate', 'Company', 'Seats', 'Status', 'Actions']"
      :data="pagedVehicles"
      :page="page"
      :page-size="pageSize"
      :total="pagination?._totalData"
      :total-pages="totalPages"
      @prev="prevPage"
      @next="nextPage"
      @go="page = $event"
      @update:page-size="
        (val) => {
          pageSize = val;
          page = 1;
        }
      "
    >
      <tr
        v-for="v in pagedVehicles"
        :key="v._id"
        class="border-b border-gray-100 transition hover:bg-gray-50"
      >
        <!-- PLATE -->
        <td class="px-4 py-3 font-medium text-gray-700">
          {{ v.plateNumber }}
        </td>

        <!-- COMPANY -->
        <td class="px-4 py-3 text-gray-600">
          {{ v.companyId?.name || "-" }}
        </td>

        <!-- SEATS -->
        <td class="px-4 py-3 text-gray-600">
          <NuxtLink
            :to="`/admin/vehicles/${v._id}/seats`"
            class="text-sm font-medium text-primary hover:underline"
          >
            {{ v.totalSeats || 0 }}
          </NuxtLink>
        </td>

        <!-- STATUS -->
        <td class="px-4 py-3">
          <span
            :class="[
              'rounded-full px-3 py-1 text-xs font-medium',
              v.status === 'ACTIVE' && 'bg-green-100 text-green-600',
              v.status === 'INACTIVE' && 'bg-gray-100 text-gray-600',
            ]"
          >
            {{ v.status }}
          </span>
        </td>

        <!-- ACTIONS -->
        <td class="space-x-3 px-4 py-3 text-right">
          <NuxtLink
            :to="`/admin/vehicles/${v._id}`"
            class="text-sm font-medium text-primary hover:underline"
          >
            Edit
          </NuxtLink>

          <DeleteButton
            :on-delete="() => store.deleteByIds([v._id])"
            :disabled="store.loading"
            success-message="Xoá xe thành công"
            error-message="Xoá xe thất bại"
            @deleted="handleDeleted"
          />
        </td>
      </tr>
    </AdminTable>

    <!-- EMPTY -->
    <p
      v-if="!store.loading && !pagedVehicles.length"
      class="mt-6 text-center text-sm text-gray-400"
    >
      No vehicles found
    </p>
  </div>
</template>
