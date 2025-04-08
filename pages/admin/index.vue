<template>
  <div class="container mx-auto px-4 py-10">
    <h1 class="text-2xl font-bold mb-6 text-green-700">Dashboard Admin</h1>

    <div class="flex gap-4 mb-6">
      <button @click="tab = 'pending'" :class="tabBtnClass(tab === 'pending')">
        Guru Pending
      </button>
      <button @click="tab = 'users'" :class="tabBtnClass(tab === 'users')">
        Semua Pengguna
      </button>
    </div>

    <div v-if="tab === 'pending'">
      <GuruPending />
    </div>

    <div v-if="tab === 'users'">
      <UserList />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import GuruPending from "./guru-pending.vue";
import UserList from "./user-list.vue";

const tab = ref("pending");

const tabBtnClass = (active) =>
  `px-4 py-2 rounded ${
    active ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"
  }`;
</script>
