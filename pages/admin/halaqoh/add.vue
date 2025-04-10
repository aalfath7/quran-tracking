<template>
  <div class="max-w-xl mx-auto mt-24 p-6 bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-6 text-indigo-700">Tambah Halaqoh</h1>

    <form @submit.prevent="handleSubmit">
      <!-- Nama Halaqoh -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700"
          >Nama Halaqoh</label
        >
        <input
          v-model="form.nama"
          type="text"
          class="mt-1 block w-full p-2 border rounded"
          placeholder="Contoh: Halaqoh 1"
          required
        />
      </div>

      <!-- Guru Pengampu -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700"
          >Guru Pengampu</label
        >
        <select
          v-model="form.guruId"
          class="mt-1 block w-full p-2 border rounded"
          required
        >
          <option value="" disabled>Pilih guru</option>
          <option v-for="guru in guruList" :key="guru._id" :value="guru._id">
            {{ guru.name }}
          </option>
        </select>
      </div>

      <!-- Submit -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Simpan
        </button>
      </div>
    </form>

    <div v-if="successMessage" class="mt-4 text-green-600">
      ✅ {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="mt-4 text-red-600">
      ❌ {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const form = ref({
  nama: "",
  guruId: "",
});

const guruList = ref([]);
const successMessage = ref("");
const errorMessage = ref("");

onMounted(async () => {
  try {
    const res = await $fetch("/api/admin/all-user"); // pastikan ini endpoint untuk ambil guru
    guruList.value = res.users.filter((user) => user.role === "guru");
  } catch (err) {
    errorMessage.value = "Gagal memuat daftar guru.";
  }
});

const handleSubmit = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  try {
    await $fetch("/api/halaqoh/create", {
      method: "POST",
      body: { ...form.value },
    });
    successMessage.value = "Halaqoh berhasil ditambahkan!";
    form.value = { nama: "", guruId: "" };
  } catch (err) {
    errorMessage.value =
      err?.data?.message || "Terjadi kesalahan saat menyimpan.";
  }
};
</script>
