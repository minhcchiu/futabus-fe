<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useSeatStore } from "~/stores/seat.store";

definePageMeta({ layout: "admin" });

const route = useRoute();
const router = useRouter();
const seatStore = useSeatStore();

const vehicleId = route.params.id as string;

/* =========================
  TYPES
========================= */
type SeatUI = {
  _id?: string;
  vehicleId?: string;
  code: string; // kỹ thuật - không đổi
  name: string; // hiển thị - có thể sửa
  floor: number;
  row: number;
  column: number;
  isActive: boolean;
  isVip: boolean;
};

/* =========================
  FORM
========================= */
const form = ref({
  floors: 1,
  rows: 10,
  columns: 4,
});

const seats = ref<SeatUI[]>([]);

onMounted(async () => {
  const data = await seatStore.fetchAll({ vehicleId, _sort: "code" });
  if (!data?.length) return;

  seats.value = data.map((s) => ({
    ...s,
    _id: s._id || "",
    vehicleId: s.vehicleId || "",
    name: s.name || "",
    floor: s.floor || 1,
    row: s.row || 1,
    column: s.column || 1,
    isActive: s.isActive || false,
    isVip: s.isVip || false,
  }));
});

/* =========================
  LOAD EXIST SEATS
========================= */
const loadSeatsByVehicle = async () => {
  const data = await seatStore.fetchAll({ vehicleId, _sort: "code" });
  if (!data?.length) return;

  form.value = {
    floors: Math.max(...seats.value.map((s) => s.floor)),
    rows: Math.max(...seats.value.map((s) => s.row)),
    columns: Math.max(...seats.value.map((s) => s.column)),
  };
};

onMounted(loadSeatsByVehicle);

/* =========================
  GENERATE SEATS (CODE FIXED)
========================= */

const numberToLetters = (num: number) => {
  let str = "";
  while (num > 0) {
    num--;
    str = String.fromCharCode(65 + (num % 26)) + str;
    num = Math.floor(num / 26);
  }
  return str;
};

const generateSeats = () => {
  seats.value = [];

  for (let r = 1; r <= form.value.rows; r++) {
    for (let c = 1; c <= form.value.columns; c++) {
      const columnLetter = numberToLetters(c); // A, B, C...

      for (let f = 1; f <= form.value.floors; f++) {
        const seatNumber = (r - 1) * form.value.floors + f;
        const code = `F${f}-R${r}-C${c}`;

        seats.value.push({
          code,
          name: `${columnLetter}${seatNumber}`, // 👈 A1, A2, A3...
          floor: f,
          row: r,
          column: c,
          isActive: true,
          isVip: false,
          _id: "",
          vehicleId,
        });
      }
    }
  }
};

/* =========================
  MATRIX BY FLOOR
========================= */
const seatMatrixByFloor = computed(() => {
  const result: Record<number, SeatUI[][]> = {};

  for (let f = 1; f <= form.value.floors; f++) {
    const matrix: SeatUI[][] = [];

    for (let r = 1; r <= form.value.rows; r++) {
      const rowSeats: SeatUI[] = [];

      for (let c = 1; c <= form.value.columns; c++) {
        const seat: any = seats.value.find(
          (s) => s.floor === f && s.row === r && s.column === c,
        );

        rowSeats.push(
          seat || {
            code: "",
            floor: f!,
            row: r!,
            column: c!,
            isActive: false,
            isVip: false,
            _id: "",
            vehicleId,
            name: "",
          },
        );
      }

      matrix.push(rowSeats);
    }

    result[f] = matrix;
  }

  return result;
});

/* =========================
  TOGGLE
========================= */
const toggleSeat = (seat: SeatUI) => {
  if (!seat.code) return;
  seat.isActive = !seat.isActive;
};

const toggleVip = (seat: SeatUI) => {
  if (!seat.isActive) return;
  seat.isVip = !seat.isVip;
};

/* =========================
  SAVE TO API
========================= */
const saveTemplate = async () => {
  if (!seats.value.length) return;

  const payload = seats.value.map((s) => ({
    code: s.code,
    name: s.name,
    floor: s.floor,
    row: s.row,
    column: s.column,
    isVip: s.isVip,
    isActive: s.isActive,
    vehicleId,
  }));

  await seatStore.updateMany(payload);
  router.push(`/admin/vehicles/${vehicleId}/seats`);
  toast.success("Thay đổi sơ đồ ghế thành công");
};

/* =========================
  EDIT NAME MODAL
========================= */
const showEditModal = ref(false);
const editingSeat = ref<SeatUI | null>(null);
const editNameInput = ref("");

const openEditNameModal = (seat: SeatUI) => {
  if (!seat._id) return;
  editingSeat.value = seat;
  editNameInput.value = seat.name;
  showEditModal.value = true;
};

