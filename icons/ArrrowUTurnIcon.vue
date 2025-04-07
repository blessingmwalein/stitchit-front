<template>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
    :width="width" :height="height">
        <path stroke-linecap="round" stroke-linejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
    </svg>
</template>
<script setup lang="ts">
//width and height props
defineProps({
  width: {
    type: Number,
    default: 24
  },
  height: {
    type: Number,
    default: 24
  }
})

</script>