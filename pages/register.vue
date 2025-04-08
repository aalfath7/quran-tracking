<template>
  <div class="container mx-auto px-4 py-10 max-w-md">
    <h1 class="text-2xl font-bold mb-6 text-center text-green-700">
      Registrasi Guru
    </h1>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label class="block mb-1 font-semibold">Nama Lengkap</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label class="block mb-1 font-semibold">Username</label>
        <input
          v-model="form.username"
          type="text"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label class="block mb-1 font-semibold">Password</label>
        <input
          v-model="form.password"
          type="password"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded"
        :disabled="loading"
      >
        {{ loading ? "Mendaftar..." : "Daftar sebagai Guru" }}
      </button>
    </form>

    <div v-if="message" class="mt-4 text-green-600 text-center">
      {{ message }}
    </div>
    <div v-if="error" class="mt-4 text-red-600 text-center">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";

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
