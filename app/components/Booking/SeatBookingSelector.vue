<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Seat } from "~/validations/admin/seat.validation";

const props = defineProps<{
  vehicleId: string;
  seatIdsBooked: string[];
}>();
const emit = defineEmits<{
  (e: "selectSeats", seats: Seat[]): void;
}>();
const vehicleStore = useVehicleStore();

onMounted(async () => {
  if (!props.vehicleId) return;
  await vehicleStore.fetchById(props.vehicleId, {
    _populate: "companyId",
  });
});

const seats = computed(
  () =>
    vehicleStore.selected?.seats
      .filter((s) => s.isActive)
      .map((s) => {
        Object.assign(s, { isBooked: props.seatIdsBooked?.includes(s._id) });
        return s;
      }) || [],
);

const selectedSeats = ref<Seat[]>([]);

/** Sort seat theo row rồi column để hiển thị đúng thứ tự */
function sortSeats(list: Seat[]) {
  return [...list].sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.column - b.column;
  });
}

const lowerSeats = computed(() =>
  sortSeats(seats.value.filter((s) => s.floor === 1)),
);

const upperSeats = computed(() =>
  sortSeats(seats.value.filter((s) => s.floor === 2)),
);

/** Group seat theo row */
function groupByRow(list: Seat[]) {
  const map: Record<number, Seat[]> = {};
  list.forEach((seat) => {
    if (!map[seat.row]) map[seat.row] = [];
    // @ts-ignore
    map[seat.row].push(seat);
  });

  Object.keys(map).forEach((row) => {
    // @ts-ignore
    map[+row].sort((a, b) => a.column - b.column);
  });

  return map;
}

const lowerGrid = computed(() => groupByRow(lowerSeats.value));
const upperGrid = computed(() => groupByRow(upperSeats.value));

function toggleSeat(seat: Seat) {
  const idx = selectedSeats.value.findIndex(
    (s) => s.code === seat.code && seat.floor === s.floor,
  );

  if (idx >= 0) selectedSeats.value.splice(idx, 1);
  else selectedSeats.value.push(seat);

  emit("selectSeats", selectedSeats.value);
}
</script>

<template>
  <div class="rounded-xl border bg-white p-5">
    <div class="mb-4 flex justify-between">
      <h2 class="font-semibold">Chọn ghế</h2>
      <a href="#" class="text-sm text-blue-600">Thông tin xe</a>
    </div>

    <div class="grid grid-cols-2 gap-12 gap-x-32">
      <!-- TẦNG DƯỚI -->
      <div>
        <h3 class="mb-3 text-center text-sm font-medium">Tầng dưới</h3>
        <div class="space-y-3">
          <div
            v-for="(rowSeats, row) in lowerGrid"
            :key="row"
            class="mb-3 flex justify-between gap-3"
          >
            <SeatBookingItem
              v-for="seat in rowSeats"
              :key="seat._id"
              :seat="seat"
              :selected-seats="selectedSeats"
              @toggle="toggleSeat"
            />
          </div>
        </div>
      </div>

      <!-- TẦNG TRÊN -->
      <div>
        <h3 class="mb-3 text-center text-sm font-medium">Tầng trên</h3>
        <div class="space-y-3">
          <div
            v-for="(rowSeats, row) in upperGrid"
            :key="row"
            class="mb-3 flex justify-between gap-3"
          >
            <SeatBookingItem
              v-for="seat in rowSeats"
              :key="seat._id"
              :seat="seat"
              :selected-seats="selectedSeats"
              @toggle="toggleSeat"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-6 text-xs text-gray-600">
      <BookingLegend color="bg-gray-300" label="Đã bán" />
      <BookingLegend color="bg-blue-100" label="Còn trống" />
      <BookingLegend color="bg-green-100" label="Đang chọn" />
    </div>
  </div>
</template>
