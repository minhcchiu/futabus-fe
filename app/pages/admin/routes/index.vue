<script setup lang="ts">
import AdminTable from "@/components/admin/AdminTable.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useBusCompanyStore } from "~/stores/bus_company.store";
import { useRouteStore } from "~/stores/route.store";

definePageMeta({ layout: "admin" });

const store = useRouteStore();
const companyStore = useBusCompanyStore();

/* UI STATE */
const keyword = ref("");
const companyFilter = ref<string | "ALL">("ALL");
const page = ref(1);
const pageSize = ref(5);

/* FETCH DATA */
const fetchData = async () => {
  await store.fetchPaginate({
    _page: page.value,
    _limit: pageSize.value,
    keyword: keyword.value || undefined,
    companyId: companyFilter.value !== "ALL" ? companyFilter.value : undefined,
  });
};

onMounted(async () => {
  await companyStore.fetchAll(); // để filter theo company
  await fetchData();
});

/* RESET PAGE WHEN FILTER CHANGE */
watch([keyword, companyFilter, pageSize], () => {
  page.value = 1;
  fetchData();
});

/* FETCH WHEN PAGE CHANGE */
watch(page, fetchData);

/* COMPUTED */
const pagedRoutes = computed(() => store.paginate?.data || []);
const pagination = computed(() => store.paginate?.paginationInfo);
const totalPages = computed(() => pagination.value?._totalPages || 1);
const companies = computed(() => companyStore.list || []);

/* HANDLERS */
function prevPage() {
  if (page.value > 1) page.value--;
}

function nextPage() {
  if (page.value < totalPages.value) page.value++;
}
</script>

<template>
  <div>
    <!-- HEADER -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Routes</h1>
        <p class="text-sm text-gray-500">Manage all routes between locations</p>
      </div>

      <NuxtLink
        to="/admin/routes/create"
        class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90"
      >
        + Add Route
      </NuxtLink>
    </div>

    <!-- FILTER -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <input
        v-model="keyword"
        placeholder="Search from / to..."
        class="w-64 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <select
        v-model="companyFilter"
        class="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="ALL">All Companies</option>
        <option v-for="c in companies" :key="c._id" :value="c._id">
          {{ c.name }}
        </option>
      </select>
    </div>

    <!-- LOADING -->
    <div v-if="store.loading" class="py-10 text-center text-sm text-gray-500">
      Loading routes...
    </div>

    <!-- TABLE -->
    <AdminTable
      v-else
      :columns="['From', 'To', 'Company']"
      :data="pagedRoutes"
      :page="page"
      :page-size="pageSize"
      :total="pagination?._totalData"
      :total-pages="totalPages"
      @prev="prevPage"
      @next="nextPage"
      @go="page = $event"
      @update:pageSize="
        (val) => {
          pageSize = val;
          page = 1;
        }
      "
    >
      <tr
        v-for="r in pagedRoutes"
        :key="r._id"
        class="border-b border-gray-100 transition hover:bg-gray-50"
      >
        <!-- FROM -->
        <td class="px-4 py-3 font-medium text-gray-700">
          {{ r.startStopId?.name }}
        </td>

        <!-- TO -->
        <td class="px-4 py-3 font-medium text-gray-700">
          {{ r.endStopId?.name }}
        </td>

        <!-- COMPANY -->
        <td class="px-4 py-3">
          <span
            class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            {{ r.companyId?.name }}
          </span>
        </td>
      </tr>
    </AdminTable>

    <!-- EMPTY -->
    <p
      v-if="!store.loading && !pagedRoutes.length"
      class="mt-6 text-center text-sm text-gray-400"
    >
      No routes found
    </p>
  </div>
</template>
