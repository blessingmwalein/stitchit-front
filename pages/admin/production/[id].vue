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
              @click="setNextStatus(nextStatus); changeStatus()" variant="brand" rounded="full">
  
              <template #prefix>
                <ArrrowUTurnIcon />
              </template>
            </CustomButton>
          </div>
        </div>
      </div>
      <Tabs value="0">
        <!-- Tab Headers -->
        <TabList>
          <Tab value="0">
            <span class="inline-flex items-center gap-2 text-sm">
              <PendingIcon />
              Production Details
            </span>
          </Tab>
          <Tab value="1">
            <span class="inline-flex items-center gap-2 text-sm">
              <ShopIcon />
              Order Details
            </span>
          </Tab>
          <Tab value="2">
            <span class="inline-flex items-center gap-2 text-sm">
              <UsersIcon />
              Client Details
            </span>
          </Tab>
          <Tab value="3">
            <span class="inline-flex items-center gap-2 text-sm">
              <ShopBag />
              Rug Details
            </span>
          </Tab>
          <Tab value="4">
            <span class="inline-flex items-center gap-2 text-sm">
              <BoxCubeIcon />
              Raw Materials
            </span>
          </Tab>
          <Tab value="5">
            <span class="inline-flex items-center gap-2 text-sm">
              <BoxCubeIcon />
              Product
            </span>
          </Tab>
          <Tab value="6">
            <span class="inline-flex items-center gap-2 text-sm">
              <ClipBoardIcon />
              Summary
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
              @row-edit-save="onRowEditSave"
              :pt="{
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
          <TabPanel value="5">
            <div v-if="!product">
              <!-- Empty state -->
              <div
                class="flex flex-col items-center justify-center gap-4 py-12 text-center text-gray-600 dark:text-gray-300">
                <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Product"
                  class="w-40 h-40 opacity-60" />
                <p class="text-xl font-semibold">No product uploaded</p>
  
  
                <CustomButton prefixIcon variant="primary" class="w-full p-button-rounded p-button-sm" label="Add Product"
                  @click="setProductForm(workInProgress)">
                  <template #prefix>
                    <PlugInIcon :width="20" :height="20" />
                  </template>
                </CustomButton>
  
              </div>
            </div>
  
            <div v-else class="flex flex-col md:flex-row justify-between items-stretch gap-4 mx-4 py-12">
              <!-- PRODUCT DETAILS CARD -->
              <div class="flex bg-white rounded-lg shadow dark:bg-gray-800 flex-col md:flex-row flex-1 overflow-hidden">
                <!-- Image Wrapper -->
                <div class="flex-shrink-0 w-full md:w-1/2 p-2 flex justify-center items-center">
                  <img v-if="product.default_image" :src="`${config.public.imageUrl}${product.default_image}`"
                    alt="Product image" class="w-full h-full object-cover rounded-2xl shadow-md" />
                </div>
                <!-- Product Info -->
                <div class="flex-auto p-6 flex flex-col">
                  <h1 class="text-2xl font-bold dark:text-white mb-2">{{ product.name }}</h1>
                  <p class="text-gray-600 dark:text-gray-300 mb-4">{{ product.description }}</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 dark:text-gray-200 flex-grow">
                    <InfoField label="Production Cost" :value="formatCurrency(product.actual_production_cost) ?? 'N/A'" />
                    <InfoField label="Total Price" :value="formatCurrency(product.total_price) ?? 'N/A'" />
                    <InfoField label="Size"
                      :value="`${product.length} x ${product.width} ${product.unit} (${product.shape})`" />
                  </div>
                  <div class="mt-6">
                    <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Rug Colors</h4>
                    <ColorPalertView :colors="product?.order?.color_palet" />
                  </div>
                </div>
              </div>
  
              <!-- DATES & ACTIONS CARD -->
              <div class="w-full md:w-1/3 bg-white rounded-lg shadow dark:bg-gray-800 flex flex-col p-6">
                <!-- Dates Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 dark:text-gray-200 flex-1">
                  <InfoField label="Start Date" :value="formatDateString(product.start_date) ?? 'N/A'" />
                  <InfoField label="End Date" :value="formatDateString(product.end_date) ?? 'N/A'" />
                  <InfoField label="Created At" :value="formatDateString(product.created_at) ?? 'N/A'" />
                  <InfoField label="Updated At" :value="formatDateString(product.updated_at) ?? 'N/A'" />
                  <InfoField label="Available Units" :value="`${product.available_quantity} units`" />
                </div>
                <!-- Edit/Delete Buttons -->
                <div class="mt-4 flex flex-row gap-2">
                  <CustomButton prefixIcon variant="primary" class="w-full p-button-rounded p-button-sm" label="Edit"
                    @click="oenEditProduct(product)">
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
  
          </TabPanel>
  
          <TabPanel value="6">
            <div class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Summary</h4>
  
              <!-- Overall Material Cost -->
              <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                  <h5 class="text-lg font-semibold text-gray-800 dark:text-white">Material Usage Summary</h5>
                  <div class="text-right text-xl font-semibold text-gray-700 dark:text-gray-100">
                    ${{ overallMaterialCost.toFixed(2) }}
                  </div>
                </div>
  
                <!-- Accordion for Material Groups -->
                <Accordion :value="activeGroupIndex">
                  <AccordionPanel v-for="(group, index) in groupedMaterials" :key="group.type" :value="index">
                    <AccordionHeader>
                      {{ group.type }}
                    </AccordionHeader>
                    <AccordionContent>
                      <table class="min-w-full text-sm text-left text-gray-600 dark:text-gray-300">
                        <thead class="border-b border-gray-300 dark:border-gray-700 text-xs uppercase font-medium">
                          <tr>
                            <th class="py-1 pr-3">Material</th>
                            <th class="py-1 pr-3">Description</th>
                            <th class="py-1 pr-3">Qty</th>
                            <th class="py-1 pr-3">Unit</th>
                            <th class="py-1 pr-3">Unit Cost</th>
                            <th class="py-1 pr-3">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in group.items" :key="item.name + item.description"
                            class="border-b border-gray-200 dark:border-gray-700">
                            <td class="py-1 pr-3">{{ item.name }}</td>
                            <td class="py-1 pr-3">{{ item.description }}</td>
                            <td class="py-1 pr-3">{{ item.quantity }}</td>
                            <td class="py-1 pr-3">{{ item.unit }}</td>
                            <td class="py-1 pr-3">{{ formatCurrency(item.unitCost) }}</td>
                            <td class="py-1 pr-3">{{ formatCurrency(item.cost) }}</td>
                          </tr>
                          <tr class="font-semibold">
  
                            <td colspan="5" class="text-right py-2 pr-3">Total</td>
                            <td class="py-2 pr-3">{{ formatCurrency(group.totalCost) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </AccordionContent>
                  </AccordionPanel>
                </Accordion>
              </div>
  
              <!-- Additional Production Summary -->
              <div class="border-t pt-4 mt-6">
                <h5 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Production Summary</h5>
                <div class="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                  <div class="flex justify-between text-xl">
                    <span>Total Production Hours:</span>
                    <span>{{ workInProgress.total_hours }} hrs</span>
                  </div>
                  <div class="flex justify-between text-xl">
                    <span>Total Labour Cost:</span>
                    <span>{{ formatCurrency(workInProgress.labour_cost) }}</span>
                  </div>
                  <div class="flex justify-between font-semibold border-t pt-2 text-xl">
                    <span>Total Production Cost:</span>
                    <span>{{ formatCurrency(workInProgress.actual_production_cost) }}</span>
                  </div>
                </div>
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
  
    <DoneProductionModal :isDoneProductionModal="isDoneProductionModal" :workInProgress="workInProgress"
      @update:isDoneProductionModal="(value) => isDoneProductionModal = value" />
  
  
    <AddFinishedProductModal :isFinishedProductFormModal="isFinishedProductFormModal" :product="product"
      :workInProgress="workInProgress"
      @update:isFinishedProductFormModal="(value) => isFinishedProductFormModal = value" />
  
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
import ClipBoardIcon from '~/icons/ClipBoardIcon.vue'
import { ProductionStatusBadge } from '#components'
import CustomButton from '~/components/common/buttons/CustomButton.vue'
import PlusIcon from '~/icons/PlusIcon.vue'
import ArrrowUTurnIcon from '~/icons/ArrrowUTurnIcon.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import DoneProductionModal from '@/components/production/modals/DoneProductionModal.vue'
import AddFinishedProductModal from '@/components/production/modals/AddFinishedProductModal.vue'
import type { AddWorkInProgressMaterialRequest, UpdateWorkInProgress, WorkInProgressData } from '~/utils/models/production'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { useMaterialStore } from '~/store/material'

import type { Material } from '~/utils/models/materials'
import { useFinishedProductsStore } from '~/store/finished_products'
import PencilIcon from '~/icons/PencilIcon.vue'
import { PlugInIcon, TrashIcon } from '~/icons'
import type { FinishedProduct } from '~/utils/models/finished_products'


const { formatCurrency } = useCurrency();
const { formatDateString } = useDateFormat();

// Store & State
const authStore = useAuthStore();
const snackbar = useSnackbar();
const productionStore = useProductionStore();
const materialsStore = useMaterialStore();
const finishedProductStore = useFinishedProductsStore();


const isMounted = ref(false) // Track if component has mounted

const isLoading = computed(() => authStore.isLoading);
const userProfile = computed(() => authStore.user);
const showConfirmUpdateStatus = ref(false)
const isDoneProductionModal = ref(false)
const isFinishedProductFormModal = ref(false)
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

const workInProgress = computed(() => productionStore.selectedWorkInProgress);
const product = computed(() => finishedProductStore.selectedProduct);
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
    await finishedProductStore.getFinishedProductByWorlInProgressId(id)
  }
});



