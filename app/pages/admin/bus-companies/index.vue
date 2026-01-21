<script setup lang="ts">
import AdminTable from "@/components/admin/AdminTable.vue";
import { computed, ref, watch } from "vue";

definePageMeta({ layout: "admin" });

const companies = DATA.BusCompany;

/* UI STATE */
const keyword = ref("");
const statusFilter = ref("ALL");
const page = ref(1);
const pageSize = 5;

/* FILTER + SEARCH */
const filteredCompanies = computed(() => {
  return companies.filter((c) => {
    const matchKeyword =
      c.name.toLowerCase().includes(keyword.value.toLowerCase()) ||
      c.hotline.includes(keyword.value);

    const matchStatus =
      statusFilter.value === "ALL" || c.status === statusFilter.value;

    return matchKeyword && matchStatus;
  });
});

/* PAGINATION */
const pagedCompanies = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredCompanies.value.slice(start, start + pageSize);
});

/* TOTAL PAGES */
const totalPages = computed(() =>
  Math.ceil(filteredCompanies.value.length / pageSize),
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
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Bus Companies</h1>
        <p class="text-sm text-gray-500">Manage all bus operators in system</p>
      </div>

      <NuxtLink
        to="/admin/bus-companies/create"
        class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90"
      >
        + Add Company
      </NuxtLink>
    </div>

    <!-- SEARCH + FILTER -->
    <div class="mb-4 flex items-center gap-3">
      <!-- Search -->
      <input
        v-model="keyword"
        placeholder="Search company or hotline..."
        class="w-64 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <!-- Filter -->
      <select
        v-model="statusFilter"
        class="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="ALL">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
    </div>

    <!-- TABLE -->
    <AdminTable
      :columns="['Name', 'Hotline', 'Status', 'Actions']"
      :data="pagedCompanies"
      :page="page"
      :pageSize="pageSize"
      @prev="prevPage"
      @next="nextPage"
    >
      <tr
        v-for="c in pagedCompanies"
        :key="c._id"
        class="border-b border-b-gray-100 transition hover:bg-gray-50"
      >
        <!-- NAME -->
        <td class="px-4 py-3 font-medium text-gray-700">
          {{ c.name }}
        </td>

        <!-- HOTLINE -->
        <td class="px-4 py-3 text-gray-600">
          {{ c.hotline }}
        </td>

        <!-- STATUS -->
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

        <!-- ACTION -->
        <td class="px-4 py-3 text-right">
          <NuxtLink
            :to="`/admin/bus-companies/${c._id}`"
            class="text-sm font-medium text-primary hover:underline"
          >
            Edit
          </NuxtLink>
        </td>
      </tr>
    </AdminTable>

    <!-- EMPTY STATE -->
    <p
      v-if="!pagedCompanies.length"
      class="mt-6 text-center text-sm text-gray-400"
    >
      No companies found
    </p>
  </div>
</template>
