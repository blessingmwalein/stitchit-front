import type { AuthResponse, LoginCredentials, User } from "~/utils/models/auth";
import type { CreateFinishedProductRequest, CreateFinishedProductResponse, FinishedProduct, FinishedProductResponse, FinishedProductsResponse, FinishedProductsResponseData } from "~/utils/models/finished_products";
import type { WorkInProgress } from "~/utils/models/production";

export const useFinishedProductsStore = defineStore("finishedProducts", {
    state: () => ({
        products: {} as FinishedProductsResponseData,
        token: useCookie<string | null>("auth_token").value || null,
        successMessage: null as string | null,
        errorMessage: null as string | null,
        errors: {} as Record<string, string>,
        isLoading: false,
        productImage: null as File | null,  // Add orderImage to the state
        user: null as User | null,  // Add user to the state
        createFinishedProductForm: {} as CreateFinishedProductRequest,  // Add createFinishedProductForm to the state
        selectedProduct: null as FinishedProduct | null,  // Add selectedProduct to the state
    }),

    actions: {
        // Login action using $fetch
        async createFinishedProduct() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const formData = new FormData();

                formData.append('id', this.createFinishedProductForm.id);
                formData.append('name', this.createFinishedProductForm.name);
                formData.append('order_id', this.createFinishedProductForm.order_id);
                formData.append('work_in_progress_id', this.createFinishedProductForm.work_in_progress_id);
                formData.append('rug_id', this.createFinishedProductForm.rug_id);
                formData.append('description', this.createFinishedProductForm.description);
                formData.append('available_quantity', this.createFinishedProductForm.available_quantity);
                formData.append('total_price', this.createFinishedProductForm.total_price);
                formData.append('unit', this.createFinishedProductForm.unit);
                formData.append('shape', this.createFinishedProductForm.shape);
                formData.append('length', this.createFinishedProductForm.length);
                formData.append('width', this.createFinishedProductForm.width);

                if (this.productImage) {
                    formData.append("default_image", this.productImage);
                }

                const response = await $fetch<CreateFinishedProductResponse>(getApiUrl("finished-products"), {
                    method: "POST",
                    body: formData,
                    headers: { Authorization: `Bearer ${this.token}`, Accept: "application/json", },
                });

                if (response?.response) {
                    this.products.data.unshift(response.response);  // Assuming the response contains the created material data
                    this.successMessage = response.message;
                }
            } catch (error) {
                // Handle API error
                const errorMsg = handleApiError(error);
                console.log("Error creating material:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while creating the material";
            } finally {
                this.isLoading = false;
                // this.createFinishedProductForm = {} as CreateFinishedProductRequest;  // Reset the form state
                // this.errors = {};  // Reset errors
                // this.successMessage = null;  // Reset success message
                // this.errorMessage = null;  // Reset error message
            }
        },

        //update material profile using $fetch
        async updateFinishedProduct() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const formData = new FormData();

                formData.append('id', this.createFinishedProductForm.id);
                formData.append('name', this.createFinishedProductForm.name);
                formData.append('order_id', this.createFinishedProductForm.order_id);
                formData.append('work_in_progress_id', this.createFinishedProductForm.work_in_progress_id);
                formData.append('rug_id', this.createFinishedProductForm.rug_id);
                formData.append('description', this.createFinishedProductForm.description);
                formData.append('available_quantity', this.createFinishedProductForm.available_quantity);
                formData.append('total_price', this.createFinishedProductForm.total_price);
                formData.append('unit', this.createFinishedProductForm.unit);
                formData.append('shape', this.createFinishedProductForm.shape);
                formData.append('length', this.createFinishedProductForm.length);
                formData.append('width', this.createFinishedProductForm.width);

                if (this.productImage) {
                    formData.append("default_image", this.productImage);
                }

                const response = await $fetch<CreateFinishedProductResponse>(getApiUrl(`products/${this.selectedProduct?.id}`), {
                    method: "PUT",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        Accept: "application/json",
                    },
                });

                if (response?.response) {
                    const updatedProduct = response.response; // Assuming the updated material data is returned here
                    const { id } = updatedProduct;
                    this.successMessage = response.message;
                    this.products.data = this.products.data.map(material =>
                        material.id === id ? { ...material, ...updatedProduct } : material
                    );
                }

            } catch (error) {
                // Handle API error
                const errorMsg = handleApiError(error);
                console.log("Error updating material:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while updating the material";
            } finally {
                this.isLoading = false;
            }
        },

        // Fetch products using $fetch
        async getFinishedProducts() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<FinishedProductsResponse>(getApiUrl("finished-products"), {
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.products = response.response;  // Assuming the response contains a 'products' array
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

                if (response?.response) {
                    this.selectedProduct = response.response;  // Assuming the response contains a 'products' array
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                this.errorMessage = "An error occurred while fetching material data";
            } finally {
                this.isLoading = false;
            }
        },



        //delete material
        async deleteMaterial() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<CreateFinishedProductResponse>(getApiUrl(`finished-products/${this.selectedProduct?.id}`), {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.products.data = this.products.data.filter(product => product.id !== this.selectedProduct?.id);  // Remove the deleted material from the list
                    this.successMessage = response.message;
                }

            } catch (error) {
                // Handle API error
                const errorMsg = handleApiError(error);
                console.log("Error deleting product:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while deleting the product";
            } finally {
                this.isLoading = false;
            }
        },

        //reset form and messages
        resetForm() {
            this.createFinishedProductForm = {} as CreateFinishedProductRequest;  // Reset the form state
            this.errors = {};  // Reset errors
            this.successMessage = null;  // Reset success me\ssage
            this.errorMessage = null;  // Reset error message
        },


        setSelectedProduct(product: any) {
            this.selectedProduct = product;  // Set the selected product profile
            //set state form with selected product data
            this.createFinishedProductForm = product
        },

        setCreateFormImage(image: File | null) {
            this.productImage = image;
        },

        setProductForm(workInProgress: WorkInProgress): void {
            if (!workInProgress?.order) return;

            const {
                total_price,
                length,
                width,
                unit,
                shape
            } = workInProgress.order;

            this.createFinishedProductForm = {
                ...this.createFinishedProductForm,
                total_price,
                length,
                width,
                unit,
                shape
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
