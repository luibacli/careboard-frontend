<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between">
      <!-- Date Filters -->
      <div class="flex flex-col sm:flex-row gap-4 items-end p-3">
        <div>
          <label for="startDate" class="font-bold text-xs mb-2">Start Date</label>
          <DatePicker
            v-model="startDate"
            showIcon
            fluid
            :showOnFocus="false"
            inputId="startDate"
            dateFormat="dd/mm/yy"
            placeholder="dd/mm/yyyy"
          />
        </div>
        <div>
          <label for="endDate" class="font-bold text-xs mb-2">End Date</label>
          <DatePicker
            v-model="endDate"
            showIcon
            fluid
            :showOnFocus="false"
            inputId="endDate"
            dateFormat="dd/mm/yy"
            placeholder="dd/mm/yyyy"
          />
        </div>
        <Button label="Load Data" severity="info" @click="applyFilter" />
        <Button
          label="Download PDF"
          icon="pi pi-download"
          severity="danger"
          :disabled="isExporting"
          @click="downloadPDF"
        />
      </div>
    </div>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else-if="summaryByRegion" ref="reportContent">
      <div></div>
      <!-- TOTAL SUMMARY -->
      <div class="bg-white rounded shadow p-4 mb-6 flex flex-col items-center">
        <div>
           <p class="text-2xl font-bold">
              {{ regionName }} Total Summary
           </p>
                
        </div>

        <div v-if="newFormattedEndDate && newFormattedStartDate" class="mb-4">
          <p class="text-md font-medium">
            {{ newFormattedStartDate }} - {{ newFormattedEndDate }}
          </p>
        </div>
<!-- 
        <div v-else class="mb-2">
          <p class="text-md font-medium">
            {{ currentDate}}
          </p>
        </div> -->
  
      

      </div>
      

      <!-- KPI Cards -->

      <!-- Konsulta Registered -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <!-- Konsulta Registered -->
            <Card class="shadow border border-gray-200">
              <template #content>
                <div class="flex items-center space-x-4">
                  <i class="pi pi-user-plus text-blue-500 text-2xl"></i>
                  <div>
                    <h2 class="text-sm text-gray-500 font-semibold">Konsulta Registered</h2>
                    <p class="text-2xl font-bold">{{ totalRegisteredByRegion.toLocaleString() }}</p>
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
                    <p class="text-2xl font-bold">{{ totalFpeByRegion.toLocaleString() }}</p>
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
                    <p class="text-2xl font-bold">{{ totalFpcByRegion.toLocaleString() }}</p>
                  </div>
                </div>
              </template>
            </Card>
          </div>


      <div class="flex flex-row  mb-4 gap-9 p-4 justify-center">
        <div>
          <div class="mb-2">
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
          style="width: 450px;"
       
        />
        </div>
        <div>
                 <Chart
            type="doughnut"
            :data="{
              labels: ['Registered', 'FPE', 'FPC'],
              datasets: [
                {
                  data: [totalRegisteredByRegion, totalFpeByRegion, totalFpcByRegion],
                  backgroundColor: ['#f97316', '#3b82f6', '#f59e0b']
                }
              ]
              
            }"
            style="width: 300px;"
          />
        </div>
      </div>

      <!-- PUBLIC FACILITIES -->
      <div class="bg-white rounded shadow p-4 mb-6">
        <h2 class="text-lg font-semibold mb-2">Public Facilities Totals</h2>
        <div class="flex gap-4 mb-4">
          <span>👥 Registered: <strong>{{ totalPublic.registered.toLocaleString() }}</strong></span>
          <span>📝 FPE: <strong>{{ totalPublic.fpe.toLocaleString() }}</strong></span>
          <span>💬 FPC: <strong>{{ totalPublic.fpc.toLocaleString() }}</strong></span>
        </div>
        <DataTable :value="publicCareGroupsByRegion" class="w-full" stripedRows>
          <Column field="client_name" header="Care Group" />
          <Column field="totals.registered" header="Registered" />
          <Column field="totals.fpe" header="FPE" />
          <Column field="totals.fpc" header="FPC" />
        </DataTable>
      </div>

      <!-- PRIVATE FACILITIES -->
      <div class="bg-white rounded shadow p-4">
        <h2 class="text-lg font-semibold mb-2">Private Facilities Totals</h2>
        <div class="flex gap-4 mb-4">
          <span>👥 Registered: <strong>{{ totalPrivate.registered.toLocaleString() }}</strong></span>
          <span>📝 FPE: <strong>{{ totalPrivate.fpe.toLocaleString() }}</strong></span>
          <span>💬 FPC: <strong>{{ totalPrivate.fpc.toLocaleString() }}</strong></span>
        </div>
        <DataTable :value="privateCareGroupsByRegion" class="w-full" stripedRows>
          <Column field="client_name" header="Care Group" />
          <Column field="totals.registered" header="Registered" />
          <Column field="totals.fpe" header="FPE" />
          <Column field="totals.fpc" header="FPC" />
        </DataTable>
      </div>
    </div>
    <div v-else="error" class="text-red-500">{{ error }}</div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, nextTick } from 'vue';
