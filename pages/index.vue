<template>
  <div class="max-w-5xl mx-auto mt-24 p-6 bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-6 text-green-700">
      Dashboard Hafalan Santri
    </h1>

    <!-- Grid Layout 2 Columns 2 Rows -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <div
        class="bg-gray-50 p-4 rounded shadow flex items-center justify-center text-gray-400"
      >
        <Chart />
      </div>
    </div>

    <!-- Tabel Responsif -->
    <div class="overflow-x-auto">
      <table class="min-w-[800px] w-full bg-white border">
        <thead>
          <tr class="bg-green-600 text-white">
            <th class="text-center py-2 px-4 border-b">No</th>
            <th class="text-left py-2 px-4 border-b">Nama Santri</th>
            <th class="text-left py-2 px-4 border-b">Kelas</th>
            <th class="text-center py-2 px-4 border-b">Total Halaman</th>
            <th class="text-center py-2 px-4 border-b">Hafalan Terakhir</th>
            <th class="text-center py-2 px-4 border-b">Setoran Bulan Ini</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(santri, index) in santriList"
            :key="santri._id"
            class="hover:bg-gray-50"
          >
            <td class="py-2 px-4 border-b font-semibold text-green-700">
              {{ index + 1 }}
            </td>
            <td class="py-2 px-4 border-b">{{ santri.nama }}</td>
            <td class="py-2 px-4 border-b">{{ santri.kelas }}</td>
            <td class="py-2 px-4 border-b text-center">
              {{ santri.totalHalaman }}
            </td>
            <td class="py-2 px-4 border-b text-center">
              {{ santri.hafalanTerakhir }}
            </td>
            <td class="py-2 px-4 border-b text-center">
              {{ santri.bulanIni }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!santriList.length" class="text-center py-10 text-gray-500">
      Belum ada data santri.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Santri {
  _id: string;
  nama: string;
  kelas: string;
  totalHalaman: number;
  hafalanTerakhir: string;
  bulanIni: number;
}

const santriList = ref<Santri[]>([]);

onMounted(async () => {
  try {
    const res = await $fetch<{ success: boolean; data: Santri[] }>(
      "/api/setoran/list"
    );

    if (res.success) {
      santriList.value = res.data;
    }
  } catch (err) {
    console.error("Gagal memuat data setoran:", err);
  }
});
</script>
