<script setup lang="ts">
import type { Trip } from "~/validations/admin/trip.validation";

defineProps<{
  trips: Trip[];
  pickupProvince?: string;
  dropoffProvince?: string;
  dateLabel: string;
}>();

const emit = defineEmits(["openFilter", "select", "back"]);
</script>

<template>
  <!-- HEADER -->
  <div class="sticky top-0 z-40 bg-green-500 px-4 py-3 text-white">
    <div class="flex items-center gap-3">
      <!-- Back -->
      <button
        class="text-xl leading-none"
        @click="emit('back')"
        aria-label="Back"
      >
        ←
      </button>

      <!-- Title -->
      <div class="flex-1 text-center">
        <p class="truncate text-sm font-semibold">
          <template v-if="pickupProvince && dropoffProvince">
            {{ pickupProvince }} → {{ dropoffProvince }}
          </template>
          <template v-else> Các chuyến xe </template>
        </p>

        <p class="text-xs opacity-80">
          {{ dateLabel }}
        </p>
      </div>

      <!-- Filter -->
      <button
        class="hidden rounded-full p-1 active:bg-white/20"
        @click="emit('openFilter')"
        aria-label="Filter"
      >
        <img
          src="https://futabus.vn/images/icons/edit_filter.svg"
          alt="filter"
          class="h-5 w-5"
        />
      </button>
    </div>
  </div>
  <!-- QUICK FILTER -->
  <div class="hidden justify-evenly gap-2 overflow-x-auto px-4 py-2">
    <FilterPill icon="🔥" label="Giá rẻ bất ngờ" />
    <FilterPill icon="⏰" label="Giờ khởi hành" />
    <FilterPill icon="💺" label="Ghế trống" />
  </div>
  <!-- TRIP LIST -->
  <div class="space-y-2">
    <!-- eslint-disable @typescript-eslint/no-unused-vars -->
    <TripCard v-for="trip in trips" :key="trip._id" :trip="trip" />
  </div>
</template>
