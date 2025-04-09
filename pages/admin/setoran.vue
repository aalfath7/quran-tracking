<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Daftar Setoran</h1>

    <div v-if="loading">Memuat...</div>
    <div v-else>
      <table class="min-w-full border border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="border px-4 py-2">Santri</th>
            <th class="border px-4 py-2">Surat</th>
            <th class="border px-4 py-2">Ayat</th>
            <th class="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in setorans" :key="s._id">
            <td class="border px-4 py-2">{{ s.santriId.username }}</td>
            <td class="border px-4 py-2">{{ s.surat }}</td>
            <td class="border px-4 py-2">{{ s.ayat }}</td>
            <td class="border px-4 py-2">{{ s.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const setorans = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await $fetch("/api/setoran/list");
    setorans.value = data.setorans;
  } catch (err) {
    console.error("Gagal memuat setoran:", err);
  } finally {
    loading.value = false;
  }
});
</script>
