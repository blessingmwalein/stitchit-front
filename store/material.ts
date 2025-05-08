import type { AuthResponse, LoginCredentials, User } from "~/utils/models/auth";
import type { CreateMaterialRequest, CreateMaterialResponse, Material, MaterialData, MaterialResponse, MaterialType, MaterialTypeData, MaterialTypeResponse } from "~/utils/models/materials";
import type { CreateResponse } from "~/utils/models/rug";

export const useMaterialStore = defineStore("material", {
    state: () => ({
        materials: {} as MaterialData,
        materialTypes: {} as MaterialTypeData,  // Add materialTypes to the state
        token: useCookie<string | null>("auth_token").value || null,
        successMessage: null as string | null,
        errorMessage: null as string | null,
        errors: {} as Record<string, string>,
        isLoading: false,
        user: null as User | null,  // Add user to the state
        createMaterialForm: {} as CreateMaterialRequest,  // Add createMaterialForm to the state
        selectedMaterial: null as Material | null,  // Add selectedMaterial to the state
    }),

    actions: {
        // Login action using $fetch
        async createMaterial() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<CreateMaterialResponse>(getApiUrl("materials"), {
                    method: "POST",
                    body: {
                        ...this.createMaterialForm,
                    },
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    console.log("Material created successfully:", response.response);
                    //update materials list
                    this.materials.data.unshift(response.response);  // Assuming the response contains the created material data
                    this.successMessage = response.message;
                }

            } catch (error) {
                // Handle API error
                const errorMsg = handleApiError(error);
                console.log("Error creating material:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while creating the material";
            } finally {
                this.isLoading = false;
                // this.createMaterialForm = {} as CreateMaterialRequest;  // Reset the form state
                // this.errors = {};  // Reset errors
                // this.successMessage = null;  // Reset success message
                // this.errorMessage = null;  // Reset error message
            }
        },

        //update material profile using $fetch
        async updateMaterial() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<CreateResponse>(getApiUrl(`materials/${this.selectedMaterial?.id}`), {
                    method: "PUT",
                    body: {
                        ...this.createMaterialForm,
                        // Spread the rest of the fields
                    },
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    const updatedRug = response.response; // Assuming the updated material data is returned here
                    const { id } = updatedRug;
                    this.successMessage = response.message;
                    this.materials.data = this.materials.data.map(material =>
                        material.id === id ? { ...material, ...updatedRug } : material
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

        // Fetch materials using $fetch
        async getMaterials() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<MaterialResponse>(getApiUrl("materials"), {
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.materials = response.response;  // Assuming the response contains a 'materials' array
                    console.log("Clients data:", this.materials);
                }
            } catch (err) {
                console.error("Error fetching materials:", err);
                this.errorMessage = "An error occurred while fetching material data";
            } finally {
                this.isLoading = false;
            }
        },

        // Fetch material types using $fetch
        async getMaterialTypes() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<MaterialTypeResponse>(getApiUrl("materials/material-types"), {
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.materialTypes = response.response;  // Assuming the response contains a 'materialTypes' array
                    console.log("Material types data:", this.materialTypes);
                }
            } catch (err) {
                console.error("Error fetching material types:", err);
                this.errorMessage = "An error occurred while fetching material types data";
            } finally {
                this.isLoading = false;
            }
        },


        //delete material
        async deleteMaterial() {
            this.isLoading = true;
            if (!this.token) return;
            try {
                const response = await $fetch<CreateResponse>(getApiUrl(`materials/${this.selectedMaterial?.id}`), {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${this.token}` },
                });

                if (response?.response) {
                    this.materials.data = this.materials.data.filter(material => material.id !== this.selectedMaterial?.id);  // Remove the deleted material from the list
                    this.successMessage = response.message;
                }

            } catch (error) {
                // Handle API error
                const errorMsg = handleApiError(error);
                console.log("Error deleting material:", errorMsg);
                this.errorMessage = errorMsg.errorMessage || "An error occurred while deleting the material";
            } finally {
                this.isLoading = false;
            }
        },

        //reset form and messages
        resetForm() {
            this.createMaterialForm = {} as CreateMaterialRequest;  // Reset the form state
            this.errors = {};  // Reset errors
            this.successMessage = null;  // Reset success message
            this.errorMessage = null;  // Reset error message
        },


        setSelectedMaterial(material: any) {
            this.selectedMaterial = material;  // Set the selected material profile
            //set state form with selected material data
            this.createMaterialForm = material

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
