<template>
  <div
    class="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
    <div class="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
      <div class="w-full">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Sales Statistics</h3>
        <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Target you’ve set for each month
        </p>
      </div>

      <div class="relative">
        <div class="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
          <button v-for="option in options" :key="option.value" @click="selected = option.value" :class="[
            selected === option.value
              ? ' text-gray-900 dark:text-white bg-white dark:bg-gray-800'
              : 'text-gray-500 dark:text-gray-400',
            'px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 hover: dark:hover:bg-gray-800 dark:hover:text-white',
          ]">
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartThree" class="-ml-4 min-w-[1000px] xl:min-w-full pl-2">
        <client-only>
          <VueApexCharts type="area" height="310" :options="chartOptions" :series="series" />
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { defineProps } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  salesData: {
    type: Array,
    required: true,
  },
})

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const series = computed(() => {
  const data = Array.isArray(props.salesData) ? props.salesData : []

  return [
    {
      name: 'Sales',
      data: data.map(item => parseFloat(item.total_sales || 0)),
    },
  ]
})


const chartOptions = ref({
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#465FFF'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  fill: {
    gradient: {
      enabled: true,
      opacityFrom: 0.55,
      opacityTo: 0,
    },
  },
  stroke: {
    curve: 'straight',
    width: [2],
  },
  markers: {
    size: 0,
  },
  labels: {
    show: false,
    position: 'top',
  },
  grid: {
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    x: {
      format: 'MMM',
    },
  },
  xaxis: {
    type: 'category',
    categories: monthLabels,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
  },
})

</script>

<style scoped>
.area-chart {
  width: 100%;
}
</style>
