<script setup lang="ts">
import AdminTable from "@/components/admin/AdminTable.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useStopLocationStore } from "~/stores/stop_location.store";

definePageMeta({ layout: "admin" });

const store = useStopLocationStore();

/* UI STATE */
const keyword = ref("");
const statusFilter = ref<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
const page = ref(1);
const pageSize = ref(5);

/* FETCH DATA */
const fetchData = async () => {
  await store.fetchPaginate({
    _page: page.value,
    _limit: pageSize.value,
    keyword: keyword.value || undefined,
    _status: statusFilter.value !== "ALL" ? statusFilter.value : undefined,
    _populate: "provinceId,districtId,wardId",
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
const pagedStops = computed(() => store.paginate?.data || []);
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
        <h1 class="text-2xl font-semibold">Stop Locations</h1>
        <p class="text-sm text-gray-500">
          Manage all pickup/drop-off locations
        </p>
      </div>
      <NuxtLink
        to="/admin/stop-locations/create"
        class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90"
      >
        + Add Stop Location
      </NuxtLink>
    </div>

    <!-- SEARCH -->
    <div class="mb-4">
      <input
        v-model="keyword"
        placeholder="Search stop name..."
        class="w-64 rounded-lg border px-3 py-2 text-sm"
      />
    </div>

    <!-- TABLE -->
    <AdminTable
      :columns="['Name', 'Address', 'Province', 'Actions']"
      :data="pagedStops"
      :page="page"
      :page-size="pageSize"
      @prev="prevPage"
      @next="nextPage"
    >
      <tr
        v-for="s in pagedStops"
        :key="s._id"
        class="border-b hover:bg-gray-50"
      >
        <td class="px-4 py-3 font-medium">{{ s.name }}</td>
        <td class="px-4 py-3 text-gray-600">{{ s.address }}</td>
        <td class="px-4 py-3 text-gray-600">{{ s.provinceId?.name || "-" }}</td>
        <td class="space-x-3 px-4 py-3 text-right">
          <NuxtLink
            :to="`/admin/stop-locations/${s._id}`"
            class="text-sm font-medium text-primary hover:underline"
          >
            Edit
          </NuxtLink>

          <DeleteButton
            :on-delete="() => store.deleteManyByIds([s._id])"
            :disabled="store.loading"
            success-message="Xoá điểm dừng thành công"
            error-message="Xoá điểm dừng thất bại"
            @deleted="handleDeleted"
          />
        </td>
      </tr>
    </AdminTable>
  </div>
</template>
