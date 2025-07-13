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
          @click="downloadPDF"
        />
      </div>
    </div>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else ref="reportContent">
      <div></div>
      <!-- TOTAL SUMMARY -->
      <div class="bg-white rounded shadow p-4 mb-6 flex flex-col items-center">
        <div>
           <p class="text-xl font-bold">
              {{ regionName }} Total Summary
           </p>
                
        </div>

        <div v-if="newFormattedEndDate && newFormattedStartDate" class="mb-4">
          <p class="text-sm">
            {{ newFormattedStartDate }} - {{ newFormattedEndDate }}
          </p>
        </div>

        <div v-else class="mb-2">
          <p class="text-sm font-medium">
            {{ currentDate}}
          </p>
        </div>
  
      

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
                    <p class="text-2xl font-bold">{{ totalRegisteredByRegion }}</p>
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
                    <p class="text-2xl font-bold">{{ totalFpeByRegion }}</p>
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
                    <p class="text-2xl font-bold">{{ totalFpcByRegion }}</p>
                  </div>
                </div>
              </template>
            </Card>
          </div>

      <!-- PUBLIC FACILITIES -->
      <div class="bg-white rounded shadow p-4 mb-6">
        <h2 class="text-lg font-semibold mb-2">Public Facilities Totals</h2>
        <div class="flex gap-4 mb-4">
          <span>👥 Registered: <strong>{{ totalPublic.registered }}</strong></span>
          <span>📝 FPE: <strong>{{ totalPublic.fpe }}</strong></span>
          <span>💬 FPC: <strong>{{ totalPublic.fpc }}</strong></span>
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
          <span>👥 Registered: <strong>{{ totalPrivate.registered }}</strong></span>
          <span>📝 FPE: <strong>{{ totalPrivate.fpe }}</strong></span>
          <span>💬 FPC: <strong>{{ totalPrivate.fpc }}</strong></span>
        </div>
        <DataTable :value="privateCareGroupsByRegion" class="w-full" stripedRows>
          <Column field="client_name" header="Care Group" />
          <Column field="totals.registered" header="Registered" />
          <Column field="totals.fpe" header="FPE" />
          <Column field="totals.fpc" header="FPC" />
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useCareGroupStore } from '../stores/careGroupStore';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import html2pdf from "html2pdf.js";

const careGroupStore = useCareGroupStore();
const route = useRoute();

const totalPublic = computed(() => ({
  registered: publicCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.registered, 0).toLocaleString(),
  fpe: publicCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpe, 0).toLocaleString(),
  fpc: publicCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpc, 0).toLocaleString(),
}));

const totalPrivate = computed(() => ({
  registered: privateCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.registered, 0).toLocaleString(),
  fpe: privateCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpe, 0).toLocaleString(),
  fpc: privateCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpc, 0).toLocaleString(),
}));

const { fetchCareGroupSummaryByRegion } = careGroupStore;
const {
  allCareGroupsByRegion,
  loading,
  publicCareGroupsByRegion,
  privateCareGroupsByRegion,
  totalFpcByRegion,
  totalFpeByRegion,
  totalRegisteredByRegion
} = storeToRefs(careGroupStore);

const regionName = route.params.name;
const reportContent = ref(null);

function downloadPDF() {
  const element = reportContent.value;
  const opt = {
    margin: 0.3,
    filename: `${regionName}-summary.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().from(element).set(opt).save();
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

onMounted(async () => {
  await fetchCareGroupSummaryByRegion(regionName);
  const date = new Date();
  currentDate.value = formatDate(date);

});
</script>
