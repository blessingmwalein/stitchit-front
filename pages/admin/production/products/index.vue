<template>
  <admin-layout>
    <template v-if="isLoading">
      <div class="space-y-5 px-6 mt-4">
        <!-- Breadcrumb Skeleton -->
        <Skeleton height="1.5rem" width="12rem" class="rounded" />
  
        <!-- Filter Pills Skeleton -->
        <div class="flex justify-center">
          <div class="flex gap-3">
            <Skeleton v-for="i in 3" :key="i" width="5rem" height="2rem" class="rounded-full" />
          </div>
        </div>
  
        <!-- Product Grid Skeleton -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="rounded-2xl overflow-hidden border border-gray-200 p-4 bg-white dark:bg-gray-200 space-y-3">
            <Skeleton height="200px" class="rounded-xl w-full" />
            <Skeleton height="1.25rem" width="70%" />
            <Skeleton height="1rem" width="90%" />
            <Skeleton height="1.5rem" width="50%" />
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
  
      <!-- ACTIONS BAR -->
  
      <div class="w-full flex justify-between items-center mt-4 mx-6">
        <!-- Add New Product button (left or you can move it right) -->
  
        <!-- Filter Tabs (centered in available space) -->
        <div class="flex-1 flex justify-center">
          <div class=" border border-gray-300 flex space-x-3 bg-gray-100 dark:bg-gray-700 p-1 rounded-full">
            <button v-for="type in types" :key="type.value" @click="selectedType = type.value" :class="[
                'px-4 py-2 text-base font-medium rounded-full transition-colors',
                selectedType === type.value
                  ? 'bg-white text-indigo-600 shadow border border-gray-300'
                  : 'text-gray-600 hover:text-indigo-600'
              ]">
              {{ type.label }}
            </button>
          </div>
        </div>
  
  
        <div>
          <CustomButton rounded="full" class="w-auto px-6 mr-10" @click="onAddProduct" label="Add New" :prefixIcon="true">
            <template #prefix>
              <PlusIcon :width="16" :height="16" />
            </template>
          </CustomButton>
        </div>
  
      </div>
      <!-- PRODUCT GRID -->
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6">
        <div v-for="prod in  filteredProducts" :key="prod.id"
          class="relative group block rounded-2xl overflow-hidden border border-gray-200 bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow">
          <!-- IMAGE SWAP -->
          <div class="relative h-[350px] sm:h-[450px]">
            <img :src="`${config.public.imageUrl}${prod.default_image}`" alt=""
              class="absolute inset-0 h-full w-full object-cover opacity-100 group-hover:opacity-0 transition-opacity" />
            <img :src="`${config.public.imageUrl}${prod.default_image|| prod.default_image}`" alt=""
              class="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
  
          <!-- OVERLAY CONTENT -->
          <div class="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 to-transparent">
            <h3 class="text-xl font-medium text-white truncate">
              {{ prod.name }}
            </h3>
            <p class="mt-1.5 text-xs text-white line-clamp-3">
              {{ prod.description }}
            </p>
            <div class="mt-3 text-white text-sm font-semibold">
              {{ formatCurrency(prod.total_price) }}
              <span class="text-xs text-gray-200">/ {{ prod.available_quantity }} pcs</span>
            </div>
  
            <!-- CARD ACTION BUTTONS -->
            <div class="mt-4 flex gap-2">
              <CustomButton :rounded="'full'" :prefixIcon="true" @click.stop="onViewProduct(prod)" label="View">
                <template #prefix>
                  <EyeIcon :width="16" :height="16" />
  
  
                </template>
              </CustomButton>
              <CustomButton :rounded="'full'" :prefixIcon="true" label="Edit" variant="success"
                @click.stop="onEditProduct(prod)">
                <template #prefix>
                  <PencilIcon :width="16" :height="16" />
                </template>
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </template>
  
    <AddFinishedProductModal :isFinishedProductFormModal="isFinishedProductFormModal" :product="product"
      :workInProgress="null" @update:isFinishedProductFormModal="(value) => isFinishedProductFormModal = value" />
  
    <ViewProductModal :isViewProductModal="isViewProductModal" :product="product"
      @update:isViewProductModal="(value) => isViewProductModal = value" />
  
  </admin-layout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import PlusIcon from '~/icons/PlusIcon.vue'
import { useFinishedProductsStore } from '~/store/finished_products'
import { useCurrency } from '~/composables/useCurrency'
import { useRouter } from 'vue-router'
import CustomButton from '~/components/common/buttons/CustomButton.vue'
import { PencilIcon, PendingIcon } from '~/icons'
import EyeIcon from '~/icons/EyeIcon.vue'
import type { FinishedProduct } from '~/utils/models/finished_products'
import AddFinishedProductModal from '@/components/production/modals/AddFinishedProductModal.vue'
import ViewProductModal from '@/components/production/modals/ViewProductModal.vue'


const { formatCurrency } = useCurrency()
const finishedProductsStore = useFinishedProductsStore()
const products = computed(() => finishedProductsStore.products)
const isLoading = computed(() => finishedProductsStore.isLoading)
const currentPageTitle = ref('Products')
const config = useRuntimeConfig()
const router = useRouter()

const product = ref()

const isFinishedProductFormModal = ref(false)
const isViewProductModal = ref(false)
// const product = computed(() => finishedProductsStore.selectedProduct);


onMounted(async () => {
  await finishedProductsStore.getFinishedProducts()
})

function onAddProduct() {
  router.push('/admin/rugs/create')
}

function onView(prod: any) {
  router.push(`/admin/products/${prod.id}`)
}

function onEdit(prod: any) {
  router.push(`/admin/products/${prod.id}/edit`)
}

const onEditProduct = (updateProduct: FinishedProduct) => {
  finishedProductsStore.setEditProductForm(updateProduct);
  product.value = updateProduct;

  isFinishedProductFormModal.value = true;
}
const onViewProduct = (updateProduct: FinishedProduct) => {
  finishedProductsStore.setEditProductForm(updateProduct);
  product.value = updateProduct;

  isViewProductModal.value = true;
}

const types = [
  { label: 'All', value: 'all' },
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
]
const selectedType: any = ref<'all' | 'small' | 'medium' | 'large'>('all')

// computes filtered list
const filteredProducts = computed(() => {
  if (selectedType.value === 'all') return products.value.data
  return products.value.data.filter((p: FinishedProduct) =>
    p.order?.rug?.type?.toLowerCase() === selectedType.value
  )
})

</script>

<style>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
