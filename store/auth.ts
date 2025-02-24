import { defineStore } from 'pinia';
import { useCookie, useFetch } from '#app';

interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  two_factor_confirmed_at: string | null;
  current_team_id: number | null;
  profile_photo_path: string | null;
  created_at: string;
  updated_at: string;
  profile_photo_url: string;
  roles: Role[];
}

interface AuthResponse {
  success: boolean;
  message: string;
  response: {
    token: string;
    user: User;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: useCookie<string | null>('auth_token').value || null,
  }),

  actions: {
    async login(credentials: LoginCredentials) {
      try {
        const { data } = await useFetch<AuthResponse>('/api/auth/login', {
          method: 'POST',
          body: credentials,
        });

        if (data.value?.response.token) {
          this.token = data.value.response.token;
          this.user = data.value.response.user;

          // Store token in a cookie
          useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 }).value = data.value.response.token; // 7 days expiry
        }
      } catch (error) {
        console.error('Login failed', error);
      }
    },

    async logout() {
      this.token = null;
      this.user = null;
      useCookie('auth_token').value = null;
    },

    async fetchUser() {
      if (!this.token) return;
      try {
        const { data } = await useFetch<User>('/api/auth/me', {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.user = data.value || null;
      } catch (error) {
        console.error('Fetch user failed', error);
      }
    },
  },

  persist: {
    enabled: true,
    strategies: [{ storage: 'cookies', key: 'auth' }], // Use cookies for SSR
  },
});
