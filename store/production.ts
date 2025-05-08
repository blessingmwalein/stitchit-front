import type { AuthResponse, LoginCredentials, User } from "~/utils/models/auth";
import type { AddWorkInProgressMaterialRequest, UpdateWorkInProgress, UpdateWorkInProgressResponse, WorkInProgress, WorkInProgressData, WorkInProgressMaterial, WorkInProgressMaterialResponse, WorkInProgressResponse, WorkIProgressResponse } from "~/utils/models/production";
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
        materials: [] as WorkInProgressMaterial[], // Add materials to the state
        materialsForm: [] as AddWorkInProgressMaterialRequest[], // Add materialsForm to the state
        updateMaterialsForm: [] as AddWorkInProgressMaterialRequest[]

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
        updateFormStatus(status: string) {
            this.updateWorkInProgressForm.status = status;
        },

        //get materials
        async getMaterials(id: string) {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<WorkInProgressMaterialResponse>(getApiUrl(`work-in-progress/${id}/materials`), {
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.materials = response.response;
                }
            } catch (err) {
                console.error("Error fetching materials:", err);
                this.errorMessage = "An error occurred while fetching order data";
            } finally {
                this.isLoading = false;
            }
        },

        //upload materials
        async addMaterials(id: string) {
            // console.log(this.materialsForm
            // .filter(material => material != null) // filters out null and undefined
            // .map(({ material_id, quantity }) => ({ material_id, quantity })))

            // return true;
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<UpdateWorkInProgressResponse>(getApiUrl(`work-in-progress/${id}/materials/bulk`), {
                    method: "POST",
                    body: {
                        'materials': this.materialsForm
                            .filter(material => material != null) // filters out null and undefined
                            .map(({ material_id, quantity }) => ({ material_id, quantity }))
                        // Spread the rest of the fields
                    },
                    headers: { Authorization: `Bearer ${this.token}` },
                });
                console.log(response)

                if (response?.message) {

                    this.successMessage = response.message;
                }

            } catch (error) {
                // Handle API error
                const errorMsg = handleApiError(error);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while updating materials";
            } finally {
                this.isLoading = false;

            }
        },
        async updateMaterials(id: string) {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<UpdateWorkInProgressResponse>(getApiUrl(`work-in-progress/${id}/materials/bulk`), {
                    method: "PUT",
                    body: {
                        'materials': this.materialsForm
                        // Spread the rest of the fields
                    },
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.successMessage = response.message;
                }

            } catch (error) {
                // Handle API error
                const errorMsg = handleApiError(error);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while updating materials";
            } finally {
                this.isLoading = false;

            }
        },

        async submitMaterials(id: string) {
            this.isLoading = true;

            try {
                const response =
                    await $fetch<UpdateWorkInProgressResponse>(getApiUrl(`work-in-progress/${id}/materials/bulk`), {
                        method: "POST",
                        body: {
                            materials: this.materialsForm
                                .filter(material => material != null)
                                .map(({ material_id, quantity, description }) => ({ material_id, quantity, description }))
                        },
                        headers: { Authorization: `Bearer ${this.token}` },
                    })

                if (response?.message) {
                    this.successMessage = response.message;
                }

            } catch (error) {
                const errorMsg = handleApiError(error);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while submitting materials";
            } finally {
                this.isLoading = false;
            }
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
