<template>
    <div class="image-upload-container">
        <Toast position="bottom-center" />

        <!-- Image Upload Component -->
        <FileUpload name="images[]" :url="uploadUrl" @upload="onUpload" :multiple="true" accept="image/*"
            :maxFileSize="maxFileSize" @select="onSelectedFiles" @error="onError" :auto="false" ref="fileUploadRef"
            class="w-full">
            <!-- Header with action buttons -->
            <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                    <div class="flex gap-2">
                        <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined severity="secondary"
                            v-tooltip.top="'Select Images'">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </Button>
                        <Button @click="uploadImages(uploadCallback)" icon="pi pi-cloud-upload" rounded outlined
                            severity="success" :disabled="!files || files.length === 0" v-tooltip.top="'Upload Images'">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                            </svg>

                        </Button>
                        <Button @click="clearImages(clearCallback)" icon="pi pi-times" rounded outlined
                            severity="danger" :disabled="!files || files.length === 0"
                            v-tooltip.top="'Clear Selection'">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>

                        </Button>
                    </div>

                    <!-- Upload progress -->
                    <div class="flex flex-col w-full md:w-auto md:flex-1 md:ml-4">
                        <small class="mb-1 text-right">{{ formatSize(totalSize) }} / {{ formatSize(maxFileSize)
                            }}</small>
                        <ProgressBar :value="totalSizePercent" :showValue="false" class="h-1 w-full"
                            :class="{ 'p-progressbar-danger': totalSizePercent > 90 }"></ProgressBar>
                    </div>
                </div>
            </template>

            <!-- Content with image previews -->
            <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                <div class="flex flex-col gap-6 pt-4">
                    <!-- Pending images -->
                    <div v-if="files.length > 0">
                        <div class="flex justify-between items-center mb-3">
                            <h5 class="m-0">Pending Images</h5>
                            <small>First image will be set as default</small>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div v-for="(file, index) of files" :key="file.name + file.type + file.size"
                                class="p-3 rounded-lg border flex flex-col items-center gap-2 transition-all hover:shadow-md"
                                :class="{ 'border-primary border-2': index === 0, 'border-surface': index !== 0 }">
                                <div class="relative w-full">
                                    <img role="presentation" :alt="file.name" :src="file.objectURL"
                                        class="w-full h-32 object-contain rounded-md" />
                                    <div v-if="index === 0"
                                        class="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                                        Default
                                    </div>
                                </div>

                                <div class="w-full text-center">
                                    <p class="text-sm font-medium text-ellipsis overflow-hidden whitespace-nowrap m-0">
                                        {{ truncateFileName(file.name, 20) }}
                                    </p>
                                    <p class="text-xs text-gray-500 m-0">{{ formatSize(file.size) }}</p>
                                </div>

                                <div class="flex justify-between w-full mt-2">
                                    <Button v-if="index !== 0" icon="pi pi-star"
                                        @click="makeDefaultPending(index, files, removeFileCallback)" text rounded
                                        severity="info" size="small" v-tooltip.top="'Make Default'">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="currentColor" class="size-4">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                        </svg>
                                    </Button>
                                    <div v-else class="w-8"></div>

                                    <Badge value="Pending" severity="warning" />

                                    <Button icon="pi pi-times" @click="onRemoveFile(file, removeFileCallback, index)"
                                        text rounded severity="danger" size="small" v-tooltip.top="'Remove'">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="currentColor" class="size-4">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Uploaded images -->
                    <div v-if="uploadedImages.length > 0">
                        <h5 class="mb-3">Uploaded Images</h5>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div v-for="(image, index) of uploadedImages" :key="index"
                                class="p-3 rounded-lg border flex flex-col items-center gap-2 transition-all hover:shadow-md border-surface">
                                <div class="relative w-full">
                                    <img role="presentation" :alt="'Image ' + index" :src="getImageUrl(image)"
                                        class="w-full h-32 object-contain rounded-md" />

                                </div>

                                <div class="w-full text-center">
                                    <p class="text-sm font-medium text-ellipsis overflow-hidden whitespace-nowrap m-0">
                                        {{ truncateFileName(image?.image_name || `Image ${index + 1}`, 20) }}
                                    </p>
                                </div>
                                <div class="flex justify-between items-center w-full mt-2">
                                    <Badge value="Uploaded" severity="success" />

                                    <Button @click="deleteImage(image.id)" text rounded severity="danger"
                                        class="bg-red-600 hover:bg-red-700 text-white p-2 ml-2" v-tooltip.top="'Delete'"
                                        :disabled="isUploading">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="2" stroke="currentColor" class="w-5 h-5 sm:w-5 sm:h-5">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Empty state -->
            <template #empty>
                <div
                    class="flex items-center justify-center flex-col p-6 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50">
                    <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-4"></i>
                    <p class="text-center text-gray-600">
                        Drag and drop images here or click the select button
                        <br>
                        <span class="text-sm text-gray-500">Supported formats: JPG, PNG, GIF, WEBP (Max: 5MB)</span>
                    </p>
                </div>
            </template>
        </FileUpload>
        <!-- Image Preview Carousel -->
        <ProductImageSlider :images="existingImages"> </ProductImageSlider>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useFinishedProductsStore } from '~/store/finished_products';
