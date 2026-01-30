<script setup lang="ts">
import type { Seat } from "~/validations/admin/seat.validation";

const props = defineProps<{
  seat: Seat;
  selectedSeats: Seat[];
}>();

const isSelected = computed(() =>
  props.selectedSeats.some(
    (s) => s.code === props.seat.code && s.floor === props.seat.floor,
  ),
);

const emit = defineEmits(["toggle"]);
const toggleSeat = () => {
  if (props.seat.isBooked) {
    return;
  }
  emit("toggle", props.seat);
};
</script>

<template>
  <button
    class="flex h-14 w-12 flex-col items-center justify-center rounded-lg border text-xs"
    :class="[
      seat.isVip && !isSelected
        ? 'border-yellow-400 bg-yellow-50'
        : 'border-gray-300',
      seat.isBooked
        ? 'cursor-not-allowed bg-gray-200'
        : 'hover:border-green-500',
      isSelected ? '!border-green-500 !bg-green-100' : '',
    ]"
    :disabled="seat.isBooked"
    @click="toggleSeat"
  >
    <span class="font-semibold">{{ seat.name }} </span>
    <span v-if="seat.isVip" class="text-[10px] text-yellow-600">VIP</span>
  </button>
</template>
