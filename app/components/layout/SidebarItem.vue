<script setup lang="ts">
const props = defineProps<{
  label: string;
  badge?: string;
  href: string;
}>();

const route = useRoute();

const isActive = computed(() => {
  return route.path === props.href;
});
</script>

<template>
  <NuxtLink
    :to="href"
    :class="[
      'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition',
      isActive
        ? 'bg-primarySoft font-semibold text-primary'
        : 'text-gray-700 hover:bg-gray-100',
    ]"
  >
    <span>{{ label }}</span>
    <span v-if="badge" class="rounded-full bg-primary px-2 text-xs text-white">
      {{ badge }}
    </span>
  </NuxtLink>
</template>