import { useToast } from 'primevue/usetoast';
import { useRuntimeConfig } from "#app";
import ProductImageSlider from '../ProductImageSlider.vue'

const props = defineProps({
    productId: {
        type: [Number, String],
        default: null
    },
    existingImages: {
        type: Array,
        default: () => []
    },
    maxFileSize: {
        type: Number,
        default: 5000000 // 5MB
    }
});

const emit = defineEmits(['images-updated']);

const config = useRuntimeConfig();

const finishedProductsStore = useFinishedProductsStore();
const toast = useToast();
const fileUploadRef = ref(null);
const carouselRef = ref(null);

const totalSize = ref(0);
const totalSizePercent = ref(0);
const uploadedImages = ref([]);
const isUploading = ref(false);

// Initialize with existing images if available
if (props.existingImages && props.existingImages.length > 0) {
    uploadedImages.value = props.existingImages.map(img => ({
        ...img,
        name: img.name || `Image ${img.id}`
    }));
}

// Load product images when component is mounted
onMounted(() => {
    if (props.productId) {
        // If we have a product ID but no images, try to fetch them
        loadProductImages(props.productId);
    }
});

// Load product images when product ID changes
watch(() => props.productId, (newId) => {
    if (newId) {
        loadProductImages(newId);
    }
});

// Load images for an existing product
async function loadProductImages(productId) {
    try {
        isUploading.value = true;
        const product = await finishedProductsStore.getFinishedProductById(productId);

        if (product && product.images) {
            uploadedImages.value = product.images.map(img => ({
                ...img,
                name: img.name || `Image ${img.id}`
            }));
        }
    } catch (error) {
        console.error('Error loading product images:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load product images',
            life: 3000
        });
    } finally {
        isUploading.value = false;
    }
}

// Helper function to get image URL
const getImageUrl = (image) => {
    // For temporary images (during creation)
    if (image.url) {
        return image.url;
    }

    // For images from the server
    if (image.image_path) {
        return `${config.public.imageUrl}${image.image_path}`;
    }

    // Fallback
    return '/placeholder.png';
};

// Compute the upload URL based on whether we're creating or updating
const uploadUrl = computed(() => {
    if (props.productId) {
        return `${getApiUrl(`finished-products/${props.productId}/images`)}`;
    }
    return ''; // For new products, we'll handle the upload manually
});

// Handle file selection
const onSelectedFiles = (event) => {
    // Validate file types
    const invalidFiles = event.files.filter(file => !isValidImageType(file));
    if (invalidFiles.length > 0) {
        toast.add({
            severity: 'error',
            summary: 'Invalid File Type',
            detail: 'Only image files are allowed (JPG, PNG, GIF, WEBP)',
            life: 3000
        });

        // Remove invalid files from selection
        invalidFiles.forEach(file => {
            const index = event.files.indexOf(file);
            if (index !== -1 && fileUploadRef.value) {
                fileUploadRef.value.remove(index);
            }
        });
    }

    // Calculate total size
    totalSize.value = 0;
    event.files.forEach(file => {
        totalSize.value += file.size;
    });
    totalSizePercent.value = Math.min((totalSize.value / props.maxFileSize) * 100, 100);

    // Warn if total size is approaching the limit
    if (totalSizePercent.value > 90) {
        toast.add({
            severity: 'warn',
            summary: 'Large Files',
            detail: 'Total file size is approaching the limit',
            life: 3000
        });
    }
};

