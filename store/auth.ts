import type { AuthResponse, LoginCredentials, User } from "~/utils/models/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: useCookie<string | null>("auth_token").value || null,
    successMessage: null as string | null,
    errorMessage: null as string | null,
    errors: {} as Record<string, string>,
    isLoading: false,
  }),

  actions: {
    async login(credentials: LoginCredentials) {
      this.isLoading = true;
      this.resetMessages();
      try {
        const { data, error } = await useFetch<AuthResponse>(getApiUrl("auth/admin/login"), {
          method: "POST",
          body: credentials,
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

        this.user = data.value.response || null;
      } catch (err) {
        this.errorMessage = "An error occurred while fetching user data";
      } finally {
        this.isLoading = false;
      }
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
