import type { AuthResponse, LoginCredentials, User } from "~/utils/models/auth";
import type { OrderData, OrdersResponse, CreateOrderRequest, CreateOrderResponse, Order, StartProductionRequest } from "~/utils/models/order";

export const useOrderStore = defineStore("order", {
    state: () => ({
        orders: {} as OrderData,
        token: useCookie<string | null>("auth_token").value || null,
        successMessage: null as string | null,
        errorMessage: null as string | null,
        errors: {} as Record<string, string>,
        isLoading: false,
        user: null as User | null,  // Add user to the state
        createOrderForm: {} as CreateOrderRequest,  // Add createOrderForm to the state
        selectedOrder: null as Order | null,  // Add selectedOrder to the 
        orderImage: null as File | null,  // Add orderImage to the state
        clientOrderFile: {} as File,  // Add clientOrderFiles to the 
        startProductionForm: {} as StartProductionRequest,  // Add startProductionForm to the state
    }),

    actions: {
        // Login action using $fetch
        async createOrder() {
            this.isLoading = true;
            if (!this.token) return;

            try {
                const formData = new FormData();

                // Append all form fields
                formData.append("rug_id", this.createOrderForm.rug_id);
                formData.append("client_id", this.createOrderForm.client_id);
                formData.append("total_price", this.createOrderForm.total_price.toString());
                formData.append("color_palet", JSON.stringify(this.createOrderForm.color_palet));
                formData.append("unit", this.createOrderForm.unit);
                formData.append("description", this.createOrderForm.description);
                formData.append("delivery_date", this.createOrderForm.delivery_date.toString());
                formData.append("length", this.createOrderForm.length.toString());
                formData.append("width", this.createOrderForm.width.toString());
                formData.append("shape", this.createOrderForm.shape);



                // Object.entries(this.createOrderForm).forEach(([key, value]) => {
                //     if (value) {
                //         formData.append(key, value);
                //     }
                // });

                // Append image file if exists
                console.log("Image file:", this.orderImage);

                if (this.orderImage) {
                    formData.append("image", this.orderImage as File);
                }

                const response = await $fetch<CreateOrderResponse>(getApiUrl("client/orders"), {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        // "Content-Type": "multipart/form-data", // Set content type for form data
                        Accept: "application/json", // Set accept header for JSON response
                    },
                });

                if (response?.response) {
                    console.log("Order created successfully:", response.response);
                    this.orders.data.push(response.response); // Update orders list
                    this.successMessage = response.message;
                }
            } catch (error) {
                const errorMsg = handleApiError(error);
                console.log("Error creating order:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while creating the order";
            } finally {
                this.isLoading = false;
            }
        },

        //update order profile using $fetch
        async updateOrder() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const formData = new FormData();

                formData.append("rug_id", this.createOrderForm.rug_id);
                formData.append("client_id", this.createOrderForm.client_id);
                formData.append("total_price", this.createOrderForm.total_price.toString());
                formData.append("color_palet", JSON.stringify(this.createOrderForm.color_palet));
                formData.append("unit", this.createOrderForm.unit);
                formData.append("description", this.createOrderForm.description);
                formData.append("delivery_date", this.createOrderForm.delivery_date.toString());
                formData.append("length", this.createOrderForm.length.toString());
                formData.append("width", this.createOrderForm.width.toString());
                formData.append("shape", this.createOrderForm.shape);

                if (this.orderImage) {
                    formData.append("image", this.orderImage as File);
                }


                const response = await $fetch<CreateOrderResponse>(getApiUrl(`client/orders/${this.selectedOrder?.id}`), {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        // "Content-Type": "multipart/form-data", // Set content type for form data
                        Accept: "application/json",
                    },
                });

                if (response?.response) {
                    const updatedOrder = response.response; // Assuming the updated order data is returned here
                    const { id } = updatedOrder;
                    this.successMessage = response.message;
                    this.orders.data = this.orders.data.map(order =>
                        order.id === id ? { ...order, ...updatedOrder } : order
                    );
                }

            } catch (error) {
                // Handle API error
                const errorMsg = handleApiError(error);
                console.log("Error updating order:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while updating the order";
            } finally {
                this.isLoading = false;
            }
        },

        //process order using $fetch
        async processOrder() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const formData = new FormData();
                formData.append('file', this.clientOrderFile as File); // Append the file to the form data
                // Append the order ID to the form data
                const response = await $fetch<CreateOrderResponse>(getApiUrl(`client/orders/${this.selectedOrder?.id}/process`), {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        Accept: "application/json",
                    },
                });

                if (response?.response) {
                    console.log("Order processed successfully:", response.response);
                    this.successMessage = response.message;
                    this.orders.data = this.orders.data.map(order =>
                        order.id === this.selectedOrder?.id ? { ...order, ...response.response } : order
                    );
                }
            } catch (error) {
                // Handle API error
                const errorMsg = handleApiError(error);
                console.log("Error processing order:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while processing the order";
            } finally {
                this.isLoading = false;
            }
        },

        // Fetch orders using $fetch
        async getOrders() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<OrdersResponse>(getApiUrl("client/orders"), {
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.orders = response.response;  // Assuming the response contains a 'orders' array
                    console.log("Clients data:", this.orders);
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
                this.errorMessage = "An error occurred while fetching order data";
            } finally {
                this.isLoading = false;
            }
        },


        //delete order
        async deleteOrder() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<CreateOrderResponse>(getApiUrl(`client/orders/${this.selectedOrder?.id}`), {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                console.log("Delete response:", response);


                // this.orders.data = this.orders.data.filter(order => order.id !== this.selectedOrder?.id);  // Remove the deleted order from the list
                this.successMessage = response.message;
                console.log("Order deleted successfully:", response.response);


            } catch (error) {
                // Handle API error
                const errorMsg = handleApiError(error);
                console.log("Error deleting order:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while deleting the order";
            } finally {
                this.isLoading = false;
            }
        },

        //start production
        async startProduction() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                this.startProductionForm.order_id = this.selectedOrder?.id ?? 0; // Set the order ID in the form data
                const response = await $fetch<CreateOrderResponse>(getApiUrl(`work-in-progress`), {
                    method: "POST",
                    body: this.startProductionForm,
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    console.log("Production started successfully:", response.response);
                    this.successMessage = response.message;
                }
            } catch (error) {
                // Handle API error
                const errorMsg = handleApiError(error);
                console.log("Error starting production:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while starting production";
            } finally {
                this.isLoading = false;
            }
        },

        //process order


        //reset form and messages
        resetForm() {
            this.createOrderForm = {} as CreateOrderRequest;  // Reset the form state
            this.errors = {};  // Reset errors
            this.successMessage = null;  // Reset success message
            this.errorMessage = null;  // Reset error message
            this.orderImage = null;  // Reset order image
            this.selectedOrder = null;  // Reset selected order

            console.log("Form reset successfully");
        },

        //reset start prod form
        resetStartProductionForm() {
            this.startProductionForm = {} as StartProductionRequest,
                this.errors = {};
            this.successMessage = null;  // Reset success message
            this.errorMessage = null;  // Reset error message
            this.orderImage = null;  // Reset order image
            this.selectedOrder = null;
        },
        // setSelectedClientProfile
        setSelectedOrder(order: Order) {
            this.selectedOrder = order;  // Set the selected order profile
            //set state form with selected order data
            this.createOrderForm = order
        },

        //set file
        setClientOrderFile(file: File) {
            this.clientOrderFile = file;  // Set the selected order image
        },

        //set create form image
        setCreateFormImage(image: File) {
            this.orderImage = image;  // Set the selected order image
        },

    },
    getters: {
        // Add any getters if needed
    },
    persist: {
        enabled: true,
        strategies: [],
    },
});
