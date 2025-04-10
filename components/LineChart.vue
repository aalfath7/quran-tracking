<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Line } from "vue-chartjs";
defineProps(["chartData", "chartOptions"]);
</script>
