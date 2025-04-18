<template>
  <div class="w-10 h-10 bg-blue-200 text-blue-700 flex items-center justify-center rounded-full font-medium">
    <span>{{ initials }}</span>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

// Define props to accept the 'name' as input
const props = defineProps({
  name: {
    type: String,
    required: true
  }
});

// Compute the initials based on the name prop
const initials = computed(() => {
  const nameParts = props.name.split(" ");
  return nameParts.map(part => part.charAt(0).toUpperCase()).join("");
});
</script>

<style scoped>
.w-10 {
  width: 40px;
}
.h-10 {
  height: 40px;
}
.rounded-full {
  border-radius: 50%;
}
</style>
