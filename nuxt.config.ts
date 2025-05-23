// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/google-fonts"],
  css: ["@/assets/css/tailwind.css"],
  runtimeConfig: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  googleFonts: {
    families: {
      Manrope: true,
    },
  },
});
