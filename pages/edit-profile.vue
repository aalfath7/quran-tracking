<template>
  <div class="max-w-xl mx-auto mt-20 bg-white p-6 shadow rounded">
    <h1 class="text-2xl font-bold mb-6 text-green-700 text-center">
      Edit Profil
    </h1>

    <form @submit.prevent="updateProfile" class="space-y-4">
      <div>
        <label class="block mb-1 font-semibold text-gray-700">Nama</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <label class="block mb-1 font-semibold text-gray-700">Username</label>
        <input
          v-model="form.username"
          type="text"
          class="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <!-- Form Password Lama -->
      <div>
        <label class="block mb-1 font-semibold text-gray-700"
          >Password Lama</label
        >
        <input
          v-model="form.oldPassword"
          type="password"
          class="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <!-- Form Password Baru -->
      <div>
        <label class="block mb-1 font-semibold text-gray-700"
          >Password Baru</label
        >
        <input
          v-model="form.password"
          type="password"
          class="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          :required="form.oldPassword.length > 0"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded"
        :disabled="loading"
      >
        {{ loading ? "Menyimpan..." : "Simpan Perubahan" }}
      </button>

      <div v-if="successMessage" class="text-green-600 text-center mt-4">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="text-red-600 text-center mt-4">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const form = ref({
  name: "",
  username: "",
  password: "",
  oldPassword: "", // Password lama
});

const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Ambil data user dari store
onMounted(() => {
  if (auth.user) {
    form.value.name = auth.user.name || "";
    form.value.username = auth.user.username || "";
  } else {
    errorMessage.value = "Data pengguna tidak tersedia.";
  }
});

const updateProfile = async () => {
  loading.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    const response = await $fetch("/api/auth/update-profile", {
      method: "PUT",
      body: form.value,
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    // Update data user di store
    auth.updateUser({
      ...auth.user,
      username: form.value.username,
      name: form.value.name,
    });

    // Jika password baru diubah, simpan token baru dan lakukan login ulang
    const newToken = response.token; // Ambil token baru dari respons API
    auth.token = newToken; // Perbarui token di store
    const tokenCookie = useCookie("token");
    tokenCookie.value = newToken; // Simpan token baru di cookie

    successMessage.value =
      "Profil berhasil diperbarui. Anda telah login ulang secara otomatis.";
  } catch (err) {
    errorMessage.value = err?.data?.message || "Gagal memperbarui profil.";
  } finally {
    loading.value = false;
  }
};
</script>
