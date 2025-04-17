<template>
    <Modal v-if="isViewProductionModal" @close="closeModal()" width="max-w-6xl">
        <!-- Header -->
        <template #header>
            <div class="flex items-center justify-between w-full">
                <div class="text-start flex-grow">
                    <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        WorkInProgress #{{ workInProgress?.production_number }} - {{ workInProgress.order?.client_name }}
                    </h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
    
                        <ProductionStatusBadge :status="workInProgress?.status" />
                    </p>
                </div>
                <div class="flex gap-3 mr-3 w-1/4">
    
                </div>
                <button @click="closeModal()"
                    class="transition-color flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
                    <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" />
                    </svg>
                </button>
            </div>
        </template>
    
        <!-- Body -->
        <template #body>
            <div class="no-scrollbar relative w-full overflow-y-auto bg-white dark:bg-gray-900">
                <!-- Image Section (no border if it's just the image) -->
                <!-- <div v-if="workInProgress?.image_url" class="mb-6 flex justify-center">
                                                              <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 max-w-full"
                                                                style="max-height: 400px; max-width: 100%;">
                                                                <img :src="`${config.public.imageUrl}${workInProgress.image_url}`" alt="WorkInProgress Image"
                                                                  class="w-full h-auto object-cover max-h-[400px] rounded-2xl" />
                                                              </div>
                                                            </div>
                                                       -->
    
                <!-- Client Information -->
                <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 relative">
                    <!-- View Profile Button -->
                    <button
                        class="absolute top-4 right-4 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" width="20" height="20">
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
    
    
                <!-- Rug Information -->
                <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
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
    
                <!-- WorkInProgress Details -->
                <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                    <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Order Details</h4>
    
                    <div class="flex flex-col lg:flex-row gap-6 items-start">
    
                        <!-- Image -->
                        <div
                            class="flex-shrink-0 w-full lg:w-1/6 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 max-h-[250px]">
                            <img v-if="workInProgress.order?.image_url"
                                :src="`${config.public.imageUrl}${workInProgress.order.image_url}`"
                                alt="WorkInProgress Image" class="w-full h-full object-cover rounded-2xl" />
                        </div>
    
                        <!-- Info Fields -->
                        <div class="w-full lg:w-2/3 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-12">
                            <InfoField label="Total Price" :value="formatCurrency(workInProgress.order?.total_price)" />
                            <InfoField label="Unit" :value="workInProgress.order?.unit" />
                            <InfoField label="Length"
                                :value="`${workInProgress.order?.length}${workInProgress.order?.unit}`" />
                            <InfoField label="Width"
                                :value="`${workInProgress.order?.width}${workInProgress.order?.unit}`" />
                            <InfoField label="Shape" :value="workInProgress.order?.shape" />
                            <!-- <InfoField label="Description" :value="workInProgress?.description" /> -->
                            <div class="mt-2  dark:border-gray-800 lg:p-6">
                        <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Color Palette</h4>
                        <ColorPalertView :colors="workInProgress.order?.color_palet" />
                    </div>
                        </div>
                    </div>
    
                    
    
                </div>
    
    
                <!-- Color Palette -->
    
                <!-- Dates -->
                <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                    <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Production Details</h4>
                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-12">
    
                        <InfoField label="Delivery Date"
                            :value="formatDateString(workInProgress.order?.delivery_date) ?? 'N/A'" />
                        <InfoField label="Start Date" :value="formatDateString(workInProgress?.start_date)" />
    
    
                        <InfoField label="Finishing Date" :value="formatDateString(workInProgress?.approx_end_date)" />
                        <InfoField label="Production Cost"
                            :value="formatCurrency(workInProgress?.approx_production_cost)" />
                    </div>
                </div>
    
            </div>
        </template>
    </Modal>
</template>
  <script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import Modal from '@/components/profile/Modal.vue';
import CustomButton from "@/components/common/buttons/CustomButton.vue";
import { useRuntimeConfig } from "#app";
import ProductionStatusBadge from '../ProductionStatusBadge.vue';
import { useDateFormat } from '~/composables/useDateFomat';
import ArrrowUTurnIcon from '~/icons/ArrrowUTurnIcon.vue';
import PencilIcon from '~/icons/PencilIcon.vue';
import type { WorkInProgress } from '~/utils/models/production';
import InfoField from '~/components/orders/InfoField.vue';
import ColorPalertView from '~/components/orders/ColorPalertView.vue';
const { formatCurrency } = useCurrency();
const {  formatDateString } = useDateFormat();

const config = useRuntimeConfig();

const emit = defineEmits(['update:isViewProductionModal']);

const props = defineProps({
  isViewProductionModal: {
    type: Boolean,
    required: true,
  },
  workInProgress: {
    type: Object as () => WorkInProgress | null,
    required: true,
  },
});

const closeModal = () => {
  emit('update:isViewProductionModal', false);
};




  </script>
  
  
  <style scoped>
.image-container {
    width: 100%;
    /* Full width */
    max-width: 100%;
    /* Limit max width */
    height: 200px;
    /* Set a fixed height */
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    background-color: #f9f9f9;
    margin-bottom: 20px;
}

.image-preview {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    /* Ensures the whole image fits inside */
}
</style>
  