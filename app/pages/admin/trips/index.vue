<script setup lang="ts">
import AdminTable from "@/components/admin/AdminTable.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useTripStore } from "~/stores/trip.store";

definePageMeta({ layout: "admin" });

const store = useTripStore();

const page = ref(1);
const pageSize = ref(5);

/* =========================
  FETCH
========================= */
const fetchData = async () => {
  await store.fetchPaginate({
    _page: page.value,
    _limit: pageSize.value,
    _populate: "companyId,routeId,vehicleId,routeId.startStopId endStopId",
  });
};

onMounted(fetchData);
watch(page, fetchData);

/* =========================
  COMPUTED
========================= */
const trips = computed(() => store.paginate?.data || []);
const totalPages = computed(
  () => store.paginate?.paginationInfo?._totalPages || 1,
);

/* =========================
  DELETE
========================= */
async function handleDeleted() {
  await fetchData();
}

/* =========================
  STOP MODAL
========================= */
const showStopModal = ref(false);
const selectedTrip = ref<any>(null);

const openStops = (trip: any) => {
  selectedTrip.value = trip;
  showStopModal.value = true;
};
</script>

<template>
  <div>
    <!-- HEADER -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Trips</h1>
        <p class="text-sm text-gray-500">Manage trips</p>
      </div>

      <NuxtLink
        to="/admin/trips/create"
        class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90"
      >
        + Add Trip
      </NuxtLink>
    </div>

    <!-- TABLE -->
    <AdminTable
      :columns="[
        'Route',
        'Vehicle',
        'Departure',
        'Arrive',
        'Status',
        'Stop',
        'Price',
        'Actions',
      ]"
      :data="trips"
      :page="page"
      :page-size="pageSize"
      :total-pages="totalPages"
      @prev="page--"
      @next="page++"
    >
      <tr v-for="t in trips" :key="t._id" class="border-b hover:bg-gray-50">
        <!-- ROUTE -->
        <td class="px-4 py-3 font-semibold text-primary">
          {{ t.routeId?.startStopId?.name }} →
          {{ t.routeId?.endStopId?.name }}
        </td>

        <!-- VEHICLE -->
        <td class="px-4 py-3">
          {{ t.vehicleId?.plateNumber || "-" }}
        </td>

        <!-- DEPARTURE -->
        <td class="px-4 py-3">
          {{ new Date(t.departureTime).toLocaleString() }}
        </td>

        <!-- ARRIVE -->
        <td class="px-4 py-3">
          <span v-if="t.arrivalTime">
            {{ new Date(t.arrivalTime).toLocaleString() }}
          </span>
          <span v-else class="text-gray-400">—</span>
        </td>

        <!-- STATUS -->
        <td class="px-4 py-3">
          {{ t.status }}
        </td>

        <!-- STOPS -->
        <td class="px-4 py-3">
          <button class="text-blue-600 underline" @click="openStops(t)">
            Stops
          </button>
        </td>

        <!-- PRICE -->
        <td class="px-4 py-3">
          <NuxtLink
            :to="`/admin/trips/${t._id}/prices`"
            class="text-primary underline"
          >
            Price
          </NuxtLink>
        </td>

        <!-- ACTIONS -->
        <td class="space-x-3 px-4 py-3 text-right">
          <NuxtLink
            :to="`/admin/trips/${t._id}`"
            class="text-primary hover:underline"
          >
            Edit
          </NuxtLink>

          <DeleteButton
            :on-delete="() => store.deleteManyByIds([t._id])"
            :disabled="store.loading"
            success-message="Xoá chuyến đi thành công"
            error-message="Xoá chuyến đi thất bại"
            @deleted="handleDeleted"
          />
        </td>
      </tr>
    </AdminTable>

    <!-- STOP MODAL -->
    <TripStopModal
      v-if="showStopModal"
      :trip="selectedTrip"
      @close="showStopModal = false"
    />
  </div>
</template>
