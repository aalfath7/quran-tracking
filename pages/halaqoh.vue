<template>
  <div class="max-w-5xl mx-auto mt-24 p-6 bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-6 text-green-700">Data Halaqoh</h1>

    <div v-for="halaqoh in halaqohList" :key="halaqoh._id" class="mb-10">
      <div class="mb-2">
        <h2 class="text-xl font-semibold text-green-800 capitalize">
          {{ halaqoh.nama }}
        </h2>
        <p class="text-gray-600 capitalize">Guru: {{ halaqoh.guru.name }}</p>
      </div>

      <table class="min-w-full bg-white border mt-2">
        <thead>
          <tr class="bg-green-600 text-white">
            <th class="text-left py-2 px-4 border-b">Nama Santri</th>
            <th class="text-left py-2 px-4 border-b">Kelas</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="santri in halaqoh.santri"
            :key="santri._id"
            class="hover:bg-gray-50"
          >
            <td class="py-2 px-4 border-b capitalize">{{ santri.nama }}</td>
            <td class="py-2 px-4 border-b">{{ santri.kelas }}</td>
          </tr>
          <tr v-if="!halaqoh.santri.length">
            <td colspan="2" class="py-3 text-center text-gray-400 italic">
              Belum ada santri.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const halaqohList = ref([]);

onMounted(async () => {
  try {
    const res = await $fetch("/api/halaqoh/with-santri");
    if (res.success) {
      halaqohList.value = res.data;
    }
  } catch (err) {
    console.error("Gagal memuat data halaqoh:", err);
  }
});
</script>
