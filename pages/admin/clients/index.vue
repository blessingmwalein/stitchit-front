<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
  
      <DataTable filterDisplay="row" :loading="isLoading" dataKey="id" v-model:filters="filters" sortMode="multiple"
        paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" :value="clients.data" stripedRows
        tableStyle="min-width: 50rem" :globalFilterFields="['code', 'name', 'category']">
        <template #header>
          <div class="flex justify-between items-center">
            <!-- Button aligned to the left -->
            <Button @click="isClientFromModal = true" variant="primary" class="p-button-rounded p-button-sm"
              label="Add New Client" icon="pi pi-plus" to="/admin/clients/create">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" width="20" height="20">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
              Create
            </Button>
  
            <!-- Search input aligned to the right -->
            <div class="flex justify-end">
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-if="filters" v-model="filters['global'].value" placeholder="Keyword Search" />
              </IconField>
            </div>
          </div>
        </template>
  
        <Column field="name" header="Personal">
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
          </template>
          <template #body="slotProps">
            <div class="flex items-center">
              <!-- Using the InitialAvatar component -->
              <InitialAvatar :name="slotProps.data.name" />
  
              <div class="ml-3">
                <div class="font-semibold text-sm">{{ slotProps.data.name }}</div>
                <div class="text-xs text-gray-600">{{ slotProps.data.city }}</div>
                <!-- Address with reduced font size and faint color -->
                <div class="flex items-center space-x-2 text-xs text-gray-400">
                  <MapPinIcon :height="18" :width="18" />
                  {{ slotProps.data.address }}
  
                </div>
              </div>
            </div>
          </template>
        </Column>
  
        <Column field="email" header="Contact">
          <template #body="slotProps">
            <div class="space-y-2">
              <!-- Phone Row -->
              <div class="flex items-center space-x-2 text-sm  text-gray-500">
                <!-- Phone Icon -->
                <PhoneIcon :height="18" :width="18" />
  
                <span>{{ slotProps.data.phone_number }}</span>
              </div>
  
              <!-- Email Row -->
              <div class="flex items-center space-x-2 text-sm  text-gray-500">
                <!-- Email Icon -->
                <EmailAtIcon :height="18" :width="18" />
                <span>{{ slotProps.data.email }}</span>
              </div>
            </div>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
              placeholder="Search by contact" />
          </template>
        </Column>
  
        <!-- <Column field="gender" header="Gender">
                                                  <template #filter="{ filterModel, filterCallback }">
                                                      <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by category" />
                                                  </template>
                                              </Column> -->
        <Column field="gender" sortable header="Gender">
          <!-- filter selecto -->
          <template #filter="{ filterModel, filterCallback }">
            <CustomSelectField v-model="filterModel.value" :label="'Select an option'" :options="[
                                                              { value: 'male', label: 'Male' },
                                                              { value: 'female', label: 'Femail' },
                                                              { value: 'other', label: 'Other' }
                                                          ]" :status="'error'" />
  
          </template>
          <template #body="slotProps">
            <Badge variant="light" :color="light">
              {{ slotProps.data.gender }}
            </Badge>
          </template>
        </Column>
        <Column header="Actions">
          <template #body="slotProps">
            <div class="flex space-x-2">
              <!-- View Button -->
              <Button @click="handleViewClient(slotProps.data)" variant='outline' size='sm'
                class="p-button-rounded p-button-warning p-button-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" width="20" height="20">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </Button>
              <Button @click="handleEditClient(slotProps.data)" variant='outline' size="sm"
                class="p-button-rounded p-button-warning p-button-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" width="20" height="20">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </Button>
              <!-- Edit Button -->
              <Button @click="showConfirmModal = true;clientStore.setSelectedClientProfile(slotProps.data) "
                variant='outline' size="sm" class="p-button-rounded p-button-warning p-button-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" width="20" height="20">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </Button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  
    <ClientFormModal :isClientFromModal="isClientFromModal" :clientProfile="selectedClientProfile"
      @update:isClientFromModal="(value) => isClientFromModal = value" />
  
    <ViewClientForm :isViewClientModal="isViewClientModal" :clientProfile="selectedClientProfile"
      @update:isViewClientModal="(value ) => isViewClientModal = value"
      @edit="isViewClientModal = false ;handleEditClient(selectedClientProfile)" />
  
    <ConfirmModal :visible="showConfirmModal" @update:visible="showConfirmModal = $event" @confirmed="handleConfirmation">
      <template #header> Delete Item </template>
      <template #body> Are you sure you want to delete this item? </template>
    </ConfirmModal>
  
  </admin-layout>
</template>

<script lang="ts" setup>
import {
  ref,
  onMounted
} from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import InitialAvatar from '@/components/common/InitialAvatar.vue'
import CustomSelectField from '@/components/forms/FormElements/CustomSelectField.vue'
import {
  PhoneIcon
} from '~/icons'
import {
  EmailAtIcon
} from '~/icons'
import {
  MapPinIcon
} from '~/icons'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import CustomButton from "@/components/common/buttons/CustomButton.vue";
import ClientFormModal from '@/components/clients/modals/ClientFormModal.vue'
import ViewClientForm from '@/components/clients/modals/ViewClientModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'


import {
  FilterMatchMode
} from '@primevue/core/api';
import {
  useClientsStore
} from "~/store/client";

// Store & State
const clientStore = useClientsStore();
const isMounted = ref(false) // Track if component has mounted

const snackbar = useSnackbar();

const isLoading = computed(() => clientStore.isLoading);
const clients = computed(() => clientStore.clients);

const selectedClientProfile = computed(() => clientStore.selectedClientProfile);

const isClientFromModal = ref(false)
const isViewClientModal = ref(false)
const showConfirmModal = ref(false)


onMounted(() => {
  isMounted.value = true // Set to true once component is mounted
})

const filters: any = ref({
  global: {
    value: null,
    matchMode: FilterMatchMode.CONTAINS
  },
  email: {
    value: null,
    matchMode: FilterMatchMode.CONTAINS
  },
  name: {
    value: null,
    matchMode: FilterMatchMode.STARTS_WITH
  },
  phone_number: {
    value: null,
    matchMode: FilterMatchMode.STARTS_WITH
  },
  gender: {
    value: null,
    matchMode: FilterMatchMode.EQUALS
  },
});

definePageMeta({
  middleware: [
    function (to, from) {
      // Custom inline middleware
    },
    'auth',
  ],
});

const currentPageTitle = ref('Clients')

onMounted(async () => {
  await clientStore.getClients(); // Fetch only if user is not loaded

});

//handle select client
const handleEditClient = (client: any) => {
  clientStore.setSelectedClientProfile(client);
  isClientFromModal.value = true;
}

const handleViewClient = (client: any) => {
  clientStore.setSelectedClientProfile(client);
  isViewClientModal.value = true;
}

const handleConfirmation = async (isConfirmed: boolean) => {
  if (isConfirmed) {
    console.log("Action confirmed!");

    // Perform the action here, e.g., delete the item
    try {
      await clientStore.deleteClient();

      if (clientStore.successMessage) {
        snackbar.add({
          type: "success",
          text: clientStore.successMessage,
        });
        clientStore.resetForm();// Emit success event
        closeModal(); // Close the modal
      }
    } catch (error) {

    }
  } else {
    console.log("Action canceled.");
  }
};
</script>
