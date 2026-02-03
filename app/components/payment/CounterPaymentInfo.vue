<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useSettingStore } from "~/stores/setting.store";

const settingStore = useSettingStore();
const setting = computed(() => settingStore.selected);

onMounted(async () => {
  await settingStore.fetchOne();
});
</script>

<template>
  <div class="rounded-xl bg-white shadow md:p-4">
    <!-- TITLE -->
    <h3 class="mb-4 text-center text-lg font-semibold text-green-600">
      Thanh toán tại quầy
    </h3>

    <!-- STORE INFO -->
    <div class="rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
      <div class="mb-2 flex items-center gap-2 font-medium text-gray-900">
        🏪 Thông tin cửa hàng
      </div>

      <div class="font-medium">{{ setting?.fullName }}</div>
      <div>📞 {{ setting?.phone }}</div>
      <div class="font-medium">📍 {{ setting?.address }}</div>

      <a
        :href="setting?.mapLink"
        target="_blank"
        class="mt-2 inline-block text-sm font-medium text-green-600 hover:underline"
      >
        👉 Mở bản đồ chỉ đường
      </a>
    </div>

    <!-- HOW TO PAY -->
    <div class="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
      <div class="mb-2 font-medium text-gray-900">Khi đến quầy, bạn cần:</div>

      <ul class="list-disc space-y-1 pl-4 text-orange-800">
        <li>Chúng tôi sẽ liên hệ xác nhận đơn trong vòng <b>1 giờ</b>.</li>
        <li>Vui lòng giữ điện thoại để không bỏ lỡ cuộc gọi.</li>
        <li class="text-red-600">
          Quá 1 giờ không liên hệ được, đơn sẽ tự động huỷ.
        </li>
      </ul>

      <div class="mt-3 text-xs text-gray-500">
        ⏱ Giờ làm việc: <b>07:00 – 21:00</b> (hàng ngày)
      </div>
    </div>

    <!-- WARNING -->
    <p class="mt-3 text-xs text-orange-700">
      ⏰ Vui lòng đến quầy trước thời gian giữ chỗ để hoàn tất thanh toán
    </p>

    <!-- TOGGLE MAP -->
    <a
      class="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
      :href="setting?.mapLink"
      target="_blank"
    >
      📍 Xem bản đồ cửa hàng
    </a>
  </div>
</template>
