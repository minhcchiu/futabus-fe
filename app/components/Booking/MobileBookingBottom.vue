<script setup lang="ts">
import { formatMoney } from "~/utils/helpers/data.helper";
import type { Seat } from "~/validations/admin/seat.validation";

defineProps<{
  step: number;
  seats: Seat[];
  total: number;
}>();

const emit = defineEmits(["next", "prev", "submit"]);
</script>

<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-50 border-t bg-white px-4 py-3 pb-20"
  >
    <!-- SEAT SUMMARY -->
    <div v-if="step === 0 || step === 3" class="mb-2 text-sm">
      <div class="flex justify-between">
        <span class="text-gray-500"> Vé chiều đi ({{ seats.length }}) </span>
        <span class="font-medium text-gray-800">
          {{ seats.map((seat) => seat.name).join(", ") || "--" }}
        </span>
      </div>

      <div class="mt-1 flex justify-between">
        <span class="text-gray-500">Tổng tiền</span>
        <span class="font-semibold text-green-600">
          {{ formatMoney(total) }}
        </span>
      </div>
    </div>

    <!-- BUTTONS -->
    <div class="flex gap-2">
      <button
        v-if="step > 0"
        class="flex-1 rounded-xl border py-2 text-sm font-medium"
        @click="emit('prev')"
      >
        Quay lại
      </button>

      <button
        v-if="step < 3"
        class="flex-1 rounded-xl bg-green-500 py-2 text-sm font-semibold text-white transition active:scale-95"
        @click="emit('next')"
      >
        Tiếp tục
      </button>

      <button
        v-if="step === 3"
        class="flex-1 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition active:scale-95"
        @click="emit('submit')"
      >
        Mua vé
      </button>
    </div>
  </div>
</template>
