<template>
    <admin-layout>
        <client-only>
            <template v-if="isLoading">
                <DetailSkeletonLoader />
            </template>
            <template v-else>
                <PageBreadcrumb :pageTitle="order?.order_number" />

                <div v-if="order?.id"
                    class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">

                    <!-- status and action buttons on the right -->


                    <!--         <ProductionStatusBadge :status="order?.status" /> -->
                    <div class="flex items-center justify-between mb-4">
                        <!-- Optional Status Badge -->
                        <OrderStatusBadge :status="order?.status" />

                        <!-- Action Buttons -->
                        <div class="flex gap-2 ">
                            <div>
                                <CustomButton v-if="isEditButtonVisible" @click="handleEditOrder(order)"
                                    label="Edit Order" :prefixIcon="true" variant="brand" rounded="full">
                                    <template #prefix>
                                        <div class="mr-3">
                                            <PencilIcon :height="20" :width="20" />
                                        </div>
                                    </template>
                                </CustomButton>
                            </div>
                            <div>
                                <CustomButton v-if="isProcessButtonVisible" @click="handleProcessOrder(order)"
                                    label="Proccess" variant="success" rounded="full" :prefixIcon="true">
                                    <template #prefix>
                                        <div class="mr-3">
                                            <ArrrowUTurnIcon :height="20" :width="20" />
                                        </div>
                                    </template>
                                </CustomButton>
                            </div>
                            <div>
                                <CustomButton v-if="isStartProductionButtonVisible"
                                    @click="handleStartProduction(order)" label="Start Production" variant="warning"
                                    rounded="full" :prefixIcon="true">
                                    <template #prefix>
                                        <div class="mr-3">
                                            <ArrrowUTurnIcon :height="20" :width="20" />
                                        </div>
                                    </template>
                                </CustomButton>
                            </div>
                            <div>
                                <CustomButton v-if="isDeliverProduct" @click="handleDeliverOrder(order)"
                                    label="Deliver Product" variant="success" rounded="full" :prefixIcon="true">
                                    <template #prefix>
                                        <div class="mr-3">
                                            <TruckIcon :height="20" :width="20" />
                                        </div>
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
                                    <ShopIcon />
                                    Order Details
                                </span>
                            </Tab>
                            <Tab value="1">
                                <span class="inline-flex items-center gap-2 text-sm">
                                    <UsersIcon />
                                    Client Details
                                </span>
                            </Tab>
                            <Tab value="2">
                                <span class="inline-flex items-center gap-2 text-sm">
                                    <ShopBag />
                                    Rug Details
                                </span>
                            </Tab>

                            <Tab value="3" v-if="order.is_order_ready">
                                <span class="inline-flex items-center gap-2 text-sm">
                                    <BoxCubeIcon />
                                    Product
                                </span>
                            </Tab>
                            <Tab value="4" v-if="order.is_order_ready">
                                <span class="inline-flex items-center gap-2 text-sm">
                                    <ClipBoardIcon />
                                    Summary
                                </span>
                            </Tab>
                        </TabList>

                        <!-- Tab Panels -->
                        <TabPanels>

                            <!-- Production Details -->
                            <!-- <TabPanel value="0">
                                                                                                <div class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                                                                                                    <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Order Details</h4>
                                                                                                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-12">
                                                                                                        <InfoField label="Delivery Date"
                                                                                                            :value="formatDateString(order.order?.delivery_date) ?? 'N/A'" />
                                                                                                        <InfoField label="Start Date" :value="formatDateString(order?.start_date)" />
                                                                                                        <InfoField label="Finishing Date" :value="formatDateString(order?.approx_end_date)" />
                                                                                                        <InfoField label="Production Cost" :value="formatCurrency(order?.approx_production_cost)" />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </TabPanel> -->

                            <!-- Order Details -->
                            <TabPanel value="0">
                                <div class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                                    <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Order
                                        Details
                                    </h4>
                                    <div class="flex flex-col lg:flex-row gap-6 items-start">
                                        <div
                                            class="flex-shrink-0 w-full lg:w-1/6 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 max-h-[250px]">
                                            <img v-if="order?.image_url"
                                                :src="`${config.public.imageUrl}${order.image_url}`"
                                                alt="WorkInProgress Image"
                                                class="w-full h-full object-cover rounded-2xl" />
                                        </div>
                                        <div
                                            class="w-full lg:w-2/3 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-12">
                                            <InfoField label="Total Price"
                                                :value="formatCurrency(order?.total_price)" />
                                            <InfoField label="Unit" :value="order?.unit" />
                                            <InfoField label="Length" :value="`${order?.length}${order?.unit}`" />
                                            <InfoField label="Width" :value="`${order?.width}${order?.unit}`" />
                                            <InfoField label="Shape" :value="order?.shape" />
                                        </div>
                                    </div>
                                    <div class="mt-6">
                                        <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Color
                                            Palette
                                        </h4>
                                        <ColorPalertView :colors="order?.color_palet" />
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value="1">
                                <div
                                    class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 relative">
                                    <button
                                        class="absolute top-4 right-4 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                                            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    </button>

                                    <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Client
                                        Information
                                    </h4>
                                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-12">
                                        <InfoField label="Client Name" :value="order?.client_name" />
                                        <InfoField label="Client Email" :value="order?.email" />
                                        <InfoField label="Client Phone" :value="order?.phone_number" />
                                    </div>
                                </div>
                            </TabPanel>


                            <!-- Client Details -->


                            <!-- Rug Details -->
                            <TabPanel value="2">
                                <div class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                                    <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Rug
                                        Information
                                    </h4>
                                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-12">
                                        <InfoField label="Rug Name" :value="order?.rug?.name" />
                                        <InfoField label="Rug Type" :value="order?.rug?.type" />
                                        <InfoField label="Materials" :value="order?.rug?.materials" />
                                        <InfoField label="Approx Cost"
                                            :value="formatCurrency(order?.rug?.approx_cost)" />
                                        <InfoField label="Approx Production Cost"
                                            :value="formatCurrency(order?.rug?.approx_production_cost)" />
                                    </div>
                                </div>
                            </TabPanel>

                            <TabPanel value="3" v-if="order?.is_order_ready">
                                <div v-if="!product">
                                    <!-- Empty state -->
                                    <div
                                        class="flex flex-col items-center justify-center gap-4 py-12 text-center text-gray-600 dark:text-gray-300">
                                        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                                            alt="No Product" class="w-40 h-40 opacity-60" />
                                        <p class="text-xl font-semibold">No product uploaded</p>
                                        
                                    </div>
                                </div>

                                <div v-else
                                    class="flex flex-col md:flex-row justify-between items-stretch gap-4 mx-4 py-12">
                                    <!-- LEFT: IMAGE SLIDER -->
                                    <div class="md:w-1/2 w-full flex items-center justify-center">
                                        <ProductImageSlider :images="product.images" class="w-full h-full " />
                                    </div>

                                    <!-- RIGHT: INFO + ACTION -->
                                    <div class="md:w-1/2 w-full flex flex-col gap-4">
                                        <!-- PRODUCT DETAILS -->
                                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col">
                                            <h1 class="text-2xl font-bold dark:text-white mb-2">{{ product.name }}</h1>
                                            <p class="text-gray-600 dark:text-gray-300 mb-4">{{ product.description }}
                                            </p>

                                            <div
                                                class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 dark:text-gray-200">
                                                <InfoField label="Production Cost"
                                                    :value="formatCurrency(product.actual_production_cost) ?? 'N/A'" />
                                                <InfoField label="Total Price"
                                                    :value="formatCurrency(product.total_price) ?? 'N/A'" />
                                                <InfoField label="Size"
                                                    :value="`${product.length} x ${product.width} ${product.unit} (${product.shape})`" />
                                            </div>

                                            <div class="mt-6">
                                                <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                                                    Rug Colors</h4>
                                                <ColorPalertView :colors="product?.order?.color_palet" />
                                            </div>
                                        </div>

                                        <!-- DATES & ACTIONS -->
                                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col">
                                            <div
                                                class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 dark:text-gray-200">
                                                <InfoField label="Start Date"
                                                    :value="formatDateString(product.start_date) ?? 'N/A'" />
                                                <InfoField label="End Date"
                                                    :value="formatDateString(product.end_date) ?? 'N/A'" />
                                                <InfoField label="Created At"
                                                    :value="formatDateString(product.created_at) ?? 'N/A'" />
                                                <InfoField label="Updated At"
                                                    :value="formatDateString(product.updated_at) ?? 'N/A'" />
                                                <InfoField label="Available Units"
                                                    :value="`${product.available_quantity} units`" />
                                            </div>

                                            <!-- Buttons -->
                                            <div class="mt-4 flex flex-row gap-2">
                                                <CustomButton prefixIcon variant="primary"
                                                    class="w-full p-button-rounded p-button-sm" label="Edit"
                                                    @click="oenEditProduct(product)">
                                                    <template #prefix>
                                                        <PencilIcon :width="20" :height="20" />
                                                    </template>
                                                </CustomButton>
                                                <CustomButton prefixIcon variant="danger"
                                                    class="w-full p-button-rounded p-button-sm" label="Delete"
                                                    @click="">
                                                    <template #prefix>
                                                        <TrashIcon :width="20" :height="20" />
                                                    </template>
                                                </CustomButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>

                            <TabPanel value="4" v-if="order?.is_order_ready">
                                <div
                                    class="p-5 border border-gray-200 rounded-2xl shadow-sm bg-white dark:bg-gray-900 dark:border-gray-800 lg:p-6">
                                    <!-- Product Summary -->
                                    <div class=" pt-4 ">
                                        <h5 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Product
                                            Summary
                                        </h5>
                                        <div class="flex justify-between text-xl text-gray-700 dark:text-gray-200">
                                            <span>Total Product Price:</span>
                                            <span>{{ formatCurrency(order?.product?.total_price) }}</span>
                                        </div>
                                    </div>

                                    <!-- Transaction Details -->
                                    <div class="border-t pt-4 mt-6">
                                        <h5 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Order
                                            Transactions
                                        </h5>

                                        <div v-if="order?.transactions && order?.transactions.length"
                                            class="overflow-x-auto">
                                            <table
                                                class="min-w-full text-sm text-left text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                <thead
                                                    class="text-xs font-semibold uppercase bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                                                    <tr>
                                                        <th class="py-2 px-4">Date</th>
                                                        <th class="py-2 px-4">Status</th>
                                                        <th class="py-2 px-4">Method</th>
                                                        <th class="py-2 px-4">Reference</th>
                                                        <th class="py-2 px-4">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="tx in order?.transactions" :key="tx.id"
                                                        class="border-t border-gray-100 dark:border-gray-700">
                                                        <td class="py-2 px-4 whitespace-nowrap">{{
                                                            formatDateString(tx.created_at)
                                                        }}</td>

                                                        <!-- Status pill -->
                                                        <td class="py-2 px-4">
                                                            <span
                                                                class="inline-block px-2 py-1 rounded-full text-xs font-semibold"
                                                                :class="{
                                                                    'bg-green-100 text-green-700': tx.status === 'completed',
                                                                    'bg-yellow-100 text-yellow-800': tx.status === 'pending',
                                                                    'bg-red-100 text-red-700': tx.status === 'failed',
                                                                    'bg-gray-100 text-gray-700': !['completed', 'pending', 'failed'].includes(tx.status)
                                                                }">
                                                                {{ tx.status }}
                                                            </span>
                                                        </td>

                                                        <!-- Payment method -->
                                                        <td class="py-2 px-4 capitalize">{{ tx.payment_method }}</td>

                                                        <!-- Reference badge -->
                                                        <td class="py-2 px-4">
                                                            <span
                                                                class="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                                {{ tx.payment_reference }}
                                                            </span>
                                                        </td>

                                                        <!-- Amount -->
                                                        <td class="py-2 px-4">{{ formatCurrency(tx.amount) }} {{
                                                            tx.currency
                                                            }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div v-else class="text-gray-500 dark:text-gray-400 text-sm mt-2">
                                            No transactions available.
                                        </div>
                                    </div>
                                </div>


                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </template>
            <StartProductionFormModal :isStartProductionFormModal="isStartProductionFormModal" :order="order"
                @update:isStartProductionFormModal="(value) => isStartProductionFormModal = value" />

            <OrderTemplateModal :isViewProcessOrderModal="isViewProcessOrderModal" :order="order"
                @update:isViewProcessOrderModal="(value) => isViewProcessOrderModal = value" />

            <DeliverProductModal :isViewDeliverProductModal="isViewDeliverProductModal" :order="order"
                @update:isViewDeliverProductModal="(value) => isViewDeliverProductModal = value" />

            <OrderFormModal :isOrderFormModal="isOrderFormModal" :order="order"
                @update:isOrderFormModal="(value) => isOrderFormModal = value" />

        </client-only>
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
import ShopIcon from '~/icons/ShopIcon.vue'
import UsersIcon from '~/icons/UsersIcon.vue'
import ShopBag from '~/icons/ShopBag.vue'
import BoxCubeIcon from '~/icons/BoxCubeIcon.vue'
import ClipBoardIcon from '~/icons/ClipBoardIcon.vue'
import { ProductionStatusBadge } from '#components'
import CustomButton from '~/components/common/buttons/CustomButton.vue'
import PlusIcon from '~/icons/PlusIcon.vue'
import ArrrowUTurnIcon from '~/icons/ArrrowUTurnIcon.vue'
import StartProductionFormModal from '~/components/orders/modals/StartProductionFormModal.vue'
import DeliverProductModal from '~/components/orders/modals/DeliverProductModal.vue'
import { useMaterialStore } from '~/store/material'
import OrderTemplateModal from '@/components/orders/modals/OrderTemplateModal.vue'

import type { Material } from '~/utils/models/materials'
import { useFinishedProductsStore } from '~/store/finished_products'
import PencilIcon from '~/icons/PencilIcon.vue'
import { PlugInIcon, TrashIcon } from '~/icons'
import type { FinishedProduct } from '~/utils/models/finished_products'
import OrderStatusBadge from '~/components/orders/OrderStatusBadge.vue'

import { useOrderStore } from '~/store/orders'
import TruckIcon from '~/icons/TruckIcon.vue'
import DetailSkeletonLoader from '~/components/ui/DetailSkeletonLoader.vue'
import ProductImageSlider from '~/components/production/ProductImageSlider.vue'


const { formatCurrency } = useCurrency();
const { formatDateString } = useDateFormat();

// Store & State
const authStore = useAuthStore();
const snackbar = useSnackbar();
const orderStore = useOrderStore();
const materialsStore = useMaterialStore();
const finishedProductStore = useFinishedProductsStore();
const route = useRoute()


const isMounted = ref(false) // Track if component has mounted
// isloading if orderStore is loadn and 
const isLoading = computed(() => orderStore.isLoading || finishedProductStore.isLoading)

const config = useRuntimeConfig();

const order = computed(() => orderStore.order);
const product = computed(() => finishedProductStore.selectedProduct);


definePageMeta({
    middleware: [
        function (to, from) {
            // Custom inline middleware
        },
        'auth',
    ],
});


const currentPageTitle = ref('User Profile')

onMounted(async () => {
    // getSingleWorkInProgress
    const id = route.params.id
    if (id) {
        await orderStore.getSingleOrder(id)
        await finishedProductStore.getFinishedProductByOrderIdId(id)

        // await finishedProductStore.getFinishedProductByOrderId(id)
    }
});

const showConfirmModal = ref(false)
const isViewProcessOrderModal = ref(false)
const isStartProductionFormModal = ref(false)
const isViewDeliverProductModal = ref(false)
const isOrderFormModal = ref(false)

const handleProcessOrder = (order: any) => {
    orderStore.setSelectedOrder(order);
    isViewProcessOrderModal.value = true;
}

const handleEditOrder = (order: any) => {
    orderStore.setSelectedOrder(order);
    isOrderFormModal.value = true;
}



const handleStartProduction = (order: any) => {
    orderStore.setSelectedOrder(order);
    isStartProductionFormModal.value = true;
}


const handleDeliverOrder = (order: any) => {
    orderStore.setSelectedOrder(order);
    orderStore.setDeliverOrderForm(order);
    isViewDeliverProductModal.value = true;
}



//computed properties for view edit button
const isEditButtonVisible = computed(() => {
    return orderStore.order?.status === 'Pending';
});

const isProcessButtonVisible = computed(() => {
    return orderStore.order?.status === 'Pending';
});

//is start production button visible
const isStartProductionButtonVisible = computed(() => {
    return orderStore.order?.status === 'Processing';
});

const isDeliverProduct = computed(() => {
    return orderStore.order?.status !== 'Delivered' && orderStore.order?.is_order_ready;
});


</script>
<style lang="css">
.p-tablist-active-bar {
    z-index: 0 !important;
}
</style>