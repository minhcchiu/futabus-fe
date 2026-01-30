<script setup lang="ts">
import { format } from "date-fns";
import type { Trip } from "~/validations/admin/trip.validation";

defineProps<{
  trip: Trip;
}>();

const getHours = (time: number) => format(time, "hh:mm");

function calcDurationSimple(departTime: number, arrivalTime: number) {
  const diffMs = arrivalTime - departTime;
  if (diffMs <= 0) return "0 phút";

  const totalMinutes = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours} giờ`;
  } else {
    return `${minutes} phút`;
  }
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
              trip.arriveTime || Date.now(),
              trip.departureTime,
            )
          }}
          <br /><span class="text-[13px]">(Asian/Ho Chi Minh)</span></span
        ><span class="flex-1 border-b-2 border-dotted" /><img
          src="https://futabus.vn/images/icons/station.svg"
          alt="station"
        />
      </div>
      <span class="text-lg font-medium md:text-2xl">{{
        getHours(trip.arriveTime || Date.now())
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
