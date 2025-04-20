import type { AuthResponse, LoginCredentials, User } from "~/utils/models/auth";
import type { RugData, RugResponse, CreateRugRequest, CreateResponse, Rug } from "~/utils/models/rug";

export const useRugStore = defineStore("rug", {
    state: () => ({
        rugs: {} as RugData,
        token: useCookie<string | null>("auth_token").value || null,
        successMessage: null as string | null,
        errorMessage: null as string | null,
        errors: {} as Record<string, string>,
        isLoading: false,
        user: null as User | null,  // Add user to the state
        createRugForm: {} as CreateRugRequest,  // Add createRugForm to the state
        selectedRug: null as Rug | null,  // Add selectedRug to the state
    }),

    actions: {
        // Login action using $fetch
        async createRug() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<CreateResponse>(getApiUrl("rugs"), {
                    method: "POST",
                    body: {
                        ...this.createRugForm,
                    },
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    console.log("Rug created successfully:", response.response);
                    //update rugs list
                    this.rugs.data.unshift(response.response);  // Assuming the response contains the created rug data
                    this.successMessage = response.message;
                }

            } catch (error) {
                // Handle API error
                const errorMsg = handleApiError(error);
                console.log("Error creating rug:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while creating the rug";
            } finally {
                this.isLoading = false;
                // this.createRugForm = {} as CreateRugRequest;  // Reset the form state
                // this.errors = {};  // Reset errors
                // this.successMessage = null;  // Reset success message
                // this.errorMessage = null;  // Reset error message
            }
        },

        //update rug profile using $fetch
        async updateRug() {
            this.isLoading = true;
            if (!this.token) return;
            try {


                const response = await $fetch<CreateResponse>(getApiUrl(`rugs/${this.selectedRug?.id}`), {
                    method: "PUT",
                    body: {
                        ...this.createRugForm,
                        // Spread the rest of the fields
                    },
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    const updatedRug = response.response; // Assuming the updated rug data is returned here
                    const { id } = updatedRug;
                    this.successMessage = response.message;
                    this.rugs.data = this.rugs.data.map(rug =>
                        rug.id === id ? { ...rug, ...updatedRug } : rug
                    );
                }

            } catch (error) {
                // Handle API error
                const errorMsg = handleApiError(error);
                console.log("Error updating rug:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while updating the rug";
            } finally {
                this.isLoading = false;
            }
        },

        // Fetch rugs using $fetch
        async getRugs() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<RugResponse>(getApiUrl("rugs"), {
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.rugs = response.response;  // Assuming the response contains a 'rugs' array
                    console.log("Clients data:", this.rugs);
                }
            } catch (err) {
                console.error("Error fetching rugs:", err);
                this.errorMessage = "An error occurred while fetching rug data";
            } finally {
                this.isLoading = false;
            }
        },


        //delete rug
        async deleteRug() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<CreateResponse>(getApiUrl(`rugs/${this.selectedRug?.id}`), {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.rugs.data = this.rugs.data.filter(rug => rug.id !== this.selectedRug?.id);  // Remove the deleted rug from the list
                    this.successMessage = response.message;
                }

            } catch (error) {
                // Handle API error
                const errorMsg = handleApiError(error);
                console.log("Error deleting rug:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while deleting the rug";
            } finally {
                this.isLoading = false;
            }
        },

        //reset form and messages
        resetForm() {
            this.createRugForm = {} as CreateRugRequest;  // Reset the form state
            this.errors = {};  // Reset errors
            this.successMessage = null;  // Reset success message
            this.errorMessage = null;  // Reset error message
        },


        setSelectedRugProfile(rug: Rug) {
            this.selectedRug = rug;  // Set the selected rug profile
            //set state form with selected rug data
            this.createRugForm = rug

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
