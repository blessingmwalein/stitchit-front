<template>
    <button 
        :type="type" 
        :disabled="disabled || isLoading" 
        :class="buttonClass" 
        @click="handleClick"
        class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium transition"
    >
        <span v-if="isLoading" class="loader mr-2"></span>
        <slot name="prefix" v-if="prefixIcon" />
        <span>{{ label }}</span>
        <slot name="suffix" v-if="suffixIcon" />
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    label: String,
    type: {
        type: String,
        default: 'button'
    },
    variant: {
        type: String,
        default: 'primary',
        validator: (value) => ['primary', 'success', 'warning', 'danger'].includes(value)
    },
    outlined: Boolean,
    rounded: {
        type: String,
        default: 'lg' // Default border-radius
    },
    prefixIcon: Boolean,
    suffixIcon: Boolean,
    disabled: Boolean,
    isLoading: Boolean
});

// Define emits for the click event
const emit = defineEmits(['click']);

const handleClick = (event) => {
    if (props.disabled || props.isLoading) return;
    emit('click', event);
};

// Map each variant to its corresponding Tailwind classes
const colorMap = {
    primary: {
        bg: 'bg-brand-500',
        hover: 'hover:bg-brand-600',
        text: 'text-white',
        border: 'border-brand-500',
        hoverBg: 'hover:bg-brand-100'
    },
    success: {
        bg: 'bg-green-500',
        hover: 'hover:bg-green-600',
        text: 'text-white',
        border: 'border-green-500',
        hoverBg: 'hover:bg-green-100'
    },
    warning: {
        bg: 'bg-yellow-500',
        hover: 'hover:bg-yellow-600',
        text: 'text-white',
        border: 'border-yellow-500',
        hoverBg: 'hover:bg-yellow-100'
    },
    danger: {
        bg: 'bg-red-500',
        hover: 'hover:bg-red-600',
        text: 'text-white',
        border: 'border-red-500',
        hoverBg: 'hover:bg-red-100'
    }
};

const buttonClass = computed(() => {
    const colors = colorMap[props.variant] || colorMap.primary;
    const classes = [];

    // Ensuring Tailwind processes custom border-radius correctly
    const roundedClass = props.rounded ? `rounded-${props.rounded}` : 'rounded-lg';
    classes.push(roundedClass);

    if (props.outlined) {
        classes.push(
            'border',
            'bg-transparent',
            colors.text,
            colors.border,
            colors.hoverBg
        );
    } else {
        classes.push(
            colors.bg,
            colors.text,
            colors.hover
        );
    }

    if (props.disabled || props.isLoading) {
        classes.push('opacity-50', 'cursor-not-allowed');
    }

    return classes.join(' ');
});
</script>

<style>
.loader {
    border: 2px solid white;
    border-top: 2px solid transparent;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
