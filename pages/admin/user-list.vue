<template>
  <div>
    <div v-if="loading" class="text-gray-500">Memuat pengguna...</div>
    <ul v-else class="space-y-4">
      <li
        v-for="user in users"
        :key="user._id"
        class="bg-white shadow p-4 rounded flex justify-between items-center"
      >
        <div>
          <p class="font-semibold">{{ user.username }}</p>
          <p class="text-sm text-gray-500">
            {{ user.role }} -
            {{ user.approved ? "Approved" : "Belum Disetujui" }}
          </p>
        </div>
        <div class="flex gap-2">
          <button
            v-if="!user.approved"
            @click="approveUser(user._id)"
            class="text-sm bg-green-500 text-white px-3 py-1 rounded"
          >
            Approve
          </button>
          <button
            @click="deleteUser(user._id)"
            class="text-sm bg-red-500 text-white px-3 py-1 rounded"
          >
            Hapus
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const users = ref([]);
const loading = ref(true);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const data = await $fetch("/api/admin/all-users");
    users.value = data.users;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const approveUser = async (id) => {
  await $fetch("/api/admin/approve-guru", {
    method: "POST",
    body: { userId: id },
  });
  await fetchUsers();
};

const deleteUser = async (id) => {
  const confirmDelete = confirm("Yakin ingin menghapus user ini?");
  if (!confirmDelete) return;

  await $fetch("/api/admin/delete-user", {
    method: "POST",
    body: { userId: id },
  });
  await fetchUsers();
};

onMounted(fetchUsers);
</script>
