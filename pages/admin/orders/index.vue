<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
  
      <DataTable filterDisplay="menu" :loading="isLoading" dataKey="id" v-model:filters="filters" sortMode="multiple"
        paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" :value="orders.data" stripedRows
        tableStyle="min-width: 50rem" :globalFilterFields="['id', 'rug.name', 'status', 'size.name']">
  
        <template #header>
          <div class="flex justify-between items-center">
            <!-- Add New Order Button -->
            <Button @click="isOrderFormModal =true" variant="primary" class="p-button-rounded p-button-sm"
              label="Add New Order" icon="pi pi-plus">
              Create Order
            </Button>
  
            <!-- Search input -->
            <div class="flex justify-end">
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-if="filters" v-model="filters['global'].value" placeholder="Search Orders" />
              </IconField>
            </div>
          </div>
        </template>
  
        <!-- Order ID Column with Filter -->
        <Column field="client_name" header="Client Infor" sortable :filter="true">
          <template #body="slotProps">
            <div class="flex items-center">
              <!-- Using the InitialAvatar component -->
              <InitialAvatar :name="slotProps.data.client_name" />
  
              <div class="ml-3">
                <div class="font-semibold text-sm">{{ slotProps.data.client_name }}</div>
                <!-- Address with reduced font size and faint color -->
                <div class="flex items-center space-x-2 text-xs text-gray-400">
  
                  <EmailAtIcon :height="15" :width="15" />
  
                  {{ slotProps.data.email }}
  
                </div>
              </div>
            </div>
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" placeholder="Client name" class="w-full" />
          </template>
        </Column>
  
        <!-- Rug Name Column with Filter -->
        <Column field="shape" header="Order Info" sortable :filter="true">
          <template #body="slotProps">
            <div class="flex items-center">
              <!-- Using the InitialAvatar component -->

              <div class="ml-3">
                <div class="font-normal text-sm">{{ slotProps.data.shape }}</div>
                <div class="font-semibold text-sm">{{ slotProps.data.length  }} x {{ slotProps.data.width }} {{ slotProps.data.unit }}</div>
              </div>
            </div>
  
          </template>
        
        </Column>
        <Column field="rug.name" header="Rug" sortable :filter="true">
          <template #body="slotProps">
            <div class="flex items-center">
              <!-- Using the InitialAvatar component -->
  
  
              <div class="ml-3">
                <div class="font-normal text-sm">{{ slotProps.data.rug.name }}</div>
                <div class="font-semibold text-sm">{{ formatCurrency(slotProps.data.rug.approx_cost) }}</div>
              </div>
            </div>
  
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" placeholder="Filter by Rug Name" class="w-full" />
          </template>
        </Column>
  
        <!-- Order Size Column with Filter -->
        <Column field="size.name" header="Delivery, Cost" sortable :filter="true">
          <template #body="slotProps">
            <div class="flex items-center">
  
  
              <div class="ml-3">
                <div class="font-normal text-sm">{{ formatDateString(slotProps.data.delivery_date) }}</div>
                <div class="font-semibold text-sm">{{ formatCurrency(slotProps.data.total_price) }}</div>
              </div>
            </div>
          </template>
          <template #filter="{ filterModel }">
            <Dropdown v-model="filterModel.value" :options="sizeOptions" placeholder="Select Size" class="w-full" />
          </template>
        </Column>
  
        <!-- Status Column with Filter -->
        <Column field="status" header="Status" sortable :filter="true">
          <template #body="slotProps">
            <Badge variant="light" :color="light">
              {{ slotProps.data.status }}
            </Badge>
          </template>
          <template #filter="{ filterModel }">
            <Dropdown v-model="filterModel.value" :options="statusOptions" placeholder="Select Status" class="w-full" />
          </template>
        </Column>
  
        <!-- Actions Column -->
        <Column header="Actions">
          <template #body="slotProps">
            <div class="flex space-x-2">
              <!-- View Button -->
              <Button @click="handleViewOrder(slotProps.data)" variant='outline' size='sm'
                class="p-button-rounded p-button-warning p-button-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" width="20" height="20">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </Button>
              <Button @click="handleEditOrder(slotProps.data)" variant='outline' size="sm"
                class="p-button-rounded p-button-warning p-button-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" width="20" height="20">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </Button>
              <!-- Edit Button -->
              <Button @click="showConfirmModal = true;ordersStore.setSelectedOrder(slotProps.data) " variant='outline'
                size="sm" class="p-button-rounded p-button-warning p-button-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" width="20" height="20">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </Button>
            </div>
          </template>
        </Column>
  
  
        <template #empty>
          <div class="flex flex-col items-center justify-center py-10 text-gray-500">
            <p class="mt-4 text-lg font-semibold">No orders found</p>
            <p class="text-sm text-gray-400">Try adding new orders to see them here.</p>
          </div>
        </template>
  
      </DataTable>
  
  
    </div>
  
    <OrderFormModal :isOrderFormModal="isOrderFormModal" :order="selectedOrder"
      @update:isOrderFormModal="(value) => isOrderFormModal = value" />
  
    <ViewOrderModal :isViewOrderModal="isViewOrderModal" :order="selectedOrder"
      @update:isViewOrderModal="(value ) => isViewOrderModal = value"
      @edit="isViewOrderModal = false ;handleEditRug(selectedOrder)" />
  
    <ConfirmModal :visible="showConfirmModal" @update:visible="showConfirmModal = $event" @confirmed="handleConfirmation">
      <template #header> Delete Item </template>
      <template #body> Are you sure you want to delete this item? </template>
    </ConfirmModal>
  
  </admin-layout>
