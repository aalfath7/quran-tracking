<template>
  <div class="p-4 max-w-xl mx-auto">
    <h2 class="text-xl font-bold mb-4">Kirim Setoran Hafalan</h2>
    <form @submit.prevent="submitSetoran" class="space-y-4">
      <input v-model="surat" placeholder="Nama Surat" class="input" />
      <input v-model="ayat" placeholder="Ayat" class="input" />
      <textarea
        v-model="catatan"
        placeholder="Catatan"
        class="input"
      ></textarea>

      <button class="bg-blue-600 text-white px-4 py-2 rounded">Kirim</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const surat = ref("");
const ayat = ref("");
const catatan = ref("");

const submitSetoran = async () => {
  try {
    await $fetch("/api/setoran/create", {
      method: "POST",
      body: {
        surat: surat.value,
        ayat: ayat.value,
        catatan: catatan.value,
        // Ambil santriId dari auth store jika perlu
      },
    });
    alert("Setoran berhasil dikirim!");
    surat.value = ayat.value = catatan.value = "";
  } catch (err) {
    console.error(err);
    alert("Gagal mengirim setoran");
  }
};
</script>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded px-3 py-2;
}
</style>
