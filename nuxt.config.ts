// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "nuxt-snackbar"],
  // Defaults options
  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.css", { injectPosition: "first" }],
    config: {},
    viewer: true,
    exposeConfig: false,
  },
  snackbar: {
    bottom: true,
    center: true,
    duration: 5000,
  },
});
