<template>
  <aside class="flex w-64 flex-col border-r bg-white px-4 py-6">
    <div class="mb-6 text-xl font-bold text-primary">🚌 BusAdmin</div>

    <nav class="flex-1 space-y-2">
      <SidebarItem label="Dashboard" href="/admin" />
      <SidebarItem label="Nhà Xe" href="/admin/bus-companies" />
      <SidebarItem label="Xe" href="/admin/vehicles" />
      <SidebarItem label="Điểm dừng (đón/trả)" href="/admin/stop-locations" />
      <SidebarItem label="Tuyến đường" href="/admin/routes" />
      <SidebarItem label="Chuyến xe" href="/admin/trips" />
      <SidebarItem label="Bookings" badge="12" href="/admin/bookings" />
      <SidebarItem label="Cài đặt" href="/admin/settings" />
    </nav>

    <div class="mt-auto text-sm text-gray-500">
      Admin User<br />
      admin@bus.vn
    </div>
  </aside>
</template>
