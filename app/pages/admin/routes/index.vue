<script setup lang="ts">
import AdminTable from "@/components/admin/AdminTable.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useBusCompanyStore } from "~/stores/bus_company.store";
import { useRouteStore } from "~/stores/route.store";
import { formatDurationShort } from "~/utils/date.util";
definePageMeta({ layout: "admin" });

const store = useRouteStore();
const companyStore = useBusCompanyStore();

/* =========================
  UI STATE
========================= */
const keyword = ref("");
const page = ref(1);
const pageSize = ref(5);

/* =========================
  FETCH
========================= */
const fetchData = async () => {
  await store.fetchPaginate({
    _page: page.value,
    _limit: pageSize.value,
    keyword: keyword.value || undefined,
    _populate: "companyId,startStopId,endStopId",
  });
};

onMounted(async () => {
  await companyStore.fetchAll();
  await fetchData();
});

/* =========================
  WATCH
========================= */
watch([keyword, pageSize], () => {
  page.value = 1;
  fetchData();
});
watch(page, fetchData);

/* =========================
  COMPUTED
========================= */
const routes = computed(() => store.paginate?.data || []);
const pagination = computed(() => store.paginate?.paginationInfo);
const totalPages = computed(() => pagination.value?._totalPages || 1);

/* =========================
  HANDLERS
========================= */
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
        <h1 class="text-2xl font-semibold">Tuyến đường</h1>
        <p class="text-sm text-gray-500">Quản lý các tuyến đường</p>
      </div>

      <NuxtLink
        to="/admin/routes/create"
        class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90"
      >
        + Thêm tuyến đường
      </NuxtLink>
    </div>

    <!-- SEARCH -->
    <div class="mb-4 flex items-center gap-3">
      <input
        v-model="keyword"
        placeholder="Tìm kiếm..."
        class="w-64 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
      />
    </div>

    <!-- TABLE -->
    <AdminTable
      :columns="[
        'Nhà xe',
        'Điểm bắt đầu',
        'Điểm kết thúc',
        'Thời gian (phút)',
        'Actions',
      ]"
      :data="routes"
      :page="page"
      :page-size="pageSize"
      :total-pages="totalPages"
      @prev="prevPage"
      @next="nextPage"
    >
      <tr v-for="r in routes" :key="r._id" class="border-b hover:bg-gray-50">
        <!-- COMPANY -->
        <td class="px-4 py-3">
          {{ r.companyId?.name || "-" }}
        </td>

        <!-- START -->
        <td class="px-4 py-3">
          {{ r.startStopId?.name || "-" }}
        </td>

        <!-- END -->
        <td class="px-4 py-3">
          {{ r.endStopId?.name || "-" }}
        </td>

        <!-- DURATION -->
        <td class="px-4 py-3">
          <span v-if="r.durationMinutes">
            {{ formatDurationShort(r.durationMinutes) }}
          </span>
          <span v-else class="text-gray-400">—</span>
        </td>

        <!-- ACTIONS -->
        <td class="space-x-3 px-4 py-3 text-right">
          <NuxtLink
            :to="`/admin/routes/${r._id}`"
            class="text-sm text-primary hover:underline"
          >
            Sửa
          </NuxtLink>

          <DeleteButton
            :on-delete="() => store.deleteManyByIds([r._id])"
            @deleted="handleDeleted"
          />
        </td>
      </tr>
    </AdminTable>
  </div>
</template>
