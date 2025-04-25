<template>
  <admin-layout v-if="isMounted">
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-12">
        <!-- Skeleton for EcommerceMetrics -->
        <div v-if="isLoading">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            <div v-for="n in 3" :key="n"
              class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 mb-4">
                <Skeleton shape="circle" size="3rem" />
              </div>
              <Skeleton width="50%" class="mb-2" />
              <Skeleton width="30%" />
            </div>
          </div>
        </div>
        <ecommerce-metrics v-else :dashboardData="dashboardData" />
      </div>
  
      <div class="col-span-12 xl:col-span-5">
        <!-- Future: monthly-sale -->
      </div>
  
      <div class="col-span-12">
        <!-- Skeleton for StatisticsChart -->
        <div v-if="isLoading"
          class="rounded-2xl border border-gray-200 dark:border-gray-200 p-6 bg-surface-0 dark:bg-surface-900">
          <div class="flex mb-4">
            <Skeleton shape="circle" size="4rem" class="mr-2" />
            <div>
              <Skeleton width="10rem" class="mb-2" />
              <Skeleton width="5rem" class="mb-2" />
              <Skeleton height=".5rem" />
            </div>
          </div>
          <Skeleton width="100%" height="150px" />
          <div class="flex justify-between mt-4">
            <Skeleton width="4rem" height="2rem" />
            <Skeleton width="4rem" height="2rem" />
          </div>
        </div>
        <statistics-chart v-else :salesData="salesData" />
      </div>
  
      <!-- <div class="col-span-12 xl:col-span-12">
          <recent-orders />
        </div> -->
    </div>
  </admin-layout>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue'
import RecentOrders from '../components/ecommerce/RecentOrders.vue'
import { useFinishedProductsStore } from '~/store/finished_products'

const isMounted = ref(false) // Track if component has mounted
const finishedProductsStore = useFinishedProductsStore()

const dashboardData = computed(() => finishedProductsStore.dashoardData)
const salesData = computed(() => finishedProductsStore.salesData)
const isLoading = computed(() => finishedProductsStore.isLoading)

onMounted(async () => {
  isMounted.value = true // Set to true once component is mounted

  await finishedProductsStore.getDashoardData()
  await finishedProductsStore.getSalesDashboardData()

})

definePageMeta({
  middleware: [
    function (to, from) {
      // Custom inline middleware
    },
    'auth',
  ],
});
</script>
