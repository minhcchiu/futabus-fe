<script setup lang="ts">
import { computed, ref } from "vue";
import { formatTime } from "~/utils/helpers/data.helper";
import type { TripStop } from "~/validations/admin/trip_stop.validation";

const props = defineProps<{
  modelValue?: string;
  options: TripStop[];
  placeholder?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const open = ref(false);
const keyword = ref("");
const selected = ref(props.modelValue);

const filtered = computed(() =>
  props.options.filter((o) =>
    o.stopId.name.toLowerCase().includes(keyword.value.toLowerCase()),
  ),
);

function select(item: TripStop) {
  selected.value = item._id;
  emit("update:modelValue", item._id);
  open.value = false;
}
</script>

<template>
  <div class="relative">
    <!-- INPUT -->
    <button
      class="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left"
      :class="open ? 'border-green-500' : ''"
      @click="open = !open"
    >
      <span class="truncate">
        {{
          options.find((o) => o._id === selected)?.stopId.name ||
          placeholder ||
          "Chọn địa điểm"
        }}
      </span>
      <span class="text-gray-400">▾</span>
    </button>

    <!-- DROPDOWN -->
    <div
      v-if="open"
      class="absolute z-20 mt-2 w-full rounded-xl border bg-white p-3 shadow-lg"
    >
      <input
        v-model="keyword"
        placeholder="Nhập tên bến xe, văn phòng"
        class="mb-3 w-full rounded-md border px-3 py-2 text-sm"
      >

      <div class="max-h-60 space-y-3 overflow-auto">
        <div
          v-for="item in filtered"
          :key="item._id"
          class="flex cursor-pointer gap-3"
          @click="select(item)"
        >
          <input
            type="radio"
            class="mt-1 accent-green-500"
            :checked="selected === item._id"
          >

          <div class="flex-1">
            <div class="flex justify-between text-sm font-medium">
              <span
                >{{ formatTime(item.departureTime || item.arrivalTime) }} -
                {{ item.stopId.name }}</span
              >
              <span class="text-xs text-green-500">Xem vị trí</span>
            </div>
            <p class="text-xs text-gray-500">
              {{ item.stopId.address }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
