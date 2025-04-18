<template>
  <div class="fixed inset-0 flex items-center justify-center z-99999">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-sm"
      aria-hidden="true"
      @click="$emit('close')"
    ></div>

    <!-- Modal Container -->
    <div
      class="relative bg-white rounded-3xl shadow-lg w-full flex flex-col max-h-[90vh]"
      :class="computedWidth"
    >
      <!-- Header -->
      <div class="p-4 border-b border-gray-300 sticky top-0 bg-white z-10 rounded-t-3xl">
        <slot name="header"></slot>
      </div>

      <!-- Body -->
      <div class="p-4 overflow-y-auto flex-1">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

// Props
const props = defineProps({
  width: {
    type: String,
    default: 'max-w-2xl', // Tailwind max width class
  },
})

// Computed Tailwind width class
const computedWidth = computed(() => {
  return props.width
})
</script>
