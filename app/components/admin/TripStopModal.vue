<script setup lang="ts">
import { formatTime } from "~/utils/helpers/data.helper";
import type { TripStop } from "~/validations/admin/trip_stop.validation";

const props = defineProps<{ trip: any }>();

const tripStopStore = useTripStopStore();
const activeTab = ref<"list" | "form">("list");
const editingStop = ref<any>(null);

defineEmits(["close"]);

onMounted(async () => {
  await tripStopStore.fetchAll({
    _populate: "stopId",
    tripId: props.trip._id,
  });
});

const addStop = () => {
  editingStop.value = null;
  activeTab.value = "form";
};

const editStop = (stop: TripStop) => {
  editingStop.value = stop;
  activeTab.value = "form";
};

const deleteStop = async (stop: TripStop) => {
  // show alert
  if (!confirm("Are you sure you want to delete this stop?")) return;
  await tripStopStore.deleteManyByIds([stop._id]);
  await tripStopStore.fetchAll({
    _populate: "stopId",
    tripId: props.trip._id,
  });
};

const backToList = async () => {
  activeTab.value = "list";
  editingStop.value = null;
  await tripStopStore.fetchAll({
    _populate: "stopId",
    tripId: props.trip._id,
  });
};

const getStopType = (ts: TripStop) => {
  if (ts.arrivalTime) return "DROP_OFF";
  if (ts.departureTime) return "PICK_UP";
  return "UNKNOWN";
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div class="max-h-[80vh] w-[700px] overflow-auto rounded-xl bg-white p-6">
      <div class="mb-4 flex justify-between">
        <h2 class="text-xl font-semibold">
          Trip Stops - {{ props.trip.route?.startStopId?.name }} →
          {{ props.trip.route?.endStopId?.name }}
        </h2>
        <button @click="$emit('close')">✖</button>
      </div>

      <!-- TABS -->
      <div class="mb-4 flex gap-4 border-b">
        <button
          :class="activeTab === 'list' && 'border-b-2 font-bold'"
          @click="activeTab = 'list'"
        >
          Stop List
        </button>
        <button
          :class="activeTab === 'form' && 'border-b-2 font-bold'"
          :disabled="!editingStop"
        >
          {{ editingStop ? "Edit Stop" : "Add Stop" }}
        </button>
      </div>

      <!-- LIST -->
      <div v-if="activeTab === 'list'">
        <button class="btn-primary mb-3" @click="addStop">+ Add Stop</button>

        <table class="w-full overflow-hidden rounded-lg border text-sm">
          <thead class="bg-muted/40">
            <tr>
              <th class="px-4 py-3 text-left">Điểm dừng</th>
              <th class="px-4 py-3 text-center">Loại</th>
              <th class="px-4 py-3 text-center">Thời gian</th>
              <th class="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="ts in tripStopStore.list"
              :key="ts._id"
              class="hover:bg-muted/30 border-t transition"
            >
              <!-- Stop name -->
              <td class="px-4 py-3 font-medium text-primary">
                {{ ts.stopId?.name }}
              </td>

              <!-- Type badge -->
              <td class="px-4 py-3 text-center">
                <span
                  v-if="getStopType(ts) === 'PICK_UP'"
                  class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                >
                  🚏 Điểm đón
                </span>

                <span
                  v-else-if="getStopType(ts) === 'DROP_OFF'"
                  class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                >
                  🏁 Điểm trả
                </span>

                <span
                  v-else
                  class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500"
                >
                  Không xác định
                </span>
              </td>

              <!-- Time -->
              <td class="px-4 py-3 text-center font-mono">
                <span v-if="ts.departureTime">
                  {{ formatTime(ts.departureTime) }}
                </span>
                <span v-else-if="ts.arrivalTime">
                  {{ formatTime(ts.arrivalTime) }}
                </span>
                <span v-else>-</span>
              </td>

              <!-- Actions -->
              <td class="flex items-center justify-end gap-2 px-4 py-3">
                <button
                  @click="editStop(ts)"
                  class="hover:bg-muted inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-primary transition"
                >
                  ✏️
                </button>
                <button
                  @click="deleteStop(ts)"
                  class="hover:bg-muted inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-red-500 transition"
                >
                  ✖
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- FORM -->
      <TripStopForm
        v-if="activeTab === 'form'"
        :trip-id="props.trip._id"
        :model="editingStop"
        @success="backToList"
        @cancel="activeTab = 'list'"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
