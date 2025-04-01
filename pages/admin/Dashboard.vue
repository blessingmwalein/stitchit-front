<template>
  <admin-layout v-if="isMounted">
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-12">
        <ecommerce-metrics />
      </div>
      <div class="col-span-12 xl:col-span-5">
        <!-- <monthly-sale /> -->
      </div>

      <div class="col-span-12">
        <statistics-chart />
      </div>

      <div class="col-span-12 xl:col-span-12">
        <recent-orders />
      </div>
    </div>
  </admin-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue'
import RecentOrders from '../components/ecommerce/RecentOrders.vue'

const isMounted = ref(false) // Track if component has mounted

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
</script>