// Validate image file type
const isValidImageType = (file) => {
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return acceptedTypes.includes(file.type);
};

// Handle file removal
const onRemoveFile = (file, removeFileCallback, index) => {
    removeFileCallback(index);
    totalSize.value -= file.size;
    totalSizePercent.value = Math.min((totalSize.value / props.maxFileSize) * 100, 100);
};

// Clear all images
const clearImages = (clearCallback) => {
    clearCallback();
    totalSize.value = 0;
    totalSizePercent.value = 0;
};

// Make a pending image the default (move it to the first position)
const makeDefaultPending = (index, files, removeFileCallback) => {
    if (index === 0 || !files || files.length <= 1) return;

    try {
        // Get the file to make default
        const fileToMakeDefault = files[index];

        // Remove the file from its current position
        removeFileCallback(index);

        // Create a new FileList with the file at the beginning
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(fileToMakeDefault);

        // Add the rest of the files
        for (let i = 0; i < files.length; i++) {
            if (i !== index) {
                dataTransfer.items.add(files[i]);
            }
        }

        // Update the file input
        if (fileUploadRef.value && fileUploadRef.value.$el) {
            const fileInput = fileUploadRef.value.$el.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.files = dataTransfer.files;

                // Trigger the select event to update the UI
                fileUploadRef.value.onFileSelect({
                    originalEvent: new Event('select'),
                    files: Array.from(dataTransfer.files)
                });
            }
        }

        toast.add({
            severity: 'info',
            summary: 'Default Changed',
            detail: 'Image set as default',
            life: 2000
        });
    } catch (error) {
        console.error('Error making image default:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to set default image',
            life: 3000
        });
    }
};

// Handle upload error
const onError = (event) => {
    toast.add({
        severity: 'error',
        summary: 'Upload Failed',
        detail: event.error || 'An error occurred during upload',
        life: 3000
    });
};

// For existing products - upload images directly using the store method
const onUpload = async (event) => {
    if (props.productId) {
        try {
            // Instead of parsing the response, we'll use the store method
            const files = Array.from(event.files || []);

            if (files.length === 0) {
                toast.add({
                    severity: 'warn',
                    summary: 'No Files',
                    detail: 'No files selected for upload',
                    life: 3000
                });
                return;
            }

            isUploading.value = true;

            // Use the store method to upload images
            const response = await finishedProductsStore.uploadProductImages(props.productId, files);

            if (response && response.success) {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: response.message || 'Images uploaded successfully',
                    life: 3000
                });

                // Reload images to get the updated list
                await loadProductImages(props.productId);

                // Emit the updated images
                emit('images-updated', uploadedImages.value);

                // Clear the file input
                if (fileUploadRef.value) {
                    fileUploadRef.value.clear();
                }
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: response?.message || 'Failed to upload images',
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to upload images',
                life: 3000
            });
        } finally {
            isUploading.value = false;
        }
    }
};

