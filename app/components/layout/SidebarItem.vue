<script setup lang="ts">
defineProps<{
  label: string;
  active?: boolean;
  badge?: string;
  href: string;
}>();
</script>

<template>
  <NuxtLink
    :class="[
      'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2',
      active
        ? 'bg-primarySoft font-semibold text-primary'
        : 'hover:bg-gray-100',
    ]"
    :href="href"
  >
    <span>{{ label }}</span>
    <span v-if="badge" class="rounded-full bg-primary px-2 text-xs text-white">
      {{ badge }}
    </span>
  </NuxtLink>
</template>
