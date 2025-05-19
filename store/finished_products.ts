import type { AuthResponse, LoginCredentials, User } from "~/utils/models/auth";
import type { CreateFinishedProductRequest, CreateFinishedProductResponse, FinishedProduct, FinishedProductResponse, FinishedProductsResponse, FinishedProductsResponseData, DashboardData, SalesData, DasbhoardDataResponse, SalesMonthlyDataResponse } from "~/utils/models/finished_products";
import type { WorkInProgress } from "~/utils/models/production";


export const useFinishedProductsStore = defineStore("finishedProducts", {
    state: () => ({
        products: { data: [], links: { first: '', last: '', next: null, prev: null }, meta: { current_page: 1, from: 1, last_page: 1, links: [], path: '', per_page: 15, to: 1, total: 0 } },
        token: useCookie<string | null>("auth_token").value || null,
        successMessage: null as string | null,
        errorMessage: null as string | null,
        errors: {} as Record<string, string>,
        isLoading: false,
        productImage: null as File | null,  // Default image (first selected)
        additionalImages: [] as File[],     // Additional images
        user: null as User | null,
        createFinishedProductForm: {} as CreateFinishedProductRequest,
        selectedProduct: null as FinishedProduct | null,
        dashoardData: {} as DashboardData,
        salesData: {} as SalesData[]
    }),

    actions: {
        // Set additional images for product creation
        setAdditionalImages(images: File[]) {
            this.additionalImages = images;
        },

        // Clear all images
        clearImages() {
            this.productImage = null;
            this.additionalImages = [];
        },

        // Create finished product with multiple images
        async createFinishedProduct() {
            console.log(this.createFinishedProductForm);

            this.isLoading = true;
            if (!this.token) return;
            try {
                const formData = new FormData();

                formData.append('id', this.createFinishedProductForm.id?.toString() || '');
                formData.append('name', this.createFinishedProductForm.name || '');
                formData.append('order_id', this.createFinishedProductForm.order_id?.toString() || '');
                formData.append('work_in_progress_id', this.createFinishedProductForm.work_in_progress_id?.toString() || '');
                formData.append('rug_id', this.createFinishedProductForm.rug_id?.toString() || '');
                formData.append('description', this.createFinishedProductForm.description || '');
                formData.append('available_quantity', this.createFinishedProductForm.available_quantity?.toString() || '');
                formData.append('total_price', this.createFinishedProductForm.total_price?.toString() || '');
                formData.append('unit', this.createFinishedProductForm.unit || '');
                formData.append('shape', this.createFinishedProductForm.shape || '');
                formData.append('length', this.createFinishedProductForm.length?.toString() || '');
                formData.append('width', this.createFinishedProductForm.width?.toString() || '');

                // Add default image
                if (this.productImage) {
                    formData.append("default_image", this.productImage);
                }

                // Add additional images
                if (this.additionalImages && this.additionalImages.length > 0) {
                    this.additionalImages.forEach(image => {
                        formData.append("images[]", image);
                    });
                }

                const response = await $fetch<CreateFinishedProductResponse>(getApiUrl("finished-products"), {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        Accept: "application/json",
                    },
                });

                console.log(response);

                if (response?.response) {
                    this.selectedProduct = response.response;
                    this.successMessage = response.message;
                }
            } catch (error) {
                console.log(error);
                const errorMsg = handleApiError(error);
                console.log("Error creating product:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while creating the product";
            } finally {
                this.isLoading = false;
            }
        },

        // Update finished product with multiple images
        async updateFinishedProduct() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const formData = new FormData();

                formData.append('id', this.createFinishedProductForm.id?.toString() || '');
                formData.append('name', this.createFinishedProductForm.name || '');
                formData.append('order_id', this.createFinishedProductForm.order_id?.toString() || '');
                formData.append('work_in_progress_id', this.createFinishedProductForm.work_in_progress_id?.toString() || '');
                formData.append('rug_id', this.createFinishedProductForm.rug_id?.toString() || '');
                formData.append('description', this.createFinishedProductForm.description || '');
                formData.append('available_quantity', this.createFinishedProductForm.available_quantity?.toString() || '');
                formData.append('total_price', this.createFinishedProductForm.total_price?.toString() || '');
                formData.append('unit', this.createFinishedProductForm.unit || '');
                formData.append('shape', this.createFinishedProductForm.shape || '');
                formData.append('length', this.createFinishedProductForm.length?.toString() || '');
                formData.append('width', this.createFinishedProductForm.width?.toString() || '');

                // Add default image if changed
                if (this.productImage) {
                    formData.append("default_image", this.productImage);
                }

                // Add additional images
                if (this.additionalImages && this.additionalImages.length > 0) {
                    this.additionalImages.forEach(image => {
                        formData.append("images[]", image);
                    });
                }

                const response = await $fetch<CreateFinishedProductResponse>(getApiUrl(`finished-products/${this.selectedProduct?.id}`), {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        Accept: "application/json",
                    },
                });

                console.log(response);

                if (response?.response) {
                    const updatedProduct = response.response;
                    this.successMessage = response.message;
                    this.selectedProduct = updatedProduct;
                }
            } catch (error) {
                console.log(error);
                const errorMsg = handleApiError(error);
                console.log("Error updating product:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while updating the product";
            } finally {
                this.isLoading = false;
            }
        },

        // Upload additional images to an existing product
        async uploadProductImages(productId: number, images: any[]) {
            this.isLoading = true;
            if (!this.token || !productId || !images.length) return;

            try {
                const formData = new FormData();

                // Add all images to the formData
                images.forEach(image => {
                    formData.append("images[]", image);
                });

                const response = await $fetch(getApiUrl(`finished-products/${productId}/images`), {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        Accept: "application/json",
                    },
                });

                if (response?.success) {
                    this.successMessage = response.message || "Images uploaded successfully";
                    // Update the selected product if needed
                    if (this.selectedProduct && this.selectedProduct.id === productId) {
                        // Fetch the updated product to get the new images
                        await this.getFinishedProductById(productId);
                    }
                }

                return response;
            } catch (error) {
                console.log(error);
                const errorMsg = handleApiError(error);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while uploading images";
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        // Delete a product image
        async deleteProductImage(productId: number, imageId: number) {
            this.isLoading = true;
            if (!this.token) return;

            try {
                const response: any = await $fetch(getApiUrl(`finished-products/images/${imageId}`), {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        Accept: "application/json",
                    },
                });

                if (response?.success) {
                    this.successMessage = response.message || "Image deleted successfully";
                    // Update the selected product if needed
                    if (this.selectedProduct && this.selectedProduct.id === productId) {
                        // Fetch the updated product to get the current images
                        await this.getFinishedProductById(productId);
                    }
                }

                return response;
            } catch (error) {
                console.log(error);
                const errorMsg = handleApiError(error);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while deleting the image";
                throw error;
            } finally {
                this.isLoading = false;
            }
        },


        // Get a specific finished product by ID
        async getFinishedProductById(id) {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<FinishedProductResponse>(getApiUrl(`finished-products/${id}`), {
                    headers: { Authorization: `Bearer ${this.token}` },
                });
                this.selectedProduct = response.response;
                return response.response;
            } catch (err) {
                console.error("Error fetching product:", err);
                this.errorMessage = "An error occurred while fetching product data";
            } finally {
                this.isLoading = false;
            }
        },

        // Existing methods...
        async getFinishedProducts() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<FinishedProductsResponse>(getApiUrl("finished-products"), {
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.products = response.response;
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                this.errorMessage = "An error occurred while fetching material data";
            } finally {
                this.isLoading = false;
            }
        },

        async getFinishedProductByWorlInProgressId(id: number) {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<FinishedProductResponse>(getApiUrl(`finished-products/work-in-progress/${id}`), {
                    headers: { Authorization: `Bearer ${this.token}` },
                });
                this.selectedProduct = response.response;

            } catch (err) {
                console.error("Error fetching products:", err);
                this.errorMessage = "An error occurred while fetching material data";
            } finally {
                this.isLoading = false;
            }
        },

        async getFinishedProductByOrderIdId(id: number) {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<FinishedProductResponse>(getApiUrl(`finished-products/order/${id}`), {
                    headers: { Authorization: `Bearer ${this.token}` },
                });
                this.selectedProduct = response.response;

            } catch (err) {
                console.error("Error fetching products:", err);
                this.errorMessage = "An error occurred while fetching material data";
            } finally {
                this.isLoading = false;
            }
        },

        async getDashoardData() {
            this.isLoading = true;

            if (!this.token) return;
            try {
                const response = await $fetch<DasbhoardDataResponse>(getApiUrl("finished-products/dashboard/data"), {
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.dashoardData = response.response;
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                this.errorMessage = "An error occurred while fetching dashboard data";
            } finally {
                this.isLoading = false;
            }
        },

        async getSalesDashboardData() {
            this.isLoading = true;

            if (!this.token) return;
            try {
                const response = await $fetch<SalesMonthlyDataResponse>(getApiUrl("finished-products/dashboard/sales-monthly"), {
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.salesData = response.response;
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                this.errorMessage = "An error occurred while fetching sales data";
            } finally {
                this.isLoading = false;
            }
        },

        async deleteMaterial() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<CreateFinishedProductResponse>(getApiUrl(`finished-products/${this.selectedProduct?.id}`), {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.products.data = this.products.data.filter(product => product.id !== this.selectedProduct?.id);
                    this.successMessage = response.message;
                }

            } catch (error) {
                const errorMsg = handleApiError(error);
                console.log("Error deleting product:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while deleting the product";
            } finally {
                this.isLoading = false;
            }
        },

        resetForm() {
            this.createFinishedProductForm = {} as CreateFinishedProductRequest;
            this.errors = {};
            this.successMessage = null;
            this.errorMessage = null;
            this.productImage = null;
            this.additionalImages = [];
        },

        setSelectedProduct(product: any) {
            this.selectedProduct = product;
        },

        setCreateFormImage(image: File | null) {
            this.productImage = image;
        },

        setProductForm(workInProgress: WorkInProgress): void {
            if (!workInProgress?.order) return;

            const {
                order: {
                    total_price,
                    length,
                    width,
                    unit,
                    shape,
                    rug_id,
                    id: order_id
                },
                id: work_in_progress_id
            } = workInProgress;

            this.createFinishedProductForm = {
                ...this.createFinishedProductForm,
                total_price,
                length,
                width,
                unit,
                shape,
                rug_id,
                order_id,
                work_in_progress_id,
                id: null
            };

            console.log(this.createFinishedProductForm);
        },

        setEditProductForm(product: FinishedProduct): void {
            if (!product) return;

            const {
                total_price,
                length,
                width,
                unit,
                shape,
                order_id,
                work_in_progress_id,
                id,
                available_quantity,
                default_image,
                name,
                description
            } = product;

            this.createFinishedProductForm = {
                ...this.createFinishedProductForm,
                total_price,
                length,
                width,
                unit,
                shape,
                available_quantity,
                order_id,
                work_in_progress_id,
                default_image,
                name,
                description,
                id,
            };
        }
    },

    getters: {
        // Add any getters if needed
    },

    persist: {
        enabled: true,
        strategies: [],
    },
});