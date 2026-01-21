<script setup lang="ts">
defineProps<{
  columns: { key: string; label: string }[];
  rows: any[];
}>();

const emit = defineEmits(["view"]);
</script>

<template>
  <div class="rounded-lg bg-white shadow-sm">
    <div class="flex items-center justify-between border-b p-4">
      <slot name="toolbar" />
    </div>

    <table class="w-full text-sm">
      <thead class="bg-gray-50 text-gray-600">
        <tr>
          <th v-for="col in columns" :key="col.key" class="p-3 text-left">
            {{ col.label }}
          </th>
          <th class="p-3 text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in rows" :key="row.id" class="border-t hover:bg-bg">
          <td v-for="col in columns" :key="col.key" class="p-3">
            <slot :name="`cell-${col.key}`" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>

          <td class="p-3 text-right">
            <button
              class="text-primary hover:underline"
              @click="emit('view', row)"
            >
              View
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
