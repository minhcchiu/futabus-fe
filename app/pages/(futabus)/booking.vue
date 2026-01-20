<script setup lang="ts">
import { BOOKING_STEPS } from "~/utils/enums";
import type { Trip } from "~/validations/trip.validation";

// const date = ref(fromDate(new Date(), getLocalTimeZone())) as Ref<DateValue>;
// const tripType = ref("one-way");
// const from = ref("dak-lak");
// const to = ref("da-nang");
// const tickets = ref(1);

const selectedTrip = ref<Trip | null>(null);

const totalPrice = computed(() => {
  if (!selectedTrip.value) return 0;
  return selectedTrip.value.price;
});

const canPay = computed(() => {
  // return totalPrice.value > 0 ;
  return true;
});

const onPayment = () => {
  navigateTo("/payment");
};

const onCancel = () => {};

const trips: Trip[] = [
  {
    id: "1",
    date: "Thứ 5, 22/01/2026",
    route: "Đắk Nông - Đà Nẵng",
    departTime: "15:00",
    departStation: "Bến Xe Đắk Nông",
    arriveTime: "06:00",
    arriveStation: "Bến Xe Trung Tâm Đà Nẵng",
    duration: "15 giờ",
    vehicleType: "Limousine",
    price: 400000,
  },
];

onMounted(() => {
  selectedTrip.value = trips[0]!;
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

const selectedSeats = ["A1", "B1"];
</script>

<template>
  <div>
    <div class="mx-auto hidden grid-cols-12 gap-6 py-6 md:grid">
      <!-- LEFT -->
      <div class="col-span-8 space-y-6">
        <SeatBookingSelector />
        <CustomerForm />
        <PickupDropoffBox />

        <BookingFooter
          :amount="totalPrice"
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
        <SeatBookingSelector v-if="currentStep === 0" />
        <CustomerForm v-if="currentStep === 1" />
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
