<template>
  <div class="max-w-6xl mx-auto mt-24 p-6 bg-white shadow rounded">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Daftar Halaqoh</h1>
      <NuxtLink
        to="/admin/halaqoh/add"
        class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
      >
        + Tambah Halaqoh
      </NuxtLink>
    </div>

    <table class="w-full border">
      <thead class="bg-gray-100">
        <tr>
          <th class="border p-2">Nama</th>
          <th class="border p-2">Guru</th>
          <th class="border p-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="h in halaqohList" :key="h._id">
          <td class="border p-2 capitalize">{{ h.nama }}</td>
          <td class="border p-2">{{ h.guru?.name }}</td>
          <td class="border p-2 space-x-2">
            <button
              class="bg-blue-500 text-white px-2 py-1 rounded"
              @click="openEditModal(h)"
            >
              Edit
            </button>
            <button
              class="bg-red-500 text-white px-2 py-1 rounded"
              @click="deleteHalaqoh(h._id)"
            >
              Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Edit -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
        <h2 class="text-xl font-bold mb-2">Edit Halaqoh</h2>
        <form @submit.prevent="submitEdit">
          <div class="mb-2">
            <label class="block font-semibold mb-1">Nama</label>
            <input
              v-model="editForm.nama"
              type="text"
              class="w-full border px-3 py-2 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block font-semibold mb-1">Guru</label>
            <select
              v-model="editForm.guru"
              class="w-full border px-3 py-2 rounded"
            >
              <option
                v-for="guru in guruList"
                :key="guru._id"
                :value="guru._id"
              >
                {{ guru.name }}
              </option>
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="bg-gray-500 text-white px-3 py-1 rounded"
              @click="showModal = false"
            >
              Batal
            </button>
            <button
              type="submit"
              class="bg-green-600 text-white px-3 py-1 rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="successMessage" class="mt-4 text-green-600">
      ✅ {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="mt-4 text-red-600">
      ❌ {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const halaqohList = ref([]);
const guruList = ref([]);
const showModal = ref(false);
const editForm = ref({ _id: "", nama: "", guru: "" });
const successMessage = ref("");
const errorMessage = ref("");

const fetchHalaqoh = async () => {
  const data = await $fetch("/api/halaqoh/list");
  if (data?.success) {
    halaqohList.value = data.data;
  }
};

const fetchGuru = async () => {
  const data = await $fetch("/api/guru");
  if (data?.success) guruList.value = data.data;
};

const submitEdit = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  const data = await $fetch(`/api/halaqoh/${editForm.value._id}`, {
    method: "PUT",
    body: editForm.value,
  });
  if (data?.success) {
    successMessage.value = "Halaqoh berhasil diubah!";
    showModal.value = false;
    fetchHalaqoh();
  } else {
    errorMessage.value = "Halaqoh gagal diubah!";
  }
};

const deleteHalaqoh = async (id) => {
  successMessage.value = "";
  errorMessage.value = "";

  const konfirmasi = confirm("Yakin ingin menghapus halaqoh ini?");
  if (!konfirmasi) return;
  const data = await $fetch(`/api/halaqoh/${id}`, {
    method: "DELETE",
  });
  if (data?.success) {
    successMessage.value = "Halaqoh berhasil dihapus!";
    fetchHalaqoh();
  } else {
    errorMessage.value = "Halaqoh gagal dihapus!";
  }
};

const openEditModal = (halaqoh) => {
  editForm.value = {
    _id: halaqoh._id,
    nama: halaqoh.nama,
    guru: halaqoh.guru?._id || "",
  };
  showModal.value = true;
};

onMounted(() => {
  fetchHalaqoh();
  fetchGuru();
});
</script>
