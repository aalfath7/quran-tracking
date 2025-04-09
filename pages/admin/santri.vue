<template>
  <div class="max-w-2xl mx-auto mt-24 p-6 bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-6 text-green-700">Tambah Santri</h1>

    <form @submit.prevent="handleSubmit">
      <!-- Nama -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Nama</label>
        <input
          v-model="form.nama"
          type="text"
          class="mt-1 block w-full p-2 border rounded"
          placeholder="Nama santri"
          required
        />
      </div>

      <!-- Kelas -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Kelas</label>
        <input
          v-model="form.kelas"
          type="text"
          class="mt-1 block w-full p-2 border rounded"
          placeholder="Contoh: 7A"
          required
        />
      </div>

      <!-- Halaqoh -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Halaqoh</label>
        <select
          v-model="form.halaqohId"
          class="mt-1 block w-full p-2 border rounded"
          required
        >
          <option value="" disabled>Pilih halaqoh</option>
          <option
            v-for="halaqoh in halaqohList"
            :key="halaqoh._id"
            :value="halaqoh._id"
          >
            {{ halaqoh.nama }} - Ust. {{ halaqoh.guru?.name }}
          </option>
        </select>
      </div>

      <!-- Submit -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
  kelas: "",
  halaqohId: "",
});

const halaqohList = ref([]);
const successMessage = ref("");
const errorMessage = ref("");

onMounted(async () => {
  try {
    const res = await $fetch("/api/halaqoh/list"); // ganti dengan endpoint yang sesuai
    halaqohList.value = res.data;
  } catch (err) {
    errorMessage.value = "Gagal memuat daftar halaqoh";
  }
});

const handleSubmit = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  try {
    const res = await $fetch("/api/santri/create", {
      method: "POST",
      body: { ...form.value },
    });
    successMessage.value = "Santri berhasil ditambahkan!";
    form.value = { nama: "", kelas: "", halaqohId: "" };
  } catch (err) {
    errorMessage.value =
      err?.data?.message || "Terjadi kesalahan saat menyimpan.";
  }
};
</script>
