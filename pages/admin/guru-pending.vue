<template>
  <div class="container mx-auto px-4 py-10">
    <h1 class="text-2xl font-bold mb-6 text-green-700">
      Guru Menunggu Persetujuan
    </h1>

    <div v-if="loading" class="text-gray-500">Memuat data...</div>
    <div v-else-if="pendingGuru.length === 0" class="text-gray-600">
      Tidak ada guru menunggu.
    </div>

    <ul v-else class="space-y-4">
      <li
        v-for="guru in pendingGuru"
        :key="guru._id"
        class="bg-white shadow p-4 rounded flex justify-between items-center"
      >
        <div>
          <p class="font-semibold">{{ guru.username }}</p>
          <p class="text-sm text-gray-500">ID: {{ guru._id }}</p>
        </div>
        <button
          @click="approveGuru(guru._id)"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          :disabled="approvingId === guru._id"
        >
          {{ approvingId === guru._id ? "Menyetujui..." : "Setujui" }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const pendingGuru = ref([]);
const loading = ref(true);
const approvingId = ref(null);

const fetchPendingGuru = async () => {
  loading.value = true;
  try {
    const data = await $fetch("/api/admin/pending-guru");
    pendingGuru.value = data.gurus;
  } catch (error) {
    console.error("Gagal memuat data guru pending:", error);
  } finally {
    loading.value = false;
  }
};

const approveGuru = async (id) => {
  approvingId.value = id;
  try {
    await $fetch(`/api/admin/approve-guru`, {
      method: "PUT",
      body: { userId: id },
    });
    pendingGuru.value = pendingGuru.value.filter((guru) => guru._id !== id);
  } catch (error) {
    console.error("Gagal menyetujui:", error);
  } finally {
    approvingId.value = null;
  }
};

onMounted(() => {
  fetchPendingGuru();
});
</script>
