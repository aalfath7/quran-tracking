<template>
  <header class="bg-white shadow-md fixed top-0 left-0 w-full z-50">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <NuxtLink to="/" class="text-xl font-bold text-green-700">
        HafalanQur'an
      </NuxtLink>
      <button class="md:hidden" @click="toggleMenu">
        <svg
          class="w-6 h-6 text-green-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            v-if="!isOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <nav class="hidden md:flex space-x-6">
        <NuxtLink to="/" class="hover:text-green-600">Beranda</NuxtLink>
        <NuxtLink to="/setoran" class="hover:text-green-600">Setoran</NuxtLink>
        <NuxtLink
          v-if="auth.user?.role === 'guru'"
          to="/halaqoh"
          class="hover:text-green-600"
        >
          Halaqoh
        </NuxtLink>
        <NuxtLink
          v-if="auth.user?.role === 'admin'"
          to="/admin/santri"
          class="hover:text-green-600"
        >
          Santri
        </NuxtLink>
        <NuxtLink
          v-if="auth.user?.role === 'admin'"
          to="/admin/halaqoh"
          class="hover:text-green-600"
        >
          Halaqoh
        </NuxtLink>
        <NuxtLink
          v-if="auth.user?.role === 'admin'"
          to="/admin/guru-pending"
          class="hover:text-green-600"
        >
          Approve Guru
        </NuxtLink>

        <span v-if="auth.user">
          <button @click="logout" class="text-red-600 hover:underline">
            Logout
          </button>
        </span>
        <span v-else>
          <NuxtLink to="/login" class="hover:text-green-600">Login</NuxtLink> |
          <NuxtLink to="/register" class="hover:text-green-600"
            >Register</NuxtLink
          >
        </span>
      </nav>
    </div>

    <!-- Mobile Overlay Menu -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="closeMenu"
    ></div>
    <nav
      v-if="isOpen"
      class="fixed top-0 right-0 w-64 h-full bg-white z-50 shadow-lg p-6 flex flex-col gap-4 transition-transform duration-300"
    >
      <NuxtLink @click="closeMenu" to="/">Beranda</NuxtLink>
      <NuxtLink @click="closeMenu" to="/setoran">Setoran</NuxtLink>

      <NuxtLink
        v-if="auth.user?.role === 'guru'"
        @click="closeMenu"
        to="/halaqoh"
      >
        Halaqoh
      </NuxtLink>
      <NuxtLink
        v-if="auth.user?.role === 'admin'"
        @click="closeMenu"
        to="/admin/santri"
      >
        Santri
      </NuxtLink>
      <NuxtLink
        v-if="auth.user?.role === 'admin'"
        @click="closeMenu"
        to="/admin/halaqoh"
      >
        Halaqoh
      </NuxtLink>
      <NuxtLink
        v-if="auth.user?.role === 'admin'"
        @click="closeMenu"
        to="/admin/guru-pending"
      >
        Approve Guru
      </NuxtLink>

      <span v-if="auth.user">
        <button @click="logout" class="text-red-600 text-left">Logout</button>
      </span>
      <span v-else>
        <NuxtLink @click="closeMenu" to="/login">Login</NuxtLink> |
        <NuxtLink @click="closeMenu" to="/register">Register</NuxtLink>
      </span>
    </nav>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const isOpen = ref(false);
const auth = useAuthStore();

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
const closeMenu = () => {
  isOpen.value = false;
};

const logout = () => {
  auth.logout();
  closeMenu();
  navigateTo("/login");
};
</script>
