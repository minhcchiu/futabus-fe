<script setup lang="ts">
const settingStore = useSettingStore();

const setting = computed(() => settingStore.selected);

onMounted(async () => {
  await settingStore.fetchOne();
});
</script>

<template>
  <footer class="bg-gradient-to-b from-green-50 to-white text-sm text-gray-700">
    <!-- MAIN -->
    <div class="mx-auto max-w-7xl px-6 py-14">
      <div class="grid gap-10 md:grid-cols-4">
        <!-- Contact -->
        <div class="space-y-4">
          <p class="text-xs font-semibold tracking-wider text-green-700">
            TRUNG TÂM CSKH
          </p>

          <p class="text-3xl font-bold text-green-600">
            {{ setting?.phone }}
          </p>

          <div class="space-y-1">
            <p class="font-semibold uppercase">
              {{ setting?.fullName }}
            </p>
            <p class="text-gray-600">
              {{ setting?.address }}
            </p>
            <p>
              <span class="text-gray-500">Email:</span>
              <span class="font-medium text-green-600">
                {{ setting?.email }}
              </span>
            </p>
            <p>
              <span class="text-gray-500">Điện thoại:</span>
              {{ setting?.phone }}
            </p>
          </div>
        </div>

        <!-- Company -->
        <div>
          <p class="mb-4 font-semibold text-green-700">
            {{ setting?.shortName }}
          </p>
          <ul class="space-y-3">
            <li class="footer-item">Về chúng tôi</li>
            <li class="footer-item">Lịch trình</li>
            <li class="footer-item">Tuyển dụng</li>
            <li class="footer-item">Tin tức & Sự kiện</li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <p class="mb-4 font-semibold text-green-700">Hỗ trợ</p>
          <ul class="space-y-3">
            <li class="footer-item">Tra cứu thông tin đặt vé</li>
            <li class="footer-item">Điều khoản sử dụng</li>
            <li class="footer-item">Câu hỏi thường gặp</li>
          </ul>
        </div>

        <!-- Trust / Highlight -->
        <div class="rounded-2xl bg-green-50 p-5 shadow-sm">
          <p class="mb-3 font-semibold text-green-700">Cam kết dịch vụ</p>
          <ul class="space-y-2 text-gray-600">
            <li>✔ Giữ chỗ nhanh – không lo mất vé</li>
            <li>✔ Thanh toán an toàn</li>
            <li>✔ Hỗ trợ 24/7</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- COPYRIGHT -->
    <div class="border-t bg-white py-4 text-center text-xs text-gray-500">
      © 2026 Công ty Cổ phần Xe khách Mai Linh. All rights reserved.
    </div>

    <!-- CHAT FLOAT -->
    <button
      class="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition hover:-translate-y-1 hover:bg-green-600"
      aria-label="Chat hỗ trợ"
    >
      💬
    </button>
  </footer>
</template>

<style scoped>
.footer-item {
  @apply cursor-pointer text-gray-600 transition hover:text-green-600;
}
</style>
