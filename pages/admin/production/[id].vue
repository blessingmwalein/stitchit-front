<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="workInProgress?.production_number" />
  
    <div v-if="workInProgress.id"
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
  
      <!-- status and action buttons on the right -->
  
  
      <!--         <ProductionStatusBadge :status="workInProgress?.status" /> -->
      <div class="flex items-center justify-between mb-4">
        <!-- Optional Status Badge -->
        <ProductionStatusBadge :status="workInProgress?.status" />
  
        <!-- Action Buttons -->
        <div class="flex gap-2 ">
          <div v-for="nextStatus in getNextStatusOptions(workInProgress?.status)" :key="nextStatus">
            <CustomButton class="w-full" :label="`Change to ${nextStatus}`"
              @click="setNextStatus(nextStatus); showConfirmUpdateStatus = true" variant="brand" rounded="full">
  
              <template #prefix>
                <ArrrowUTurnIcon />
              </template>
            </CustomButton>
          </div>
          <!-- <CustomButton @click="" type="submit" label="Allocate Materials" variant="brand" rounded="full"
                                    :isLoading="false" :prefixIcon="true" :disabled="false" class="w-full">
                                    <template #prefix>
                                      <PlusIcon />
                                    </template>
                                  </CustomButton>
                          
                                  <CustomButton @click="" type="submit" label="Update Status" variant="warning" rounded="full" :isLoading="false"
                                    :prefixIcon="true" :disabled="false" class="w-full">
                                    <template #prefix>
                                      <ArrrowUTurnIcon />
                                    </template>
                                  </CustomButton> -->
  
        </div>
      </div>
      <Tabs value="0">
        <!-- Tab Headers -->
        <TabList>
          <Tab value="0">
            <span class="inline-flex items-center gap-2">
              <PendingIcon />
              Production Details
            </span>
          </Tab>
          <Tab value="1">
            <span class="inline-flex items-center gap-2">
              <ShopIcon />
              Order Details
            </span>
          </Tab>
          <Tab value="2">
            <span class="inline-flex items-center gap-2">
              <UsersIcon />
              Client Details
            </span>
          </Tab>
          <Tab value="3">
            <span class="inline-flex items-center gap-2">
              <ShopBag />
              Rug Details
            </span>
          </Tab>
          <Tab value="4">
            <span class="inline-flex items-center gap-2">
              <BoxCubeIcon />
              Raw Materials
            </span>
          </Tab>
        </TabList>
  
        <!-- Tab Panels -->
        <TabPanels>
  
          <!-- Production Details -->
          <TabPanel value="0">
            <div class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Production Details</h4>
              <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-12">
                <InfoField label="Delivery Date"
                  :value="formatDateString(workInProgress.order?.delivery_date) ?? 'N/A'" />
                <InfoField label="Start Date" :value="formatDateString(workInProgress?.start_date)" />
                <InfoField label="Finishing Date" :value="formatDateString(workInProgress?.approx_end_date)" />
                <InfoField label="Production Cost" :value="formatCurrency(workInProgress?.approx_production_cost)" />
              </div>
            </div>
          </TabPanel>
  
          <!-- Order Details -->
          <TabPanel value="1">
            <div class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Order Details</h4>
              <div class="flex flex-col lg:flex-row gap-6 items-start">
                <div
                  class="flex-shrink-0 w-full lg:w-1/6 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 max-h-[250px]">
                  <img v-if="workInProgress.order?.image_url"
                    :src="`${config.public.imageUrl}${workInProgress.order.image_url}`" alt="WorkInProgress Image"
                    class="w-full h-full object-cover rounded-2xl" />
                </div>
                <div class="w-full lg:w-2/3 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-12">
                  <InfoField label="Total Price" :value="formatCurrency(workInProgress.order?.total_price)" />
                  <InfoField label="Unit" :value="workInProgress.order?.unit" />
                  <InfoField label="Length" :value="`${workInProgress.order?.length}${workInProgress.order?.unit}`" />
                  <InfoField label="Width" :value="`${workInProgress.order?.width}${workInProgress.order?.unit}`" />
                  <InfoField label="Shape" :value="workInProgress.order?.shape" />
                </div>
              </div>
              <div class="mt-6">
                <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Color Palette</h4>
                <ColorPalertView :colors="workInProgress.order?.color_palet" />
              </div>
            </div>
          </TabPanel>
  
          <!-- Client Details -->
          <TabPanel value="2">
            <div class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 relative">
              <button
                class="absolute top-4 right-4 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"
                  stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>
  
              <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Client Information</h4>
              <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-12">
                <InfoField label="Client Name" :value="workInProgress.order?.client_name" />
                <InfoField label="Client Email" :value="workInProgress.order?.email" />
                <InfoField label="Client Phone" :value="workInProgress.order?.phone_number" />
              </div>
            </div>
          </TabPanel>
  
          <!-- Rug Details -->
          <TabPanel value="3">
            <div class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Rug Information</h4>
              <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-12">
                <InfoField label="Rug Name" :value="workInProgress.order?.rug?.name" />
                <InfoField label="Rug Type" :value="workInProgress.order?.rug?.type" />
                <InfoField label="Materials" :value="workInProgress.order?.rug?.materials" />
                <InfoField label="Approx Cost" :value="formatCurrency(workInProgress.order?.rug?.approx_cost)" />
                <InfoField label="Approx Production Cost"
                  :value="formatCurrency(workInProgress.order?.rug?.approx_production_cost)" />
              </div>
            </div>
          </TabPanel>
  
        </TabPanels>
      </Tabs>
    </div>
  
  
    <ConfirmModal :visible="showConfirmUpdateStatus" @update:visible="showConfirmUpdateStatus = $event"
      @confirmed="handleConfirmation">
      <template #header> Update Status </template>
      <template #body> Are you sure you want to update this production to {{updateWorkInProgressForm.status}}? </template>
    </ConfirmModal>
  </admin-layout>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import PersonalInfoCard from '@/components/profile/PersonalInfoCard.vue'
