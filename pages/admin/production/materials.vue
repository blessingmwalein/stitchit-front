<template>
  <admin-layout>
    <template v-if="isLoading">
      <PageSkeletonLoader />
    </template>
  
    <template v-else>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
  
        <DataTable filterDisplay="row" :loading="isLoading" dataKey="id" v-model:filters="filters" sortMode="multiple"
          paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" :value="materials.data" stripedRows
          tableStyle="min-width: 50rem" :globalFilterFields="['code', 'name', 'category']">
          <template #header>
            <div class="flex justify-between items-center">
              <!-- Button aligned to the left -->
              <Button @click="isMaterialFormModal = true" variant="primary" class="p-button-rounded p-button-sm"
                label="Add New Client" icon="pi pi-plus" to="/admin/materials/create">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" width="20" height="20">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
                Create
              </Button>
  
              <!-- Search input aligned to the right -->
              <div class="flex justify-end">
                <IconField>
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText v-if="filters" v-model="filters['global'].value" placeholder="Keyword Search" />
                </IconField>
              </div>
            </div>
          </template>
  
          <Column field="name" header="Name">
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
            </template>
            <template #body="slotProps">
  
              <div class="font-semibold text-sm">{{ slotProps.data.name }}</div>
              <div class="text-xs text-gray-400">
                {{ slotProps.data.brand }}
  
              </div>
  
            </template>
          </Column>
  
          <Column field="material_type_name" header="Material Type">
            <template #body="slotProps">
              <Badge variant="light" :color="light">
                {{ slotProps.data.material_type_name }}
              </Badge>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Material Type" />
            </template>
          </Column>
  
          <Column field="price_per_unit" header="Unit Cost">
            <template #body="slotProps">
              <div class="font-semibold text-sm">{{ formatCurrency(slotProps.data.price_per_unit) }}</div>
              <div class="text-xs text-gray-400">
                {{ slotProps.data.unit }}
  
              </div>
            </template>
  
          </Column>
  
  
          <Column header="Actions">
            <template #body="slotProps">
              <div class="flex space-x-2">
                <!-- View Button -->
                <Button @click="handleViewRug(slotProps.data)" variant='outline' size='sm'
                  class="p-button-rounded p-button-warning p-button-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" width="20" height="20">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </Button>
                <Button @click="handleEditRug(slotProps.data)" variant='outline' size="sm"
                  class="p-button-rounded p-button-warning p-button-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" width="20" height="20">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </Button>
                <!-- Edit Button -->
                <Button @click="showConfirmModal = true;materialStore.setSelectedMaterial(slotProps.data) "
                  variant='outline' size="sm" class="p-button-rounded p-button-warning p-button-sm">
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
  
              <p class="mt-4 text-lg font-semibold">No items found</p>
              <p class="text-sm text-gray-400">Try adding new items to see them here.</p>
            </div>
          </template>
  
        </DataTable>
      </div>
    </template>
  
    <MaterialFormModal :isMaterialFormModal="isMaterialFormModal" :material="selectedMaterial"
      @update:isMaterialFormModal="(value) => isMaterialFormModal = value" />
  
    <ViewMaterialModal :isViewMaterialModal="isViewMaterialModal" :material="selectedMaterial"
      @update:isViewMaterialModal="(value ) => isViewMaterialModal = value"
      @edit="isViewMaterialModal = false ;handleEditRug(selectedMaterial)" />
  
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
import MaterialFormModal from '@/components/materials/modals/MaterialFormModal.vue'
import ViewMaterialModal from '@/components/materials/modals/ViewMaterialModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'


import {
  FilterMatchMode
} from '@primevue/core/api';

import { useCurrency } from '~/composables/useCurrency';
import { useMaterialStore } from '~/store/material'
import PageSkeletonLoader from '~/components/ui/PageSkeletonLoader.vue'

const { formatCurrency } = useCurrency();


// Store & State
const materialStore = useMaterialStore();
const isMounted = ref(false) // Track if component has mounted

const snackbar = useSnackbar();

const isLoading = computed(() => materialStore.isLoading);
const materials = computed(() => materialStore.materials);

const selectedMaterial = computed(() => materialStore.selectedMaterial);

const isMaterialFormModal = ref(false)
const isViewMaterialModal = ref(false)
const showConfirmModal = ref(false)


onMounted(() => {
  isMounted.value = true // Set to true once component is mounted
})

const filters: any = ref({
  global: {
    value: null,
    matchMode: FilterMatchMode.CONTAINS
  },

  name: {
    value: null,
    matchMode: FilterMatchMode.STARTS_WITH
  },
  price_per_unit: {
    value: null,
    matchMode: FilterMatchMode.EQUALS
  },

  material_type_name: {
    value: null,
    matchMode: FilterMatchMode.EQUALS
  },
});

definePageMeta({
  middleware: [
    function (to, from) {
      // Custom inline middleware
    },
    'auth',
  ],
});

const currentPageTitle = ref('Materials')

onMounted(async () => {
  await materialStore.getMaterials(); // Fetch only if user is not loaded
});

//handle select client
const handleEditRug = (client: any) => {
  materialStore.setSelectedMaterial(client);
  isMaterialFormModal.value = true;
}

const handleViewRug = (client: any) => {
  materialStore.setSelectedMaterial(client);
  isViewMaterialModal.value = true;
}

const handleConfirmation = async (isConfirmed: boolean) => {
  if (isConfirmed) {
    console.log("Action confirmed!");

    // Perform the action here, e.g., delete the item
    try {
      await materialStore.deleteMaterial();

      if (materialStore.successMessage) {
        snackbar.add({
          type: "success",
          text: materialStore.successMessage,
        });
        materialStore.resetForm();// Emit success event
        closeModal(); // Close the modal
      }
    } catch (error) {

    }
  } else {
    console.log("Action canceled.");
  }
};
    </script>
    