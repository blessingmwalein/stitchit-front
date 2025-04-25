<template>
  <Modal v-if="isDoneProductionModal" @close="closeModal()">
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
          WorkInProgress #{{ workInProgress?.order?.order_number }} - {{ workInProgress?.order?.client_name }}
        </h4>
        <p class="text-sm text-gray-500 dark:text-gray-400">
  
          <ProductionStatusBadge :status="workInProgress?.status" />
        </p>
      </div>
    </template>
    <template #body>
      <div class="no-scrollbar relative w-full  overflow-y-auto bg-white  dark:bg-gray-900">
        <client-only>
          <div class="mb-4">
            <Alert v-if="productionStore.errorMessage" variant="error" title="Something went wrong"
              :message="productionStore.errorMessage ?? ''" :showLink="false" />
          </div>
          <div class="mb-6">
            <div class="flex justify-between items-center mb-4">
              <h5 class="text-lg font-semibold text-gray-800 dark:text-white">Material Usage Summary</h5>
              <div class="text-right text-xl font-semibold text-gray-700 dark:text-gray-100">
                ${{ overallMaterialCost.toFixed(2) }}
              </div>
            </div>
  
            <div v-for="group in groupedMaterials" :key="group.type"
              class="mb-4 border rounded p-4 bg-gray-50 dark:bg-gray-800">
              <h6 class="text-md font-bold text-gray-700 dark:text-white mb-2">{{ group.type }}</h6>
              <table class="min-w-full text-sm text-left text-gray-600 dark:text-gray-300">
                <thead class="border-b border-gray-300 dark:border-gray-700 text-xs uppercase font-medium">
                  <tr>
                    <th class="py-1 pr-3">Material</th>
                    <th class="py-1 pr-3">Description</th>
                    <th class="py-1 pr-3">Qty</th>
                    <th class="py-1 pr-3">Unit</th>
                    <th class="py-1 pr-3">Unit Cost</th>
                    <th class="py-1 pr-3">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in group.items" :key="item.name + item.description"
                    class="border-b border-gray-200 dark:border-gray-700">
                    <td class="py-1 pr-3">{{ item.name }}</td>
                    <td class="py-1 pr-3">{{ item.description }}</td>
                    <td class="py-1 pr-3">{{ item.quantity }}</td>
                    <td class="py-1 pr-3">{{ item.unit }}</td>
                    <td class="py-1 pr-3">{{ formatCurrency(item?.unitCost) }}</td>
                    <td class="py-1 pr-3">{{ formatCurrency(item?.cost) }}</td>
                  </tr>
                  <tr class="font-semibold">
                    <td colspan="5" class="text-right py-2 pr-3">Total</td>
                    <td class="py-2 pr-3">${{ formatCurrency(group?.totalCost) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
  
  
          <Vueform @submit="handleSubmit" v-model="updateProductionForm" :show-errors="false" :display-errors="false"
            :endpoint="false" sync>
            <!-- <StaticElement name="personal_title" content="Deetails" tag="h3" /> -->
            <!-- <StaticElement name="divider" tag="hr" /> -->
            <TextElement name="total_hours" label="Hours Spent" :rules="['required']" :columns="{
                                                                                                container: 12,
                                                                                                label: 12,
                                                                                                wrapper: 12,
                                                                                              }" />
            <StaticElement name="span" :columns="{ container: 4 }" tag="span" />
  
            <ButtonElement name="close" button-class="bg-red-500" :columns="{
                                                                                                container: 4,
                                                                                              }" @click="closeModal()"
              button-label="Close" :full="true" size="lg" />
  
            <ButtonElement :loading="isLoading" button-class="bg-brand-500" name="register" :columns="{
                                                                                                container: 4,
                                                                                              }" :submits="true"
              button-label="Submit" :full="true" size="lg" />
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
import ProductionStatusBadge from '../ProductionStatusBadge.vue';
import { useRugStore } from '~/store/rugs';
import type { UpdateWorkInProgress, WorkInProgress } from '~/utils/models/production';
import { useProductionStore } from '~/store/production';

const emit = defineEmits(['update:isDoneProductionModal', 'success']);
const productionStore = useProductionStore();
const errors: Record<string, string> = productionStore.errors;
const isLoading = computed(() => productionStore.isLoading)

const { formatCurrency } = useCurrency();

const snackbar = useSnackbar();

const props = defineProps({
  isDoneProductionModal: {
    type: Boolean,
    required: true,
  },
  workInProgress: {
    type: Object as () => WorkInProgress | null,
    required: true,
  },
});
const materials = computed(() => productionStore.materials);

const updateProductionForm = computed({
  get: () => productionStore.updateWorkInProgressForm,
  set: (data: UpdateWorkInProgress) => productionStore.updateWorkInProgressForm = data
})

// const setNextStatus = (status: string) => {
//   productionStore.updateFormStatus(status);
//   nextStatus.value = status;
// }

// Close modal function
const closeModal = () => {
  emit('update:isDoneProductionModal', false);
};

const success = () => {
  emit('success', true);
}

const handleSubmit = async () => {
  // Call login and wait for it to finish
  console.log(productionStore.updateWorkInProgressForm);
  productionStore.updateFormStatus('Done');
  try {
    await productionStore.updateProduction();


    if (productionStore.successMessage) {
      snackbar.add({
        type: "success",
        text: productionStore.successMessage,
      });
      productionStore.resetForm();// Emit success event
      closeModal(); // Close the modal
    }
  } catch (error) {
    if (productionStore.errorMessage) {
      snackbar.add({
        type: "error",
        text: productionStore.errorMessage,
      });
    }
  }

}

const groupedMaterials = computed(() => {
  const result: Record<string, any> = {};

  productionStore.materials.forEach(entry => {
    const item = entry;
    const type = item.material.material_type_name;
    const unitCost = item.material.price_per_unit;
    const quantity = item.quantity;
    const cost = unitCost * quantity;

    if (!result[type]) {
      result[type] = {
        type: type,
        items: [],
        totalCost: 0,
      };
    }

    result[type].items.push({
      name: item.material.name,
      quantity,
      unit: item.material.unit,
      unitCost,
      cost,
      description: item.description,
    });

    result[type].totalCost += cost;
  });

  return Object.values(result);
});

const overallMaterialCost = computed(() =>
  groupedMaterials.value.reduce((sum, group) => sum + group.totalCost, 0)
);

  </script>
  
  <style scoped>
/* Add your custom styles here */
</style>
  