// For new products - store the files to be uploaded with the form
const uploadImages = async (uploadCallback) => {
    if (props.productId) {
        // For existing products, we'll use our custom upload method that uses the store
        const files = fileUploadRef.value.files;
        if (!files || files.length === 0) {
            toast.add({
                severity: 'warn',
                summary: 'No Files',
                detail: 'Please select at least one image',
                life: 3000
            });
            return;
        }

        try {
            isUploading.value = true;

            // Use the store method to upload images
            const response = await finishedProductsStore.uploadProductImages(props.productId, Array.from(files));

            if (response && response.success) {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: response.message || 'Images uploaded successfully',
                    life: 3000
                });

                // Reload images to get the updated list
                await loadProductImages(props.productId);

                // Emit the updated images
                emit('images-updated', uploadedImages.value);

                // Clear the file input
                if (fileUploadRef.value) {
                    fileUploadRef.value.clear();
                    totalSize.value = 0;
                    totalSizePercent.value = 0;
                }
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: response?.message || 'Failed to upload images',
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to upload images',
                life: 3000
            });
        } finally {
            isUploading.value = false;
        }
    } else {
        // For new products, store the files in the Pinia store
        const files = fileUploadRef.value.files;
        if (!files || files.length === 0) {
            toast.add({
                severity: 'warn',
                summary: 'No Files',
                detail: 'Please select at least one image',
                life: 3000
            });
            return;
        }

        try {
            // Set the first image as default
            finishedProductsStore.setCreateFormImage(files[0]);

            // Store additional images
            if (files.length > 0) {
                finishedProductsStore.setAdditionalImages(Array.from(files).slice(1));
            } else {
                finishedProductsStore.setAdditionalImages([]);
            }

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Images ready for upload',
                life: 3000
            });

            // Create preview images
            const previewImages = [];
            for (let i = 0; i < files.length; i++) {
                previewImages.push({
                    url: URL.createObjectURL(files[i]),
                    is_default: i === 0,
                    id: `temp-${i}`,
                    name: files[i].name
                });
            }
            uploadedImages.value = previewImages;
            emit('images-updated', files);

            // Clear the file input to prevent duplicate uploads
            fileUploadRef.value.clear();
            totalSize.value = 0;
            totalSizePercent.value = 0;
        } catch (error) {
            console.error('Error preparing images:', error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to prepare images for upload',
                life: 3000
            });
        }
    }
};



// Delete an image using the store method
const deleteImage = async (imageId) => {
    if (!props.productId) {
        // For temporary images in new product creation
        uploadedImages.value = uploadedImages.value.filter(img => img.id !== imageId);

        // If we deleted the default image, set the first remaining image as default
        if (uploadedImages.value.length > 0 && !uploadedImages.value.some(img => img.is_default)) {
            uploadedImages.value[0].is_default = true;
        }

        emit('images-updated', uploadedImages.value);
        return;
    }

    try {
        isUploading.value = true;

        // Use the store method to delete image
        const response = await finishedProductsStore.deleteProductImage(props.productId, imageId);

        if (response && response.success) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: response.message || 'Image deleted successfully',
                life: 3000
            });

            // Remove the deleted image from the list
            uploadedImages.value = uploadedImages.value.filter(img => img.id !== imageId);

            emit('images-updated', uploadedImages.value);
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response?.message || 'Failed to delete image',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete image',
            life: 3000
        });
    } finally {
        isUploading.value = false;
    }
};

// Scroll to a specific image in the carousel
const scrollToImage = (index) => {
    if (carouselRef.value) {
        carouselRef.value.setActiveIndex(index);
    }
};

// Format file size
const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Truncate file name if too long
const truncateFileName = (fileName, maxLength) => {
    if (!fileName) return '';
    if (fileName.length <= maxLength) return fileName;

    const extension = fileName.split('.').pop();
    const name = fileName.substring(0, fileName.length - extension.length - 1);

    if (name.length <= maxLength - 3 - extension.length) {
        return fileName;
    }

    return name.substring(0, maxLength - 3 - extension.length) + '...' + extension;
};

// Helper function to get API URL
const getApiUrl = (endpoint) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://stitchit.test/api';
    return `${baseUrl}/${endpoint}`;
};
</script>

<style scoped>
.image-upload-container {
    margin-bottom: 2rem;
}

.carousel-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
}

:deep(.p-fileupload-content) {
    padding: 1.5rem;
}

:deep(.p-progressbar-danger) {
    background-color: #f59e0b;
}

:deep(.p-progressbar-danger .p-progressbar-value) {
    background-color: #ef4444;
}

:deep(.p-carousel-indicators) {
    margin-top: 1rem;
}

:deep(.p-carousel-indicator > button) {
    width: 1rem;
    height: 1rem;
}

:deep(.p-carousel-indicator.p-highlight > button) {
    background-color: var(--primary-color);
}
</style>