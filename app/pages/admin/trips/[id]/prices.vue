<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSeatStore } from "~/stores/seat.store";
import { useTripStore } from "~/stores/trip.store";
import { useTripPriceStore } from "~/stores/trip_price.store";
import type { Seat } from "~/validations/admin/seat.validation";
import type { TripPrice } from "~/validations/admin/trip_price.validation";

definePageMeta({ layout: "admin" });

const route = useRoute();
const router = useRouter();

const tripStore = useTripStore();
const seatStore = useSeatStore();
const tripPriceStore = useTripPriceStore();

const tripId = route.params.id as string;

const trip = ref<any>(null);
const vehicleId = ref<string>("");

const seats = ref<Seat[]>([]);
const tripPrices = ref<TripPrice[]>([]);
const selectedSeats = ref<Seat[]>([]);
const priceInput = ref<number | null>(null);

/* =========================
 LOAD TRIP + VEHICLE
========================= */
const loadTrip = async () => {
  const data = await tripStore.fetchById(tripId, {
    _populate: "vehicleId",
  });
  if (!data) return;
  trip.value = data;
  vehicleId.value = data.vehicleId._id;
};

/* =========================
 LOAD TRIP PRICE
========================= */
const loadTripPrices = async () => {
  const data = await tripPriceStore.fetchAll({
    tripId,
  });
  if (!data) return;
  tripPrices.value = data;
};

const formattedPrice = computed(() => {
  if (!priceInput.value) return "";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(priceInput.value);
});

/* =========================
 LOAD SEATS BY VEHICLE
========================= */
const loadSeatsByVehicle = async () => {
  if (!vehicleId.value) return;
  const data = await seatStore.fetchAll({ vehicleId: vehicleId.value });
  seats.value = data || [];
};

onMounted(async () => {
  await loadTrip();
  await loadSeatsByVehicle();
  await loadTripPrices();
});

/* =========================
 SEAT MATRIX FIXED GRID
========================= */
const seatMatrix = computed(() => {
  if (!seats.value.length) return {};

  const floors = Math.max(...seats.value.map((s) => s.floor));
  const rows = Math.max(...seats.value.map((s) => s.row));
  const cols = Math.max(...seats.value.map((s) => s.column));

  const result: Record<number, (Seat | null)[][]> = {};

  for (let f = 1; f <= floors; f++) {
    const matrix: (Seat | null)[][] = [];

    for (let r = 1; r <= rows; r++) {
      const rowSeats: (Seat | null)[] = [];

      for (let c = 1; c <= cols; c++) {
        const seat = seats.value.find(
          (s) => s.floor === f && s.row === r && s.column === c,
        );
        rowSeats.push(seat || null);
      }

      matrix.push(rowSeats);
    }

    result[f] = matrix;
  }

  return result;
});

/* =========================
 SELECT SEAT
========================= */
const toggleSelectSeat = (seat: Seat) => {
  const idx = selectedSeats.value.findIndex((s) => s._id === seat._id);
  if (idx >= 0) selectedSeats.value.splice(idx, 1);
  else selectedSeats.value.push(seat);
};

const isSelected = (seat: Seat) =>
  selectedSeats.value.some((s) => s._id === seat._id);

/* =========================
 SAVE PRICE
========================= */
const savePrice = async () => {
  if (!priceInput.value || !selectedSeats.value.length) {
    alert("Chọn ghế và nhập giá!");
    return;
  }

  const payload = selectedSeats.value.map((seat) => ({
    tripId,
    seatId: seat._id,
    price: priceInput.value || 0,
  }));

  await tripPriceStore.updateMany(payload);
  selectedSeats.value = [];
  priceInput.value = null;
};

const getSeatPrice = (seatId: string) => {
  const price = trip.value.tripPrices?.find(
    (tp: any) => tp.seatId === seatId,
  )?.price;

  return new Intl.NumberFormat("vi-VN").format(price || 0);
};
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-6">
    <div class="flex justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Seat Price Configuration</h1>
        <!-- DEBUG -->
        <div class="text-sm text-gray-500">
          Seats loaded: {{ seats.length }}
        </div>
      </div>

      <!-- back -->
      <div class="flex justify-end">
        <button @click="navigateTo('/admin/trips')">← Quay lại</button>
      </div>
    </div>
    <!-- PRICE FORM -->
    <div class="rounded-lg border bg-white p-4 shadow-sm">
      <div class="flex items-end gap-4">
        <div class="flex-1">
          <label class="label">Price for selected seats</label>
          <input
            v-model.number="priceInput"
            type="number"
            min="0"
            class="input"
            placeholder="VD: 150000"
          />

          <!-- HIỂN THỊ TIỀN VIỆT -->
          <div
            v-if="priceInput"
            class="mt-1 text-sm font-semibold text-green-600"
          >
            {{ formattedPrice }}
          </div>
        </div>
        <button class="btn-primary" @click="savePrice">Apply Price</button>
      </div>

      <div class="mt-2 text-sm text-gray-500">
        Selected seats:
        <span
          v-for="seat in selectedSeats"
          :key="seat._id"
          class="font-semibold"
        >
          {{ seat.name }},
        </span>
      </div>
    </div>

    <!-- SEAT LAYOUT -->
    <div v-if="seats.length" class="space-y-6">
      <div
        v-for="(matrix, floor) in seatMatrix"
        :key="floor"
        class="rounded-lg border bg-white p-4 shadow-sm"
      >
        <h3 class="mb-4 font-semibold">Floor {{ floor }}</h3>

        <div class="space-y-2">
          <div
            v-for="(rowSeats, rIdx) in matrix"
            :key="rIdx"
            class="grid gap-3"
            :style="{
              gridTemplateColumns: `repeat(${matrix[0]!.length}, minmax(0,1fr))`,
            }"
          >
            <div
              v-for="seat in rowSeats"
              :key="seat?._id || `${floor}-${rIdx}-${Math.random()}`"
              class="seat"
              :class="{
                selected: seat && isSelected(seat),
                vip: seat?.isVip,
                disabled: !seat || !seat.isActive,
              }"
              @click="seat && toggleSelectSeat(seat)"
            >
              <!-- TOP -->
              <div class="mb-1 flex items-center justify-between text-xs">
                <span class="font-semibold">{{
                  seat?.name || seat?.code
                }}</span>
                <span v-if="seat?.isVip" class="vip-btn">★</span>
              </div>

              <!-- PRICE -->
              <div class="text-sm font-bold text-blue-600">
                {{ getSeatPrice(seat?._id || "") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ACTION -->
    <div class="flex justify-end">
      <button class="btn-secondary" @click="router.back()">Back</button>
    </div>
  </div>
</template>

<style scoped>
.label {
  @apply text-sm text-gray-600;
}

.input {
  @apply w-full rounded-lg border px-3 py-2 text-sm;
}

.seat {
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 8px;
  text-align: center;
  font-weight: 500;
  background: white;
  cursor: pointer;
}

.seat.selected {
  background: #dbeafe;
  border-color: #2563eb;
  color: #1e40af;
}

.seat.vip {
  background: #fef9c3;
  border-color: #facc15;
}

.seat.disabled {
  background: #f3f4f6;
  color: #9ca3af;
  pointer-events: none;
}

.btn-primary {
  @apply rounded-lg bg-green-500 px-4 py-2 text-white;
}

.btn-secondary {
  @apply rounded-lg border bg-gray-200 px-4 py-2;
}

.vip-btn {
  @apply absolute bottom-1 right-1 text-xs text-yellow-600 hover:scale-110;
}
</style>
