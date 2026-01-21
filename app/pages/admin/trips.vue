<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Trips</h1>
      <button
        class="rounded-lg bg-primary px-4 py-2 text-white"
        @click="openCreate = true"
      >
        + Create Trip
      </button>
    </div>

    <DataTable :columns="columns" :rows="trips" @view="onView">
      <template #cell-status="{ row }">
        <Badge :variant="row.status === 'Open' ? 'success' : 'warning'">
          {{ row.status }}
        </Badge>
      </template>
    </DataTable>

    <Dialog
      :open="openCreate"
      @close="openCreate = false"
      @confirm="createTrip"
    >
      <template #title>Create Trip</template>

      <div class="space-y-3">
        <input class="w-full rounded border p-2" placeholder="Trip code" />
        <input class="w-full rounded border p-2" placeholder="Route" />
        <input type="time" class="w-full rounded border p-2" />
      </div>
    </Dialog>

    <Drawer :open="openDrawer" @close="openDrawer = false">
      <template #title>Trip Detail</template>

      <div class="space-y-2 text-sm">
        <div><b>Route:</b> {{ selected?.route }}</div>
        <div><b>Vehicle:</b> {{ selected?.vehicle }}</div>
        <div><b>Status:</b> {{ selected?.status }}</div>
      </div>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
const openCreate = ref(false);
const openDrawer = ref(false);
const selected = ref<any>(null);

const columns = [
  { key: "code", label: "Code" },
  { key: "route", label: "Route" },
  { key: "vehicle", label: "Vehicle" },
  { key: "time", label: "Time" },
  { key: "status", label: "Status" },
];

const trips = ref([
  {
    id: 1,
    code: "TRIP001",
    route: "Hà Nội → Đà Nẵng",
    vehicle: "51A-12345",
    time: "08:00",
    status: "Open",
  },
]);

function onView(row: any) {
  selected.value = row;
  openDrawer.value = true;
}

function createTrip() {
  openCreate.value = false;
}
</script>
