<template>
   <div class="p-6 space-y-6">
 
    
 
      <div class="flex justify-between">

       <!-- Date Filters -->
    <div class="flex flex-col sm:flex-row gap-4 items-end  p-3">
 
 <div>
   <label for="startDate" class="font-bold block mb-2">Start Date</label>
   <DatePicker v-model="starDate" showIcon fluid :showOnFocus="false" inputId="startDate" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy"/>
 </div>
 <div>
  <label for="endDate" class="font-bold block mb-2">End Date</label>
   <DatePicker v-model="endDate" showIcon fluid :showOnFocus="false" inputId="endDate" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy"/>
 </div>
<Button label="Load Data" severity="info" @click="applyFilter"/>

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
     <div v-else  ref="reportContent">
      <div></div>
       <!-- TOTAL SUMMARY -->
       <div class="bg-white rounded shadow p-4 mb-6">
        <div v-show="newFormattedEndDate && newFormattedStartDate" class="mb-6">
          <p class="text-xl">{{ newFormattedStartDate }} -  {{ newFormattedEndDate }}</p>
        </div>
      
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
import { date } from 'zod/v4';


const careGroupStore = useCareGroupStore();

const route = useRoute();

const totalPublic = computed(() => {
   return {
      registered: publicCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.registered, 0).toLocaleString(),
      fpe: publicCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpe, 0).toLocaleString(),
      fpc: publicCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpc, 0).toLocaleString(),
   }
})

const totalPrivate = computed(() => {
   return {
      registered: privateCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.registered, 0).toLocaleString(),
      fpe: privateCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpe, 0).toLocaleString(),
      fpc: privateCareGroupsByRegion.value.reduce((sum, cg) => sum + cg.totals.fpc, 0).toLocaleString()
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

const starDate = ref("");
const endDate = ref("");

const newFormattedStartDate = ref("");
const newFormattedEndDate = ref("");


function formatDate(dateInput) {
  if (!dateInput) return ''
  return dateInput.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}


function applyFilter() {
  if (starDate.value && endDate.value) {
    fetchCareGroupSummaryByRegion(regionName, starDate.value, endDate.value)
    newFormattedStartDate.value = formatDate(starDate.value);
    newFormattedEndDate.value = formatDate(endDate.value);
    console.log("From: ", newFormattedStartDate.value, " TO: ", newFormattedEndDate.value);


    
    
  } else {
    fetchCareGroupSummaryByRegion(regionName)
  }
}
onMounted( async () => {
   await fetchCareGroupSummaryByRegion(regionName)
})
</script>