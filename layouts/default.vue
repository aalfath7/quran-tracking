<template>
  <div>
    <Navbar />

    <main class="mt-20 mb-10 mx-2"><slot /></main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from "../components/Footer.vue";
import Navbar from "../components/Navbar.vue";
</script>
