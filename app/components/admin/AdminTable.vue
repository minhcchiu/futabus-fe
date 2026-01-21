<script setup lang="ts">
defineProps<{
  columns: string[];
  data: any[];
  page?: number;
  pageSize?: number;
}>();

defineEmits(["prev", "next"]);
</script>

<template>
  <div class="overflow-hidden border bg-white shadow-sm">
    <table class="w-full text-sm">
      <!-- HEADER -->
      <thead class="border-b bg-gray-50 text-left text-gray-600">
        <tr>
          <th v-for="col in columns" :key="col" class="px-4 py-3 font-medium">
            {{ col }}
          </th>
        </tr>
      </thead>

      <!-- BODY -->
      <tbody v-if="data.length">
        <slot />
      </tbody>

      <!-- NO DATA -->
      <tbody v-else>
        <tr>
          <td :colspan="columns.length" class="py-12 text-center text-gray-400">
            No data found
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- FOOTER -->
  <div
    v-if="page !== undefined && pageSize !== undefined"
    class="mt-4 flex items-center justify-between text-sm text-gray-500"
  >
    <span>
      Showing
      {{ (page - 1) * pageSize + 1 }} -
      {{ Math.min(page * pageSize, data.length) }}
    </span>

    <div class="flex gap-2">
      <button
        @click="$emit('prev')"
        :disabled="page === 1"
        class="rounded-lg border px-3 py-1 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>
      <button
        @click="$emit('next')"
        :disabled="data.length < pageSize"
        class="rounded-lg border px-3 py-1 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>
