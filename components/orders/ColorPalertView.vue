<!-- components/ColorBadgeList.vue -->
<template>
    <div class="flex flex-wrap gap-2">
        <span v-for="(color, index) in colors" :key="index"
            class="px-3 py-1 text-sm font-medium rounded-full border shadow-sm"
            :style="{ backgroundColor: color, color: getTextColor(color) }">
            {{ color }}
        </span>
    </div>
</template>
  
  <script setup>
import { computed } from 'vue'

const props = defineProps({
  colors: {
    type: Array,
    required: true,
    default: () => [],
  },
})

// Optional: determine if text should be white or black based on background
function getTextColor(bgColor) {
  try {
    const c = document.createElement('div')
    c.style.color = bgColor
    document.body.appendChild(c)
    const computedColor = getComputedStyle(c).color
    document.body.removeChild(c)

    const rgb = computedColor.match(/\d+/g)?.map(Number) || [255, 255, 255]
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
    return brightness > 150 ? '#000' : '#fff'
  } catch {
    return '#000'
  }
}
  </script>
  