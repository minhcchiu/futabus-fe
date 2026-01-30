<script setup lang="ts">
import { toast } from "vue-sonner";
import { BOOKING_STEPS } from "~/utils/enums";
import { formatDateTime } from "~/utils/helpers/data.helper";
import { handleApiError } from "~/utils/helpers/error-handler.helper";
import {
  BookingStatus,
  PaymentMethod,
} from "~/validations/admin/booking.validation";
import type { Seat } from "~/validations/admin/seat.validation";

const route = useRoute();
const router = useRouter();
const tripStore = useTripStore();
const bookingStore = useBookingStore();
const tripPriceStore = useTripPriceStore();
const trip = computed(() => tripStore.selected);
const seatIdsBooked = ref<string[]>([]);

const date = ref<number>(Date.now());

onMounted(async () => {
  const tripId = route.query.trip_id as string;
  date.value = formatDateUrlToNumber(route.query.date as string);

  seatIdsBooked.value = await bookingStore.getSeatsBooked({
    tripId,
    [`expireAt>${date.value}`]: "",
    status: BookingStatus.PENDING,
  });

  await Promise.all([
    tripStore.fetchById(tripId!, {
      _populate: "routeId.startStopId endStopId,vehicleId",
    }),
    tripPriceStore.fetchAll({
      tripId,
    }),
  ]);
});

const totalPrice = computed(() => {
  if (!trip.value) return 0;
  if (!selectedSeats.value.length) return 0;

  const seatsPrices = tripPriceStore.list.filter((tp) =>
    // @ts-ignore
    selectedSeats.value.some((s) => s._id === tp.seatId),
  );

  return seatsPrices.reduce((total, seatPrice) => total + seatPrice.price, 0);
});

const currentStep = ref(BOOKING_STEPS.SEAT);

const totalSteps = 4;

const checkNextStep = (step: number) => {
  switch (step) {
    case BOOKING_STEPS.SEAT:
      return checkSelectedSeats();
    case BOOKING_STEPS.CUSTOMER:
      return checkCustomerInfo();
    case BOOKING_STEPS.PICKUP:
      return checkPickupDropoff();
    case BOOKING_STEPS.PAYMENT:
      return canPay();
    default:
      return true;
  }
};
const nextStep = () => {
  if (!checkNextStep(currentStep.value)) {
    return;
  }

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
  departureTime?: number;
  dropoffTripStopId: string;
  pickupType: "station" | "transfer";
  dropoffType: "station" | "transfer";
}>({
  departureTime: undefined,
  pickupTripStopId: "",
  dropoffTripStopId: "",
  pickupType: "station",
  dropoffType: "station",
});

const onPickupDropoffChange = (data: typeof pickupDropoff.value) => {
  pickupDropoff.value = data;
};

const checkSelectedSeats = () => {
  if (selectedSeats.value.length === 0) {
    toast.error("Vui lòng chọn ghế");
    return false;
  }
  return true;
};

const checkCustomerInfo = () => {
  if (
    !customerForm.value.name ||
    !customerForm.value.phone ||
    !customerForm.value.email
  ) {
    toast.error(`Vui lòng nhập đầy đủ thông tin: Tên, Số điện thoại, Email`);
    return false;
  }

  if (!customerForm.value.accepted) {
    toast.error("Vui lòng đồng ý với điều khoản và điều kiện");
    return false;
  }

  return true;
};

const checkPickupDropoff = () => {
  if (
    !pickupDropoff.value.pickupTripStopId ||
    !pickupDropoff.value.dropoffTripStopId
  ) {
    toast.error("Vui lòng chọn điểm đón và trả");
    return false;
  }

  return true;
};

const canPay = () => {
  if (!checkSelectedSeats()) {
    return false;
  }
  if (!checkCustomerInfo()) {
    return false;
  }
  if (!checkPickupDropoff()) {
    return false;
  }

  return true;
};

const onPayment = async () => {
  if (!canPay()) return;

  try {
    const pickupTime = new Date(pickupDropoff.value.departureTime!);
    const booked = await bookingStore.create({
      tripId: trip.value!._id,
      seatIds: selectedSeats.value.map((s) => s._id),
      fromStopId: pickupDropoff.value.pickupTripStopId,
      toStopId: pickupDropoff.value.dropoffTripStopId,
      status: BookingStatus.PENDING,
      amount: totalPrice.value,
      paymentInfo: {
        method: PaymentMethod.BANK_TRANSFER,
        status: BookingStatus.PENDING,
        amount: totalPrice.value,
      },
      customerInfo: {
        name: customerForm.value.name,
        phone: customerForm.value.phone,
        email: customerForm.value.email,
        note: customerForm.value.note,
      },
      departureTime: new Date(trip.value!.departureTime).setHours(
        pickupTime.getHours(),
        pickupTime.getMinutes(),
        0,
        0,
      ),
    });

    router.push({
      name: "payment",
      query: {
        booking_id: booked._id,
      },
    });
  } catch (error: any) {
    toast({ ...handleApiError(error), variant: "destructive" });
  }
};

const onCancel = () => {};
</script>

<template>
  <div>
    <!-- DESKTOP UI -->
    <div class="mx-auto hidden grid-cols-12 gap-6 py-6 md:grid">
      <!-- LEFT -->
      <div class="col-span-8 space-y-6">
        <SeatBookingSelector
          v-if="trip"
          :vehicle-id="trip.vehicleId._id"
          :seat-ids-booked="seatIdsBooked"
          @select-seats="selectSeats"
        />
        <CustomerForm :form="customerForm" @change="customerForm = $event" />
        <PickupDropoffBox
          :trip-stops="trip?.tripStops || []"
          @change="onPickupDropoffChange"
        />

        <BookingFooter
          :amount="totalPrice"
          @cancel="onCancel"
          @submit="onPayment"
        />
      </div>

      <!-- RIGHT -->
      <div class="col-span-4 space-y-4">
        <TripBookingSummary
          :trip="trip"
          :seats="selectedSeats"
          :pickup-drop-off="pickupDropoff"
          :total-price="totalPrice"
        />

        <ContactSummary
          :customer-form="customerForm"
          :trip="trip"
          :seats="selectedSeats"
          :pickup-drop-off="pickupDropoff"
          :total-price="totalPrice"
        />
        <PriceSummary :total-price="totalPrice" />
      </div>
    </div>

    <!-- MOBILE UI -->
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
              {{ formatDateTime(trip?.departureTime || Date.now()) }}
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
          :seat-ids-booked="seatIdsBooked"
          @select-seats="selectSeats"
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
            :pickup-drop-off="pickupDropoff"
            :total-price="totalPrice"
          />
          <ContactSummary
            :customer-form="customerForm"
            :trip="trip"
            :seats="selectedSeats"
            :pickup-drop-off="pickupDropoff"
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
