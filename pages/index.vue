<template>
  <div class="max-w-6xl mx-auto mt-24 p-6 bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-6 text-green-700">
      Daftar Seluruh Santri
    </h1>

    <table class="min-w-full bg-white border">
      <thead>
        <tr class="bg-green-600 text-white">
          <th class="text-left py-2 px-4 border-b">Nama</th>
          <th class="text-left py-2 px-4 border-b">Kelas</th>
          <th class="text-left py-2 px-4 border-b">Halaqoh</th>
          <th class="text-left py-2 px-4 border-b">Guru</th>
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
          <td class="py-2 px-4 border-b">
            {{ santri.halaqohId?.nama || "-" }}
          </td>
          <td class="py-2 px-4 border-b">
            Ust. {{ santri.halaqohId?.guru?.name || "-" }}
          </td>
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
    const res = await $fetch("/api/santri/list");
    santriList.value = res.data || [];
  } catch (error) {
    console.error("Gagal memuat data santri:", error);
  }
});
</script>
