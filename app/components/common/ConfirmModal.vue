<script setup lang="ts">
defineProps<{
  show: boolean;
  title?: string;
  message?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "confirm" | "cancel"): void;
}>();
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  >
    <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
      <h3 class="mb-2 text-lg font-semibold">
        {{ title || "Confirm" }}
      </h3>
      <p class="mb-6 text-sm text-gray-500">
        {{ message || "Are you sure?" }}
      </p>

      <div class="flex justify-end gap-3">
        <button
          class="rounded-lg border px-4 py-2 text-sm"
          :disabled="loading"
          @click="emit('cancel')"
        >
          Cancel
        </button>

        <button
          class="rounded-lg bg-red-500 px-4 py-2 text-sm text-white disabled:opacity-50"
          :disabled="loading"
          @click="emit('confirm')"
        >
          {{ loading ? "Deleting..." : "Delete" }}
        </button>
      </div>
    </div>
  </div>
</template>
