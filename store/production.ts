import type { AuthResponse, LoginCredentials, User } from "~/utils/models/auth";
import type { WorkInProgress, WorkInProgressData, WorkInProgressResponse } from "~/utils/models/production";

export const useProductionStore = defineStore("production", {
    state: () => ({
        workInProgressItems: {} as WorkInProgressData,
        token: useCookie<string | null>("auth_token").value || null,
        successMessage: null as string | null,
        errorMessage: null as string | null,
        errors: {} as Record<string, string>,
        isLoading: false, // Add user to the state
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


        // setSelectedClientProfile
        setSelectedWorkInProgress(workInProgress: WorkInProgress) {
            this.selectedWorkInProgress = workInProgress;
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
