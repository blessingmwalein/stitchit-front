<template>
    <admin-layout>
        <PageBreadcrumb :pageTitle="currentPageTitle" />
        <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
    
            <DataTable filterDisplay="menu" :loading="isLoading" dataKey="id" v-model:filters="filters" sortMode="multiple"
                paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" :value="workInProgressItems.data" stripedRows
                tableStyle="min-width: 50rem" :globalFilterFields="['id', 'rug.name', 'status', 'size.name']">
    
                <template #header>
                    <div class="flex justify-between items-center">
    
    
                        <!-- Search input -->
                        <div class="flex justify-end">
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-if="filters" v-model="filters['global'].value"
                                    placeholder="Search Production" />
                            </IconField>
                        </div>
                    </div>
                </template>
    
                <!-- Order ID Column with Filter -->
                <Column field="client_name" header="Client Infor" sortable :filter="true">
                    <template #body="slotProps">
                        <div class="flex items-center">
                            <!-- Using the InitialAvatar component -->
                            <InitialAvatar :name="slotProps.data.order.client_name" />
    
                            <div class="ml-3">
                                <div class="font-semibold text-sm">#{{slotProps.data.order.order_number}} - {{
                                    slotProps.data.order.client_name }}</div>
                                <!-- Address with reduced font size and faint color -->
                                <div class="flex items-center space-x-2 text-xs text-gray-400">
    
                                    <EmailAtIcon :height="15" :width="15" />
    
                                    {{ slotProps.data.order.email }}
    
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
                                <div class="font-normal text-sm">{{slotProps.data.order.rug.name }} - {{
                                    slotProps.data.order.shape }}</div>
                                <div class="font-semibold text-sm">{{ slotProps.data.order.length }} x {{
                                    slotProps.data.order.width }}
                                    {{
                                    slotProps.data.order.unit }}</div>
                            </div>
                        </div>
    
                    </template>
    
                </Column>
    
                <!-- Order Size Column with Filter -->
                <Column field="start_date" header="Start, End Date" sortable :filter="true">
                    <template #body="slotProps">
                        <div class="flex items-center">
    
    
                            <div class="ml-3">
                                <div class="font-normal text-sm">{{ formatDateString(slotProps.data.start_date) }} - {{
                                    formatDateString(slotProps.data.approx_end_date) }}</div>
                                <div class="font-bold text-sm">{{ formatCurrency(slotProps.data.approx_production_cost) }}
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #filter="{ filterModel }">
                        <Dropdown v-model="filterModel.value" :options="sizeOptions" placeholder="Select Size"
                            class="w-full" />
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
                        <Dropdown v-model="filterModel.value" :options="statusOptions" placeholder="Select Status"
                            class="w-full" />
                    </template>
                </Column>
    
                <!-- Actions Column -->
                <Column header="Actions">
                    <template #body="slotProps">
                        <div class="flex space-x-2">
                            <!-- View Button -->
                            <Button @click="handleViewProductionModal(slotProps.data)" variant='outline' size='sm'
                                class="p-button-rounded p-button-warning p-button-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" width="20" height="20">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </Button>
                            <Button @click="handleEditOrder(slotProps.data)" variant='outline' size="sm"
                                class="p-button-rounded p-button-warning p-button-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" width="20" height="20">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                                </svg>
    
                            </Button>
                            <!-- Edit Button -->
                            <Button @click="showConfirmModal = true;productionStore.setSelectedOrder(slotProps.data) "
                                variant='outline' size="sm" class="p-button-rounded p-button-warning p-button-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" width="20" height="20">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
                                </svg>
    
                            </Button>
                        </div>
                    </template>
                </Column>
    
    
                <template #empty>
                    <div class="flex flex-col items-center justify-center py-10 text-gray-500">
                        <p class="mt-4 text-lg font-semibold">No production items found</p>
                        <p class="text-sm text-gray-400">Try adding new production items to see them here.</p>
                    </div>
                </template>
    
            </DataTable>
    
    
        </div>
    
        <ViewProductionModal :isViewProductionModal="isViewProductionModal" :workInProgress="selectedWorkInProgress"
            @update:isViewProductionModal="(value ) => isViewProductionModal = value" />
    
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
import ViewProductionModal from '@/components/production/modals/ViewProductionModal.vue'
import OrderTemplateModal from '@/components/orders/modals/OrderTemplateModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'


import {
  FilterMatchMode
} from '@primevue/core/api';

import { useCurrency } from '~/composables/useCurrency';
import { useDateFormat } from '~/composables/useDateFomat';
import StartProductionFormModal from '~/components/orders/modals/StartProductionFormModal.vue'
import { useProductionStore } from '~/store/production'
import type { WorkInProgress } from '~/utils/models/production'

const { formatCurrency } = useCurrency();
const { formatDate, formatDateString } = useDateFormat();



// Store & State
const productionStore = useProductionStore();
const isMounted = ref(false) // Track if component has mounted

const snackbar = useSnackbar();

const isLoading = computed(() => productionStore.isLoading);
const workInProgressItems = computed(() => productionStore.workInProgressItems);

const selectedWorkInProgress = computed(() => productionStore.selectedWorkInProgress);

const isOrderFormModal = ref(false)
const isViewProductionModal = ref(false)
const showConfirmModal = ref(false)
const isViewProcessOrderModal = ref(false)
const isStartProductionFormModal = ref(false)



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

const handleViewProductionModal = (workInProgress: WorkInProgress) => {
  //   productionStore.setSelectedWorkInProgress(workInProgress);
  //   isViewProductionModal.value = true;
  //navigate to production view 
  navigateTo(`/admin/production/${workInProgress.id}`);


}

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

const currentPageTitle = ref('Production')

onMounted(async () => {
  await productionStore.getWorkInProgress(); // Fetch only if user is not loaded

});

//handle select order


    </script>
    