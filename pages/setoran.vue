<template>
  <div class="max-w-xl mx-auto mt-24 p-6 bg-white shadow rounded">
    <h2 class="text-xl font-bold text-green-700 mb-4">Input Setoran Santri</h2>

    <form @submit.prevent="submitSetoran">
      <div class="mb-4">
        <label class="block mb-1">Santri</label>
        <select
          v-model="form.santriId"
          class="w-full border p-2 rounded"
          :disabled="loadingSantri"
        >
          <option value="" disabled>Pilih Santri</option>
          <option v-if="loadingSantri" disabled>Memuat data santri...</option>
          <option v-else v-for="s in santriList" :key="s._id" :value="s._id">
            {{ s.nama }} - {{ s.kelas }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block mb-1">Surat</label>
        <select v-model="form.surat" class="w-full border p-2 rounded">
          <option value="">Pilih Surat</option>
          <option
            v-for="(nama, index) in daftarSurat"
            :key="index"
            :value="nama"
          >
            {{ nama }}
          </option>
        </select>
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
        <label class="block mb-1">Jumlah Halaman</label>
        <input
          v-model="form.jumlahHalaman"
          type="number"
          step="0.1"
          class="w-full border p-2 rounded"
          placeholder="Contoh: 1"
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
import { useRouter } from "vue-router"; // impor router
const router = useRouter();

const auth = useAuthStore();
auth.loadFromStorage();

const guruId = computed(() => auth.user?._id || "");

const form = ref({
  santriId: "",
  surat: "",
  ayat: "",
  jumlahHalaman: "",
  catatan: "",
});

const daftarSurat = [
  "Al-Fatihah",
  "Al-Baqarah",
  "Ali 'Imran",
  "An-Nisa",
  "Al-Ma'idah",
  "Al-An'am",
  "Al-A'raf",
  "Al-Anfal",
  "At-Taubah",
  "Yunus",
  "Hud",
  "Yusuf",
  "Ar-Ra'd",
  "Ibrahim",
  "Al-Hijr",
  "An-Nahl",
  "Al-Isra",
  "Al-Kahf",
  "Maryam",
  "Taha",
  "Al-Anbiya",
  "Al-Hajj",
  "Al-Mu’minun",
  "An-Nur",
  "Al-Furqan",
  "Asy-Syu'ara",
  "An-Naml",
  "Al-Qasas",
  "Al-Ankabut",
  "Ar-Rum",
  "Luqman",
  "As-Sajdah",
  "Al-Ahzab",
  "Saba",
  "Fatir",
  "Yasin",
  "Ash-Saffat",
  "Sad",
  "Az-Zumar",
  "Ghafir",
  "Fussilat",
  "Asy-Syura",
  "Az-Zukhruf",
  "Ad-Dukhan",
  "Al-Jasiyah",
  "Al-Ahqaf",
  "Muhammad",
  "Al-Fath",
  "Al-Hujurat",
  "Qaf",
  "Adz-Dzariyat",
  "At-Tur",
  "An-Najm",
  "Al-Qamar",
  "Ar-Rahman",
  "Al-Waqi'ah",
  "Al-Hadid",
  "Al-Mujadilah",
  "Al-Hasyr",
  "Al-Mumtahanah",
  "As-Saff",
  "Al-Jumu'ah",
  "Al-Munafiqun",
  "At-Taghabun",
  "At-Talaq",
  "At-Tahrim",
  "Al-Mulk",
  "Al-Qalam",
  "Al-Haqqah",
  "Al-Ma’arij",
  "Nuh",
  "Al-Jinn",
  "Al-Muzzammil",
  "Al-Muddathir",
  "Al-Qiyamah",
  "Al-Insan",
  "Al-Mursalat",
  "An-Naba",
  "An-Nazi’at",
  "Abasa",
  "At-Takwir",
  "Al-Infitar",
  "Al-Mutaffifin",
  "Al-Insyiqaq",
  "Al-Buruj",
  "At-Tariq",
  "Al-A'la",
  "Al-Ghasyiyah",
  "Al-Fajr",
  "Al-Balad",
  "Asy-Syams",
  "Al-Lail",
  "Ad-Duha",
  "Asy-Syarh",
  "At-Tin",
  "Al-‘Alaq",
  "Al-Qadr",
  "Al-Bayyinah",
  "Az-Zalzalah",
  "Al-‘Adiyat",
  "Al-Qari’ah",
  "At-Takatsur",
  "Al-‘Asr",
  "Al-Humazah",
  "Al-Fil",
  "Quraisy",
  "Al-Ma’un",
  "Al-Kautsar",
  "Al-Kafirun",
  "An-Nasr",
  "Al-Lahab",
  "Al-Ikhlas",
  "Al-Falaq",
  "An-Nas",
];

const santriList = ref([]);
const loadingSantri = ref(true); // ⬅️ Loading state

onMounted(async () => {
  try {
    loadingSantri.value = true;
    const res = await $fetch("/api/santri/list");
    santriList.value = res.data.filter(
      (s) => s.halaqoh?.guru?._id === guruId.value
    );
  } catch (e) {
    console.error("Gagal memuat data santri:", e);
  } finally {
    loadingSantri.value = false;
  }
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
      jumlahHalaman: "",
      catatan: "",
    };
    router.push("/");
  } catch (e) {
    alert("Gagal menyimpan setoran.");
    console.error(e);
  }
}
</script>
