<script lang="ts" setup>
import { useUserStore } from "~/stores/pre-built/user.store";

const userStore = useUserStore();
const authStore = useAuthStore();

const logout = async () => {
  await authStore.logout();
};

const me = computed(() => userStore.selected);
</script>

<template>
  <header class="flex items-center justify-between border-b bg-white px-6 py-3">
    <!-- Search -->
    <input
      placeholder="Search... (Ctrl + K)"
      class="w-80 rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
    >

    <!-- Right actions -->
    <div class="flex items-center gap-4">
      <DropdownMenu>
        <!-- ❌ KHÔNG as-child -->
        <DropdownMenuTrigger
          class="flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2 hover:bg-gray-100"
        >
          <!-- Avatar -->
          <img
            v-if="me?.avatar"
            :src="me.avatar"
            class="h-7 w-7 rounded-full object-cover"
          >
          <div
            v-else
            class="flex h-7 w-7 items-center justify-center rounded-full bg-primarySoft text-xs font-semibold text-primary"
          >
            {{ me?.fullName?.charAt(0) || "U" }}
          </div>

          <!-- Name -->
          <span class="hidden text-sm font-medium md:block">
            {{ me?.fullName || "Admin" }}
          </span>

          <Icon name="lucide:chevron-down" class="h-4 w-4 text-gray-400" />
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent
            align="end"
            :side-offset="8"
            :avoid-collisions="false"
            class="absolute right-0 top-0 z-50 w-56"
          >
            <DropdownMenuLabel class="px-2 py-1.5">
              <p class="text-sm font-medium">
                {{ me?.fullName || "Admin" }}
              </p>
              <p class="text-muted-foreground text-xs">
                {{ me?.email }}
              </p>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem class="cursor-pointer">
              <Icon name="lucide:user" class="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              class="cursor-pointer text-red-600 focus:text-red-600"
              @click="logout"
            >
              <Icon name="lucide:log-out" class="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  </header>
</template>
