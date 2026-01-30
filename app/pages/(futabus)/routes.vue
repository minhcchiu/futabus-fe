<script setup lang="ts">
const routes = [
  [
    {
      id: 1,
      from: "An Hữu (Tiền Giang)",
      to: "TP.Hồ Chí Minh",
      type: "Limousine",
      distance: "127km",
      duration: "2 giờ",
    },
  ],
  [
    {
      id: 2,
      from: "An Khê (Gia Lai)",
      to: "TP.Hồ Chí Minh",
      type: "Limousine",
      distance: "640km",
      duration: "13 giờ",
    },
    {
      id: 3,
      from: "An Khê (Gia Lai)",
      to: "TP.Hồ Chí Minh",
      type: "Limousine",
      distance: "670km",
      duration: "13 giờ",
    },
  ],
  [
    {
      id: 4,
      from: "An Minh (Kiên Giang)",
      to: "TP.Hồ Chí Minh",
      type: "Limousine",
      distance: "295km",
      duration: "7 giờ",
    },
  ],
  [
    {
      id: 5,
      from: "An Nhơn",
      to: "TP.Hồ Chí Minh",
      type: "Giường",
      distance: "720km",
      duration: "13 giờ",
    },
    {
      id: 6,
      from: "An Nhơn",
      to: "TP.Hồ Chí Minh",
      type: "Giường",
      distance: "710km",
      duration: "12 giờ",
    },
    {
      id: 7,
      from: "An Nhơn",
      to: "TP.Hồ Chí Minh",
      type: "",
      distance: "688km",
      duration: "11 giờ",
    },
  ],
];
const isDeveloping = true;
</script>

<template>
  <div class="mx-auto py-10">
    <!-- Coming Soon -->
    <div
      v-if="isDeveloping"
      class="flex flex-col items-center justify-center rounded-xl border bg-white py-20 text-center"
    >
      <div class="mb-4 text-6xl">🚧</div>
      <h2 class="text-2xl font-semibold text-gray-800">
        Tính năng đang được phát triển
      </h2>
      <p class="mt-2 max-w-md text-gray-500">
        Chúng tôi đang hoàn thiện chức năng tìm tuyến xe. Vui lòng quay lại sau.
      </p>
    </div>

    <!-- Nội dung cũ (ẩn tạm) -->
    <template v-else>
      <div class="space-y-4">
        <!-- Search -->
        <div class="relative flex items-center md:gap-3">
          <SearchInput placeholder="Nhập điểm đi" />
          <div
            class="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-white text-green-500"
          >
            <span>⇄</span>
          </div>
          <SearchInput placeholder="Nhập điểm đến" />
        </div>
        <div class="mt-6 flex w-full flex-col gap-4 overflow-auto">
          <!-- Table header -->
          <div
            class="grid min-w-[800px] grid-cols-7 rounded-lg border bg-white px-4 py-3 text-sm font-medium text-gray-600"
          >
            <div class="col-span-2">Tuyến xe</div>
            <div>Loại xe</div>
            <div>Quãng đường</div>
            <div>Thời gian hành trình</div>
            <div>Giá vé</div>
            <div />
          </div>
          <!-- Routes -->
          <div class="grid min-w-[800px] gap-2">
            <div
              v-for="(group, index) in routes"
              :key="index"
              class="rounded-xl border bg-white"
            >
              <div
                v-for="route in group"
                :key="route.id"
                class="grid grid-cols-7 items-center gap-2 border-t px-4 py-3 text-sm first:border-t-0"
              >
                <!-- Route -->
                <div class="col-span-2 font-medium text-green-500">
                  {{ route.from }} <span class="mx-1">⇒</span>
                  <span class="text-gray-900">{{ route.to }}</span>
                </div>
                <div>{{ route.type || "---" }}</div>
                <div>{{ route.distance }}</div>
                <div>{{ route.duration }}</div>
                <div>---</div>
                <div class="text-right">
                  <button
                    class="rounded-full bg-green-100 px-4 py-1 text-green-600 hover:bg-green-200"
                  >
                    Tìm tuyến xe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="css" scoped></style>
