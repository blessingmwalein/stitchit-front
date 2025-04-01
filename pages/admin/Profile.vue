<template>
    <admin-layout>
        <PageBreadcrumb :pageTitle="currentPageTitle" />

        <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <!-- <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Profile</h3> -->
            <profile-card />
            <personal-info-card />
            <!-- <address-card /> -->
        </div>
    </admin-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import PersonalInfoCard from '@/components/profile/PersonalInfoCard.vue'
import AddressCard from '@/components/profile/AddressCard.vue'

import { useAuthStore } from "~/store/auth";

// Store & State
const authStore = useAuthStore();
const isMounted = ref(false) // Track if component has mounted

const isLoading = computed(() => authStore.isLoading);
const userProfile = computed(() => authStore.user);

onMounted(() => {
    isMounted.value = true // Set to true once component is mounted
})

definePageMeta({
    middleware: [
        function (to, from) {
            // Custom inline middleware
        },
        'auth',
    ],
});

const currentPageTitle = ref('User Profile')

onMounted(async () => {
    if (!authStore.user && authStore.token) {
        await authStore.fetchUser(); // Fetch only if user is not loaded
    }
});
</script>