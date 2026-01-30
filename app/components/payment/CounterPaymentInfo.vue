<script setup lang="ts">
const settingStore = useSettingStore();

const setting = computed(() => settingStore.selected);
onMounted(async () => {
  await settingStore.fetchOne();
});

const showQrPreview = ref(false);
</script>

<template>
  <div class="rounded-xl bg-white p-4 shadow">
    <h3 class="mb-4 text-center text-lg font-semibold text-green-600">
      Thanh toán tại quầy
    </h3>

    <!-- BANK + QR -->
    <div class="mb-4 grid grid-cols-[1fr_auto] gap-4 rounded-lg border p-3">
      <!-- BANK INFO -->
      <div class="space-y-1 text-sm text-gray-600">
        <div class="font-medium text-gray-900">Chuyển khoản (nếu cần)</div>
        <div>{{ setting?.bankInfo?.bankName || "--" }}</div>
        <div>
          {{ setting?.bankInfo?.accountNumber || "--" }} –
          <span class="text-gray-800">{{
            setting?.bankInfo?.accountHolder || "--"
          }}</span>
        </div>
      </div>

      <!-- QR -->
      <div
        v-if="setting?.bankInfo?.qr"
        class="flex items-center justify-center"
      >
        <img
          :src="setting?.bankInfo?.qr"
          alt="QR Bank"
          class="h-20 w-20 rounded-md border"
          @click="showQrPreview = true"
        />
      </div>
    </div>

    <!-- STORE INFO -->
    <div class="rounded-lg border p-3 text-sm text-gray-600">
      <div class="mb-1 font-medium text-gray-900">Thông tin cửa hàng</div>
      <div>{{ setting?.fullName }}</div>
      <div>📞 {{ setting?.phone }}</div>
      <div>📍 {{ setting?.address }}</div>

      <a
        :href="setting?.mapLink"
        target="_blank"
        class="mt-2 inline-block text-sm font-medium text-green-600 hover:underline"
      >
        👉 Mở bản đồ chỉ đường
      </a>
    </div>

    <p class="mt-4 text-xs text-orange-500">
      ⏰ Vui lòng đến quầy trước thời gian giữ chỗ để hoàn tất thanh toán
    </p>

    <!-- QR PREVIEW MODAL -->
    <teleport to="body">
      <div
        v-if="showQrPreview"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        @click.self="showQrPreview = false"
      >
        <div class="relative rounded-xl bg-white p-4 shadow-xl">
          <!-- CLOSE -->
          <button
            class="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            @click="showQrPreview = false"
          >
            ✕
          </button>

          <img
            :src="setting?.bankInfo?.qr"
            alt="QR Preview"
            class="h-72 w-72 object-contain"
          />

          <p class="mt-3 text-center text-sm text-gray-600">
            Quét mã để chuyển khoản nhanh
          </p>
        </div>
      </div>
    </teleport>
  </div>
</template>
