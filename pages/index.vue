<template>
  <div class="max-w-5xl mx-auto mt-24 p-6 bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-6 text-green-700">
      Dashboard Hafalan Santri
    </h1>

    <!-- Grid Layout 2 Columns 2 Rows -->
    <div class="grid grid-cols-1 md:grid-cols-1 gap-6 mb-10">
      <Chart />
    </div>

    <!-- Search & Limit -->
    <div class="flex flex-col md:flex-row md:items-center gap-4 mb-6">
      <input
        v-model="search"
        @input="fetchSantri"
        type="text"
        placeholder="Cari nama atau kelas..."
        class="border p-2 rounded w-full md:w-1/2"
      />

      <select
        v-model.number="limit"
        @change="fetchSantri"
        class="border p-2 rounded w-28"
      >
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="20">20</option>
      </select>
    </div>

    <!-- Tabel -->
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
            <td
              class="py-2 px-4 border-b font-semibold text-green-700 text-center"
            >
              {{ index + 1 + (currentPage - 1) * limit }}
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

    <!-- Pagination -->
    <div class="flex justify-center mt-6 gap-2">
      <button
        :disabled="currentPage === 1"
        @click="currentPage--, fetchSantri()"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        @click="
          currentPage = page;
          fetchSantri();
        "
        class="px-3 py-1 border rounded"
        :class="{
          'bg-green-600 text-white': currentPage === page,
          'bg-white': currentPage !== page,
        }"
      >
        {{ page }}
      </button>

      <button
        :disabled="currentPage === totalPages"
        @click="currentPage++, fetchSantri()"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
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
const currentPage = ref(1);
const totalPages = ref(1);
const search = ref("");
const limit = ref(10);

const fetchSantri = async () => {
  try {
    const res = await $fetch<{
      success: boolean;
      data: Santri[];
      totalPages: number;
    }>("/api/setoran/list", {
      query: {
        page: currentPage.value,
        limit: limit.value,
        search: search.value,
      },
    });

    if (res.success) {
      santriList.value = res.data;
      totalPages.value = res.totalPages;
    }
  } catch (err) {
    console.error("Gagal memuat data setoran:", err);
  }
};

onMounted(fetchSantri);
</script>
