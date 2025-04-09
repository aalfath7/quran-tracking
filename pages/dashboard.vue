<template>
  <div class="max-w-5xl mx-auto mt-24 p-6 bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-6 text-green-700">Dashboard Guru</h1>

    <table class="min-w-full bg-white border">
      <thead>
        <tr class="bg-green-600 text-white">
          <th class="text-left py-2 px-4 border-b">Nama Santri</th>
          <th class="text-left py-2 px-4 border-b">Kelas</th>
          <th class="text-left py-2 px-4 border-b">Total Setoran</th>
          <th class="text-left py-2 px-4 border-b">Setoran Bulan Ini</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="santri in santriList"
          :key="santri._id"
          class="hover:bg-gray-50"
        >
          <td class="py-2 px-4 border-b">{{ santri.nama }}</td>
          <td class="py-2 px-4 border-b">{{ santri.kelas }}</td>
          <td class="py-2 px-4 border-b text-center">
            {{ santri.totalSetoran }}
          </td>
          <td class="py-2 px-4 border-b text-center">{{ santri.bulanIni }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="!santriList.length" class="text-center py-10 text-gray-500">
      Belum ada data santri.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const santriList = ref([]);

onMounted(async () => {
  try {
    const res = await $fetch("/api/halaqoh/dashboard");
    if (res.success) {
      santriList.value = res.data;
    }
  } catch (err) {
    console.error("Gagal memuat data dashboard guru:", err);
  }
});
</script>
