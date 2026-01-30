<script setup lang="ts">
import { format } from "date-fns";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { LocationsFromTo } from "~/validations/admin/route.validation";
import type { Province } from "~/validations/pre-built/province.validation";

const route = useRoute();
const router = useRouter();
const props = defineProps<{
  locationsFromTo: LocationsFromTo[];
}>();
const emit = defineEmits<{
  (
    e: "search",
    query: {
      from: string | null;
      to: string | null;
      date: string;
      ticket: string;
    },
  ): void;
}>();

/* ========================
   STATE
======================== */
const provinceFrom = ref<Province | null>(null);
const provinceTo = ref<Province | null>(null);
const openType = ref<"from" | "to" | null>(null);

/* ========================
   COMPUTED LISTS
======================== */
const locationsFrom = computed(() => {
  return props.locationsFromTo
    .filter(
      (l) =>
        !provinceTo.value ||
        l.provincesTo.some((pt) => pt.name === provinceTo.value?.name),
    )
    .map((l) => l.provinceFrom);
});

const locationsTo = computed(() => {
  return props.locationsFromTo
    .filter(
      (l) =>
        !provinceFrom.value || l.provinceFrom.name === provinceFrom.value?.name,
    )
    .flatMap((l) => l.provincesTo);
});

/* ========================
   UI HANDLERS
======================== */
const openFrom = () => (openType.value = "from");
const openTo = () => (openType.value = "to");
const closeAll = () => (openType.value = null);

/* ========================
   SELECT HANDLERS
======================== */
const selectProvinceFrom = (province: Province | null) => {
  provinceFrom.value = province;
  provinceTo.value = null; // reset TO khi đổi FROM

  closeAll();
};

const selectProvinceTo = (province: Province | null) => {
  provinceTo.value = province;
  closeAll();
};

/* ========================
   SYNC QUERY → FORM
======================== */
const syncFormFromQuery = () => {
  const { from, to } = route.query;
  // FROM
  if (from) {
    const foundFrom = props.locationsFromTo.find(
      (l) => l.provinceFrom.name === from,
    )?.provinceFrom;

    provinceFrom.value = foundFrom || null;
  } else {
    provinceFrom.value = null;
  }

  // TO (chỉ hợp lệ theo FROM)
  if (to && provinceFrom.value) {
    const foundTo = props.locationsFromTo
      .filter((l) => l.provinceFrom.name === provinceFrom.value!.name)
      .flatMap((l) => l.provincesTo)
      .find((p) => p.name === to);

    provinceTo.value = foundTo || null;
  } else {
    provinceTo.value = null;
  }

  // OPTIONAL: Nếu chỉ có TO mà không có FROM
  if (!from && to) {
    const foundPair = props.locationsFromTo.find((l) =>
      l.provincesTo.some((p) => p.name === to),
    );
    if (foundPair) {
      provinceFrom.value = foundPair.provinceFrom;
      provinceTo.value = foundPair.provincesTo.find((p) => p.name === to)!;
    }
  }
};

/* ========================
   LIFECYCLE
======================== */
onMounted(() => {
  syncFormFromQuery();
});
watch(
  () => route.query,
  () => {
    syncFormFromQuery();
  },
);

/* ========================
   Handle Date
======================== */
const travelDate = ref<Date>(new Date());
onMounted(() => {
  if (route.query.date) {
    const [day, month, year] = (route.query.date as string).split("-");
    travelDate.value = new Date(+year!, +month! - 1, +day!);
  }
});

const onDateChange = (date: Date) => {
  travelDate.value = date;
};

// Handle ticket
const ticketCount = ref<number>(+(route.query?.ticket || 1));

const onSubmit = () => {
  // set query
  const query = {
    from: provinceFrom.value?.name || null,
    to: provinceTo.value?.name || null,
    date: format(travelDate.value, "dd-MM-yyyy"),
    ticket: `${ticketCount.value}`,
  };

  router.replace({ query });

  emit("search", query);
};
</script>
<template>
  <section class="relative z-40 mx-auto -mt-40 max-w-7xl px-4 md:mt-6">
    <div class="rounded-2xl border border-green-300 bg-white p-6 shadow-sm">
      <!-- TOP OPTIONS -->
      <div class="mb-6 flex items-center justify-between">
        <!-- Trip type -->
        <div class="flex items-center gap-6 text-sm">
          <label class="flex cursor-pointer items-center gap-2 text-green-600">
            <input type="radio" checked class="accent-green-500" >
            Một chiều
          </label>

          <label class="hidden cursor-pointer items-center gap-2 text-gray-600">
            <input type="radio" class="accent-green-500" >
            Khứ hồi
          </label>
        </div>

        <!-- Guide -->
        <button class="hidden text-sm text-green-500 hover:underline">
          Hướng dẫn mua vé
        </button>
      </div>

      <!-- MAIN FORM -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <!-- Wrapper 2 input -->
        <div class="relative col-span-2 grid grid-cols-2 gap-4">
          <!-- Điểm đi -->
          <LocationSelect
            label="Điểm đi"
            placeholder="Chọn điểm đi"
            :open="openType === 'from'"
            :provinces="locationsFrom || []"
            :model-value="provinceFrom"
            @open="openFrom"
            @close="closeAll"
            @select="selectProvinceFrom"
          />

          <LocationSelect
            label="Điểm đến"
            placeholder="Chọn điểm đến"
            :open="openType === 'to'"
            :provinces="locationsTo || []"
            :model-value="provinceTo"
            :disabled="!provinceFrom"
            @open="openTo"
            @close="closeAll"
            @select="selectProvinceTo"
          />

          <!-- Swap button -->
          <button
            type="button"
            class="group absolute left-1/2 top-1/2 z-20 mt-2 -translate-x-1/2 -translate-y-1/2"
          >
            <img
              src="https://futabus.vn/images/icons/switch_location.svg"
              alt="Swap"
              class="transition-all duration-300 ease-in-out group-hover:rotate-180 group-hover:scale-110"
            >
          </button>
        </div>

        <!-- Ngày đi -->
        <DateSelect
          v-if="travelDate"
          :value="travelDate"
          @change="onDateChange"
        />

        <!-- Số vé -->
        <div>
          <label class="mb-1 block text-sm font-medium">Số vé</label>
          <select
            v-model="ticketCount"
            class="w-full rounded-lg border px-4 py-[18px] outline-none focus:border-green-500"
          >
            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
      </div>

      <!-- RECENT SEARCH -->
      <div class="mt-6 hidden">
        <p class="mb-3 text-sm font-medium">Tìm kiếm gần đây</p>

        <div class="flex flex-wrap gap-4">
          <RecentItem title="Đắk Lắk - Đà Nẵng" date="22/01/2026" />
          <RecentItem title="Hà Nội - TP. Hồ Chí Minh" date="09/01/2026" />
          <RecentItem title="An Giang - Bà Rịa - Vũng Tàu" date="08/01/2026" />
        </div>
      </div>

      <!-- SEARCH BUTTON -->
      <div class="mt-8 flex justify-center">
        <button
          class="rounded-full bg-green-500 px-12 py-3 font-semibold text-white hover:bg-green-600"
          @click="onSubmit"
        >
          Tìm chuyến xe
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="css" scoped>
.swap-rotate {
  transition: transform 0.3s;
}
.swap-rotate:active {
  transform: rotate(180deg);
}
</style>