import { useCareGroupStore } from '../stores/careGroupStore';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import html2pdf from "html2pdf.js";


const careGroupStore = useCareGroupStore();
const route = useRoute();

const totalPublic = computed(() => ({
  registered: publicCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.registered, 0),
  fpe: publicCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpe, 0),
  fpc: publicCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpc, 0),
}));

const totalPrivate = computed(() => ({
  registered: privateCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.registered, 0),
  fpe: privateCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpe, 0),
  fpc: privateCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpc, 0),
}));


const { fetchCareGroupSummaryByRegion } = careGroupStore;
const {
  allCareGroupsByRegion,
  summaryByRegion,
  loading,
  publicCareGroupsByRegion,
  privateCareGroupsByRegion,
  totalFpcByRegion,
  totalFpeByRegion,
  totalRegisteredByRegion,
  error
} = storeToRefs(careGroupStore);

const regionName = route.params.name;
const reportContent = ref(null);





const isExporting = ref(false);

async function downloadPDF() {
  isExporting.value = true;
  try {
    console.log("Starting PDF export...");
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 500));

    const element = reportContent.value;
    if (!element) {
      alert("Report content not ready!");
      return;
    }

    const opt = {
      margin: 0.3,
      filename: `${regionName}-summary.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "Legal", orientation: "portrait" }
    };

    // Generate and save PDF
    html2pdf().from(element).set(opt).save();

    console.log("PDF export done!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error generating PDF: " + (error?.message ?? error));
  } finally {
    isExporting.value = false;
  }
}



const startDate = ref("");
const endDate = ref("");
const newFormattedStartDate = ref("");
const newFormattedEndDate = ref("");

function formatDate(dateInput) {
  if (!dateInput) return '';
  return dateInput.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

const currentDate = ref(null);

function applyFilter() {
  if (startDate.value && endDate.value) {
    fetchCareGroupSummaryByRegion(regionName, startDate.value, endDate.value);
    newFormattedStartDate.value = formatDate(startDate.value);
    newFormattedEndDate.value = formatDate(endDate.value);
    console.log("From: ", newFormattedStartDate.value, " TO: ", newFormattedEndDate.value);
  } else {
    fetchCareGroupSummaryByRegion(regionName);
  }
}

const monthLabels = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const selectedYear = ref(new Date().getFullYear());

const fpeCounts = computed(() => {
  const countsByMonth = {};
  if (summaryByRegion.value?.monthlyFpeFpc) {
   summaryByRegion.value?.monthlyFpeFpc.forEach(item => {
      if (item._id.tranche === "1" && item._id.year == selectedYear.value) {
        countsByMonth[item._id.month] = item.count;
      }
    });
  }
  return Array.from({ length: 12 }, (_, i) => countsByMonth[i + 1] || 0);
});



const fpcCounts = computed(() => {
  const countsByMonth = {};
  if (summaryByRegion.value?.monthlyFpeFpc) {
  summaryByRegion.value?.monthlyFpeFpc.forEach(item => {
      if (item._id.tranche === "2" && item._id.year == selectedYear.value) {
        countsByMonth[item._id.month] = item.count;
      }
    });
  }
  return Array.from({ length: 12 }, (_, i) => countsByMonth[i + 1] || 0);
});
onMounted(async () => {
  if (regionName) {
    await fetchCareGroupSummaryByRegion(regionName);
    const date = new Date();
    currentDate.value = formatDate(date);
  }
});

</script>
