<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Trips</h1>
      <button
        class="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-600"
      >
        + Create Trip
      </button>
    </div>

    <div class="rounded-lg bg-white p-4 shadow-sm">
      <table class="w-full text-sm">
        <thead class="text-left text-gray-500">
          <tr>
            <th class="p-2">Code</th>
            <th class="p-2">Route</th>
            <th class="p-2">Vehicle</th>
            <th class="p-2">Time</th>
            <th class="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-t hover:bg-bg">
            <td class="p-2">TRIP001</td>
            <td class="p-2">Hà Nội → Đà Nẵng</td>
            <td class="p-2">51A-12345</td>
            <td class="p-2">08:00</td>
            <td class="p-2">
              <span
                class="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"
                >Open</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