import AddressCard from '@/components/profile/AddressCard.vue'
import InfoField from '~/components/orders/InfoField.vue'
import ColorPalertView from '~/components/orders/ColorPalertView.vue'

import { useAuthStore } from "~/store/auth";
import { useProductionStore } from '~/store/production'
import PendingIcon from '~/icons/PendingIcon.vue'
import ShopIcon from '~/icons/ShopIcon.vue'
import UsersIcon from '~/icons/UsersIcon.vue'
import ShopBag from '~/icons/ShopBag.vue'
import BoxCubeIcon from '~/icons/BoxCubeIcon.vue'
import { ProductionStatusBadge } from '#components'
import CustomButton from '~/components/common/buttons/CustomButton.vue'
import PlusIcon from '~/icons/PlusIcon.vue'
import ArrrowUTurnIcon from '~/icons/ArrrowUTurnIcon.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import type { UpdateWorkInProgress } from '~/utils/models/production'


const { formatCurrency } = useCurrency();
const { formatDateString } = useDateFormat();

// Store & State
const authStore = useAuthStore();
const snackbar = useSnackbar();

const isMounted = ref(false) // Track if component has mounted

const isLoading = computed(() => authStore.isLoading);
const userProfile = computed(() => authStore.user);
const showConfirmUpdateStatus = ref(false)
const nextStatus = ref();


const config = useRuntimeConfig();
const updateWorkInProgressForm = computed({
  get: () => productionStore.updateWorkInProgressForm,
  set: (data: UpdateWorkInProgress) => productionStore.updateWorkInProgressForm = data
})


const workInProgress = computed(() => productionStore.selectedWorkInProgress)
const productionStore = useProductionStore();
const route = useRoute()
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

const getNextStatusOptions = (currentStatus: string) => {
  const transitions: any = {
    'In Progress': ['Tufting'],
    Tufting: ['Binding'],
    Binding: ['Done'],
  };
  return transitions[currentStatus] || [];
};

const currentPageTitle = ref('User Profile')

onMounted(async () => {
  // getSingleWorkInProgress
  const id = route.params.id
  if (id) {
    await productionStore.getSingleWorkInProgress(id)
  }
});



const setNextStatus = (status: string) => {

  productionStore.updateFormStatus(status);

}

const handleConfirmation = async (isConfirmed: boolean) => {
  if (isConfirmed) {
    try {
      await productionStore.updateProduction();


      if (productionStore.successMessage) {
        snackbar.add({
          type: "success",
          text: productionStore.successMessage,
        });// Emit success event
        // closeModal(); // Close the modal
      }
    } catch (error) {

    }
  } else {
    console.log("Action canceled.");
  }
};
</script>