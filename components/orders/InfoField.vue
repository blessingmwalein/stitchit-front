

<template>
  <div>
    <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{{ label }}</p>
    <p class="text-sm font-medium text-gray-800 dark:text-white/100">{{ value ?? 'N/A' }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  label: string;
  value: string | number | null | undefined;
}>();
</script>
