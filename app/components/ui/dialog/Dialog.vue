<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="emit('close')" />

      <div class="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            <slot name="title" />
          </h2>
          <button @click="emit('close')">✕</button>
        </div>

        <div class="mb-6">
          <slot />
        </div>

        <div class="flex justify-end gap-2">
          <button
            class="rounded-lg border px-4 py-2 text-sm"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            class="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary-600"
            @click="emit('confirm')"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>()
const emit = defineEmits(['close', 'confirm'])
</script>