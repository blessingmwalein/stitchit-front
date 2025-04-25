<template>
    <Modal v-if="isViewDeliverProductModal" @close="closeModal()">
        <template #header>
            <button @click="closeModal()"
                class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
                <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                        fill="" />
                </svg>
            </button>
            <div class="text-start flex-grow">
                <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Order #{{ order?.order_number }} - {{ order?.client_name }}
                </h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Please add transaction details <br><br>
                    <OrderStatusBadge :status="order?.status" />
                </p>
            </div>
        </template>
        <template #body>
            <div class="no-scrollbar relative w-full  overflow-y-auto bg-white  dark:bg-gray-900">
                <client-only>
                    <div class="mb-4">
                        <Alert v-if="ordersStore.errorMessage" variant="error" title="Something went wrong"
                            :message="ordersStore.errorMessage ?? ''" :showLink="false" />
                    </div>
                    <div class="mt-6 mb-4 w-full p-4 border border-gray-200 rounded-2xl bg-white dark:bg-gray-900">
                        <!-- IMAGE + INFO ROW -->
                        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
                            <!-- Product Image -->
                            <div class="flex-shrink-0">
                                <img v-if="order?.product?.default_image"
                                    :src="`${config.public.imageUrl}${order?.product?.default_image}`" alt="Rug image"
                                    class="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg shadow" />
                            </div>
                            <!-- Product Info -->
                            <div class="flex-1 space-y-2">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                    {{ order?.product?.name }}
                                </h3>
                                <dl
                                    class="text-sm text-gray-500 dark:text-gray-400 divide-y divide-gray-200 dark:divide-gray-700">
                                    <div class="flex justify-between py-2">
                                        <dt class="font-medium">Type</dt>
                                        <dd>{{ order.rug.type }}</dd>
                                    </div>
                                    <div class="flex justify-between py-2">
                                        <dt class="font-medium">Shape</dt>
                                        <dd>{{ order?.product?.shape }}</dd>
                                    </div>
                                    <div class="flex justify-between py-2">
                                        <dt class="font-medium">Size</dt>
                                        <dd>{{ order?.product?.length }}×{{ order?.product?.width }} {{ order?.product?.unit
                                            }}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
    
    
                        </div>
    
                        <!-- TOTALS SUMMARY -->
                        <div class="flow-root">
                            <div class="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
                                <dl class="flex items-center justify-between gap-4 py-3">
                                    <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Subtotal</dt>
                                    <dd class="text-base font-medium text-gray-900 dark:text-white">
                                        {{ formatCurrency(order?.product?.total_price) }}
                                    </dd>
                                </dl>
                                <dl class="flex items-center justify-between gap-4 py-3">
                                    <dt class="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                                    <dd class="text-base font-bold text-gray-900 dark:text-white">
                                        {{ formatCurrency(order?.product?.total_price) }}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
    
    
                    <Vueform @submit="handleSubmit" v-model="deliverProductForm" :show-errors="false"
                        :display-errors="false" :endpoint="false" sync>
    
    
                        <SelectElement label="Payment Method" name="payment_method" :search="true" :native="false"
                            input-type="search" autocomplete="disabled" placeholder="Type" :items="paymentMethods"
                            :columns="{
                                                                                                                                                            container: 12,                                                                      }"
                            :rules="['required']" />
    
                        <!-- <StaticElement name="contact_title" content="Contact details" tag="h3" top="2" /> -->
                        <!-- <StaticElement name="divider_1" tag="hr" /> -->
                        <TextElement name="amount" input-type="text" v-mask="'$#,##0.00'" :rules="['required']"
                            label="Received Amount" :columns="{ container: 6 }" />
    
                        <SelectElement label="Currency" name="currency" :search="true" :native="false" input-type="search"
                            autocomplete="disabled" placeholder="Type" :items="currencies"
                            :columns="{
                                                                                                                                                            container: 6,
                                                                                                                                                          }" :rules="['required']" />
    
                        <TextElement name="payment_reference" input-type="text" v-mask="'$#,##0.00'"
                            label="Payment Reference" :columns="{ container: 12 }" />
    
    
                        <StaticElement name="span"
                            :columns="{
                                                                                                                                                          container: 4,
                                                                                                                                                        }"
                            tag="span" />
                        <ButtonElement name="close" button-class="bg-red-500"
                            :columns="{
                                                                                                                                                          container: 4,
                                                                                                                                                        }"
                            @click="closeModal()" button-label="Close" :full="true" size="lg" />
    
                        <ButtonElement button-class="bg-brand-500" name="register"
                            :columns="{
                                                                                                                                                          container: 4,
                                                                                                                                                        }" :submits="true"
                            button-label="Submit" :full="true" size="lg" />
                    </Vueform>
                </client-only>
            </div>
        </template>
    </Modal>
</template>
  
  <script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import Modal from '@/components/profile/Modal.vue';
import { useAuthStore } from "~/store/auth";
import type { CreateClientRequest, UserClient } from '~/utils/models/client';
import CustomButton from '~/components/common/buttons/CustomButton.vue';
import Alert from "@/components/ui/Alert.vue";

import type { CreateRugRequest, Rug } from '~/utils/models/rug';
import type { CreateOrderRequest, Order } from '~/utils/models/order';
import { useOrderStore } from '~/store/orders';
import { currencies, paymentMethods } from '~/utils/data/colors';
import type { FinishedProduct } from '~/utils/models/finished_products';

const emit = defineEmits(['update:isViewDeliverProductModal', 'success']);
const ordersStore = useOrderStore();
const errors: Record<string, string> = ordersStore.errors;

const { formatCurrency } = useCurrency();
const snackbar = useSnackbar();

const props = defineProps({
  isViewDeliverProductModal: {
    type: Boolean,
    required: true,
  },
  order: {
    type: Object as () => Order | null,
    required: true,
  },

  //   product: {
  //     type: Object as () => FinishedProduct | null,
  //     required: true,
  //   },
});
const config = useRuntimeConfig();

const deliverProductForm = computed({
  get: () => ordersStore.deliverOrderForm,
  set: (data: CreateOrderRequest) => ordersStore.createOrderForm = data
})

// Close modal function
const closeModal = () => {
  emit('update:isViewDeliverProductModal', false);
};

const success = () => {
  emit('success', true);
}

const handleSubmit = async () => {
  // Call login and wait for it to finish
  try {
    // if (ordersStore.selectedOrder?.id) {
    //   await ordersStore.updateRug();
    // } else {
    await ordersStore.deliverOrder();

    // }

    if (ordersStore.successMessage) {
      snackbar.add({
        type: "success",
        text: ordersStore.successMessage,
      });
      ordersStore.resetDeliverForm();// Emit success event
      closeModal(); // Close the modal
    }
  } catch (error) {
    if (ordersStore.errorMessage) {
      snackbar.add({
        type: "error",
        text: ordersStore.errorMessage,
      });
    }
  }

}

  </script>
  
  <style scoped>
/* Add your custom styles here */
</style>
  