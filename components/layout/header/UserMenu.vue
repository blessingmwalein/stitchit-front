<template>
  <div class="relative" ref="dropdownRef" v-if="!isLoading">
    <button class="flex items-center text-gray-700 dark:text-gray-400" @click.prevent="toggleDropdown">
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11">
        <img :src="userProfile?.profilePicture || '/images/user/owner.jpg'" alt="User" />
      </span>
  
      <span class="block mr-1 font-medium text-theme-sm">
        {{ userProfile?.name || "Guest" }}
      </span>
  
      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>
  
    <!-- Dropdown Start -->
    <div v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] z-[99999] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark">
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ userProfile?.name || "Guest User" }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ userProfile?.email || "No email provided" }}
        </span>
      </div>
  
      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
            <component :is="item.icon" class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
  
      <router-link to="/auth/admin/signin" @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
        <LogoutIcon class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
        Sign out
      </router-link>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup lang="ts">
import { UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, InfoCircleIcon } from '@/icons'
import { RouterLink } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from "~/store/auth";

// Store & State
const authStore = useAuthStore();

const isLoading = computed(() => authStore.isLoading);
const userProfile = computed(() => authStore.user); // Reactive user data

// Dropdown
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

const menuItems = [
  { href: '/admin/profile', icon: UserCircleIcon, text: 'Edit profile' },
  // { href: '/chat', icon: SettingsIcon, text: 'Account settings' },
  // { href: '/profile', icon: InfoCircleIcon, text: 'Support' },
];

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const closeDropdown = () => {
  dropdownOpen.value = false;
};

const signOut = async () => {
  await authStore.logout();
  closeDropdown();
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown();
  }
};

onMounted(async () => {
  document.addEventListener('click', handleClickOutside);

  if (!authStore.user && authStore.token) {
    await authStore.fetchUser(); // Fetch only if user is not loaded
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
