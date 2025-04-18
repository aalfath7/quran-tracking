<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  type ChartData,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

// 👇 Props: jenis setoran
const props = defineProps<{
  jenis: string;
}>();

const chartData = ref<ChartData<"line">>({
  labels: [],
  datasets: [],
});

const isLoadingChart = ref(true);

const chartOptions: any = {
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

// 👇 Fungsi untuk load chart berdasarkan jenis
const loadChart = async () => {
  isLoadingChart.value = true;

  try {
    const res = await $fetch("/api/setoran/chart", {
      query: { jenis: props.jenis },
    });

    if (res.success) {
      const tanggalSet = new Set<string>();
      const datasets: any[] = [];

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
  } catch (err) {
    console.error("Gagal memuat grafik:", err);
  } finally {
    isLoadingChart.value = false;
  }
};

// 👇 Load pertama kali
onMounted(() => {
  loadChart();
});

// 👇 Watch jika jenis berubah
watch(
  () => props.jenis,
  () => {
    loadChart();
  }
);
</script>

<template>
  <div class="mb-10 h-[350px] relative">
    <h2 class="text-md font-bold text-green-700 mb-4">
      Grafik Setoran Harian Santri
    </h2>

    <div v-if="isLoadingChart" class="flex items-center justify-center h-full">
      <span class="text-gray-500 animate-pulse">Memuat grafik...</span>
    </div>

    <div v-else>
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
div {
  height: 350px;
}
</style>
