<script setup lang="ts">
import { BOOKING_STEPS } from "~/utils/enums";
import type { Seat } from "~/validations/admin/seat.validation";

const tripStore = useTripStore();
const route = useRoute();
const trip = computed(() => tripStore.selected);

const totalPrice = computed(() => {
  if (!trip.value) return 0;
  return trip.value.price;
});

const canPay = computed(() => {
  // return totalPrice.value > 0 ;
  return true;
});

const onPayment = () => {
  navigateTo("/payment");
};

const onCancel = () => {};

onMounted(async () => {
  const tripId = route.query.trip_id as string;

  await tripStore.fetchById(tripId!, {
    _populate: "routeId.startStopId endStopId,vehicleId",
  });
});

const currentStep = ref(BOOKING_STEPS.SEAT);

const totalSteps = 4;

const nextStep = () => {
  if (currentStep.value < totalSteps - 1) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const selectedSeats = ref<string[]>([]);

const selectSeats = (seats: Seat[]) => {
  selectedSeats.value = seats.map((s) => s.code);
};

// Handle booking
const customerForm = ref({
  name: "",
  phone: "",
  email: "",
  note: "",
  accepted: false,
});
</script>

<template>
  <div>
    <div class="mx-auto hidden grid-cols-12 gap-6 py-6 md:grid">
      <!-- LEFT -->
      <div class="col-span-8 space-y-6">
        <SeatBookingSelector
          v-if="trip"
          :vehicle-id="trip.vehicleId._id"
          @select-seats="selectSeats"
        />
        <CustomerForm v-model="customerForm" />
        <PickupDropoffBox />

        <BookingFooter
          :amount="totalPrice || 10000"
          :can-pay="canPay"
          @cancel="onCancel"
          @submit="onPayment"
        />
      </div>

      <!-- RIGHT -->
      <div class="col-span-4 space-y-4">
        <TripBookingSummary />
        <PriceSummary />
      </div>
    </div>

    <div
      class="fixed inset-0 z-[99] flex min-h-screen flex-col bg-gray-100 md:hidden"
    >
      <!-- STEP HEADER -->
      <div class="sticky top-0 z-20">
        <div
          class="flex items-center justify-between bg-green-500 px-4 py-3 text-white"
        >
          <button @click="$router.back()">←</button>
          <div class="text-center">
            <p class="font-semibold">Đà Nẵng - Đăk Lăk</p>
            <p class="text-xs opacity-80">Thứ 2, 19/01</p>
          </div>
          <div />
        </div>
        <div class="flex justify-between border-b bg-white px-4 py-3">
          <div class="font-semibold">
            {{
              [
                "Chọn ghế",
                "Thông tin khách hàng",
                "Điểm đón/trả",
                "Thanh toán",
              ][currentStep]
            }}
          </div>
          <div class="text-sm text-gray-400">{{ currentStep + 1 }}/4</div>
        </div>
      </div>

      <!-- STEP CONTENT -->
      <div class="h-full flex-1 space-y-4 overflow-y-auto p-4">
        <SeatBookingSelector
          v-if="currentStep === 0 && trip"
          :vehicle-id="trip.vehicleId._id"
        />
        <CustomerForm v-model="customerForm" v-if="currentStep === 1" />
        <PickupDropoffBox v-if="currentStep === 2" />

        <div v-if="currentStep === 3" class="space-y-4">
          <TripBookingSummary />
          <PriceSummary />
        </div>
      </div>

      <!-- MOBILE NAV BAR -->
      <div class="pb-28">
        <MobileBookingBottom
          :step="currentStep"
          :seats="selectedSeats"
          :total="trip?.price || 10000"
          @next="nextStep"
          @prev="prevStep"
          @submit="onPayment"
        />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
