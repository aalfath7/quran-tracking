<template>
  <div class="max-w-6xl mx-auto mt-24 p-6 bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-6 text-green-700">
      Data Halaqoh & Santri
    </h1>

    <div
      v-if="santriList.length === 0"
      class="text-center text-gray-500 italic"
    >
      Belum ada data santri.
    </div>

    <div v-else>
      <div class="mb-6">
        <p class="text-xl font-semibold text-green-800 capitalize">
          Guru: {{ namaGuru }}
        </p>
        <p class="text-gray-600">Total Santri: {{ totalSantri }}</p>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-[800px] w-full bg-white border mt-2">
          <thead>
            <tr class="bg-green-600 text-white">
              <th class="text-left py-2 px-4 border-b">Nama Santri</th>
              <th class="text-left py-2 px-4 border-b">Kelas</th>
              <th class="text-left py-2 px-4 border-b">Total Halaman</th>
              <th class="text-left py-2 px-4 border-b">Hafalan Terakhir</th>
              <th class="text-left py-2 px-4 border-b">Setoran Bulan Ini</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="santri in santriList"
              :key="santri._id"
              class="hover:bg-gray-50"
            >
              <td class="py-2 px-4 border-b capitalize">{{ santri.nama }}</td>
              <td class="py-2 px-4 border-b">{{ santri.kelas }}</td>
              <td class="py-2 px-4 border-b">{{ santri.totalHalaman }}</td>
              <td class="py-2 px-4 border-b">{{ santri.hafalanTerakhir }}</td>
              <td class="py-2 px-4 border-b">{{ santri.bulanIni }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const santriList = ref([]);
const namaGuru = ref("");
const totalSantri = ref(0);

onMounted(async () => {
  try {
    const res = await $fetch("/api/halaqoh/list"); // Sesuaikan endpoint
    if (res.success) {
      santriList.value = res.data;
      namaGuru.value = res.namaGuru;
      totalSantri.value = res.totalSantri;
    }
  } catch (err) {
    console.error("Gagal memuat data halaqoh:", err);
  }
});
</script>
