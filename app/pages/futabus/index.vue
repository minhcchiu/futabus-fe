<script setup lang="ts">
import type { Trip } from "~/validations/trip.validation";

definePageMeta({ layout: "no-layout" });

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
      <div class="mt-10">
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
      <aside class="col-span-4 hidden md:block">
        <FilterSidebar />
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
