<script setup lang="ts">
import type { Trip } from "~/validations/admin/trip.validation";

defineProps<{
  trips: Trip[];
  pickupProvince?: string;
  dropoffProvince?: string;
  dateLabel: string;
}>();

// const emit = defineEmits<{
//   (e: "select", trip: Trip): void;
// }>();
</script>

<template>
  <div class="space-y-4">
    <TripListHeader
      :total="trips.length"
      :from="pickupProvince"
      :to="dropoffProvince"
      :dateLabel="dateLabel"
    />

    <!-- eslint-disable @typescript-eslint/no-unused-vars -->
    <template v-if="trips.length > 0">
      <TripCard v-for="trip in trips" :key="trip._id" :trip="trip" />
    </template>

    <div
      v-else
      class="flex flex-col items-center justify-center rounded-xl border bg-white py-12 text-center"
    >
      <img
        src="/images/empty_list.svg"
        alt="Không có chuyến xe"
        class="mb-4 h-28 opacity-80"
      />

      <p class="text-base font-medium">Không có chuyến xe cho ngày đã chọn</p>

      <p class="text-muted-foreground mt-1 text-sm">
        Vui lòng chọn ngày hoặc tuyến khác
      </p>
    </div>
  </div>
</template>
