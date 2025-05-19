<template>
  <Modal v-if="isViewProductModal" @close="closeModal()" width="max-w-7xl">
    <template #header>
      <button @click="closeModal()"
        class="absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700">
        <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" />
        </svg>
      </button>
      <div class="px-2 pr-14">
        <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {{ product?.name }}
        </h4>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">View product details.</p>
      </div>
    </template>

    <template #body>
      <div v-if="product" class="w-full bg-white dark:bg-gray-900 p-6">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- LEFT: IMAGE SLIDER -->
          <div class="md:w-1/2 w-full">
            <ProductImageSlider :images="product.images" />
          </div>

          <!-- RIGHT: PRODUCT INFO -->
          <div class="md:w-1/2 w-full flex flex-col justify-between">
            <div>
              <h1 class="text-2xl font-bold dark:text-white mb-2">{{ product.name }}</h1>
              <p class="text-gray-600 dark:text-gray-300 mb-4">{{ product.description }}</p>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-gray-700 dark:text-gray-200 mb-4">
                <InfoField label="Production Cost" :value="formatCurrency(product.actual_production_cost) ?? 'N/A'" />
                <InfoField label="Total Price" :value="formatCurrency(product.total_price) ?? 'N/A'" />
                <InfoField label="Size"
                  :value="`${product.length} x ${product.width} ${product.unit} (${product.shape})`" />
                <InfoField label="Available Units" :value="`${product.available_quantity} units`" />
                <InfoField label="Start Date" :value="formatDateString(product.start_date) ?? 'N/A'" />
                <InfoField label="End Date" :value="formatDateString(product.end_date) ?? 'N/A'" />
                <InfoField label="Created At" :value="formatDateString(product.created_at) ?? 'N/A'" />
                <InfoField label="Updated At" :value="formatDateString(product.updated_at) ?? 'N/A'" />
              </div>

              <!-- COLORS -->
              <div>
                <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">Rug Colors</h4>
                <ColorPalertView :colors="product?.order?.color_palet" />
              </div>
            </div>

            <!-- ACTION BUTTONS -->
            <div class="mt-6 flex gap-3">
              <CustomButton prefixIcon variant="primary" class="w-full p-button-rounded p-button-sm" label="Edit"
                @click="">
                <template #prefix>
                  <PencilIcon :width="20" :height="20" />
                </template>
              </CustomButton>

              <CustomButton prefixIcon variant="danger" class="w-full p-button-rounded p-button-sm" label="Delete"
                @click="">
                <template #prefix>
                  <TrashIcon :width="20" :height="20" />
                </template>
              </CustomButton>
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
import InfoField from '~/components/orders/InfoField.vue';
import CustomButton from '~/components/common/buttons/CustomButton.vue';
import ProductImageSlider from '../ProductImageSlider.vue';
import ColorPalertView from '~/components/orders/ColorPalertView.vue';
import { PencilIcon, TrashIcon } from '~/icons';

const { formatCurrency } = useCurrency();
const { formatDateString } = useDateFormat();

const emit = defineEmits(['update:isViewProductModal', 'success']);

const props = defineProps({
  isViewProductModal: {
    type: Boolean,
    required: true,
  },
  product: {
    type: Object,
    required: true,
  },
});

const closeModal = () => {
  emit('update:isViewProductModal', false);
};
</script>

<style scoped>
/* Optional custom styles */
</style>
