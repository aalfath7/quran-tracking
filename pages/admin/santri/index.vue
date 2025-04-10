<template>
  <div class="max-w-6xl mx-auto mt-24 p-6 bg-white shadow rounded">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Daftar Santri</h1>
      <NuxtLink
        to="/admin/santri/add"
        class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
      >
        + Tambah Santri
      </NuxtLink>
    </div>

    <table class="min-w-full border">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2">Nama</th>
          <th class="p-2">Kelas</th>
          <th class="p-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="santri in santriList" :key="santri._id">
          <td class="p-2 text-center capitalize">{{ santri.nama }}</td>
          <td class="p-2 text-center">{{ santri.kelas }}</td>
          <td class="p-2 text-center space-x-2">
            <button @click="openEdit(santri)" class="text-blue-500">
              Edit
            </button>
            <button @click="hapusSantri(santri._id)" class="text-red-500">
              Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Modal -->
    <div
      v-if="editSantri"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-4 rounded shadow w-96">
        <h3 class="text-lg font-bold mb-2">Edit Santri</h3>
        <input
          v-model="editSantri.nama"
          placeholder="Nama"
          class="border w-full p-2 mb-2"
        />
        <input
          v-model="editSantri.kelas"
          placeholder="Kelas"
          class="border w-full p-2 mb-2"
        />
        <div class="flex justify-end space-x-2">
          <button @click="editSantri = null" class="text-gray-500">
            Batal
          </button>
          <button @click="simpanEdit" class="text-green-600">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const santriList = ref([]);
const editSantri = ref(null);

const fetchSantri = async () => {
  const res = await $fetch("/api/santri/list");
  if (res.success) santriList.value = res.data;
};

const openEdit = (santri) => {
  editSantri.value = { ...santri };
};

const simpanEdit = async () => {
  await $fetch(`/api/santri/${editSantri.value._id}`, {
    method: "PUT",
    body: {
      nama: editSantri.value.nama,
      kelas: editSantri.value.kelas,
    },
  });
  editSantri.value = null;
  fetchSantri();
};

const hapusSantri = async (id) => {
  if (confirm("Yakin ingin menghapus santri ini?")) {
    await $fetch(`/api/santri/${id}`, { method: "DELETE" });
    fetchSantri();
  }
};

onMounted(fetchSantri);
</script>
