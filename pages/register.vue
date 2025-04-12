<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <!-- Logo -->
      <div class="flex justify-center mb-4">
        <img src="/logo-qt.png" alt="Logo" class="w-72" />
      </div>

      <h1 class="text-2xl font-bold mb-6 text-center text-green-700">
        Registrasi Guru
      </h1>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block mb-1 font-semibold text-gray-700">
            Nama Lengkap
          </label>
          <input
            v-model="form.name"
            type="text"
            class="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-700">Username</label>
          <input
            v-model="form.username"
            type="text"
            class="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-700">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded transition flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <svg
            v-if="loading"
            class="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          {{ loading ? "Mendaftar..." : "Daftar sebagai Guru" }}
        </button>
      </form>

      <div v-if="message" class="mt-4 text-green-600 text-center">
        {{ message }}
      </div>
      <div v-if="error" class="mt-4 text-red-600 text-center">
        {{ error }}
      </div>

      <!-- Link ke login -->
      <p class="mt-6 text-center text-sm text-gray-600">
        Sudah punya akun?
        <NuxtLink
          to="/login"
          class="text-green-600 hover:underline font-medium"
        >
          Login di sini
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  layout: "login",
});

const form = ref({
  name: "",
  username: "",
  password: "",
});

const loading = ref(false);
const message = ref("");
const error = ref("");

const handleRegister = async () => {
  loading.value = true;
  message.value = "";
  error.value = "";

  try {
    await $fetch("/api/auth/register-guru", {
      method: "POST",
      body: form.value,
    });

    message.value = "Pendaftaran berhasil! Menunggu persetujuan admin.";
    form.value = { name: "", username: "", password: "" };
  } catch (err) {
    console.error(err);
    error.value =
      err?.data?.statusMessage || "Terjadi kesalahan saat mendaftar.";
  } finally {
    loading.value = false;
  }
};
</script>
