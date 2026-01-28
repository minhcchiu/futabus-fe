<script setup lang="ts">
import { BOOKING_STEPS } from "~/utils/enums";
import { formatDateTime } from "~/utils/helpers/data.helper";
import type { Seat } from "~/validations/admin/seat.validation";

const tripStore = useTripStore();
const tripPriceStore = useTripPriceStore();
const route = useRoute();
const trip = computed(() => tripStore.selected);

const totalPrice = computed(() => {
  if (!trip.value) return 0;
  if (!selectedSeats.value.length) return 0;

  const seatsPrices = tripPriceStore.list.filter((tp) =>
    // @ts-ignore
    selectedSeats.value.some((s) => s._id === tp.seatId),
  );

  return seatsPrices.reduce((total, seatPrice) => total + seatPrice.price, 0);
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
  await tripPriceStore.fetchAll({
    tripId: tripId,
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

const selectedSeats = ref<Seat[]>([]);

const selectSeats = (seats: Seat[]) => {
  selectedSeats.value = seats;
};

// Handle booking
const customerForm = ref({
  name: "",
  phone: "",
  email: "",
  note: "",
  accepted: false,
});

// Handle pickup / dropOff
const pickupDropoff = ref<{
  pickupTripStopId: string;
  dropoffTripStopId: string;
  pickupType: "station" | "transfer";
  dropoffType: "station" | "transfer";
}>({
  pickupTripStopId: "",
  dropoffTripStopId: "",
  pickupType: "station",
  dropoffType: "station",
});

const onPickupDropoffChange = (data: typeof pickupDropoff.value) => {
  pickupDropoff.value = data;
};
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
        <CustomerForm :form="customerForm" @change="customerForm = $event" />
        <PickupDropoffBox
          :trip-stops="trip?.tripStops || []"
          @change="onPickupDropoffChange"
        />

        <BookingFooter
          :amount="totalPrice"
          :can-pay="canPay"
          @cancel="onCancel"
          @submit="onPayment"
        />
      </div>

      <!-- RIGHT -->
      <div class="col-span-4 space-y-4">
        <TripBookingSummary
          :trip="trip"
          :seats="selectedSeats"
          :pickupDropOff="pickupDropoff"
          :total-price="totalPrice"
        />

        <ContactSummary
          :customer-form="customerForm"
          :trip="trip"
          :seats="selectedSeats"
          :pickupDropOff="pickupDropoff"
          :total-price="totalPrice"
        />
        <PriceSummary :total-price="totalPrice" />
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
            <p class="font-semibold">
              {{ trip?.routeId.startStopId.name }} -
              {{ trip?.routeId.endStopId.name }}
            </p>
            <p class="text-xs opacity-80">
              {{ formatDateTime(trip?.departureTime) }}
            </p>
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
        <CustomerForm
          v-if="currentStep === 1"
          :form="customerForm"
          @change="customerForm = $event"
        />
        <PickupDropoffBox
          v-if="currentStep === 2"
          :trip-stops="trip?.tripStops || []"
          @change="onPickupDropoffChange"
        />

        <div v-if="currentStep === 3" class="space-y-4">
          <TripBookingSummary
            :trip="trip"
            :seats="selectedSeats"
            :pickupDropOff="pickupDropoff"
            :total-price="totalPrice"
          />
          <ContactSummary
            :customer-form="customerForm"
            :trip="trip"
            :seats="selectedSeats"
            :pickupDropOff="pickupDropoff"
            :total-price="totalPrice"
          />
          <PriceSummary :total-price="totalPrice" />
        </div>
      </div>

      <!-- MOBILE NAV BAR -->
      <div class="pb-28">
        <MobileBookingBottom
          :step="currentStep"
          :seats="selectedSeats"
          :total="totalPrice"
          @next="nextStep"
          @prev="prevStep"
          @submit="onPayment"
        />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