</template>
  
  <script lang="ts" setup>
import {
  ref,
  onMounted
} from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import InitialAvatar from '@/components/common/InitialAvatar.vue'
import CustomSelectField from '@/components/forms/FormElements/CustomSelectField.vue'
import {
  PhoneIcon
} from '~/icons'
import {
  EmailAtIcon
} from '~/icons'
import {
  MapPinIcon
} from '~/icons'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import CustomButton from "@/components/common/buttons/CustomButton.vue";
import OrderFormModal from '@/components/orders/modals/OrderFormModal.vue'
import ViewOrderModal from '@/components/orders/modals/ViewOrderModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'


import {
  FilterMatchMode
} from '@primevue/core/api';
import {
  useOrderStore
} from "~/store/orders";

import { useCurrency } from '~/composables/useCurrency';
import { useDateFormat } from '~/composables/useDateFomat';

const { formatCurrency } = useCurrency();
const { formatDate, formatDateString } = useDateFormat();



// Store & State
const ordersStore = useOrderStore();
const isMounted = ref(false) // Track if component has mounted

const snackbar = useSnackbar();

const isLoading = computed(() => ordersStore.isLoading);
const orders = computed(() => ordersStore.orders);

const selectedOrder = computed(() => ordersStore.selectedOrder);

const isOrderFormModal = ref(false)
const isViewOrderModal = ref(false)
const showConfirmModal = ref(false)


onMounted(() => {
  isMounted.value = true // Set to true once component is mounted
})

// const filters = ref({
//   global: { value: null },
//   id: { value: null },
//   'rug.name': { value: null },
//   'size.name': { value: null },
//   status: { value: null }
// });

const filters: any = ref({
  global: {
    value: null,
    matchMode: FilterMatchMode.CONTAINS
  },
  email: {
    value: null,
    matchMode: FilterMatchMode.CONTAINS
  },
  client_name: {
    value: null,
    matchMode: FilterMatchMode.STARTS_WITH
  },
  'rug.name': {
    value: null,
    matchMode: FilterMatchMode.STARTS_WITH
  },
  'status': {
    value: null,
    matchMode: FilterMatchMode.EQUALS
  },
});


const sizeOptions = ref([
  { label: 'Small', value: 'Small' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Large', value: 'Large' }
]);

const statusOptions = ref([
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
]);

definePageMeta({
  middleware: [
    function (to, from) {
      // Custom inline middleware
    },
    'auth',
  ],
});

const currentPageTitle = ref('Orders')

onMounted(async () => {
  await ordersStore.getOrders(); // Fetch only if user is not loaded

});

//handle select order
const handleEditOrder = (order: any) => {
  ordersStore.setSelectedOrder(order);
  isOrderFormModal.value = true;
}

const handleViewOrder = (order: any) => {
  ordersStore.setSelectedOrder(order);
  isViewOrderModal.value = true;
}

const handleConfirmation = async (isConfirmed: boolean) => {
  if (isConfirmed) {
    console.log("Action confirmed!");

    // Perform the action here, e.g., delete the item
    try {
      await ordersStore.deleteOrder();

      if (ordersStore.successMessage) {
        snackbar.add({
          type: "success",
          text: ordersStore.successMessage,
        });
        ordersStore.resetForm();// Emit success event
        closeModal(); // Close the modal
      }
    } catch (error) {

    }
  } else {
    console.log("Action canceled.");
  }
};
  </script>
  