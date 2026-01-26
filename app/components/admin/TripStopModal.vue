<script setup lang="ts">
const props = defineProps<{ trip: any }>();

const tripStopStore = useTripStopStore();
const activeTab = ref<"list" | "form">("list");
const editingStop = ref<any>(null);

defineEmits(["close"]);

onMounted(async () => {
  await tripStopStore.fetchAll({
    _populate: "routeId,routeId.startStopId endStopId",
    tripId: props.trip._id,
  });
});

const addStop = () => {
  editingStop.value = null;
  activeTab.value = "form";
};

const editStop = (stop: any) => {
  editingStop.value = stop;
  activeTab.value = "form";
};

const backToList = async () => {
  activeTab.value = "list";
  editingStop.value = null;
  await tripStopStore.fetchAll({
    _populate: "routeId,routeId.startStopId endStopId",
    tripId: props.trip._id,
  });
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

        <table class="w-full border text-sm">
          <tr v-for="ts in tripStopStore.list" :key="ts._id">
            <td class="px-4 py-3 text-primary">
              {{ ts.routeId?.startStopId?.name }} →
              {{ ts.routeId?.endStopId?.name }}
            </td>
            <td class="p-2">{{ ts.arrivalTime }}</td>
            <td class="p-2">{{ ts.departureTime }}</td>
            <td class="p-2">
              <button @click="editStop(ts)">Edit</button>
            </td>
          </tr>
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
