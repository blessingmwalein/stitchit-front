<template>
  <div class="fixed inset-0 flex items-center justify-center z-99999">
    <div
      class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-sm"
      aria-hidden="true"
      @click="$emit('close')"
    ></div>
    
    <div class="relative bg-white rounded-3xl shadow-lg w-full max-w-2xl flex flex-col max-h-[90vh]">
      <!-- Header Slot -->
      <div class="p-4 border-b border-gray-300 sticky top-0 bg-white z-10 rounded-t-3xl">
        <slot name="header"></slot>
      </div>
      
      <!-- Body Slot (Scrollable) -->
      <div class="p-4 overflow-y-auto flex-1">
        <slot name="body"></slot>
      </div>
      
      <!-- Bottom Slot -->
      <!-- <div class="p-4 border-t border-gray-300 sticky bottom-0 bg-white z-10 rounded-b-3xl">
        <slot name="bottom"></slot>
      </div> -->
    </div>
  </div>
</template>

<script setup>
// No additional setup needed
</script>
