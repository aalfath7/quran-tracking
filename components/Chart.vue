<template>
  <div class="mb-10">
    <h2 class="text-xl font-bold text-green-700 mb-4">
      Grafik Setoran Harian Santri
    </h2>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
import { Line } from "vue-chartjs";
import { ref, onMounted } from "vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

const chartData = ref({
  labels: [],
  datasets: [],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
    },
  },
};

onMounted(async () => {
  const res = await $fetch("/api/setoran/chart");

  if (res.success) {
    const tanggalSet = new Set<string>();
    const datasets: any[] = [];

    // Gabungkan semua tanggal yang muncul
    res.data.forEach((santri: any) => {
      Object.keys(santri.data).forEach((tgl) => tanggalSet.add(tgl));
    });

    const sortedLabels = Array.from(tanggalSet).sort();

    res.data.forEach((santri: any, idx: number) => {
      const data = sortedLabels.map((tgl) => santri.data[tgl] || 0);
      datasets.push({
        label: santri.nama,
        data,
        fill: false,
        borderColor: `hsl(${(idx * 70) % 360}, 70%, 50%)`,
        tension: 0.3,
      });
    });

    chartData.value = {
      labels: sortedLabels,
      datasets,
    };
  }
});
</script>

<style scoped>
/* Optional: fix height */
div {
  height: 400px;
}
</style>
