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
  
          <TabPanel value="4">
            <DataTable v-model:editingRows="editingRows" :loading="isLoading" editMode="row" dataKey="id" paginator
              :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" :value="materials" stripedRows tableStyle="min-width: 50rem"
              @row-edit-save="onRowEditSave" :pt="{
                                                                                                            table: { style: 'min-width: 50rem' },
                                                                                                            column: {
                                                                                                                bodycell: ({ state }) => ({
                                                                                                                    style:  state['d_editing']&&'padding-top: 0.75rem; padding-bottom: 0.75rem'
                                                                                                                })
                                                                                                            }
                                                                                                        }">
              <template #header>
                <div class="flex justify-between items-center" v-if="!isProductionDone">
                  <!-- Button aligned to the left -->
                  <Button @click="addNewMaterial" variant="primary" class="p-button-rounded p-button-sm" label="Add Row"
                    icon="pi pi-plus">
                    Add Row
                  </Button>
                  <Button @click="save" variant="outline" class="p-button-rounded p-button-sm" label="Add Row"
                    icon="pi pi-plus">
                    Save
                  </Button>
  
                  <!-- Search input aligned to the right -->
                </div>
              </template>
  
              <Column field="material_id" header="Name">
  
                <template #body="slotProps">
  
                  <div class="font-semibold text-sm">{{ slotProps.data.material?.name }}</div>
  
                  <div class="text-xs text-gray-400">
                    {{ slotProps.data.material.material_type_name }}
  
                  </div>
  
                </template>
  
                <template #editor="{ data, field }">
                  <!-- <InputText v-model="data[field]" fluid /> -->
                  <Select v-model="data[field]"
                    :options="materialsOption.data.map(material=> ({ value:material.id, label:material.name}))"
                    optionLabel="label" optionValue="value" placeholder="Select a material" fluid>
  
                  </Select>
  
                </template>
              </Column>
  
              <Column field="description" header="Description">
                <template #body="slotProps">
                  <div class="text-xs text-gray-400">
                    <!-- {{ slotProps.data.description }} -->
                    <Badge variant="light" :color="light">
                      {{ slotProps.data.description}}
                    </Badge>
                  </div>
                </template>
                <template #editor="{ data, field }">
                  <InputText v-model="data[field]" fluid />
                </template>
  
              </Column>
  
              <Column field="price_per_unit" header="Unit Cost">
                <template #body="slotProps">
                  <div class="font-semibold text-sm">{{ formatCurrency(slotProps.data?.material?.price_per_unit) }}
                    {{slotProps.data?.material?.unit}}</div>
                </template>
  
              </Column>
  
              <Column field="quantity" header="Quantity">
                <template #body="slotProps">
                  <div class="font-semibold text-sm">{{ slotProps.data?.quantity }}</div>
                </template>
  
                <template #editor="{ data, field }">
                  <InputNumber v-model="data[field]" fluid />
                </template>
  
              </Column>
  
              <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
              <template #empty>
                <div class="flex flex-col items-center justify-center py-10 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                  </svg>
  
                  <p class="mt-4 text-lg font-semibold">No materials found</p>
                  <p class="text-sm text-gray-400">Try allocating materials.</p>
                </div>
              </template>
  
            </DataTable>
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
import type { AddWorkInProgressMaterialRequest, UpdateWorkInProgress } from '~/utils/models/production'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { useMaterialStore } from '~/store/material'
import type { Material } from '~/utils/models/materials'


const { formatCurrency } = useCurrency();
const { formatDateString } = useDateFormat();

// Store & State
const authStore = useAuthStore();
const snackbar = useSnackbar();
const productionStore = useProductionStore();
const materialsStore = useMaterialStore();


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

const materialsForm = computed({
  get: () => productionStore.materialsForm,
  set: (data: AddWorkInProgressMaterialRequest[]) => productionStore.materialsForm = data
})


const updateMaterialsForm = computed({
  get: () => productionStore.updateMaterialsForm,
  set: (data: AddWorkInProgressMaterialRequest[]) => productionStore.updateMaterialsForm = data
})

const materials = computed(() => productionStore.materials);

//get material by id
const getMaterialById = (id: number) => {
  return materialsStore.materials.data.find(m => m.id === id);
};

const materialsOption = computed(() => materialsStore.materials);
const isProductionDone = computed(() => productionStore.selectedWorkInProgress.status === 'Done')

const addedRows = ref([]);
const updatedRows = ref([]);

const onRowEditSave = (event: any) => {
  let { newData, index } = event;

  const updatedMaterial = {
    ...newData,
    material: {
      name: getMaterialById(newData.material_id)?.name || "",
      brand: getMaterialById(newData.material_id)?.brand || "",
      material_type_name: getMaterialById(newData.material_id)?.material_type_name || "",
      price_per_unit: getMaterialById(newData.material_id)?.price_per_unit || 0,
      unit: getMaterialById(newData.material_id)?.unit || 0
    }
  };

  materials.value[index] = updatedMaterial;
  newData.id != null ? updateMaterialsForm.value[index] = newData
    : materialsForm.value[index] = newData



};


const editingRows = ref([]);

const workInProgress = computed(() => productionStore.selectedWorkInProgress)
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

const addNewMaterial = () => {
  const newMaterial: any = {
    id: null,
    material: {
      name: "",
      brand: "",
      material_type_name: "",
      price_per_unit: 0,
      unit: ""
    },
    description: "",
    material_id: null,
    quantity: 0,
    // you can use this to detect new rows later if needed
  };
  materials.value.push(newMaterial);
  editingRows.value.push(newMaterial.id); // optionally start editing the row immediately
};

const currentPageTitle = ref('User Profile')

onMounted(async () => {
  // getSingleWorkInProgress
  const id = route.params.id
  if (id) {
    await productionStore.getSingleWorkInProgress(id)
    await productionStore.getMaterials(id)
    await materialsStore.getMaterials(id)
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

      console.log(productionStore.errorMessage);
      if (productionStore.errorMessage) {
        snackbar.add({
          type: "error",
          text: productionStore.errorMessage,
        });// Emit success event
        // closeModal(); // Close the modal
      }

    } catch (error) {
      console.log('Error 2')

    }
  } else {
    console.log("Action canceled.");
  }
};

const save = async () => {
  const id = route.params.id
  try {
    // await productionStore.addMaterials(id)
    await productionStore.submitMaterials(id);
    if (productionStore.successMessage) {
      await productionStore.getMaterials(id)
      snackbar.add({
        type: "success",
        text: productionStore.successMessage,
      });// Emit success event
      // closeModal(); // Close the modal
    }
  } catch (error) {

  }
}

</script>