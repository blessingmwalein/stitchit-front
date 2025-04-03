<template>
  <Modal v-if="isViewOrderModal" @close="closeModal()">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="text-start flex-grow">
          <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Order #{{ order?.id }} - {{ order?.client_name }}
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Status: {{ order?.status }}
          </p>
        </div>
        <div class="flex gap-3 mr-3">
          <CustomButton @click="editOrder()" type="submit" label="Edit Order" variant="brand" rounded="full"
            :isLoading="false" :disabled="false" class="w-full" />
        </div>
        <button @click="closeModal()"
          class="transition-color flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
          <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
              fill="" />
          </svg>
        </button>
      </div>
    </template>
    <template #body>
      <div class="no-scrollbar relative w-full overflow-y-auto bg-white dark:bg-gray-900">
        <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Client Information
          </h4>
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Client Email</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ order?.email }}</p>
            </div>
            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Total Price</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">${{ order?.total_price }}</p>
            </div>
            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Unit</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ order?.unit }}</p>
            </div>
            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Delivery Date</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ order?.delivery_date ?? 'N/A' }}</p>
            </div>
            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Description</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ order?.description }}</p>
            </div>
            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Colors</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ order?.color_palet.join(', ') }}</p>
            </div>
            <div>
              <img :src="order?.image_url" alt="Order Image" class="w-full rounded-lg" />
            </div>
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
import type { Order } from '~/utils/models/order';

const emit = defineEmits(['update:isViewOrderModal', 'edit']);

const props = defineProps({
  isViewOrderModal: {
    type: Boolean,
    required: true,
  },
  order: {
    type: Object as () => Order | null,
    required: true,
  },
});

const closeModal = () => {
  emit('update:isViewOrderModal', false);
};

const editOrder = () => {
  emit('edit');
};
</script>
