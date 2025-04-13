<template>
  <div
    v-if="avgChartData && avgChartOptions"
    class="bg-gray-50 p-4 rounded shadow"
  >
    <LineChart :chartData="avgChartData" :chartOptions="avgChartOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const avgChartData = ref<any>(null);
const avgChartOptions = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const response: any = await $fetch("/api/halaqoh/average-daily");

    if (!response.success) throw new Error(response.message);

    avgChartData.value = {
      labels: response.data.map((item: any) => item.nama), // Label = nama santri
      datasets: [
        {
          label: "Rata-Rata Halaman",
          data: response.data.map((item: any) => item.rataRataHalaman),
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
        },
      ],
    };

    avgChartOptions.value = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Rata-Rata Setoran Hafalan Santri per Hari",
        },
        legend: {
          position: "top",
        },
      },
    };
  } catch (err: any) {
    error.value = err.message || "Terjadi kesalahan";
  } finally {
    loading.value = false;
  }
});
</script>
