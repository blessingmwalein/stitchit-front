import { useClientsStore } from '~/store/client';

export default defineNuxtPlugin(async () => {
  const authStore = useClientsStore();
});
