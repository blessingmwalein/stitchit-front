import { useAuthStore } from "~/store/auth";

export function useApi() {
  const authStore = useAuthStore();

  return async function fetchData(url: string, options: any = {}) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${authStore.token}`,
    };
    return useFetch(url, options);
  };
}
