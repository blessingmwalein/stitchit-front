<template>
  <Modal v-if="isFinishedProductFormModal" @close="closeModal()" width="max-w-4xl">
    <template #header>
      <button @click="closeModal()"
        class="absolute right-5 top-5 z-1000 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700">
        <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
            fill="" />
        </svg>
      </button>
      <div class="px-2 pr-14">
        <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {{ product ? `Edit Product - ${product.name}` : 'Add New Product' }}
        </h4>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {{ product ? 'Update the product details below.' : 'Fill in the details to create a new product.' }}
        </p>
      </div>
    </template>
    <template #body>
      <div class="no-scrollbar relative w-full overflow-y-auto bg-white dark:bg-gray-900">

        <Alert v-if="finishedProductStore.errorMessage" variant="error" title="Something went wrong"
          :message="finishedProductStore.errorMessage ?? ''" :showLink="false" />
        <div class="card flex flex-col items-center gap-6 w-full mb-4 mt-4">

          <!-- <label class="text-base font-normal text-gray-800 dark:text-white/90 ">Product Image</label>
          <FileUpload title="Choose Design" mode="basic" @select="onFileSelect" customUpload auto severity="secondary"
            class="p-button-outlined" />
        
          <div v-if="imageSrc || product?.default_image" class="image-container">
            <img :src="imageSrcComputed" alt="Image preview" class="image-preview" />
          </div> -->

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Product Images</h3>
            <ProductImageUpload :productId="product ? product?.id : null" :existingImages="product?.images"
              @images-updated="handleImagesUpdated" />
          </div>

        </div>


        <client-only>
          <Vueform @submit="handleSubmit" v-model="finishedProductForm" :show-errors="false" :display-errors="false"
            :endpoint="false" sync>


            <TextElement name="total_price" input-type="number" label="Total Price" :rules="['required']"
              :columns="{ container: 6 }" />

            <SelectElement label="Unit" name="unit" :native="false" :rules="['required']" :columns="{ container: 6 }"
              :items="unitsData" />
            <SelectElement label="Shape" name="shape" :native="false" :rules="['required']" :columns="{ container: 4 }"
              :items="shapesData" />
            <TextElement name="length" input-type="number" label="Length" :rules="['required']"
              :columns="{ container: 4 }" />
            <TextElement name="width" input-type="number" label="Width" :rules="['required']"
              :columns="{ container: 4 }" />

            <TextElement name="name" input-type="text" label="Name" :rules="['required']" :columns="{ container: 6 }" />

            <TextElement name="available_quantity" input-type="number" label="Quantity" :rules="['required']"
              :columns="{ container: 6 }" />

            <TextElement name="order_id" hidden input-type="number" label="Order" :columns="{ container: 6 }" />

            <TextElement name="work_in_progress_id" hidden input-type="number" label="Work In Progress"
              :columns="{ container: 6 }" />

            <TextElement name="rug_id" input-type="number" hidden label="Rug Id" :columns="{ container: 6 }" />

            <TextElement name="id" input-type="number" hidden label="Id" :columns="{ container: 6 }" />




            <TextareaElement name="description" label="Description" :rules="['required', 'max:255']"
              :columns="{ container: 12 }" />

            <StaticElement name="span" :columns="{ container: 4 }" tag="span" />
            <ButtonElement name="close" button-class="bg-red-500" :columns="{ container: 4 }" @click="closeModal()"
              button-label="Close" :full="true" size="lg" />
            <ButtonElement :loading="isLoading" button-class="bg-brand-500" name="register" :columns="{ container: 4 }"
              :submits="true" button-label="Submit" :full="true" size="lg" />
          </Vueform>
        </client-only>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, onMounted, watch } from 'vue';
import Modal from '@/components/profile/Modal.vue';
import { useRugStore } from '~/store/rugs';
import { useClientsStore } from '~/store/client';
import { useOrderStore } from '~/store/orders';
import { colorsData, shapesData, unitsData } from '~/utils/data/colors';
import Alert from '~/components/ui/Alert.vue';
import ProductImageUpload from './ProductImageUpload.vue';
import { useRuntimeConfig } from "#app";
import { useFinishedProductsStore } from '~/store/finished_products';
import type { CreateFinishedProductRequest, FinishedProduct } from '~/utils/models/finished_products';


const config = useRuntimeConfig();

const emit = defineEmits(['update:isFinishedProductFormModal', 'success']);
const rugsStore = useRugStore();
const clientStore = useClientsStore();
const finishedProductStore = useFinishedProductsStore();
const snackbar = useSnackbar();
const isLoading = computed(() => finishedProductStore.isLoading)

const imageSrc = ref(null);

const props = defineProps({
  isFinishedProductFormModal: {
    type: Boolean,
    required: true,
  },
  product: {
    type: Object,
    required: true,
  },
  workInProgress: {
    type: Object,
    required: true,
  },
});

const finishedProductForm = computed({
  get: () => finishedProductStore.createFinishedProductForm,
  set: (data: CreateFinishedProductRequest) => finishedProductStore.createFinishedProductForm = data
});

const closeModal = () => {

  //clear form data
  // finishedProductStore.setSelectedProduct(null);
  finishedProductStore.resetForm();
  emit('update:isFinishedProductFormModal', false);
};

onMounted(async () => {
  // finishedProductStore.setProductForm(props.workInProgress);
});

watch(
  () => props.workInProgress,
  (newValue: any) => {
    if (newValue) {
      finishedProductStore.setProductForm(newValue);
    }
  },
  { immediate: true }
);

//computed image src
const imageSrcComputed = computed(() => {
  if (imageSrc.value) {
    return imageSrc.value;
  } else if (props.product?.default_image) {
    return `${config.public.imageUrl}${props.product.default_image}`;
  }
  return null;
});

const handleSubmit = async () => {
  try {
    if (finishedProductStore.selectedProduct?.id) {
      await finishedProductStore.updateFinishedProduct();
    } else {
      await finishedProductStore.createFinishedProduct();
    }

    if (finishedProductStore.errorMessage) {
      snackbar.add({ type: "error", text: finishedProductStore.errorMessage });
      return;
    }

    if (finishedProductStore.successMessage) {
      snackbar.add({
        type: "success",
        text: finishedProductStore.successMessage,
      });
      finishedProductStore.resetForm();
      closeModal();
    }

  } catch (error) {
    snackbar.add({ type: "error", text: finishedProductStore.errorMessage });
  }
};


const onFileSelect = (event) => {
  const file = event.files[0];

  console.log(file);
  const reader = new FileReader();

  reader.onload = (e) => {
    imageSrc.value = e.target.result;
  };

  reader.readAsDataURL(file);
  // Set the image in the form data
  finishedProductStore.setCreateFormImage(file);

};

// watch(() => props.product, async (newOrder: any) => {
//   if (newOrder) {
//     await searchClients(newOrder.client_name);

//   }
// }, { immediate: true });



</script>
<style scoped>
.image-container {
  width: 100%;
  /* Full width */
  max-width: 100%;
  /* Limit max width */
  height: 200px;
  /* Set a fixed height */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  background-color: #f9f9f9;
  margin-bottom: 20px;
}

.image-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  /* Ensures the whole image fits inside */
}
</style>