// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  css: ["@/assets/css/main.css"],
  ui: {
    colorMode: false,
  },
  icon: {},
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  ssr: true,
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },
});
