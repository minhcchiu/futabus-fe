<script setup lang="ts">
import AdminTable from "@/components/admin/AdminTable.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useBusCompanyStore } from "~/stores/bus_company.store";

definePageMeta({ layout: "admin" });

const store = useBusCompanyStore();

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
const pagedCompanies = computed(() => store.paginate?.data || []);
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
        <h1 class="text-2xl font-semibold">Nhà Xe</h1>
        <p class="text-sm text-gray-500">
          Quản lý tất cả các nhà khai thác xe buýt trong hệ thống
        </p>
      </div>

      <NuxtLink
        to="/admin/bus-companies/create"
        class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90"
      >
        + Add Company
      </NuxtLink>
    </div>

    <!-- FILTER -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <input
        v-model="keyword"
        placeholder="Search company or hotline..."
        class="w-64 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <select
        v-model="statusFilter"
        class="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="ALL">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
    </div>

    <!-- LOADING -->
    <div v-if="store.loading" class="py-10 text-center text-sm text-gray-500">
      Loading data...
    </div>

    <!-- TABLE -->
    <AdminTable
      v-else
      :columns="['Name', 'Hotline', 'Status', 'Actions']"
      :data="pagedCompanies"
      :page="page"
      :page-size="pageSize"
      :total="store.paginate?.paginationInfo?._totalData"
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
        v-for="c in pagedCompanies"
        :key="c._id"
        class="border-b border-gray-100 transition hover:bg-gray-50"
      >
        <td class="px-4 py-3 font-medium text-gray-700">
          {{ c.name }}
        </td>

        <td class="px-4 py-3 text-gray-600">
          {{ c.hotline }}
        </td>

        <td class="px-4 py-3">
          <span
            :class="[
              'inline-flex rounded-full px-3 py-1 text-xs font-medium',
              c.status === 'ACTIVE' && 'bg-green-100 text-green-600',
              c.status === 'INACTIVE' && 'bg-gray-100 text-gray-600',
            ]"
          >
            {{ c.status }}
          </span>
        </td>

        <td class="space-x-3 px-4 py-3 text-right">
          <NuxtLink
            :to="`/admin/bus-companies/${c._id}`"
            class="text-sm font-medium text-primary hover:underline"
          >
            Edit
          </NuxtLink>

          <DeleteButton
            :on-delete="() => store.deleteManyByIds([c._id!])"
            :disabled="store.loading"
            success-message="Xoá nhà xe thành công"
            error-message="Xoá nhà xe thất bại"
            @deleted="handleDeleted"
          />
        </td>
      </tr>
    </AdminTable>

    <!-- EMPTY -->
    <p
      v-if="!store.loading && !pagedCompanies.length"
      class="mt-6 text-center text-sm text-gray-400"
    >
      No companies found
    </p>
  </div>
</template>
