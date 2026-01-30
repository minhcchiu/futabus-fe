<script setup lang="ts">
import {
  fromDate,
  getLocalTimeZone,
  type DateValue,
} from "@internationalized/date";
import { computed, ref } from "vue";

/* props: nhận Date thường */
const props = defineProps<{
  value?: Date;
}>();

const emit = defineEmits<{
  (e: "change", value: Date): void;
}>();

const isOpen = ref(false);

/* convert Date -> DateValue */
const toDateValue = (d: Date) => fromDate(d, getLocalTimeZone()) as DateValue;
/* state nội bộ */
const selectedDate = ref<DateValue>(toDateValue(new Date())) as Ref<DateValue>;
watch(
  () => props.value,
  () => {
    selectedDate.value = props.value
      ? toDateValue(props.value)
      : toDateValue(new Date());
  },
);

const formattedDate = computed(() => {
  const d = selectedDate.value;
  return `${d.day.toString().padStart(2, "0")}/${d.month
    .toString()
    .padStart(2, "0")}/${d.year}`;
});

const dayOfWeek = computed(() => {
  const d = selectedDate.value.toDate("vi-VN");
  if (d.getDay() === 0) return "Chủ Nhật";
  return `Thứ ${d.getDay() + 1}`;
});

const onChangeDate = (v: any) => {
  emit("change", new Date(v.year, v.month - 1, v.day));
};
</script>
<template>
  <!-- Ngày đi -->
  <div>
    <label class="mb-1 block text-sm font-medium">Ngày đi</label>
    <Popover v-model:open="isOpen">
      <PopoverTrigger as-child>
        <div
          class="cursor-pointer rounded-lg border px-4 py-2.5 transition-colors hover:bg-gray-50"
        >
          <div class="font-semibold">{{ formattedDate }}</div>
          <div class="text-xs text-gray-500">{{ dayOfWeek }}</div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        class="w-auto rounded-lg bg-white p-0 shadow-lg"
        side="bottom"
        align="start"
      >
        <Calendar
          v-model="selectedDate"
          class="p-3"
          layout="grid"
          :min-date="fromDate(new Date(), getLocalTimeZone())"
          locale="vi-VN"
          :first-day-of-week="1"
          @update:model-value="onChangeDate"
        >
          <template #header="{ month, year, previousMonth, nextMonth }">
            <div class="flex items-center justify-between px-2 py-1">
              <span class="text-sm font-medium uppercase"
                >THÁNG {{ month + 1 }}/{{ year }}</span
              >
              <div class="flex space-x-2">
                <Button variant="ghost" size="icon" @click="previousMonth"
                  >&lt;</Button
                >
                <Button variant="ghost" size="icon" @click="nextMonth"
                  >&gt;</Button
                >
              </div>
            </div>
          </template>
          <template #day="{ date }">
            <div class="text-center">
              <div>{{ date.getDate() }}</div>
            </div>
          </template>
        </Calendar>
      </PopoverContent>
    </Popover>
  </div>
</template>

<style lang="css" scoped>
/* Customize selected date background to orange */
.calendar .selected {
  @apply rounded-full bg-green-100 text-green-900;
}
</style>
