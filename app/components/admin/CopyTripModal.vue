<script setup lang="ts">
import { useTripStore } from "~/stores/trip.store";

const props = defineProps<{
  trip: any;
}>();

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const store = useTripStore();
const dates = ref<number[]>([]);
const selectedDate = ref("");
const loading = ref(false);

const addDate = () => {
  if (selectedDate.value) {
    const timestamp = new Date(selectedDate.value).getTime();
    if (!dates.value.includes(timestamp)) {
      dates.value.push(timestamp);
    }
    selectedDate.value = "";
  }
};

const removeDate = (index: number) => {
  dates.value.splice(index, 1);
};

const handleCopy = async () => {
  if (!props.trip?._id || dates.value.length === 0) {
    return;
  }

  loading.value = true;
  try {
    await store.copyTripToDates({
      tripId: props.trip._id,
      dates: dates.value,
    });

    emit("success");
    emit("close");
  } finally {
    loading.value = false;
  }
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("vi-VN");
};
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="w-full max-w-md rounded-lg bg-white p-6">
      <div class="mb-4">
        <h2 class="text-xl font-semibold">Sao chép chuyến xe</h2>
        <p class="text-sm text-gray-600">
          Chuyến: {{ trip?.routeId?.startStopId?.name }} →
          {{ trip?.routeId?.endStopId?.name }}
        </p>
      </div>

      <div class="mb-4">
        <label class="mb-2 block text-sm font-medium text-gray-700">
          Chọn ngày để tạo chuyến mới
        </label>
        <div class="flex gap-2">
          <input
            v-model="selectedDate"
            type="date"
            class="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            :min="new Date().toISOString().split('T')[0]"
          />
          <button
            @click="addDate"
            :disabled="!selectedDate"
            class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Thêm
          </button>
        </div>
      </div>

      <div class="mb-6">
        <div class="mb-2 text-sm font-medium text-gray-700">
          Các ngày đã chọn:
        </div>
        <div v-if="dates.length === 0" class="text-sm text-gray-400">
          Chưa chọn ngày nào
        </div>
        <div v-else class="flex flex-wrap gap-2">
          <div
            v-for="(date, index) in dates"
            :key="index"
            class="flex items-center gap-2 rounded bg-gray-100 px-3 py-1 text-sm"
          >
            {{ formatDate(date) }}
            <button
              @click="removeDate(index)"
              class="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <button
          @click="$emit('close')"
          class="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          @click="handleCopy"
          :disabled="loading || dates.length === 0"
          class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {{
            loading ? "Đang sao chép..." : `Sao chép (${dates.length} chuyến)`
          }}
        </button>
      </div>
    </div>
  </div>
</template>
