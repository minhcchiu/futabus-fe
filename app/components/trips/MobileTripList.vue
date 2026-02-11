<script setup lang="ts">
import type { Trip } from "~/validations/admin/trip.validation";

defineProps<{
  trips: Trip[];
  pickupProvince?: string;
  dropoffProvince?: string;
  dateLabel: string;
  isLoading?: boolean;
}>();

const emit = defineEmits(["openFilter", "select", "back"]);
</script>

<template>
  <!-- ================= HEADER ================= -->
  <div class="sticky top-0 z-40 bg-green-500 px-4 py-3 text-white">
    <div class="flex items-center gap-3">
      <!-- Back -->
      <button
        class="text-xl leading-none"
        aria-label="Back"
        @click="emit('back')"
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
        aria-label="Filter"
        @click="emit('openFilter')"
      >
        <img
          src="https://futabus.vn/images/icons/edit_filter.svg"
          alt="filter"
          class="h-5 w-5"
        >
      </button>
    </div>
  </div>

  <!-- ================= QUICK FILTER ================= -->
  <div class="hidden justify-evenly gap-2 overflow-x-auto px-4 py-2">
    <FilterPill icon="🔥" label="Giá rẻ bất ngờ" />
    <FilterPill icon="⏰" label="Giờ khởi hành" />
    <FilterPill icon="💺" label="Ghế trống" />
  </div>

  <!-- ================= TRIP LIST ================= -->
  <div class="space-y-2 px-4 py-3">
    <!-- ===== LOADING ===== -->
    <template v-if="isLoading">
      <div
        v-for="i in 5"
        :key="i"
        class="animate-pulse rounded-xl border bg-white p-4 shadow-sm"
      >
        <div class="mb-3 flex items-center justify-between">
          <div class="h-5 w-24 rounded bg-gray-200" />
          <div class="h-5 w-16 rounded bg-gray-200" />
        </div>

        <div class="mb-2 h-4 w-1/2 rounded bg-gray-200" />
        <div class="h-4 w-1/3 rounded bg-gray-200" />

        <div class="mt-4 flex justify-end">
          <div class="h-8 w-24 rounded-lg bg-gray-200" />
        </div>
      </div>
    </template>

    <!-- ===== DATA ===== -->
    <template v-else-if="trips.length > 0">
      <TransitionGroup name="fade" tag="div" class="space-y-2">
        <TripCard
          v-for="trip in trips"
          :key="trip._id"
          :trip="trip"
          @click="emit('select', trip)"
        />
      </TransitionGroup>
    </template>

    <!-- ===== EMPTY ===== -->
    <div
      v-else
      class="flex flex-col items-center justify-center rounded-xl border bg-white py-12 text-center"
    >
      <img
        src="/images/empty_list.svg"
        alt="Không có chuyến xe"
        class="mb-4 h-24 opacity-80"
      >

      <p class="text-sm font-medium">Không có chuyến xe cho ngày đã chọn</p>

      <p class="text-muted-foreground mt-1 text-xs">
        Vui lòng thử lại với ngày hoặc tuyến khác
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
