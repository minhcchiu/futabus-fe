<script setup lang="ts">
import { format } from "date-fns";
import type { Trip } from "~/validations/admin/trip.validation";

defineProps<{
  trip: Trip;
}>();

const getHours = (time: number) => format(time, "hh:mm");

 function calcDurationSimple(
  departTime: number,
  arrivalTime: number,
): string {
  const minutes = Math.max(
    0,
    Math.floor((arrivalTime - departTime) / 60000),
  );

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h && m) return `${h} giờ ${m} phút`;
  if (h) return `${h} giờ`;
  return `${m} phút`;
}

</script>

<template>
  <div class="flex w-full flex-col">
    <div class="flex items-center justify-between gap-4">
      <span class="text-lg font-medium md:text-2xl">{{
        getHours(trip.departureTime)
      }}</span>
      <div class="flex w-full items-center">
        <img
          src="https://futabus.vn/images/icons/pickup.svg"
          alt="pickup"
        /><span class="flex-1 border-b-2 border-dotted" /><span
          class="text-gray text-center leading-4"
          >{{
            calcDurationSimple(
              trip.departureTime,
              trip.arrivalTime || Date.now(),
            )
          }}
          <br /><span class="text-[13px]">(Asian/Ho Chi Minh)</span></span
        ><span class="flex-1 border-b-2 border-dotted" /><img
          src="https://futabus.vn/images/icons/station.svg"
          alt="station"
        />
      </div>
      <span class="text-lg font-medium md:text-2xl">{{
        getHours(trip.arrivalTime || Date.now())
      }}</span>
    </div>
    <div class="mt-3 flex justify-between text-[13px] font-normal">
      <div class="flex-1">
        <span class="text-sm font-medium md:text-[15px]">{{
          trip.routeId.startStopId.name
        }}</span
        ><br /><span class="text-gray mt-2" />
      </div>
      <div class="flex-1 text-right">
        <span class="text-sm font-medium md:text-[15px]">{{
          trip.routeId.endStopId.name
        }}</span
        ><br /><span class="text-gray mt-2" />
      </div>
    </div>
  </div>
</template>
