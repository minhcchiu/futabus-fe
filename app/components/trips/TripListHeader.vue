<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Armchair, Clock, Zap } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps<{
  from?: string | null;
  to?: string | null;
  dateLabel: string; // ví dụ: "30/02/2026"
  total: number;
}>();

const title = computed(() => {
  if (!props.from && !props.to) {
    return `Các chuyến xe hôm nay · ${props.dateLabel}`;
  }

  if (props.from && !props.to) {
    return `Từ ${props.from} · ${props.dateLabel}`;
  }

  return `${props.from} → ${props.to} · ${props.dateLabel}`;
});
</script>

<template>
  <div
    class="sticky top-0 z-30 space-y-2 rounded-xl border-b bg-white px-4 py-3"
  >
    <!-- Title -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">
        {{ title }}
        <span v-if="from && to" class="text-muted-foreground">
          ({{ total }})
        </span>
      </h2>
    </div>

    <!-- Filter chips -->
    <div class="hidden flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        class="rounded-full border-green-500 text-green-500 hover:bg-green-50"
      >
        <Zap class="mr-1 h-4 w-4" />
        Giá rẻ
      </Button>

      <Button size="sm" variant="outline" class="rounded-full">
        <Clock class="mr-1 h-4 w-4" />
        Giờ chạy
      </Button>

      <Button size="sm" variant="outline" class="rounded-full">
        <Armchair class="mr-1 h-4 w-4" />
        Ghế trống
      </Button>
    </div>
  </div>
</template>
