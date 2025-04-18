<template>
    <span :class="[baseStyles, statusColorClass]">
      <slot>{{ status }}</slot>
    </span>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface Props {
    status: 'Pending' | 'Processing' | 'In Progress' | 'Delivered' | 'Cancelled'
  }
  
  const props = defineProps<Props>()
  
  const baseStyles =
    'inline-flex items-center px-3 py-0.5 rounded-full font-semibold text-sm capitalize shadow-sm'
  
  const statusColorMap: Record<Props['status'], string> = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600/20 dark:text-yellow-400',
    Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-600/20 dark:text-blue-400',
    'In Progress': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-600/20 dark:text-indigo-400',
    Delivered: 'bg-green-100 text-green-800 dark:bg-green-600/20 dark:text-green-400',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-600/20 dark:text-red-400',
  }
  
  const statusColorClass = computed(() => statusColorMap[props.status])
  </script>
  