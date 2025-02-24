import VueApexCharts from 'vue3-apexcharts';

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) return // Ensure it's not loaded on the server
  nuxtApp.vueApp.use(VueApexCharts)
})
