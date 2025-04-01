<template>
    <div class="space-y-2">
      <label v-if="label" :for="id" class="mb-1.5 block text-sm font-medium" :class="labelClass">
        {{ label }}
      </label>
      <div class="relative">
        <input
          :id="id"
          v-bind="$attrs"
          :type="isPassword ? (showPassword ? 'text' : 'password') : type"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          class="w-full rounded-lg border bg-transparent px-4 py-2.5 pr-10 text-sm  focus:outline-none focus:ring"
          :class="inputClass"
        />
        <span v-if="isPassword" @click="togglePasswordVisibility" class="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer">
          <svg v-if="!showPassword" class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z" fill="#98A2B3" />
          </svg>
          <svg v-else class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212Z" fill="#98A2B3" />
          </svg>
        </span>
      </div>
      <div v-if="errorMessage && errorMessage.length" class="mt-1.5">
        <p
          v-for="(error, index) in errorMessage"
          :key="index"
          class="text-theme-xs text-error-500"
        >
          {{ error }}
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref } from 'vue';
  
  const props = defineProps({
    modelValue: String,
    label: String,
    id: String,
    type: {
      type: String,
      default: 'text'
    },
    // Now expects a list of error strings
    errorMessage: {
      type: Array,
      default: () => []
    },
    status: String,
  });
  
  defineEmits(['update:modelValue']);
  
  const showPassword = ref(false);
  const isPassword = computed(() => props.type === 'password');
  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };
  
  const inputClass = computed(() => ({
    'border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-brand-500 focus:border-brand-300': !props.status,
    'border-error-300 text-error-700 focus:ring-error-500 focus:border-error-300': props.status === 'error',
    'border-success-300 text-success-700 focus:ring-success-500 focus:border-success-300': props.status === 'success',
    'border-gray-300 text-gray-400 placeholder-gray-300 cursor-not-allowed': props.status === 'disabled'
  }));
  
  const labelClass = computed(() => ({
    'text-gray-700': !props.status,
    'text-error-500': props.status === 'error',
    'text-success-500': props.status === 'success',
    'text-gray-400': props.status === 'disabled'
  }));
  
  const statusIcon = computed(() => props.status === 'error' || props.status === 'success');
  </script>
  