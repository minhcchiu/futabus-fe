<script setup lang="ts">
import { formatMoney } from "~/utils/helpers/data.helper";
import type { Trip } from "~/validations/admin/trip.validation";

const props = defineProps<{
  trip: Trip;
}>();

const minPrice = computed(() =>
  Math.min(...props.trip.tripPrices.map((p) => p.price).filter((p) => p > 0)),
);
</script>

<template>
  <div class="text-gray mt-2 flex justify-between border-t py-1 md:hidden">
    <ul class="flex justify-end gap-x-2">
      <li class="flex items-center gap-x-1 text-xs text-[#454647]">
        <div class="h-[6px] w-[6px] rounded-full bg-[#C8CCD3]" />
        {{ trip.vehicleId.level }}
      </li>
      <li class="flex items-center gap-x-1 text-xs text-[#00613D]">
        <div class="h-[6px] w-[6px] rounded-full bg-[#C8CCD3]" />
        {{ trip.emptySeat }} chỗ trống
      </li>
    </ul>

    <span class="font-semibold text-green-600">
      {{ minPrice ? formatMoney(minPrice) : "Liên hệ" }}
    </span>
  </div>
</template>
