<script setup lang="ts">
import { toCamelCase, toVnd } from "~/utils/helpers/data.helper";
import type { Trip } from "~/validations/admin/trip.validation";

defineProps<{
  trip: Trip;
}>();
</script>

<template>
  <div
    class="text-gray hidden min-w-[200px] flex-wrap justify-end gap-x-2 md:flex"
  >
    <ul class="flex justify-end gap-x-2">
      <li class="flex items-center gap-x-1 text-sm text-[#454647]">
        <div class="h-[6px] w-[6px] rounded-full bg-[#C8CCD3]" />
        {{ toCamelCase(trip.vehicleId.level) }}
      </li>
      <li class="flex items-center gap-x-1 text-sm text-[#00613D]">
        <div class="h-[6px] w-[6px] rounded-full bg-[#C8CCD3]" />
        {{ trip.emptySeat || 10 }} chỗ trống
      </li>
    </ul>

    <p class="mt-5 text-lg font-bold text-green-600">
      {{ toVnd(trip.price || trip.tripPrices?.[0]?.price || 500000) }}
    </p>
  </div>
</template>
