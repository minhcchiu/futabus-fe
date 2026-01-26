<script setup lang="ts">
import type { Trip } from "~/validations/trip.validation";

// const date = ref(fromDate(new Date(), getLocalTimeZone())) as Ref<DateValue>;
// const tripType = ref("one-way");
// const from = ref("dak-lak");
// const to = ref("da-nang");
// const tickets = ref(1);

const selectedTrip = ref<Trip | null>(null);

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
  {
    id: "2",
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
  {
    id: "3",
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
  {
    id: "4",
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

const openFilter = ref(false);
const isOpenSearchResult = ref(false);
const onSearch = () => {
  isOpenSearchResult.value = true;
};

const onCloseMobileTripList = () => {
  isOpenSearchResult.value = false;
};
</script>

<template>
  <div>
    <HeroBanner
      title="Futabus"
      description="A community for developers, ask questions and get answers."
      image="https://api.huonganhgroup.vn/static/upload/image/1768727497064_b9325bded872cb0de35e563c_4e7c3aef7148c10ee.png"
    />

    <div class="hidden md:block">
      <TripSearchBox />
    </div>

    <div class="block md:hidden">
      <MobileSearch @search="onSearch" />

      <!-- RECENT -->
      <div class="mt-10 hidden">
        <p class="mb-2 text-center text-xl font-semibold text-green-600">
          Tìm kiếm gần đây
        </p>
        <div class="flex gap-6 overflow-x-auto pb-1">
          <div
            v-for="item in [
              { title: 'Đắk Lắk - Đà Nẵng', date: '22/01/2026' },
              { title: 'Hà Nội - TP. Hồ Chí Minh', date: '09/01/2026' },
              { title: 'An Giang - Bà Rịa - Vũng Tàu', date: '08/01/2026' },
            ]"
            :key="item.title"
            class="min-w-[200px] rounded-lg border bg-white px-3 py-2"
          >
            <p class="text-sm font-semibold">{{ item.title }}</p>
            <p class="mt-1 text-xs text-gray-400">{{ item.date }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-x-6 px-4 py-6">
      <!-- Sidebar -->
      <aside class="col-span-4 space-y-4">
        <div class="overflow-hidden rounded-xl bg-white shadow">
          <!-- IMAGE / BANNER -->
          <div class="relative h-36 w-full">
            <img
              src="/images/contact-banner.png"
              alt="FUTA Bus Lines"
              class="h-full w-full object-cover"
            />
            <div class="absolute inset-0 bg-black/30"></div>
            <div class="absolute bottom-3 left-4 text-white">
              <h2 class="text-lg font-semibold">Liên hệ với chúng tôi</h2>
              <p class="text-xs opacity-90">FUTA Bus Lines</p>
            </div>
          </div>

          <!-- CONTENT -->
          <div class="space-y-4 p-4 text-sm">
            <!-- Company -->
            <div>
              <p class="text-xs uppercase text-gray-400">Đơn vị vận hành</p>
              <p class="mt-1 font-semibold text-green-600">
                CÔNG TY CỔ PHẦN XE KHÁCH PHƯƠNG TRANG<br />
                FUTA BUS LINES
              </p>
            </div>

            <!-- Address -->
            <div class="flex items-start gap-2 text-gray-600">
              <span>📍</span>
              <p>
                486-486A Lê Văn Lương, Phường Tân Hưng,<br />
                TPHCM, Việt Nam
              </p>
            </div>

            <!-- Contact -->
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                📞
                <a href="tel:19006067" class="font-medium text-green-600">
                  1900 6067
                </a>
              </div>
              <div class="flex items-center gap-2">
                ✉️
                <a
                  href="mailto:hotro@futa.vn"
                  class="text-blue-600 hover:underline"
                >
                  hotro@futa.vn
                </a>
              </div>
              <div class="flex items-center gap-2">
                🌐
                <a
                  href="https://futabus.vn"
                  target="_blank"
                  class="text-blue-600 hover:underline"
                >
                  futabus.vn
                </a>
              </div>
            </div>

            <!-- Quick actions -->
            <div class="grid grid-cols-2 gap-2 pt-2">
              <a
                href="tel:19006067"
                class="flex items-center justify-center gap-1 rounded-lg bg-green-500 py-2 text-white hover:bg-green-600"
              >
                📞 Gọi ngay
              </a>
              <a
                href="https://zalo.me/19006067"
                target="_blank"
                class="flex items-center justify-center gap-1 rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
              >
                💬 Chat Zalo
              </a>
            </div>
          </div>
        </div>
      </aside>

      <!-- Content -->
      <main class="col-span-8 hidden md:block">
        <TripList
          :trips="trips"
          route-name="Đắk Lắk - Đà Nẵng"
          @select="selectedTrip = $event"
        />
      </main>
    </div>

    <div
      v-if="isOpenSearchResult"
      class="fixed inset-0 z-[99] block bg-gray-100 md:hidden"
    >
      <!-- MOBILE -->
      <div>
        <MobileTripList
          :trips="trips"
          route-name="Đắk Lắk - Đà Nẵng"
          @open-filter="openFilter = true"
          @select="selectedTrip = $event"
          @back="onCloseMobileTripList"
        />
      </div>

      <MobileFilterModal v-model="openFilter" />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
