import type { AuthResponse, LoginCredentials, User } from "~/utils/models/auth";
import type { CreateFinishedProductRequest, CreateFinishedProductResponse, FinishedProduct, FinishedProductResponse, FinishedProductsResponse, FinishedProductsResponseData,DashboardData, SalesData, DasbhoardDataResponse, SalesMonthlyDataResponse } from "~/utils/models/finished_products";
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
        dashoardData: {} as  DashboardData,
        salesData:{} as SalesData[]
    }),

    actions: {
        // Login action using $fetch
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


                if (this.productImage) {
                    formData.append("default_image", this.productImage);
                }

                const response = await $fetch<CreateFinishedProductResponse>(getApiUrl("finished-products"), {
                    method: "POST",
                    body: formData,
                    headers: { Authorization: `Bearer ${this.token}`, Accept: "application/json", },
                });

                console.log(response);

                if (response?.response) {
                    this.selectedProduct = response.response  // Assuming the response contains the created material data
                    this.successMessage = response.message;
                }
            } catch (error) {
                // Handle API error
                console.log(error)
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

                if (this.productImage) {
                    formData.append("default_image", this.productImage);
                }

                const response = await $fetch<CreateFinishedProductResponse>(getApiUrl(`finished-products/${this.selectedProduct?.id}`), {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        Accept: "application/json",
                    },
                });

                console.log(response)

                if (response?.response) {
                    const updatedProduct = response.response; // Assuming the updated material data is returned here
                    const { id } = updatedProduct;
                    this.successMessage = response.message;
                    this.selectedProduct = updatedProduct;
                }
            } catch (error) {
                // Handle API error
                console.log(error);
                const errorMsg = handleApiError(error);
                console.log("Error updating product:", errorMsg);
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
                this.selectedProduct = response.response;  // Assuming the response contains a 'products' array

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
                this.selectedProduct = response.response;  // Assuming the response contains a 'products' array

            } catch (err) {
                console.error("Error fetching products:", err);
                this.errorMessage = "An error occurred while fetching material data";
            } finally {
                this.isLoading = false;
            }
        },

        //get dashboard data 
        async getDashoardData(){
            this.isLoading = true;

            if (!this.token) return;
            try {
                const response = await $fetch<DasbhoardDataResponse>(getApiUrl("finished-products/dashboard/data"), {
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.dashoardData = response.response;  // Assuming the response contains a 'products' array
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                this.errorMessage =  "An error occurred while fetching dashboard data";
            } finally {
                this.isLoading = false;
            }
        },

        //get sales dashboard data
        async getSalesDashboardData(){
            this.isLoading = true;

            if (!this.token) return;
            try {
                const response = await $fetch<SalesMonthlyDataResponse>(getApiUrl("finished-products/dashboard/sales-monthly"), {
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.salesData = response.response;  // Assuming the response contains a 'products' array
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                this.errorMessage =  "An error occurred while fetching sales data";
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

        //get dashboard data
        
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
            // this.createFinishedProductForm = product
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
                    id: order_id // Extract order.id and rename it to order_id
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

            console.log(this.createFinishedProductForm)
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
