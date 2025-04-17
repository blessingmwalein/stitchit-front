<template>
  <Modal v-if="isMaterialFormModal" @close="closeModal()">
    <template #header>
      <button @click="closeModal()"
        class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
        <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
            fill="" />
        </svg>
      </button>
      <div class="px-2 pr-14">
        <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {{ material ? `Edit Material - ${material.name}` : 'Add New Material' }}
        </h4>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          {{
          material
          ? 'Fill in the details to edit the material.'
          : 'Fill in the details to add a new material.'
          }}
        </p>
      </div>
    </template>
    <template #body>
      <div class="no-scrollbar relative w-full  overflow-y-auto bg-white  dark:bg-gray-900">
        <client-only>
          <div class="mb-4">
            <Alert v-if="materialStore.errorMessage" variant="error" title="Something went wrong"
              :message="materialStore.errorMessage ?? ''" :showLink="false" />
          </div>
          <Vueform @submit="handleSubmit" v-model="materialForm" :show-errors="false" :display-errors="false"
            :endpoint="false" sync>
            <!-- <StaticElement name="personal_title" content="Deetails" tag="h3" /> -->
            <!-- <StaticElement name="divider" tag="hr" /> -->
            <TextElement name="name" label="Name" :rules="['required', 'max:255']" :columns="{
                                                          container: 6,
                                                          label: 12,
                                                          wrapper: 12,
                                                        }" />
  
  
            <SelectElement label="Material Type" :search="true" name="material_type_id"
              :native="false" :rules="['required']" :columns="{ container: 6 }"
              :items="materialStore.materialTypes?.data?.map(type => ({ value: type.id, label: type.name }))" />
  
            <SelectElement label="Unit" name="unit" :search="true" :native="false" input-type="search"
              autocomplete="disabled" placeholder="Type" :items="materialUnitsData" :columns="{
                                                            container: 6,
                                                          }" :rules="['required']" />
  
            <!-- <StaticElement name="contact_title" content="Contact details" tag="h3" top="2" /> -->
            <!-- <StaticElement name="divider_1" tag="hr" /> -->
            <TextElement name="price_per_unit" input-type="number" :rules="['required']" label="Unit Price"
              :columns="{ container: 6 }" />
  
  
            <TextElement name="brand" input-type="text" :rules="['required']" label="Brand"
              :columns="{ container: 12 }" />
  
  
  
            <StaticElement name="span" :columns="{
                                                          container: 4,
                                                        }" tag="span" />
            <ButtonElement name="close" button-class="bg-red-500" :columns="{
                                                          container: 4,
                                                        }" @click="closeModal()" button-label="Close" :full="true"
              size="lg" />
  
            <ButtonElement button-class="bg-brand-500" name="register" :columns="{
                                                          container: 4,
                                                        }" :submits="true" button-label="Submit" :full="true"
              size="lg" />
          </Vueform>
        </client-only>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import Modal from '@/components/profile/Modal.vue';
import { useAuthStore } from "~/store/auth";
import type { CreateClientRequest, UserClient } from '~/utils/models/client';
import CustomButton from '~/components/common/buttons/CustomButton.vue';
import Alert from "@/components/ui/Alert.vue";

import { useMaterialStore } from '~/store/material';
import type { CreateMaterialRequest, Material } from '~/utils/models/materials';
import { materialUnitsData } from '~/utils/data/colors';

const emit = defineEmits(['update:isMaterialFormModal', 'success']);
const materialStore = useMaterialStore();
const errors: Record<string, string> = materialStore.errors;


const snackbar = useSnackbar();

const props = defineProps({
  isMaterialFormModal: {
    type: Boolean,
    required: true,
  },
  material: {
    type: Object as () => Material | null,
    required: true,
  },
});

const materialForm = computed({
  get: () => materialStore.createMaterialForm,
  set: (data: CreateMaterialRequest) => materialStore.createMaterialForm = data
})

// Close modal function
const closeModal = () => {
  emit('update:isMaterialFormModal', false);
};

const success = () => {
  emit('success', true);
}

onMounted(async () => {
  await materialStore.getMaterialTypes(); // Fetch only if user is not loaded
});


const handleSubmit = async () => {
  // Call login and wait for it to finish
  console.log(materialStore.createMaterialForm);

  try {
    if (materialStore.selectedMaterial?.id) {
      await materialStore.updateMaterial();
    } else {
      await materialStore.createMaterial();
    }


    if (materialStore.successMessage) {
      snackbar.add({
        type: "success",
        text: materialStore.successMessage,
      });
      materialStore.resetForm();// Emit success event
      closeModal(); // Close the modal
    }
  } catch (error) {
    if (materialStore.errorMessage) {
      snackbar.add({
        type: "error",
        text: materialStore.errorMessage,
      });
    }
  }

}

</script>

<style scoped>
/* Add your custom styles here */
</style>
