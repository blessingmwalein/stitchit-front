<template>
    <span :class="[baseStyles, statusColorClass]">
        <slot>{{ status }}</slot>
    </span>
</template>
  
  <script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: 'Tufting' | 'Binding' | 'In Progress'
}

const props = defineProps<Props>()

const baseStyles =
  'inline-flex items-center px-3 py-0.5 rounded-full font-semibold text-sm capitalize shadow-sm'

const statusColorMap: Record<Props['status'], string> = {
  Tufting: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600/20 dark:text-yellow-400',
  Binding: 'bg-blue-100 text-blue-800 dark:bg-blue-600/20 dark:text-blue-400',
  'In Progress': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-600/20 dark:text-indigo-400',
}

const statusColorClass = computed(() => statusColorMap[props.status])
  </script>
  