import type { AuthResponse, LoginCredentials, User } from "~/utils/models/auth";
import type { UpdateWorkInProgress, UpdateWorkInProgressResponse, WorkInProgress, WorkInProgressData, WorkInProgressResponse, WorkIProgressResponse } from "~/utils/models/production";
import type { CreateResponse } from "~/utils/models/rug";

export const useProductionStore = defineStore("production", {
    state: () => ({
        workInProgressItems: {} as WorkInProgressData,
        token: useCookie<string | null>("auth_token").value || null,
        successMessage: null as string | null,
        errorMessage: null as string | null,
        errors: {} as Record<string, string>,
        isLoading: false, // Add user to the state
        updateWorkInProgressForm: {} as UpdateWorkInProgress,
        selectedWorkInProgress: {} as WorkInProgress, // Add selectedWorkInProgress to the state
        // Add startProductionForm to the state
    }),

    actions: {
        async getWorkInProgress() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<WorkInProgressResponse>(getApiUrl("work-in-progress"), {
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.workInProgressItems = response.response;
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
                this.errorMessage = "An error occurred while fetching order data";
            } finally {
                this.isLoading = false;
            }
        },

        //get sigle work in progress
        async getSingleWorkInProgress(id: string) {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<WorkIProgressResponse>(getApiUrl(`work-in-progress/${id}`), {
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.selectedWorkInProgress = response.response;
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
                this.errorMessage = "An error occurred while fetching order data";
            } finally {
                this.isLoading = false;
            }
        },

        //update prodution status
        async updateProduction() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<UpdateWorkInProgressResponse>(getApiUrl(`work-in-progress/${this.selectedWorkInProgress?.id}`), {
                    method: "PUT",
                    body: {
                        ...this.updateWorkInProgressForm,
                        // Spread the rest of the fields
                    },
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    const updatedWorkInProgress = response.response; // Assuming the updated rug data is returned here
                    const { id } = updatedWorkInProgress;
                    this.successMessage = response.message;
                    this.selectedWorkInProgress = updatedWorkInProgress;
                }

            } catch (error) {
                // Handle API error
                const errorMsg = handleApiError(error);
                console.log("Error updating rug:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while updating the production item";
            } finally {
                this.isLoading = false;
            }
        },

        // setSelectedClientProfile
        setSelectedWorkInProgress(workInProgress: WorkInProgress) {
            this.selectedWorkInProgress = workInProgress;
        },

        //update form status
        updateFormStatus(status:string){
            this.updateWorkInProgressForm.status = status;
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
