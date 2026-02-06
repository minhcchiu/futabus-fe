<script setup lang="ts">
import type { Booking } from "~/validations/admin/booking.validation";
import type { Sepay } from "~/validations/admin/sepay.validation";

defineProps<{
  booked?: Booking;
  banks: Sepay[];
  setting?: any;
  methodSelected?: string;
  qrCodeUrl?: string;
  isExpired: boolean;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "update:method", value: string): void;
  (e: "payment"): void;
}>();
</script>

<template>
  <div class="mx-auto hidden px-4 py-6 md:block">
    <div class="grid grid-cols-12 gap-6">
      <!-- LEFT -->
      <div class="col-span-4 space-y-4 rounded-xl bg-white">
        <PaymentMethodList
          :banks="banks"
          :model-value="methodSelected"
          :cash="setting?.bankInfo"
          @update:model-value="emit('update:method', $event)"
        />
      </div>

      <!-- CENTER -->
      <div class="col-span-4">
        <div v-if="booked && !isExpired">
          <PaymentQRCode
            v-if="methodSelected !== 'CASH'"
            :amount="booked.amount"
            :expire="booked.expireAt"
            :method="methodSelected"
            :qr-code="qrCodeUrl"
          />

          <CounterPaymentInfo v-else />
        </div>

        <div v-else class="rounded-xl bg-red-50 p-6 text-center text-red-600">
          ⛔ Thời gian thanh toán đã hết hiệu lực
          <br />
          Vui lòng đặt vé lại
        </div>
      </div>

      <!-- RIGHT -->
      <div class="col-span-4 space-y-4">
        <PassengerInfoCard :customer-info="booked?.customerInfo" />
        <TripInfoCard v-if="booked" :booked="booked" />
        <PriceDetailCard v-if="booked" :booked="booked" />
      </div>
    </div>

    <!-- ACTION -->
    <BankTransferConfirm
      v-if="booked"
      :expire="booked.expireAt"
      :is-submitting="loading"
      :booking="booked"
      @payment="emit('payment')"
    />
  </div>
</template>
