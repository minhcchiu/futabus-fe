<script setup lang="ts">
import AdminTable from "@/components/admin/AdminTable.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useSepayStore } from "~/stores/sepay.store";

definePageMeta({ layout: "admin", middleware: "auth" });

const store = useSepayStore();

/* =========================
  UI STATE
========================= */
const keyword = ref("");
const page = ref(1);
const pageSize = ref(10);

/* =========================
  FETCH
========================= */
const fetchData = async () => {
  const searchValue = keyword.value ? `/${keyword.value}/i` : undefined;
  await store.fetchPaginate({
    _page: page.value,
    _limit: pageSize.value,
    [`_oneOf.name`]: searchValue,
    [`_oneOf.code`]: searchValue,
    [`_oneOf.bin`]: searchValue,
    [`_oneOf.shortName`]: searchValue,
    [`_oneOf.short_name`]: searchValue,
    _sort: "-isUse",
  });
};

onMounted(fetchData);

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
const sepays = computed(() => store.paginate?.data || []);
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
        <h1 class="text-2xl font-semibold">Sepay / Ngân hàng</h1>
        <p class="text-sm text-gray-500">
          Quản lý ngân hàng & thông tin thanh toán
        </p>
      </div>
    </div>

    <!-- SEARCH -->
    <div class="mb-4 flex items-center gap-3">
      <input
        v-model="keyword"
        placeholder="Tìm theo tên, mã, BIN..."
        class="w-72 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
      >
    </div>

    <!-- TABLE -->
    <AdminTable
      :columns="[
        'Logo',
        'Ngân hàng',
        'Mã / BIN',
        'Swift',
        'Hỗ trợ',
        'Tài khoản',
        'Sử dụng',
        'Actions',
      ]"
      :data="sepays"
      :page="page"
      :page-size="pageSize"
      :total-pages="totalPages"
      @prev="prevPage"
      @next="nextPage"
    >
      <tr v-for="s in sepays" :key="s._id" class="border-b hover:bg-gray-50">
        <!-- LOGO -->
        <td class="px-4 py-3">
          <img
            v-if="s.logo"
            :src="s.logo"
            class="h-8 w-8 rounded object-contain"
          >
          <span v-else class="text-gray-400">—</span>
        </td>

        <!-- BANK NAME -->
        <td class="px-4 py-3">
          <div class="font-medium">{{ s.name }}</div>
          <div class="text-xs text-gray-500">
            {{ s.shortName || s.short_name }}
          </div>
        </td>

        <!-- CODE / BIN -->
        <td class="px-4 py-3 text-sm">
          <div><b>Code:</b> {{ s.code }}</div>
          <div class="text-gray-500"><b>BIN:</b> {{ s.bin || "—" }}</div>
        </td>

        <!-- SWIFT -->
        <td class="px-4 py-3 text-sm">
          {{ s.swift_code || "—" }}
        </td>

        <!-- SUPPORT -->
        <td class="px-4 py-3 text-sm">
          <div
            :class="s.transferSupported ? 'text-green-600' : 'text-gray-400'"
          >
            ✔ Chuyển khoản
          </div>
          <div :class="s.lookupSupported ? 'text-green-600' : 'text-gray-400'">
            ✔ Tra cứu
          </div>
        </td>

        <!-- BANK INFO -->
        <td class="px-4 py-3 text-sm">
          <div v-if="s.bankInfo">
            <div class="text-gray-500">
              {{ s.bankInfo.accountNumber }}
            </div>
            <div class="text-xs italic">
              {{ s.bankInfo.accountHolder }}
            </div>
          </div>
          <span v-else class="text-gray-400">—</span>
        </td>

        <!-- IS USE -->
        <td class="px-4 py-3">
          <span
            class="rounded-full px-2 py-1 text-xs font-medium"
            :class="
              s.isUse
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            "
          >
            {{ s.isUse ? "Đang dùng" : "Tạm tắt" }}
          </span>
        </td>

        <!-- ACTIONS -->
        <td class="space-x-3 px-4 py-3 text-right">
          <NuxtLink
            :to="`/admin/sepay/${s._id}`"
            class="text-sm text-primary hover:underline"
          >
            Sửa
          </NuxtLink>

          <DeleteButton
            :on-delete="() => store.deleteManyByIds([s._id])"
            @deleted="handleDeleted"
          />
        </td>
      </tr>
    </AdminTable>
  </div>
</template>
