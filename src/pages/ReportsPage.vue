<template>
   <div class="p-6 space-y-6">
      <div class="flex justify-between">
      <h1 class="text-2xl font-bold mb-4">{{ regionName }} Clients Summary</h1>
      <Button
        label="Download PDF"
        icon="pi pi-download"
        class="p-button-primary"
        @click="downloadPDF"
      />
    </div>

     
 
     <div v-if="loading" class="text-gray-500">Loading...</div>
     <div v-else-if="error" class="text-red-500">{{ error }}</div>
     <div v-else  ref="reportContent">
      <div></div>
       <!-- TOTAL SUMMARY -->
       <div class="bg-white rounded shadow p-4 mb-6">
         <h2 class="text-lg font-semibold mb-2"> {{ regionName }} Overall Totals (All Facilities)</h2>
         <div class="flex gap-4">
           <span>👥 Registered: <strong>{{ totalRegisteredByRegion }}</strong></span>
           <span>📝 FPE: <strong>{{ totalFpeByRegion }}</strong></span>
           <span>💬 FPC: <strong>{{ totalFpcByRegion }}</strong></span>
         </div>
       </div>
 
       <!-- PUBLIC FACILITIES -->
       <div class="bg-white rounded shadow p-4 mb-6">
         <h2 class="text-lg font-semibold mb-2">Public Facilities Totals</h2>
         <div class="flex gap-4 mb-4">
           <span>👥 Registered: <strong>{{ totalPublic.registered }}</strong></span>
           <span>📝 FPE: <strong>{{ totalPublic.fpe }}</strong></span>
           <span>💬 FPC: <strong>{{ totalPublic.fpc }}</strong></span>
         </div>
 
         <DataTable
           :value="publicCareGroupsByRegion"
           class="w-full"
           stripedRows
         >
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
 
         <DataTable
           :value="privateCareGroupsByRegion"
           class="w-full"
           stripedRows
         >
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

const totalPublic = computed(() => {
   return {
      registered: publicCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.registered, 0),
      fpe: publicCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpe, 0),
      fpc: publicCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpc, 0)
   }
})

const totalPrivate = computed(() => {
   return {
      registered: privateCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.registered, 0),
      fpe: privateCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpe, 0),
      fpc: privateCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpc, 0)
   }
})

const { fetchCareGroupSummaryByRegion } = careGroupStore;
const {allCareGroupsByRegion, loading, publicCareGroupsByRegion, privateCareGroupsByRegion, totalFpcByRegion, totalFpeByRegion, totalRegisteredByRegion} = storeToRefs(careGroupStore)

const regionName = route.params.name;

const reportContent = ref(null);

function downloadPDF() {
   const element = reportContent.value;

   const opt = {
    margin:       0.3,
    filename:     `${regionName}-summary.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
   };

   html2pdf().from(element).set(opt).save();
}

onMounted( async () => {
   await fetchCareGroupSummaryByRegion(regionName)
})
</script>