<template>
  <div
    class="relative group block w-full max-w-[520px] h-[500px] rounded-2xl overflow-hidden border border-gray-200 bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow"
  >
    <!-- Full-size background carousel -->
    <Carousel
      ref="carouselRef"
      :value="images"
      :numVisible="1"
      :numScroll="1"
      :circular="true"
      orientation="vertical"
      :showIndicators="images.length > 1"
      class="absolute inset-0 w-full h-full"
    >
      <template #item="slotProps">
        <div class="relative w-full h-full">
          <img
            :src="getImageUrl(slotProps.data)"
            :alt="slotProps.data.image_name || `Product image ${slotProps.index + 1}`"
            class="w-full h-full object-cover"
          />
          <div
            v-if="slotProps.data.image_name"
            class="absolute top-4 left-0 right-0 text-center z-0"
          >
            <span
              class="text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded"
              >{{ slotProps.data.image_name }}</span
            >
          </div>
        </div>
      </template>
      
      <!-- Custom navigation buttons -->
      <template #header v-if="images.length > 1">
        <div class="absolute inset-0 z-10 pointer-events-none">
          <button 
            @click.stop="prevImage"
            class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
            aria-label="Previous image"
          >
            <i class="pi pi-chevron-left text-sm"></i>
          </button>
          <button 
            @click.stop="nextImage"
            class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
            aria-label="Next image"
          >
            <i class="pi pi-chevron-right text-sm"></i>
          </button>
        </div>
      </template>
    </Carousel>

    <!-- Overlay Product Info -->
    <div
      class="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/60 to-transparent h-1/2 z-0"
    >
      <h3 class="text-xl font-medium text-white truncate">{{ product.name }}</h3>
      <p class="mt-1.5 text-sm text-white line-clamp-3">
        {{ product.description }}
      </p>
      <div class="mt-3 text-white text-sm font-semibold">
        {{ formatCurrency(product.total_price) }}
        <span class="text-xs text-gray-200 ml-1">
          / {{ product.available_quantity }} pcs
        </span>
      </div>

      <!-- Buttons -->
      <div class="mt-4 flex gap-2">
        <CustomButton
          :rounded="'full'"
          :prefixIcon="true"
          @click.stop="$emit('view', product)"
          label="View"
          class="bg-white/20 hover:bg-white/30 text-white"
        >
          <template #prefix>
            <EyeIcon :width="16" :height="16" />
          </template>
        </CustomButton>

        <CustomButton
          :rounded="'full'"
          :prefixIcon="true"
          label="Edit"
          variant="success"
          @click.stop="$emit('edit', product)"
        >
          <template #prefix>
            <PencilIcon :width="16" :height="16" />
          </template>
        </CustomButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRuntimeConfig } from "#app";
import CustomButton from "~/components/common/buttons/CustomButton.vue";
import EyeIcon from "~/icons/EyeIcon.vue";
import PencilIcon from "~/icons/PencilIcon.vue";
import Carousel from "primevue/carousel";
import { useCurrency } from "~/composables/useCurrency";

interface ImageItem {
  id?: number;
  image_path?: string;
  image_name?: string;
  url?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  total_price: number;
  available_quantity: number;
  images: ImageItem[];
}

const { formatCurrency } = useCurrency();

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits(["view", "edit"]);

const config = useRuntimeConfig();
const carouselRef = ref<InstanceType<typeof Carousel>>();
const images = ref(props.product.images || []);

const getImageUrl = (image: ImageItem): string => {
  if (image.url) return image.url;
  if (image.image_path) return `${config.public.imageUrl}${image.image_path}`;
  return "/placeholder.png";
};

const nextImage = () => {
  carouselRef.value?.next();
};

const prevImage = () => {
  carouselRef.value?.prev();
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Override PrimeVue carousel styles to make it full-size */
:deep(.p-carousel) {
  height: 100%;
}

:deep(.p-carousel-container) {
  height: 100%;
}

:deep(.p-carousel-items-container) {
  height: 100%;
}

:deep(.p-carousel-indicators) {
  position: absolute;
  bottom: 32%;
  left: 0;
  right: 0;
  z-index: 20;
}

:deep(.p-carousel-indicator > button) {
  width: 8px !important;
  height: 8px !important;
  border-radius: 9999px !important;
  background-color: rgba(255, 255, 255, 0.5) !important;
}

:deep(.p-carousel-indicator.p-highlight > button) {
  width: 16px !important;
  background-color: white !important;
}

:deep(.p-carousel-items-content) {
  height: 100%;
}

:deep(.p-carousel-item) {
  height: 100%;
}
</style>
