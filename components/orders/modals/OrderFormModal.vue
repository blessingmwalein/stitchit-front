<template>
  <Modal v-if="isOrderFormModal" @close="closeModal()">
    <template #header>
      <button @click="closeModal()"
        class="absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700">
        <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
            fill="" />
        </svg>
      </button>
      <div class="px-2 pr-14">
        <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {{ order ? `Edit Order - ${order.rug_id}` : 'Add New Order' }}
        </h4>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {{ order ? 'Update the order details below.' : 'Fill in the details to create a new order.' }}
        </p>
      </div>
    </template>
    <template #body>
      <div class="no-scrollbar relative w-full overflow-y-auto bg-white dark:bg-gray-900">
        <!-- Image Upload Section -->
        <Alert v-if="orderStore.errorMessage" variant="error" title="Something went wrong"
          :message="orderStore.errorMessage ?? ''" :showLink="false" />
        <div class="card flex flex-col items-center gap-6 w-full mb-4 mt-4">
          <!-- Full-width File Upload -->
          <!-- label to choose design  -->
          <label class="text-base font-normal text-gray-800 dark:text-white/90 ">Upload Design</label>
          <FileUpload title="Choose Design" mode="basic" @select="onFileSelect" customUpload auto severity="secondary"
            class="p-button-outlined" />
          <!-- Image Preview -->
          <div v-if="imageSrc || order?.image_url" class="image-container">
            <img :src="imageSrcComputed" alt="Image preview" class="image-preview" />
          </div>
        </div>
  
        <client-only>
          <Vueform @submit="handleSubmit" v-model="orderForm" :show-errors="false" :display-errors="false"
            :endpoint="false" sync>
            <SelectElement label="Select Rug" name="rug_id" :native="false" :rules="['required']"
              :columns="{ container: 6 }" :items="rugsStore.rugs.data.map(rug => ({ value: rug.id, label: rug.name }))" />
            <SelectElement label="Select Client" :search="true" @search-change="searchClients" name="client_id"
              :native="false" :rules="['required']" :columns="{ container: 6 }"
              :items="clientStore.clients?.data?.map(client => ({ value: client.id, label: client.name }))" />
            <TextElement name="total_price" input-type="number" label="Total Price" :rules="['required']"
              :columns="{ container: 6 }" />
            <TagsElement :search="true" name="color_palet" label="Color Palette" :rules="['required']"
              :columns="{ container: 6 }" :items="colorsData" />
  
            <SelectElement label="Unit" name="unit" :native="false" :rules="['required']" :columns="{ container: 4 }"
              :items="unitsData" />
            <TextElement name="length" input-type="number" label="Length" :rules="['required']"
              :columns="{ container: 4 }" />
            <TextElement name="width" input-type="number" label="Width" :rules="['required']"
              :columns="{ container: 4 }" />
  
            <SelectElement label="Shape" name="shape" :native="false" :rules="['required']" :columns="{ container: 6 }"
              :items="shapesData" />
            <DateElement name="delivery_date" label="Delivery Date" :rules="['required']" :columns="{ container: 6 }" />
            <TextareaElement name="description" label="Description" :rules="['required', 'max:255']"
              :columns="{ container: 12 }" />
  
            <StaticElement name="span" :columns="{ container: 4 }" tag="span" />
            <ButtonElement name="close" button-class="bg-red-500" :columns="{ container: 4 }" @click="closeModal()"
              button-label="Close" :full="true" size="lg" />
            <ButtonElement :loading="isLoading" button-class="bg-brand-500" name="register" :columns="{ container: 4 }" :submits="true"
              button-label="Submit" :full="true" size="lg" />
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
import { useRuntimeConfig } from "#app";


const config = useRuntimeConfig();

const emit = defineEmits(['update:isOrderFormModal', 'success']);
const rugsStore = useRugStore();
const clientStore = useClientsStore();
const orderStore = useOrderStore();
const snackbar = useSnackbar();
const isLoading = computed(() => orderStore.isLoading)

const imageSrc = ref(null);

const props = defineProps({
  isOrderFormModal: {
    type: Boolean,
    required: true,
  },
  order: {
    type: Object,
    required: true,
  },
});

const orderForm = computed({
  get: () => orderStore.createOrderForm,
  set: (data) => orderStore.createOrderForm = data
});

const closeModal = () => {

  //clear form data
  orderStore.setSelectedOrder(null);
  orderStore.resetForm();
  emit('update:isOrderFormModal', false);
};

onMounted(async () => {
  await rugsStore.getRugs(); // Fetch only if user is not loaded
  if (props.order !== null) {

    console.log(props.order);
    searchClients(props.order.client_name)
  }
});

//computed image src
const imageSrcComputed = computed(() => {
  if (imageSrc.value) {
    return imageSrc.value;
  } else if (props.order?.image_url) {
    return `${config.public.imageUrl}${props.order.image_url}`;
  }
  return null;
});

const handleSubmit = async () => {
  try {
    if (orderStore.selectedOrder?.id) {
      await orderStore.updateOrder();
    } else {
      await orderStore.createOrder();
    }

    if (orderStore.errorMessage) {
      snackbar.add({ type: "error", text: orderStore.errorMessage });
      return;
    }

    if (orderStore.successMessage) {
      snackbar.add({
        type: "success",
        text: orderStore.successMessage,
      });
      orderStore.resetForm();
      closeModal();
    }

  } catch (error) {
    snackbar.add({ type: "error", text: orderStore.errorMessage });
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
  orderStore.setCreateFormImage(file);

};

watch(() => props.order, async (newOrder: any) => {
  if (newOrder) {
    await searchClients(newOrder.client_name);

  }
}, { immediate: true });



const searchClients = async (data: any) => {
  console.log(data);

  //set form name, email, phone to search
  clientStore.clientSearchForm.name = data;


  try {
    await clientStore.searchClients();

  } catch (error) {

  }



}


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