const setNextStatus = (status: string) => {
  productionStore.updateFormStatus(status);
  nextStatus.value = status;
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

const changeStatus = () => {
  console.log(nextStatus.value);
  if (nextStatus.value === 'Done') {
    isDoneProductionModal.value = true
  } else {
    showConfirmUpdateStatus.value = true
  }
}
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

const groupedMaterials = computed(() => {
  const result: Record<string, any> = {};

  productionStore.materials.forEach(entry => {
    const item = entry;
    const type = item.material.material_type_name;
    const unitCost = item.material.price_per_unit;
    const quantity = item.quantity;
    const cost = unitCost * quantity;

    if (!result[type]) {
      result[type] = {
        type: type,
        items: [],
        totalCost: 0,
      };
    }

    result[type].items.push({
      name: item.material.name,
      quantity,
      unit: item.material.unit,
      unitCost,
      cost,
      description: item.description,
    });

    result[type].totalCost += cost;
  });

  return Object.values(result);
});

const overallMaterialCost = computed(() =>
  groupedMaterials.value.reduce((sum, group) => sum + group.totalCost, 0)
);

const setProductForm = (workInProgress: WorkInProgressData) => {

  isFinishedProductFormModal.value = true

};

const oenEditProduct = (product: FinishedProduct) => {
  finishedProductStore.setEditProductForm(product);

  isFinishedProductFormModal.value = true;
}

</script>