const saveEditName = async () => {
  if (!editingSeat.value) return;

  const newName = editNameInput.value.trim();
  if (!newName) {
    alert("Seat name cannot be empty");
    return;
  }

  await seatStore.updateById(editingSeat.value._id!, {
    name: newName,
  });

  editingSeat.value.name = newName;
  showEditModal.value = false;

  toast.success("Thay đổi tên ghế thành công");
};
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-6">
    <h1 class="text-2xl font-semibold">Sơ đồ chỗ ngồi</h1>

    <!-- FORM -->
    <div
      class="grid grid-cols-4 gap-4 rounded-lg border bg-white p-5 shadow-sm"
    >
      <div>
        <label class="label">Tầng</label>
        <input
          v-model.number="form.floors"
          type="number"
          min="1"
          class="input"
        >
      </div>

      <div>
        <label class="label">Dòng</label>
        <input v-model.number="form.rows" type="number" min="1" class="input" >
      </div>

      <div>
        <label class="label">Cột</label>
        <input
          v-model.number="form.columns"
          type="number"
          min="1"
          class="input"
        >
      </div>

      <div>
        <label class="label">Random</label>
        <button class="btn-primary w-full" @click="generateSeats">
          Random ghế
        </button>
      </div>
    </div>

    <!-- RESULT -->
    <div v-if="seats.length" class="space-y-6">
      <!-- ACTION -->
      <div class="flex justify-end gap-3">
        <button
          class="rounded-lg border bg-red-400 px-3 py-2 text-sm text-white hover:bg-red-300"
          @click="router.back()"
        >
          Hủy
        </button>
        <button
          class="rounded-lg border bg-primary px-3 py-2 text-sm !text-white"
          :disabled="seatStore.loading"
          @click="saveTemplate"
        >
          {{ seatStore.loading ? "Saving..." : "Lưu sơ đồ" }}
        </button>
      </div>

      <div
        v-for="(matrix, floor) in seatMatrixByFloor"
        :key="floor"
        class="rounded-lg border bg-white p-4 shadow-sm"
      >
        <h3 class="mb-4 font-semibold">Tầng {{ floor }}</h3>

        <div class="space-y-2">
          <div
            v-for="(rowSeats, rIdx) in matrix"
            :key="rIdx"
            class="grid gap-3"
            :style="{
              gridTemplateColumns: `repeat(${form.columns}, minmax(0,1fr))`,
            }"
          >
            <div
              v-for="seat in rowSeats"
              :key="`${seat.floor}-${seat.row}-${seat.column}`"
              class="seat"
              :class="{ disabled: !seat.isActive, vip: seat.isVip }"
              @click="toggleSeat(seat)"
            >
              {{ seat.name }}

              <span v-if="seat.isVip" class="vip-tag">VIP</span>

              <button
                v-if="seat._id"
                class="edit-btn"
                title="Edit name"
                @click.stop="openEditNameModal(seat)"
              >
                ✏️
              </button>

              <button
                v-if="seat.code"
                class="vip-btn"
                @click.stop="toggleVip(seat)"
              >
                ★
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT NAME MODAL -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div class="w-[360px] rounded-lg bg-white p-5 shadow-lg">
        <h3 class="mb-4 text-lg font-semibold">Thay đổi tên ghế</h3>

        <div class="space-y-3">
          <div>
            <label class="label">Tên ghế</label>
            <input
              v-model="editNameInput"
              class="input"
              placeholder="VD: Ghế VIP 01"
              autofocus
            >
          </div>

          <div class="flex justify-end gap-3 pt-3">
            <button class="btn-secondary" @click="showEditModal = false">
              Hủy
            </button>
            <button class="btn-primary" @click="saveEditName">Lưu</button>
          </div>
        </div>
      </div>
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
  @apply relative cursor-pointer rounded-lg border px-3 py-3 text-center font-medium transition hover:shadow;
}

.disabled {
  @apply bg-gray-200 text-gray-400 line-through;
}

.vip {
  @apply border-yellow-400 bg-yellow-100;
}

.vip-tag {
  @apply absolute right-1 top-1 text-xs text-yellow-600;
}

.vip-btn {
  @apply absolute bottom-1 right-1 text-xs text-yellow-600 hover:scale-110;
}

.btn-primary {
  @apply rounded-lg border px-3 py-2 text-sm !text-white;
}

.btn-secondary {
  @apply rounded-lg border bg-red-400 px-3 py-2 text-sm text-white hover:bg-red-300;
}

.edit-btn {
  @apply absolute bottom-1 left-1 text-xs text-gray-500 hover:text-blue-500;
}
</style>
