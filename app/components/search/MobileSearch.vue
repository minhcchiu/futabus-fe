<script setup lang="ts">
import { format } from "date-fns";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { LocationsFromTo } from "~/validations/admin/route.validation";
import type { Province } from "~/validations/pre-built/province.validation";

const route = useRoute();
const router = useRouter();
const emit = defineEmits(["search"]);

const props = defineProps<{
  locationsFromTo: LocationsFromTo[];
}>();

/* ========================
   STATE
======================== */
const provinceFrom = ref<Province | null>(null);
const provinceTo = ref<Province | null>(null);
const openType = ref<"from" | "to" | null>(null);

/* ========================
   COMPUTED LISTS (GIỐNG DESKTOP)
======================== */
const locationsFrom = computed(() =>
  props.locationsFromTo
    .filter(
      (l) =>
        !provinceTo.value ||
        l.provincesTo.some((p) => p.name === provinceTo.value?.name),
    )
    .map((l) => l.provinceFrom),
);

const locationsTo = computed(() =>
  props.locationsFromTo
    .filter(
      (l) =>
        !provinceFrom.value || l.provinceFrom.name === provinceFrom.value?.name,
    )
    .flatMap((l) => l.provincesTo),
);

/* ========================
   UI HANDLERS
======================== */
const openFrom = () => (openType.value = "from");
const openTo = () => (openType.value = "to");
const closeAll = () => (openType.value = null);

/* ========================
   SELECT HANDLERS
======================== */
const selectProvinceFrom = (p: Province | null) => {
  provinceFrom.value = p;
  provinceTo.value = null;
  closeAll();
};

const selectProvinceTo = (p: Province | null) => {
  provinceTo.value = p;
  closeAll();
};

/* ========================
   DATE + TICKET
======================== */
const travelDate = ref<Date>(new Date());
const ticketCount = ref<number>(1);

/* ========================
   SYNC QUERY → FORM
======================== */
const syncFromQuery = () => {
  const { from, to, date, ticket } = route.query;

  provinceFrom.value =
    props.locationsFromTo.find((l) => l.provinceFrom.name === from)
      ?.provinceFrom || null;

  if (provinceFrom.value && to) {
    provinceTo.value =
      props.locationsFromTo
        .filter((l) => l.provinceFrom.name === provinceFrom.value!.name)
        .flatMap((l) => l.provincesTo)
        .find((p) => p.name === to) || null;
  }

  if (date) {
    const [d, m, y] = (date as string).split("-");
    travelDate.value = new Date(+y!, +m! - 1, +d!);
  }

  ticketCount.value = +(ticket || 1);
};

onMounted(syncFromQuery);
watch(() => route.query, syncFromQuery);

/* ========================
   SUBMIT
======================== */
const onSubmit = () => {
  router.replace({
    query: {
      from: provinceFrom.value?.name || null,
      to: provinceTo.value?.name || null,
      date: format(travelDate.value, "dd-MM-yyyy"),
      ticket: `${ticketCount.value}`,
    },
  });

  emit("search", {
    from: provinceFrom.value?.name || null,
    to: provinceTo.value?.name || null,
    date: format(travelDate.value, "dd-MM-yyyy"),
    ticket: `${ticketCount.value}`,
  });
};
</script>

<template>
  <!-- MOBILE ONLY -->
  <section class="relative z-50 mx-auto -mt-40 px-4 md:hidden">
    <div class="rounded-2xl border border-green-300 bg-white p-4 shadow-xl">
      <!-- Trip type -->
      <div class="mb-4 flex items-center gap-6 text-sm">
        <label class="flex items-center gap-2 text-green-600">
          <input type="radio" checked class="accent-green-500" />
          Một chiều
        </label>
      </div>

      <!-- FROM / TO -->
      <div class="relative space-y-4">
        <LocationSelect
          label="Điểm đi"
          placeholder="Chọn điểm đi"
          :open="openType === 'from'"
          :provinces="locationsFrom"
          :model-value="provinceFrom"
          @open="openFrom"
          @close="closeAll"
          @select="selectProvinceFrom"
        />

        <LocationSelect
          label="Điểm đến"
          placeholder="Chọn điểm đến"
          :open="openType === 'to'"
          :provinces="locationsTo"
          :model-value="provinceTo"
          :disabled="!provinceFrom"
          @open="openTo"
          @close="closeAll"
          @select="selectProvinceTo"
        />

        <!-- Swap -->
        <button
          type="button"
          class="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
          @click="
            () => {
              const t = provinceFrom;
              provinceFrom = provinceTo;
              provinceTo = t;
              closeAll();
            }
          "
        >
          <img
            src="https://futabus.vn/images/icons/switch_location.svg"
            class="h-6 w-6"
          />
        </button>
      </div>

      <!-- DATE + TICKET -->
      <div class="mt-4 grid grid-cols-2 gap-3">
        <DateSelect
          v-if="travelDate"
          :value="travelDate"
          @change="(d) => (travelDate = d)"
        />

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

      <!-- SEARCH -->
      <div class="mt-6">
        <button
          class="w-full rounded-full bg-green-500 py-3 font-semibold text-white active:scale-95"
          @click="onSubmit"
        >
          Tìm chuyến xe
        </button>
      </div>
    </div>
  </section>
</template>
