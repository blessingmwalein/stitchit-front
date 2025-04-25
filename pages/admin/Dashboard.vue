<template>
  <admin-layout v-if="isMounted">
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-12">
        <ecommerce-metrics :dashboardData="dashboardData" />
      </div>
      <div class="col-span-12 xl:col-span-5">
        <!-- <monthly-sale /> -->
      </div>

      <div class="col-span-12">
        <statistics-chart :salesData="salesData" />
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
