<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <!-- Logo -->
      <div class="flex justify-center mb-4">
        <img src="/logo-qt.png" alt="Logo" class="w-72" />
      </div>

      <h2 class="text-2xl font-bold mb-6 text-center text-green-700">Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-1">Username</label>
          <input
            v-model="username"
            type="text"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm mb-4">
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
        >
          Login
        </button>
      </form>

      <!-- Link ke register -->
      <p class="mt-6 text-center text-sm text-gray-600">
        Belum punya akun?
        <NuxtLink
          to="/register"
          class="text-green-600 hover:underline font-medium"
        >
          Daftar di sini
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  layout: "login",
});

const username = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const handleLogin = async () => {
  error.value = "";
  try {
    const res = await $fetch("/api/auth/login", {
      method: "POST",
      body: { username: username.value, password: password.value },
    });

    const token = useCookie("token");
    token.value = res.token;

    const role = useCookie("role");
    role.value = res.user.role;

    router.push("/");
  } catch (err) {
    error.value = err?.data?.statusMessage || "Gagal login. Coba lagi.";
  }
};
</script>
