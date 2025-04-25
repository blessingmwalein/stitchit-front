import { defineStore } from 'pinia'
import { useCookie } from '#imports'
import { useRouter } from 'vue-router'
import type { AuthResponse, LoginCredentials, ProfileResponse, User } from '~/utils/models/auth'
import { getApiUrl } from '~/utils/api'
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: useCookie<string | null>('auth_token').value || null,
    successMessage: null as string | null,
    errorMessage: null as string | null,
    errors: {} as Record<string, string>,
    isLoading: false,
    loginForm: {} as LoginCredentials,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login() {
      this.isLoading = true
      this.resetMessages()

      try {
        const data = await $fetch<AuthResponse>(getApiUrl('auth/admin/login'), {
          method: 'POST',
          body: this.loginForm,
        })

        if (!data.response?.token) {
          throw new Error(data.message || 'Login failed')
        }

        this.token = data.response.token
        this.user  = data.response.user
        useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 }).value = data.response.token
        this.successMessage = 'Login successful'

        // Fetch full profile
        await this.fetchUser()
      } catch (err: any) {
        const resp = handleApiError(err)
        this.setMessages(resp)
      } finally {
        this.isLoading = false
      }
    },

    async fetchUser() {
      if (!this.token) return
      this.isLoading = true
      try {
        const data = await $fetch<ProfileResponse>(getApiUrl('auth/admin/profile'), {
          method: 'GET',
          headers: { Authorization: `Bearer ${this.token}` },
        })

        if (data.response) {
          this.user = data.response
        } else {
          throw new Error(data.message || 'Failed to fetch profile')
        }
      } catch (err: any) {
        const resp = handleApiError(err)
        this.setMessages(resp)
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      // clear cookie
      const cookie = useCookie('auth_token')
      cookie.value = null
      cookie.delete()

      // reset store state
      this.user = null
      this.token = null
      this.resetMessages()
      this.resetForm()

      // redirect to login
      const router = useRouter()
      router.push({ name: 'login' })
    },

    setMessages(response: any) {
      this.errorMessage   = response.errorMessage   || null
      this.successMessage = response.successMessage || null
      this.errors         = response.errors         || {}
    },

    resetMessages() {
      this.successMessage = null
      this.errorMessage   = null
      this.errors         = {}
    },

    resetForm() {
      this.loginForm      = {} as LoginCredentials
    },
  },

  persist: {
    enabled: true,
    strategies: [{ storage: 'cookies', key: 'auth' }],
  },
})
