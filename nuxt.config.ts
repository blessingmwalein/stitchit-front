import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt", 
    "nuxt-snackbar", 
    "@nuxtjs/tailwindcss", 
    "@primevue/nuxt-module", 
    "@vueform/nuxt"
  ],
  css: ["~/assets/css/tailwind.css"],
  tailwindcss: {
    cssPath: [`~/assets/css/tailwind.css`, { injectPosition: "first" }],
    config: {
      content: [
        "./components/**/*.{vue,js,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./vueform.config.ts", // Ensure Vueform is included
        "./node_modules/@vueform/vueform/themes/tailwind/**/*.vue",
        "./node_modules/@vueform/vueform/themes/tailwind/**/*.js",
      ],
      darkMode: "class",
      theme: {
        extend: {},
      },
      plugins: [
        require('@vueform/vueform/tailwind'),
      ],
    },
    viewer: true,
    exposeConfig: false,
  },
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || "https://localhost:8000/api",
      companyName: process.env.COMPANY_NAME || "My Company",
    },
  },
  snackbar: {
    bottom: true,
    center: true,
    duration: 5000,
  },
});
