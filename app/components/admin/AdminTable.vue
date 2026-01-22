<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  columns: string[];
  data: any[];
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  pageSizeOptions?: number[];
}>();

const emit = defineEmits(["prev", "next", "go", "update:pageSize"]);

const startItem = computed(() => {
  if (!props.page || !props.pageSize) return 0;
  return (props.page - 1) * props.pageSize + 1;
});

const endItem = computed(() => {
  if (!props.page || !props.pageSize || !props.total) return 0;
  return Math.min(props.page * props.pageSize, props.total);
});

const visiblePages = computed(() => {
  if (!props.page || !props.totalPages) return [];
  const delta = 2;
  const range = [];
  for (
    let i = Math.max(1, props.page - delta);
    i <= Math.min(props.totalPages, props.page + delta);
    i++
  ) {
    range.push(i);
  }
  return range;
});
</script>

<template>
  <div class="overflow-hidden border bg-white shadow-sm">
    <table class="w-full text-sm">
      <!-- HEADER -->
      <thead class="border-b bg-gray-50 text-left text-gray-600">
        <tr>
          <th
            v-for="(col, index) in columns"
            :key="col"
            :class="[
              'px-4 py-3 font-medium',
              index === columns.length - 1 && 'text-right',
            ]"
          >
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
  <!-- ENTERPRISE FOOTER -->
  <div
    v-if="page && pageSize && total && totalPages"
    class="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500"
  >
    <!-- LEFT INFO -->
    <span>
      Showing
      <strong>{{ startItem }}</strong>
      –
      <strong>{{ endItem }}</strong>
      of
      <strong>{{ total }}</strong>
      items
    </span>

    <!-- RIGHT CONTROLS -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- PAGE SIZE -->
      <div class="flex items-center gap-1">
        <span>Show</span>
        <select
          :value="pageSize"
          class="rounded border px-2 py-1 text-sm"
          @change="
            emit('update:pageSize', +($event.target as HTMLSelectElement).value)
          "
        >
          <option
            v-for="opt in pageSizeOptions || [5, 10, 20, 50]"
            :key="opt"
            :value="opt"
          >
            {{ opt }}
          </option>
        </select>
        <span>/ page</span>
      </div>

      <!-- PAGINATION -->
      <div class="flex items-center gap-1">
        <!-- PREV -->
        <button
          :disabled="page === 1"
          class="rounded border px-2 py-1 disabled:opacity-50"
          @click="emit('prev')"
        >
          ‹
        </button>

        <!-- FIRST -->
        <button
          v-if="page > 3"
          class="rounded border px-2 py-1"
          @click="emit('go', 1)"
        >
          1
        </button>
        <span v-if="page > 4">...</span>

        <!-- PAGES -->
        <button
          v-for="p in visiblePages"
          :key="p"
          @click="emit('go', p)"
          :class="[
            'rounded border px-3 py-1',
            p === page ? 'bg-primary text-white' : 'hover:bg-gray-50',
          ]"
        >
          {{ p }}
        </button>

        <!-- LAST -->
        <span v-if="page < totalPages - 3">...</span>
        <button
          v-if="page < totalPages - 2"
          class="rounded border px-2 py-1"
          @click="emit('go', totalPages)"
        >
          {{ totalPages }}
        </button>

        <!-- NEXT -->
        <button
          :disabled="page === totalPages"
          class="rounded border px-2 py-1 disabled:opacity-50"
          @click="emit('next')"
        >
          ›
        </button>
      </div>

      <!-- JUMP PAGE -->
      <div class="flex items-center gap-1">
        <span>Go to</span>
        <input
          type="number"
          min="1"
          :max="totalPages"
          class="w-16 rounded border px-2 py-1 text-sm"
          @keydown.enter="
            emit('go', +($event.target as HTMLInputElement).value)
          "
        />
      </div>
    </div>
  </div>
</template>
