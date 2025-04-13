<template>
  <div class="max-w-5xl mx-auto mt-24 p-6 bg-white shadow rounded">
    <h1 class="text-2xl font-bold mb-6 text-green-700">
      Dashboard Hafalan Santri
    </h1>

    <!-- Grid Layout 2 Columns 2 Rows -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <div class="bg-gray-50 p-4 rounded shadow">
        <AverageDailySetoranChart />
      </div>

      <!-- Grafik Rata-Rata per Bulan -->
      <div
        v-if="avgChartData && avgChartOptions"
        class="bg-gray-50 p-4 rounded shadow"
      >
        <LineChart :chartData="avgChartData" :chartOptions="avgChartOptions" />
      </div>

      <!-- Grafik Total & Bulan Ini -->
      <div
        v-if="chartData && chartOptions"
        class="bg-gray-50 p-4 rounded shadow"
      >
        <LineChart :chartData="chartData" :chartOptions="chartOptions" />
      </div>

      <!-- Placeholder or future chart -->
      <div
        class="bg-gray-50 p-4 rounded shadow flex items-center justify-center text-gray-400"
      >
        <span>Coming Soon...</span>
      </div>
    </div>

    <table class="min-w-full bg-white border">
      <thead>
        <tr class="bg-green-600 text-white">
          <th class="text-left py-2 px-4 border-b">Nama Santri</th>
          <th class="text-left py-2 px-4 border-b">Kelas</th>
          <th class="text-center py-2 px-4 border-b">Total Setoran</th>
          <th class="text-center py-2 px-4 border-b">Setoran Bulan Ini</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="santri in santriList"
          :key="santri._id"
          class="hover:bg-gray-50"
        >
          <td class="py-2 px-4 border-b">{{ santri.nama }}</td>
          <td class="py-2 px-4 border-b">{{ santri.kelas }}</td>
          <td class="py-2 px-4 border-b text-center">
            {{ santri.totalSetoran }}
          </td>
          <td class="py-2 px-4 border-b text-center">{{ santri.bulanIni }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="!santriList.length" class="text-center py-10 text-gray-500">
      Belum ada data santri.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import LineChart from "@/components/LineChart.vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

interface Santri {
  _id: string;
  nama: string;
  kelas: string;
  totalSetoran: number;
  bulanIni: number;
}

const santriList = ref<Santri[]>([]);
const chartData = ref<any>(null);
const chartOptions = ref<any>(null);
const avgChartData = ref<any>(null);
const avgChartOptions = ref<any>(null);

onMounted(async () => {
  // Grafik per santri
  try {
    const res = await $fetch<{ success: boolean; data: Santri[] }>(
      "/api/halaqoh/dashboard"
    );
    if (res.success) {
      santriList.value = res.data;

      chartData.value = {
        labels: res.data.map((s) => s.nama),
        datasets: [
          {
            label: "Total Setoran",
            backgroundColor: "#4ade80",
            borderColor: "#22c55e",
            data: res.data.map((s) => s.totalSetoran),
            tension: 0.3,
          },
          {
            label: "Setoran Bulan Ini",
            backgroundColor: "#60a5fa",
            borderColor: "#3b82f6",
            data: res.data.map((s) => s.bulanIni),
            tension: 0.3,
          },
        ],
      };

      chartOptions.value = {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Grafik Setoran Santri" },
        },
      };
    }
  } catch (err) {
    console.error("Gagal memuat data dashboard:", err);
  }

  // Grafik rata-rata per bulan
  try {
    const res = await $fetch<{
      success: boolean;
      labels: string[];
      data: number[];
    }>("/api/halaqoh/avg-per-month");

    if (res.success) {
      avgChartData.value = {
        labels: res.labels,
        datasets: [
          {
            label: "Rata-Rata Setoran Bulanan",
            backgroundColor: "#facc15",
            borderColor: "#eab308",
            data: res.data,
            tension: 0.4,
            fill: false,
          },
        ],
      };

      avgChartOptions.value = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Rata-Rata Setoran Hafalan Santri per Bulan",
          },
          legend: {
            position: "top",
          },
        },
      };
    }
  } catch (err) {
    console.error("Gagal load rata-rata setoran:", err);
  }
});
</script>
