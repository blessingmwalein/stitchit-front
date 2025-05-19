<template>
    <div v-if="images.length > 0" class="image-carousel mt-6">
        <h5 class="mb-3">Product Images Preview</h5>

        <Carousel ref="carouselRef" :value="images" :numVisible="1" :numScroll="1" :circular="true"
            :showIndicators="images.length > 1" class="mt-4 border rounded-lg p-4 bg-gray-50">
            <template #item="slotProps">
                <div class="carousel-item w-full h-[400px] relative overflow-hidden">
                    <img :src="getImageUrl(slotProps.data)" :alt="slotProps.data.image_name || 'Product image'"
                        class="absolute top-0 left-0 w-full h-full object-cover" />
                    <div class="absolute bottom-2 left-0 right-0 text-center">
                        <span class="text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                            {{ slotProps.data.image_name || `Image ${slotProps.index + 1}` }}
                        </span>
                    </div>
                </div>
            </template>
        </Carousel>

        <!-- Thumbnails -->
        <div v-if="images.length > 1" class="flex flex-wrap gap-2 justify-center mt-4">
            <div v-for="(image, index) in images" :key="image.id"
                class="cursor-pointer p-1 border rounded-md transition-all hover:shadow-md border-gray-300"
                @click="scrollToImage(index)">
                <img :src="getImageUrl(image)" :alt="`Thumbnail ${index + 1}`" class="w-16 h-16 object-cover rounded" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRuntimeConfig } from "#app";


interface ImageItem {
    id: number
    finished_product_id: number
    image_path?: string
    image_name?: string
    url?: string // For temporary/preview images
    created_at?: string
    updated_at?: string
}

const props = defineProps<{
    images: ImageItem[]
}>()

const config = useRuntimeConfig()
const carouselRef = ref<InstanceType<typeof Carousel>>()

const getImageUrl = (image: ImageItem): string => {
    // For temporary images (e.g., selected but not uploaded)
    if (image.url) {
        return image.url
    }

    // For images from the server
    if (image.image_path) {
        return `${config.public.imageUrl}${image.image_path}`
    }

    // Fallback image
    return '/placeholder.png'
}

const scrollToImage = (index: number) => {
    carouselRef.value?.scrollTo(index)
}
</script>
