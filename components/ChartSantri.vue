<!-- components/ChartSantri.vue -->
<template>
  <BarChart :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { BarChart } from "vue-chartjs";
const chartData = {
  labels: ["Ali", "Budi", "Cici"],
  datasets: [
    {
      label: "Jumlah Setoran",
      data: [5, 8, 3],
      backgroundColor: ["#34D399", "#60A5FA", "#FBBF24"],
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Progress Hafalan" },
  },
};
</script>
