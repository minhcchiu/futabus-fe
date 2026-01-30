<script setup lang="ts">
import { endOfDay, format, startOfDay } from "date-fns";
import type { Trip } from "~/validations/admin/trip.validation";

const tripStore = useTripStore();
const routeStore = useRouteStore();

const selectedTrip = ref<Trip | null>(null);

const route = useRoute();
const from = computed(() => route.query.from as string | undefined);
const to = computed(() => route.query.to as string | undefined);
const ticket = computed(() => route.query.ticket as string | undefined);
const date = computed(() => {
  const d = route.query.date as string | undefined;

  if (!d) return Date.now();

  const [day, month, year] = d.split("-");
  return new Date(+year!, +month! - 1, +day!).getTime();
});

const trips = computed(() => tripStore.list);
const locationsFromTo = computed(() => routeStore.locationsFromTo);

const getProvinceId = (name: string) => {
  return locationsFromTo.value.find((l) => l.provinceFrom.name === name)
    ?.provinceFrom._id;
};

const getProvinceToId = (name: string) => {
  return locationsFromTo.value
    .find((l) => l.provincesTo.some((p) => p.name === name))
    ?.provincesTo.find((p) => p.name === name)?._id;
};

const fetchTrips = async (query: {
  from?: string | null;
  to?: string | null;
  date: number;
  ticket?: number;
}) => {
  let startAt = Date.now();
  let endAt = endOfDay(Date.now()).getTime();
  if (query.date) {
    startAt = startOfDay(new Date(query.date)).getTime();
    endAt = endOfDay(startAt).getTime();
  }

  const filter = {
    _sort: "departureTime",
    _populate: "routeId.startStopId endStopId,vehicleId",
    [`departureTime>=${startAt}`]: "",
    [`departureTime<=${endAt}`]: "",
  };

  if (query.from) {
    // const provinceFromId = getProvinceId(query.from);
    // Object.assign(filter, {
    // provinceFromId,
    // });
  }

  if (query.to) {
    // const provinceToId = getProvinceToId(query.to);
    //    Object.assign(filter, {
    // provinceToId,
    // });
  }

  const list = await tripStore.fetchAll(filter);

  return list.length;
};

onMounted(async () => {
  await routeStore.getLocationsFromTo();
  await fetchTrips({
    date: date.value,
    ticket: ticket.value ? +ticket.value : undefined,
    from: from.value,
    to: to.value,
  });
});

const searchOnDesktop = async (query: {
  from: string | null;
  to: string | null;
  date: string;
  ticket: string;
}) => {
  const d = query.date as string | undefined;
  let dateTime = Date.now();
  if (d) {
    const [day, month, year] = d.split("-");
    dateTime = new Date(+year!, +month! - 1, +day!).getTime();
  }

  await fetchTrips({
    from: query.from,
    to: query.to,
    date: dateTime,
    ticket: query.ticket ? +query.ticket : undefined,
  });
};

const openFilter = ref(false);
const isOpenSearchResult = ref(false);
const showEmptyModal = ref(false);

const searchOnMobile = async (query: {
  from: string | null;
  to: string | null;
  date: string;
  ticket: string;
}) => {
  showEmptyModal.value = false;
  isOpenSearchResult.value = false;

  const d = query.date as string | undefined;
  let dateTime = Date.now();
  if (d) {
    const [day, month, year] = d.split("-");
    dateTime = new Date(+year!, +month! - 1, +day!).getTime();
  }

  const total = await fetchTrips({
    from: query.from,
    to: query.to,
    date: dateTime,
    ticket: query.ticket ? +query.ticket : undefined,
  });

  if (total === 0) {
    showEmptyModal.value = true;
  } else {
    isOpenSearchResult.value = true;
  }
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
      <TripSearchBox
        v-if="!routeStore.loading"
        :locations-from-to="locationsFromTo"
        @search="searchOnDesktop"
      />
    </div>

    <div class="block md:hidden">
      <MobileSearch
        v-if="!routeStore.loading"
        :locations-from-to="locationsFromTo"
        @search="searchOnMobile"
      />

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
      <aside class="col-span-12 space-y-4 md:col-span-4">
        <div class="overflow-hidden rounded-xl bg-white shadow">
          <!-- IMAGE / BANNER -->
          <div class="relative h-36 w-full">
            <img
              src="/images/contact-banner.png"
              alt="FUTA Bus Lines"
              class="h-full w-full object-cover"
            />
            <div class="absolute inset-0 bg-black/30" />
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
          @select="selectedTrip = $event"
          :pickup-province="from"
          :dropoff-province="to"
          :date-label="format(date, 'dd/MM/yyyy')"
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
          :pickup-province="from"
          :dropoff-province="to"
          :date-label="format(date, 'dd/MM/yyyy')"
          @open-filter="openFilter = true"
          @select="selectedTrip = $event"
          @back="onCloseMobileTripList"
        />
      </div>

      <MobileFilterModal v-model="openFilter" />
    </div>

    <Teleport to="body">
      <div
        v-if="showEmptyModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 md:hidden"
      >
        <div
          class="w-full max-w-sm rounded-2xl bg-white px-6 py-7 text-center shadow-xl"
        >
          <img
            src="/images/empty_list.svg"
            alt="Không có chuyến xe"
            class="mx-auto mb-4 h-20 opacity-80"
          />

          <p class="text-lg font-semibold">Không có chuyến xe</p>

          <p class="text-muted-foreground mt-1 text-sm">
            Thử chọn ngày hoặc tuyến khác
          </p>

          <div class="mt-6 flex gap-3">
            <button
              class="flex-1 rounded-full border px-4 py-2 text-sm"
              @click="showEmptyModal = false"
            >
              Đóng
            </button>

            <button
              class="flex-1 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white"
              @click="showEmptyModal = false"
            >
              Đổi tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="css" scoped></style>
