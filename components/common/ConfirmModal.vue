<template>
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center z-50">
      <!-- Overlay -->
      <div 
        class="fixed inset-0 h-full w-full bg-gray-500/50 backdrop-blur-sm" 
        aria-hidden="true" 
        @click="confirm(false)"
      ></div>
  
      <!-- Modal Box -->
      <div class="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-5">
        <!-- Close Button -->
        <button 
          @click="confirm(false)"
          class="transition-color absolute right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
        >
          <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
              fill="" />
          </svg>
        </button>
  
        <!-- Header Slot (Title) -->
        <div class="text-lg font-semibold text-gray-800 mb-2">
          <slot name="header">Confirm Action</slot>
        </div>
  
        <!-- Body Slot (Message) -->
        <div class="text-gray-600 mb-4">
          <slot name="body">Are you sure you want to proceed?</slot>
        </div>
  
        <!-- Buttons -->
        <div class="flex justify-end space-x-3">
          <button 
            @click="confirm(false)" 
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button 
            @click="confirm(true)" 
            class="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    visible: Boolean, // Prop to control modal visibility
  });
  
  const emit = defineEmits(['update:visible', 'confirmed']);
  
  const confirm = (value) => {
    emit('confirmed', value); // Emit confirmation result
    emit('update:visible', false); // Close modal after confirmation
  };
  </script>
  