<template>
  <Modal v-if="isViewMaterialModal" @close="closeModal()">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <!-- Left Side: Close Button -->
  
  
        <!-- Center: Title & Description -->
        <div class="text-start flex-grow">
          <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {{ material?.name }} 
            
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <!-- Optional content here -->
          </p>
        </div>
  
        <!-- Right Side: Buttons -->
        <div class="flex gap-3 mr-3">
          <CustomButton @click="editMaterial()" type="submit" label="Edit Material" variant="brand" rounded="full"
            :isLoading="false" :disabled="false" class="w-full" />
        </div>
  
        <button @click="closeModal()"
          class="transition-color flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
          <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
              fill="" />
          </svg>
        </button>
      </div>
    </template>
  
    <template #body>
      <div class="no-scrollbar relative w-full  overflow-y-auto bg-white  dark:bg-gray-900">
        <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <!-- <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                Personal Information
                              </h4> -->
  
              <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                <div>
                  <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Name</p>
                  <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{material?.name}}</p>
                </div>
  
                <div>
                  <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Type</p>
                  <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{material?.material_type_name}}</p>
                </div>
  
  
  
                <div>
                  <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Unit Cost</p>
                  <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                    ${{ material?.price_per_unit }}
                  </p>
                </div>
  
  
                <div>
                  <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Unit</p>
                  <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ material?.unit }}
                  </p>
  
  
                </div>
  
                <div>
                  <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Materials</p>
                  <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                    {{ material?.material_type_description }}
                  </p>
  
  
                </div>
  
              </div>
  
            </div>
          </div>
  
  
        </div>
      </div>
    </template>
  </Modal>
</template>
  
<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import Modal from '@/components/profile/Modal.vue';
import CustomButton from "@/components/common/buttons/CustomButton.vue";
import RugFormModal from './MaterialFormModal.vue';
import type { Material } from '~/utils/models/materials';


const emit = defineEmits(['update:isViewMaterialModal', 'edit']);

const props = defineProps({
  isViewMaterialModal: {
    type: Boolean,
    required: true,
  },
  material: {
    type: Object as () => Material | null,
    required: true,
  },
});

//cl
const closeModal = () => {
  emit('update:isViewMaterialModal', false);
};

const firstName = computed(() => {
  return props.material?.name.split(' ')[0]
})

//get last name from name user pfile

const lastName = computed(() => {
  return props.material?.name.split(' ')[1]
})


const editMaterial = () => {
  emit('edit');
}

</script>