<script setup>
import { ref, onMounted, computed, } from 'vue';
import { storeToRefs } from 'pinia';
import { useSummaryStore } from '../stores/summaryStore';
import { useOnboardedStore } from '../stores/onBoarded';

const summaryStore = useSummaryStore();
const onBoardedStore = useOnboardedStore();


const startDate = ref('');
const endDate = ref('');
const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear.toString());

const monthLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const fpeCounts = computed(() => {
  const countsByMonth = {};
  if (summaryStore.summaryData?.monthlyFpeFpc) {
    summaryStore.summaryData.monthlyFpeFpc.forEach(item => {
      if (item._id.tranche === "1" && item._id.year == selectedYear.value) {
        countsByMonth[item._id.month] = item.count;
      }
    });
  }
  return Array.from({ length: 12 }, (_, i) => countsByMonth[i + 1] || 0);
});

const fpcCounts = computed(() => {
  const countsByMonth = {};
  if (summaryStore.summaryData?.monthlyFpeFpc) {
    summaryStore.summaryData.monthlyFpeFpc.forEach(item => {
      if (item._id.tranche === "2" && item._id.year == selectedYear.value) {
        countsByMonth[item._id.month] = item.count;
      }
    });
  }
  return Array.from({ length: 12 }, (_, i) => countsByMonth[i + 1] || 0);
});

const fpeCountTotal = computed(() =>
  summaryStore.summaryData?.fpe?.[0]?.count || 0
);
const fpcCountTotal = computed(() =>
  summaryStore.summaryData?.fpc?.[0]?.count || 0
);
const labsCountTotal = computed(() =>
  summaryStore.summaryData?.labs?.[0]?.count || 0
);
const medsCountTotal = computed(() =>
  summaryStore.summaryData?.meds?.[0]?.count || 0
);

onMounted(() => {
  summaryStore.loadSummary();
  onBoardedStore.fetchPatients();
});

const applyFilter = () => {
  if (startDate.value && endDate.value) {
    summaryStore.loadSummary(startDate.value, endDate.value);
  } else {
    summaryStore.loadSummary();
  }
};
</script>

<template>
  <div class="p-6 space-y-6">
    <p class="text-3xl font-bold">Dashboard Summary</p>

    <!-- Date Filters -->
    <div class="flex flex-col sm:flex-row gap-4 items-end bg-white p-3">
 
      <div>
        <label class="block text-sm text-gray-500 mb-1">Start Date</label>
        <input
          type="date"
          v-model="startDate"
          class="border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <div>
        <label class="block text-sm text-gray-500 mb-1">End Date</label>
        <input
          type="date"
          v-model="endDate"
          class="border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <button
        @click="applyFilter"
        class="bg-blue-600 text-white px-3 py-2 rounded"
      >
        Load Data
      </button>
    </div>

    <!-- Loading -->
    <div v-if="summaryStore.loading" class="text-gray-500">Loading summary data...</div>

    <!-- Error -->
    <div v-else-if="summaryStore.error" class="text-red-500">{{ summaryStore.error }}</div>

    <!-- Data -->
    <div v-else-if="summaryStore.summaryData">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Konsulta Registered -->
  <Card class="shadow border border-gray-200">
    <template #content>
      <div class="flex items-center space-x-4">
        <i class="pi pi-user-plus text-blue-500 text-2xl"></i>
        <div>
          <h2 class="text-sm text-gray-500 font-semibold">Konsulta Registered</h2>
          <p class="text-2xl font-bold">{{ onBoardedStore.totalPatients }}</p>
        </div>
      </div>
    </template>
  </Card>

  <!-- First Patient Encounter -->
  <Card class="shadow border border-gray-200">
    <template #content>
      <div class="flex items-center space-x-4">
        <i class="pi pi-user-edit text-green-500 text-2xl"></i>
        <div>
          <h2 class="text-sm text-gray-500 font-semibold">First Patient Encounter</h2>
          <p class="text-2xl font-bold">{{ fpeCountTotal }}</p>
        </div>
      </div>
    </template>
  </Card>

  <!-- Consultation -->
  <Card class="shadow border border-gray-200">
    <template #content>
      <div class="flex items-center space-x-4">
        <i class="pi pi-comments text-purple-500 text-2xl"></i>
        <div>
          <h2 class="text-sm text-gray-500 font-semibold">Consultation</h2>
          <p class="text-2xl font-bold">{{ fpcCountTotal }}</p>
        </div>
      </div>
    </template>
  </Card>

  <!-- Laboratories Provided -->
  <Card class="shadow border border-gray-200">
    <template #content>
      <div class="flex items-center space-x-4">
        <i class="pi pi-shield text-yellow-500 text-2xl"></i>
        <div>
          <h2 class="text-sm text-gray-500 font-semibold">Laboratories Provided</h2>
          <p class="text-2xl font-bold">{{ labsCountTotal }}</p>
        </div>
      </div>
    </template>
  </Card>

  <!-- Medicines Provided -->
  <Card class="shadow border border-gray-200">
    <template #content>
      <div class="flex items-center space-x-4">
        <i class="pi pi-heart-fill text-red-500 text-2xl"></i>
        <div>
          <h2 class="text-sm text-gray-500 font-semibold">Medicines Provided</h2>
          <p class="text-2xl font-bold">{{ medsCountTotal }}</p>
        </div>
      </div>
    </template>
  </Card>
</div>


          <!-- Monthly FPE & FPC Chart -->
          <div v-if="!startDate && !endDate" class="bg-white rounded shadow p-4 mt-8">
        <div class="flex flex-col sm:flex-row justify-between items-end mb-2">
          <h2 class="text-sm text-gray-500">Monthly FPE & FPC</h2>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Year</label>
            <select
              v-model="selectedYear"
              @change="applyFilter"
              class="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option disabled value="">Select Year</option>
              <option>2022</option>
              <option>2023</option>
              <option>2024</option>
              <option>2025</option>
            </select>
          </div>
        </div>
        <Chart
          type="bar"
          :data="{
            labels: monthLabels,
            datasets: [
              {
                label: 'FPE',
                data: fpeCounts,
                backgroundColor: '#3b82f6'
              },
              {
                label: 'FPC',
                data: fpcCounts,
                backgroundColor: '#f59e0b'
              }
            ]
          }"
          style="width: 1000px; height: 500px;"
        />
      </div>

      <!-- Pie Charts Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <!-- FPE vs FPC Pie Chart -->
        <div class="bg-white rounded shadow p-4 flex flex-col items-center">
          <h2 class="text-sm text-gray-500 mb-2">FPE vs FPC Distribution</h2>
          <Chart
            type="pie"
            :data="{
              labels: ['FPE', 'FPC'],
              datasets: [
                {
                  data: [fpeCountTotal, fpcCountTotal],
                  backgroundColor: ['#3b82f6', '#f59e0b']
                }
              ]
            }"
            style="max-width: 300px; height: 300px;"
          />
        </div>

        <!-- Labs vs Meds Pie Chart -->
        <div class="bg-white rounded shadow p-4 flex flex-col items-center">
          <h2 class="text-sm text-gray-500 mb-2">Labs vs Meds Provided</h2>
          <Chart
            type="pie"
            :data="{
              labels: ['Labs', 'Meds'],
              datasets: [
                {
                  data: [labsCountTotal, medsCountTotal],
                  backgroundColor: ['#10b981', '#f97316']
                }
              ]
            }"
            style="max-width: 300px; height: 300px;"
          />
        </div>
      </div>

  
    </div>

    <!-- No data -->
    <div v-else>
      <p class="text-gray-500">No summary data available.</p>
    </div>
  </div>
</template>
