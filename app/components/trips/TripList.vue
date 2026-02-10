<script setup lang="ts">
import type { Trip } from "~/validations/admin/trip.validation";

defineProps<{
  trips: Trip[];
  pickupProvince?: string;
  dropoffProvince?: string;
  dateLabel: string;
  isLoading?: boolean;
}>();
</script>

<template>
  <div class="space-y-4">
    <!-- ================= HEADER ================= -->
    <TripListHeader
      :total="isLoading ? 0 : trips.length"
      :from="pickupProvince"
      :to="dropoffProvince"
      :date-label="dateLabel"
    />

    <!-- ================= LOADING ================= -->
    <template v-if="isLoading">
      <div class="space-y-4">
        <div
          v-for="i in 4"
          :key="i"
          class="animate-pulse rounded-xl border bg-white p-5 shadow-sm"
        >
          <div class="mb-4 flex items-center justify-between">
            <div class="h-5 w-32 rounded bg-gray-200" />
            <div class="h-5 w-20 rounded bg-gray-200" />
          </div>

          <div class="mb-3 h-4 w-1/2 rounded bg-gray-200" />
          <div class="mb-3 h-4 w-1/3 rounded bg-gray-200" />

          <div class="mt-4 flex justify-end">
            <div class="h-9 w-28 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    </template>

    <!-- ================= DATA ================= -->
    <template v-else-if="trips.length > 0">
      <TransitionGroup name="fade" tag="div" class="space-y-4">
        <TripCard v-for="trip in trips" :key="trip._id" :trip="trip" />
      </TransitionGroup>
    </template>

    <!-- ================= EMPTY ================= -->
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
