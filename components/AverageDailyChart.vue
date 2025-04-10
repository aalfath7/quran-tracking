<!-- components/AverageDailyChart.vue -->
<template>
  <div>
    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);

const chartData = ref<any>(null);
const chartOptions = ref<any>(null);

onMounted(async () => {
  try {
    const res = await $fetch("/api/halaqoh/average-daily");

    if (res.success) {
      chartData.value = {
        labels: res.data.map((item: any) => item.date),
        datasets: [
          {
            label: "Average Daily Setoran",
            data: res.data.map((item: any) => item.average),
            borderColor: "#10b981",
            backgroundColor: "rgba(16,185,129,0.2)",
            fill: true,
            tension: 0.3, // curve
          },
        ],
      };

      chartOptions.value = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Average Daily Setoran Curve",
          },
        },
      };
    }
  } catch (error) {
    console.error("Failed to load daily average chart data:", error);
  }
});
</script>
