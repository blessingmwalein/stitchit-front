import type { AuthResponse, LoginCredentials, User } from "~/utils/models/auth";
import type { ClientData, ClientsResponse, CreateClientRequest, CreateClientResponse, UserClient } from "~/utils/models/client";

export const useClientsStore = defineStore("client", {
  state: () => ({
    clients: {} as ClientData,
    token: useCookie<string | null>("auth_token").value || null,
    successMessage: null as string | null,
    errorMessage: null as string | null,
    errors: {} as Record<string, string>,
    isLoading: false,
    user: null as User | null,  // Add user to the state
    createClientForm: {} as CreateClientRequest,  // Add createClientForm to the state
    selectedClientProfile: null as UserClient | null,  // Add selectedClientProfile to the state
  }),

  actions: {
    // Login action using $fetch
    async createClient() {
      this.isLoading = true;
      if (!this.token) return;
      try {
        const response = await $fetch<CreateClientResponse>(getApiUrl("client/invite"), {
          method: "POST",
          body: {
            ...this.createClientForm,
            role: "Client",  // Explicitly set the role here
            // Spread the rest of the fields
          },
          headers: { Authorization: `Bearer ${this.token}` },
        });

        if (response?.response) {
          console.log("Client created successfully:", response.response);
          //update clients list
          this.clients.data.push(response.response);  // Assuming the response contains the created client data
          this.successMessage = response.message;
        }

      } catch (error) {
        // Handle API error
        const errorMsg = handleApiError(error);
        console.log("Error creating client:", errorMsg);
        this.errorMessage = errorMsg.errorMessage || "An error occurred while creating the client";
      } finally {
        this.isLoading = false;
        // this.createClientForm = {} as CreateClientRequest;  // Reset the form state
        // this.errors = {};  // Reset errors
        // this.successMessage = null;  // Reset success message
        // this.errorMessage = null;  // Reset error message
      }
    },

    //update client profile using $fetch
    async updateClientProfile() {
      this.isLoading = true;
      if (!this.token) return;
      try {
        const { name, gender, phone_number, address, city } = this.createClientForm;

        const response = await $fetch<CreateClientResponse>(getApiUrl(`client/clients/${this.selectedClientProfile?.id}`), {
          method: "PUT",
          body: {
            name,
            gender,
            phone_number,
            address,
            city
          },
          headers: { Authorization: `Bearer ${this.token}` },
        });

        if (response?.response) {
          const updatedClient = response.response; // Assuming the updated client data is returned here
          const { id } = updatedClient;
          this.successMessage = response.message;
          this.clients.data = this.clients.data.map(client =>
            client.id === id ? { ...client, ...updatedClient } : client
          );
        }

      } catch (error) {
        // Handle API error
        const errorMsg = handleApiError(error);
        console.log("Error updating client:", errorMsg);
        this.errorMessage = errorMsg.errorMessage || "An error occurred while updating the client";
      } finally {
        this.isLoading = false;
      }
    },

    // Fetch clients using $fetch
    async getClients() {
      this.isLoading = true;
      if (!this.token) return;
      try {
        const response = await $fetch<ClientsResponse>(getApiUrl("client/clients"), {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        if (response?.response) {
          this.clients = response.response;  // Assuming the response contains a 'clients' array
          console.log("Clients data:", this.clients);
        }
      } catch (err) {
        console.error("Error fetching clients:", err);
        this.errorMessage = "An error occurred while fetching client data";
      } finally {
        this.isLoading = false;
      }
    },


    //delete client
    async deleteClient() {
      this.isLoading = true;
      if (!this.token) return;
      try {
        const response = await $fetch<CreateClientResponse>(getApiUrl(`client/clients/${this.selectedClientProfile?.id}`), {
          method: "DELETE",
          headers: { Authorization: `Bearer ${this.token}` },
        });

        if (response?.response) {
          this.clients.data = this.clients.data.filter(client => client.id !== this.selectedClientProfile?.id);  // Remove the deleted client from the list
          this.successMessage = response.message;
        }

      } catch (error) {
        // Handle API error
        const errorMsg = handleApiError(error);
        console.log("Error deleting client:", errorMsg);
        this.errorMessage = errorMsg.errorMessage || "An error occurred while deleting the client";
      } finally {
        this.isLoading = false;
      }
    },

    //reset form and messages
    resetForm() {
      this.createClientForm = {} as CreateClientRequest;  // Reset the form state
      this.errors = {};  // Reset errors
      this.successMessage = null;  // Reset success message
      this.errorMessage = null;  // Reset error message
    },

    // setSelectedClientProfile
    setSelectedClientProfile(client: UserClient) {
      this.selectedClientProfile = client;  // Set the selected client profile
      //set state form with selected client data
      this.createClientForm = client

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
