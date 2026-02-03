<script lang="ts" setup>
import { useUserStore } from "~/stores/pre-built/user.store";

const settingStore = useSettingStore();
const userStore = useUserStore();

const setting = computed(() => settingStore.selected);
const me = computed(() => userStore.selected);

onMounted(async () => {
  await settingStore.fetchOne();
  await userStore.fetchMe();
});
</script>
<template>
  <aside class="flex w-64 flex-col border-r bg-white px-4 pb-6 pt-2">
    <div class="text-xl font-bold text-primary">
      <img :src="setting?.logo" alt="" class="h-16 object-contain" >
    </div>

    <nav class="flex-1 space-y-2">
      <SidebarItem label="Dashboard" href="/admin" />
      <SidebarItem label="Nhà Xe" href="/admin/bus-companies" />
      <SidebarItem label="Xe" href="/admin/vehicles" />
      <SidebarItem label="Điểm dừng (đón/trả)" href="/admin/stop-locations" />
      <SidebarItem label="Tuyến đường" href="/admin/routes" />
      <SidebarItem label="Chuyến xe" href="/admin/trips" />
      <SidebarItem label="Bookings" badge="12" href="/admin/bookings" />
      <SidebarItem label="Sepay" href="/admin/sepay" />
      <SidebarItem label="Cài đặt" href="/admin/settings" />
    </nav>

    <div class="mt-auto text-sm text-gray-500">
      {{ me?.fullName }}<br >
      {{ me?.email }}
    </div>
  </aside>
</template>
