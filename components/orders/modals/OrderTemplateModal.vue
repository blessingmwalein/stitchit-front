<template>
    <Modal v-if="isViewProcessOrderModal" @close="closeModal()" width="max-w-6xl">
        <template #header>
            <div class="flex items-center justify-between w-full">
                <div class="text-start flex-grow">
                    <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Order #{{ order?.order_number }} - {{ order?.client_name }}
                    </h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                    <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
                        Please review the order details below.
                    </p>
                    <OrderStatusBadge :status="order?.status" />
                    </p>
                </div>
                <div class="flex gap-3 mr-3 w-1/6">

                    <CustomButton @click="exportToPDF" label="Process" variant="success" rounded="full"
                        :prefixIcon="true">
                        <template #prefix>
                            <div class="mr-3">
                                <ArrrowUTurnIcon :height="20" :width="20" />
                            </div>
                        </template>
                    </CustomButton>
                </div>
                <button @click="closeModal()"
                    class="transition-color flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
                    <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z" />
                    </svg>
                </button>
            </div>
        </template>

        <template #body>

            <div ref="pdfContent"
                class="max-w-4xl mx-auto bg-white font-sans text-sm border border-gray-300 shadow-md overflow-hidden">
                <!-- Header -->
                <div class=" bg-black text-white p-4 relative">
                    <div class="grid grid-cols-2">
                        <div>
                            <img src="/images/logo/STICHIT-01.png" alt="Logo" class="h-10 mb-2" />
                            <p><strong>Address:</strong> 770 - 648 Goodhope Westgate Harare</p>
                            <p><strong>Email:</strong> stichiitt@gmail.com</p>
                            <p><strong>Web:</strong> www.stichit.co.zw</p>
                            <p><strong>Phone:</strong> +263772440088</p>
                        </div>
                        <div class="text-right">
                            <h1 class="text-3xl font-bold">RUG ORDER</h1>
                            <div class="bg-yellow-500 text-black p-3 mt-4 rounded space-y-1">
                                <p><strong>Order No:</strong> {{ order?.order_number }}</p>
                                <p><strong>Date:</strong> {{ formatDateString(order?.created_at) }}</p>
                                <p><strong>Delivery Date:</strong> {{ formatDateString(order?.delivery_date) }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Client Info -->
                <div class="px-4 py-2 border border-gray-200 rounded-2xl m-2 border-t border-gray-300">
                    <h2 class="font-semibold text-lg mb-1">Client Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <InfoField label="Name" :value="order.client_name" />
                        <!-- <InfoField label="Gender" :value="order.gender" /> -->
                        <!-- <InfoField label="Email" :value="order.email" /> -->
                        <InfoField label="Phone" :value="order.phone_number" />
                        <InfoField label="City" :value="order.city" />
                        <InfoField label="Address" :value="order.address" />
                    </div>
                </div>

                <!-- Order Table -->
                <div class="p-4 border border-gray-200 rounded-2xl m-2">
                    <h2 class="font-semibold text-lg mb-2">Order Details</h2>
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-black text-white">
                            <tr>
                                <th class="p-2">ITEM</th>
                                <th class="p-2 text-center">QTY</th>
                                <th class="p-2 text-center">UNIT PRICE</th>
                                <th class="p-2 text-center">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody class="border-t border-gray-300">
                            <tr class="border-b border-gray-200">
                                <td class="p-2">
                                    {{ order.description }} ({{ order.shape }}, {{ order.length }} x {{ order.width }}
                                    {{
                                        order.unit }})
                                    <br />
                                    <small class="text-gray-500">Material: {{ order.rug.materials }}</small>
                                </td>
                                <td class="p-2 text-center">1</td>
                                <td class="p-2 text-center">${{ order.rug.approx_cost }}</td>
                                <td class="p-2 text-center">${{ order.total_price }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class=" pt-4">
                        <div class="mb-2 font-bold bg-yellow-500 inline-block px-2 py-1 rounded">DESIGN</div>
                        <div class="bg-white  p-4 flex justify-center items-center rounded-md ">
                            <div v-if="order?.image_url" class="mb-6 flex justify-center">
                                <div class=" dark:border-gray-800 max-w-full"
                                    style="max-height: 250px; max-width: 100%;">
                                    <img id="orderImage" :src="`${config.public.imageUrl}${order.image_url}`"
                                        alt="Order Image"
                                        class="w-full h-auto object-cover max-h-[250px] rounded-2xl" />
                                </div>
                            </div>

                        </div>

                        <!-- Colors -->
                        <div class=" mb-4">
                            <p class="font-semibold mb-3">Color Palette:</p>
                            <ColorPalertView :colors="order.color_palet" />
                        </div>
                    </div>
                </div>

                <!-- Design + Colors -->


                <!-- Payment + Terms -->
                <div class="py-6 space-y-4 border border-gray-200 rounded-2xl m-2">
                    <div class="px-4 py-6 border-b border-gray-200">
                        <h2 class="font-semibold text-lg mb-2">Payment Details</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <InfoField label="Total Price" :value="formatCurrency(order?.total_price)" />
                            <InfoField label="Deposit Required" value="$20" />
                            <InfoField label="Payment Method" value="Cash, InnBucks, Ecocash" />
                        </div>
                    </div>

                    <div class="px-4">
                        <h3 class="font-semibold text-lg mb-2">Terms</h3>
                        <ul class="list-disc list-inside text-sm">
                            <li>Delivery date: {{ formatDateString(order.delivery_date) }}</li>
                            <li>$20 deposit required before processing</li>
                            <li>Balance payable upon delivery</li>
                        </ul>
                    </div>
                </div>

                <!-- Bank Info -->
                <div class="sm:col-span-3 py-6 space-y-4 px-4">
                    <label class="font-semibold block mb-2">Payment Methods</label>
                    <div class="flex flex-wrap justify-start gap-4 px-4 py-2">
                        <!-- Cash -->
                        <div class="w-60 border border-gray-300 rounded-2xl shadow-md p-4 flex items-center gap-4">
                            <img src="/images/payments/cash.png" alt="Cash" class="h-12 w-12 object-contain" />
                            <div>
                                <h4 class="font-semibold text-gray-800">Cash</h4>
                                <p class="text-sm text-gray-600">Pay in person</p>
                            </div>
                        </div>

                        <!-- Ecocash -->
                        <div class="w-60 border border-gray-300 rounded-2xl shadow-md p-4 flex items-center gap-4">
                            <img src="/images/payments/ecocash.png" alt="Ecocash" class="h-12 w-12 object-contain" />
                            <div>
                                <h4 class="font-semibold text-gray-800">Ecocash</h4>
                                <p class="text-sm text-gray-600">Blessing Mwale</p>
                                <p class="text-sm text-gray-600">0772440088</p>
                            </div>
                        </div>

                        <!-- InnBucks -->
                        <div class="w-60 border border-gray-300 rounded-2xl shadow-md p-4 flex items-center gap-4">
                            <img src="/images/payments/inbukks.png" alt="InnBucks" class="h-12 w-12 object-contain" />
                            <div>
                                <h4 class="font-semibold text-gray-800">InnBucks</h4>
                                <p class="text-sm text-gray-600">Blessing Mwale</p>
                                <p class="text-sm text-gray-600">0772440088</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Signature -->
                <div class="p-4 flex justify-end">
                    <div class="text-right">
                        <p class="font-bold">BMwale</p>
                        <p class="text-xs">Authorised Signature</p>
                    </div>
                </div>
            </div>
        </template>

        <ConfirmModal :visible="showConfirmModal" @update:visible="showConfirmModal = $event"
            @confirmed="handleConfirmation">
            <template #header> Process Order </template>
            <template #body>
                <div class="text-center">
                    <p class="text-lg font-semibold">Are you sure you want to process this order?</p>
                    <p class="text-sm text-gray-500">This action cannot be undone.</p>
                </div>
            </template>
        </ConfirmModal>

    </Modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useRuntimeConfig } from "#app";
// import html2pdf from 'html2pdf.js';

import Modal from '@/components/profile/Modal.vue';
import type { Order } from '~/utils/models/order';
import ColorPalertView from '../ColorPalertView.vue';
import InfoField from '../InfoField.vue';
import { useDateFormat } from '~/composables/useDateFomat';
import OrderStatusBadge from '../OrderStatusBadge.vue';
import CustomButton from "@/components/common/buttons/CustomButton.vue";
import ArrrowUTurnIcon from '~/icons/ArrrowUTurnIcon.vue';
import { useCurrency } from '~/composables/useCurrency';
import { useOrderStore } from '~/store/orders';
import ConfirmModal from '@/components/common/ConfirmModal.vue';

// import html2pdf from 'html2pdf.js';

const config = useRuntimeConfig();

const orderStore = useOrderStore();
const emit = defineEmits(['update:isOrderFormModal', 'success']);

const { formatCurrency } = useCurrency();
const { formatDate, formatDateString } = useDateFormat();
const showConfirmModal = ref(false)
const snackbar = useSnackbar();

const props = defineProps({
    isViewProcessOrderModal: {
        type: Boolean,
        required: true,
    },
    order: {
        type: Object as () => Order | null,
        required: true,
    },
});

const closeModal = () => {
    emit('update:isViewProcessOrderModal', false);
};


const pdfContent = ref<HTMLElement | null>(null);

// const printPDf = async () => {
//   if (!pdfContent.value) {
//     console.error("PDF content not found");
//     return;
//   }

//   const options = {
//     margin: 0.5,
//     filename: `Order-${props.order?.order_number || "invoice"}.pdf`,
//     image: { type: "jpeg", quality: 0.98 },
//     html2canvas: {
//       scale: 2,
//       useCORS: true,
//       allowTaint: true, // optional, depending on CORS images
//     },
//     jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
//   };

//   try {
//     await html2pdf()
//       .set(options)
//       .from(pdfContent.value)
//       .save();
//   } catch (err) {
//     console.error("Failed to generate PDF:", err);
//   }
// };

const exportToPDF = async () => {
    if (!pdfContent.value || !props.order?.image_url) return;

    //   const imgEl = pdfContent.value.querySelector("#orderImage");
    //   if (imgEl instanceof HTMLImageElement) {
    //     try {
    //       const base64Image = await convertImageToBase64(`${config.public.imageUrl}${props.order.image_url}`);
    //       imgEl.src = base64Image;
    //     } catch (error) {
    //       console.error("Error converting image to base64:", error);
    //     }
    //   }



    //   // Update the state with the generated PDF file (assuming you're using React state)
    //   orderStore.setClientOrderFile(pdfFile);  // assuming setFile is your state setter function

    // Now, upload the file to the API
    try {
        await orderStore.processOrder();

        if (orderStore.successMessage) {
            snackbar.add({ type: "success", text: orderStore.successMessage });
        }

        if (orderStore.errorMessage) {

            snackbar.add({ type: "error", text: orderStore.errorMessage });
            //   return;
        }

        closeModal();

    } catch (error) {
        console.error("Error uploading PDF:", error);
        snackbar.add({ type: "error", text: "Failed to upload PDF." });
    }

};

const handleConfirmation = async (confirmed: boolean) => {
    if (confirmed) {
        showConfirmModal.value = false;
        await orderStore.processOrder();
        closeModal();
    } else {
        showConfirmModal.value = false;
    }
};


const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
    const response = await fetch(imageUrl, { mode: "cors" });
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};



</script>

<style scoped>
/* Add any extra styling here if needed */
</style>