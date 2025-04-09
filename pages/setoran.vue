<template>
  <div class="max-w-xl mx-auto mt-24 p-6 bg-white shadow rounded">
    <h2 class="text-xl font-bold text-green-700 mb-4">Input Setoran Santri</h2>

    <form @submit.prevent="submitSetoran">
      <div class="mb-4">
        <label class="block mb-1">Santri</label>
        <select v-model="form.santriId" class="w-full border p-2 rounded">
          <option value="">Pilih Santri</option>
          <option v-for="s in santriList" :key="s._id" :value="s._id">
            {{ s.nama }} - {{ s.kelas }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block mb-1">Surat</label>
        <input
          v-model="form.surat"
          class="w-full border p-2 rounded"
          placeholder="Contoh: Al-Baqarah"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Ayat</label>
        <input
          v-model="form.ayat"
          class="w-full border p-2 rounded"
          placeholder="Contoh: 1-5"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Catatan</label>
        <textarea
          v-model="form.catatan"
          class="w-full border p-2 rounded"
        ></textarea>
      </div>

      <button
        type="submit"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Simpan Setoran
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth"; // pastikan path benar

const auth = useAuthStore();
auth.loadFromStorage();

const guruId = computed(() => auth.user?._id || "");

const form = ref({
  santriId: "",
  surat: "",
  ayat: "",
  catatan: "",
});

const santriList = ref([]);

onMounted(async () => {
  const res = await $fetch("/api/santri/list");
  santriList.value = res.data.filter(
    (s) => s.halaqoh?.guru?._id === guruId.value
  );
});

async function submitSetoran() {
  try {
    await $fetch("/api/setoran/create", {
      method: "POST",
      body: {
        ...form.value,
        guruId: guruId.value,
      },
    });
    alert("Setoran berhasil disimpan!");
    form.value = {
      santriId: "",
      surat: "",
      ayat: "",
      catatan: "",
    };
  } catch (e) {
    alert("Gagal menyimpan setoran.");
    console.error(e);
  }
}
</script>
