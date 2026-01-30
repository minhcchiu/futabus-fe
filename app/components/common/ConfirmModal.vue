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
      <h3 class="mb-2 text-center text-lg font-semibold">
        {{ title || "Xác nhận xóa" }}
      </h3>
      <p class="mb-6 text-center text-sm text-gray-500">
        {{ message || "Bạn có chắc chắn muốn xóa?" }}
      </p>

      <div class="flex justify-center gap-3">
        <button
          class="rounded-lg border px-4 py-2 text-sm"
          :disabled="loading"
          @click="emit('cancel')"
        >
          Hủy
        </button>

        <button
          class="rounded-lg bg-red-500 px-4 py-2 text-sm text-white disabled:opacity-50"
          :disabled="loading"
          @click="emit('confirm')"
        >
          {{ loading ? "Đang xóa..." : "Xóa" }}
        </button>
      </div>
    </div>
  </div>
</template>
