<template>
    <div class="space-y-2">
      <!-- <label v-if="label" :for="id" class="mb-1.5 block text-sm font-medium" :class="labelClass">
        {{ label }}
      </label> -->
      <div class="relative">
        <select
          v-bind="$attrs"
          :id="id"
          :value="modelValue"
          @change="$emit('update:modelValue', $event.target.value)"
          class="w-full rounded-lg border bg-transparent px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring"
          :class="inputClass"
        >
          <option value="" disabled>Select Option</option>
          <option v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <span v-if="showIcon" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
          <svg
            class="fill-current"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
              stroke=""
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
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
    options: {
      type: Array,
      required: true
    },
    errorMessage: {
      type: Array,
      default: () => []
    },
    status: String,
    showIcon: {
      type: Boolean,
      default: true
    }
  });
  
  defineEmits(['update:modelValue']);
  
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
  </script>
  