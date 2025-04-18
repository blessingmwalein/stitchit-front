import type { AuthResponse, LoginCredentials, User } from "~/utils/models/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: useCookie<string | null>("auth_token").value || null,
    successMessage: null as string | null,
    errorMessage: null as string | null,
    errors: {} as Record<string, string>,
    isLoading: false,
    loginForm: {} as LoginCredentials,
  }),

  actions: {
    async login() {
      this.isLoading = true;
      this.resetMessages();
      try {
        const { data, error } = await useFetch<AuthResponse>(getApiUrl("auth/admin/login"), {
          method: "POST",
          body: this.loginForm,
        });

        if (error.value) {
          const response = handleApiError(error.value);
          this.setMessages(response);
          return;
        }

        if (data.value?.response.token) {
          this.token = data.value.response.token;
          this.user = data.value.response.user;
          this.successMessage = "Login successful";
          useCookie("auth_token", { maxAge: 60 * 60 * 24 * 7 }).value = data.value.response.token;

          // Fetch user after login
          await this.fetchUser();
        }
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUser() {
      this.isLoading = true;
      if (!this.token) return;
      try {
        const { data, error } = await useFetch<ProfileResponse>(getApiUrl("auth/admin/profile"), {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        console.log("User data:", data.value, error.value);

        if (error.value) {
          const response = handleApiError(error.value);
          this.setMessages(response);
          return;
        }

        if (data.value) {
          this.successMessage = data.value.message || null;
          // return;
        }

        this.user = data.value.response || null;
      } catch (err) {
        this.errorMessage = "An error occurred while fetching user data";
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },

    //setMessages
    setMessages(response: any) {
      if (response.errorMessage) {
        this.errorMessage = response.errorMessage;
      } else if (response.successMessage) {
        this.successMessage = response.successMessage;
      } else if (response.errors) {
        this.errors = response.errors;
      }
    },

    // resetMessages

    resetMessages() {
      this.successMessage = null;
      this.errorMessage = null;
      this.errors = {};
    },

    //reset form
    resetForm() {
      this.loginForm = {} as LoginCredentials;
      this.successMessage = null;
      this.errorMessage = null;
      this.errors = {};
    },
  },

  getters: {
    isLoggedIn(): boolean {
      return !!this.token;
    },
  },

  persist: {
    enabled: true,
    strategies: [{ storage: "cookies", key: "auth" }],
  },
});
