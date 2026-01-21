<script setup lang="ts">
import AdminTable from "@/components/admin/AdminTable.vue";
import { computed, ref } from "vue";

definePageMeta({ layout: "admin" });

const routes = DATA.Route;

/* UI STATE */
const keyword = ref("");
const companyFilter = ref("ALL");
const page = ref(1);
const pageSize = 5;

/* COMPANY LIST */
const companies = computed(() => {
  const map = new Map();
  routes.forEach((r) => map.set(r.company._id, r.company.name));
  return Array.from(map, ([id, name]) => ({ id, name }));
});

/* SEARCH + FILTER */
const filteredRoutes = computed(() => {
  return routes.filter((r) => {
    const matchKeyword =
      r.startStop.name.toLowerCase().includes(keyword.value.toLowerCase()) ||
      r.endStop.name.toLowerCase().includes(keyword.value.toLowerCase());

    const matchCompany =
      companyFilter.value === "ALL" || r.company._id === companyFilter.value;

    return matchKeyword && matchCompany;
  });
});

/* PAGINATION */
const pagedRoutes = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredRoutes.value.slice(start, start + pageSize);
});

/* TOTAL PAGES */
const totalPages = computed(() =>
  Math.ceil(filteredRoutes.value.length / pageSize),
);

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
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">Routes</h1>
      <p class="text-sm text-gray-500">Manage all routes between locations</p>
    </div>

    <!-- SEARCH + FILTER -->
    <div class="mb-4 flex items-center gap-3">
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
        <option v-for="c in companies" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>
    </div>

    <!-- TABLE -->
    <AdminTable
      :columns="['From', 'To', 'Company']"
      :data="pagedRoutes"
      :page="page"
      :pageSize="pageSize"
      @prev="prevPage"
      @next="nextPage"
    >
      <tr
        v-for="r in pagedRoutes"
        :key="r._id"
        class="border-b border-b-gray-100 transition hover:bg-gray-50"
      >
        <!-- FROM -->
        <td class="px-4 py-3 font-medium text-gray-700">
          {{ r.startStop.name }}
        </td>

        <!-- TO -->
        <td class="px-4 py-3 font-medium text-gray-700">
          {{ r.endStop.name }}
        </td>

        <!-- COMPANY -->
        <td class="px-4 py-3">
          <span
            class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            {{ r.company.name }}
          </span>
        </td>
      </tr>
    </AdminTable>

    <!-- EMPTY STATE (nếu muốn custom hơn AdminTable) -->
    <p
      v-if="!pagedRoutes.length"
      class="mt-6 text-center text-sm text-gray-400"
    >
      No routes found
    </p>
  </div>
</template>
