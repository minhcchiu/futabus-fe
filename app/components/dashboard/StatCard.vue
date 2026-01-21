<script setup lang="ts">
defineProps<{
  title: string;
  value: string;
  change: string;
  negative?: boolean;
}>();
</script>

<template>
  <div class="rounded-xl border bg-white p-4 shadow-sm">
    <p class="text-sm text-gray-500">{{ title }}</p>
    <h2 class="my-1 text-2xl font-bold">{{ value }}</h2>
    <p :class="['text-sm', negative ? 'text-red-500' : 'text-primary']">
      {{ change }} vs last week
    </p>
  </div>
</template>
