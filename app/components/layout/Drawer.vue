<script setup lang="ts">
defineProps<{ open: boolean }>();
const emit = defineEmits(["close"]);
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex">
      <div class="flex-1 bg-black/40" @click="emit('close')" />

      <div
        class="relative w-full max-w-md bg-white p-6 shadow-lg transition-transform"
      >
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            <slot name="title" />
          </h2>
          <button @click="emit('close')">✕</button>
        </div>

        <slot />
      </div>
    </div>
  </Teleport>
</template>
