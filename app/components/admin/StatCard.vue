<script setup lang="ts">
defineProps<{ title: string; value: string | number }>();
</script>
<template>
  <div class="rounded-lg bg-white p-4 shadow-sm">
    <div class="text-sm text-gray-500">{{ title }}</div>
    <div class="mt-1 text-2xl font-semibold text-primary">
      {{ value }}
    </div>
  </div>
</template>
