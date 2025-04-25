<template>
  <Modal v-if="isStartProductionFormModal" @close="closeModal()">
    <template #header>
      <button @click="closeModal()"
        class="absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700">
        <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
            fill="" />
        </svg>
      </button>
      <div class="px-2 pr-14">
        <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Production Setup – Order #{{ order.id }}
        </h4>
  
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Fill out the details below to initiate the rug production process for this order.
        </p>
  
        <!-- Client Info in Column View -->
        <div class="flex items-center">
          <!-- Using the InitialAvatar component -->
          <InitialAvatar :name="order?.client_name" />
  
          <div class="ml-3">
            <div class="font-semibold text-sm">{{ order?.client_name }}</div>
            <!-- Address with reduced font size and faint color -->
            <div class="flex items-center space-x-2 text-xs text-gray-400">
  
              <EmailAtIcon :height="15" :width="15" />
  
              {{ order?.email }}
  
            </div>
          </div>
        </div>
  
  
      </div>
  
  
  
    </template>
    <template #body>
      <div class="no-scrollbar relative w-full overflow-y-auto bg-white dark:bg-gray-900">
        <!-- Image Upload Section -->
        <Alert v-if="orderStore.errorMessage" variant="error" title="Something went wrong"
          :message="orderStore.errorMessage ?? ''" :showLink="false" />
        <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Order Details</h4>
  
          <div class="flex flex-col lg:flex-row gap-6 items-start">
  
            <!-- Image -->
            <div
              class="flex-shrink-0 max-w-[150px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 max-h-[150px]">
              <img v-if="order?.image_url" :src="`${config.public.imageUrl}${order.image_url}`" alt="Order Image"
                class="w-full h-full object-cover rounded-2xl" />
            </div>
  
            <!-- Info Fields -->
            <div class="w-full lg:w-2/3 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-12">
              <InfoField label="Total Price" :value="formatCurrency(order?.total_price)" />
              <InfoField label="Unit" :value="order?.unit" />
              <InfoField label="Length" :value="`${order?.length}m`" />
              <InfoField label="Width" :value="`${order?.width}m`" />
              <InfoField label="Shape" :value="order?.shape" />
              <InfoField label="Description" :value="order?.description" />
  
            </div>
  
          </div>
          <div class=" mb-6  dark:border-gray-800 mt-4">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90">Color Palette</h4>
            <ColorPalertView :colors="order?.color_palet" />
          </div>
        </div>
  
  
        <client-only>
          <Vueform @submit="handleSubmit" v-model="startProductionForm" :show-errors="false" :display-errors="false"
            :endpoint="false" sync>
            <DateElement name="start_date" label="Start Date" :rules="['required']" :columns="{ container: 6 }" />
            <DateElement name="approx_end_date" label="Finishing Date" :rules="['required']"
              :columns="{ container: 6 }" />
  
            <TextElement name="approx_production_cost" input-type="number" label="Production Cost" :rules="['required']"
              :columns="{ container: 12 }" />
  
  
            <StaticElement name="span" :columns="{ container: 4 }" tag="span" />
            <ButtonElement name="close" button-class="bg-red-500" :columns="{ container: 4 }" @click="closeModal()"
              button-label="Close" :full="true" size="lg" />
            <ButtonElement button-class="bg-brand-500" name="register" :columns="{ container: 4 }" :submits="true"
              button-label="Submit" :full="true" size="lg" />
          </Vueform>
        </client-only>
      </div>
    </template>
  </Modal>
</template>
  
  <script setup lang="ts">
import { ref, computed, defineProps, defineEmits, onMounted, watch } from 'vue';
import Modal from '@/components/profile/Modal.vue';
import { useRugStore } from '~/store/rugs';
import { useClientsStore } from '~/store/client';
import { useOrderStore } from '~/store/orders';
import { colorsData, shapesData, unitsData } from '~/utils/data/colors';
import Alert from '~/components/ui/Alert.vue';
import { useRuntimeConfig } from "#app";
import InfoField from '../InfoField.vue';
import ColorPalertView from '../ColorPalertView.vue';

import InitialAvatar from '@/components/common/InitialAvatar.vue'

import { EmailAtIcon } from '~/icons';

const config = useRuntimeConfig();
const { formatCurrency } = useCurrency();
const { formatDate, formatDateString } = useDateFormat();

const emit = defineEmits(['update:isStartProductionFormModal', 'success']);
const rugsStore = useRugStore();
const clientStore = useClientsStore();
const orderStore = useOrderStore();
const snackbar = useSnackbar();

const imageSrc = ref(null);

const props = defineProps({
  isStartProductionFormModal: {
    type: Boolean,
    required: true,
  },
  order: {
    type: Object,
    required: true,
  },
});

const startProductionForm = computed({
  get: () => orderStore.startProductionForm,
  set: (data) => orderStore.startProductionForm = data
});

const closeModal = () => {

  //clear form data
  // orderStore.setSelectedOrder(null);
  orderStore.resetStartProductionForm();
  emit('update:isStartProductionFormModal', false);
};

onMounted(async () => {

});

//computed image src

const handleSubmit = async () => {
  try {
    await orderStore.startProduction();


    if (orderStore.errorMessage) {
      snackbar.add({ type: "error", text: orderStore.errorMessage });
      return;
    }

    if (orderStore.successMessage) {
      snackbar.add({
        type: "success",
        text: orderStore.successMessage,
      });
      orderStore.resetStartProductionForm();
      navigateTo("/admin/production");

    }

  } catch (error) {
    snackbar.add({ type: "error", text: orderStore.errorMessage ?? "" });
  }
};



  </script>
