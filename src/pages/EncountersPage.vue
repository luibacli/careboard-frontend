<template>
    <Toast />
  
    <div v-if="uploading" class="mt-2">
      <ProgressBar :value="progress" showValue>{{ progress }}%</ProgressBar>
    </div>
  
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 masterlist-header gap-2">
      <p class="text-2xl font-bold">Master List</p>
  
      <div class="flex flex-wrap gap-2">
        <InputText
          v-model="searchQuery"
          placeholder="Search by patient name"
          class="w-72 border-gray-300 focus:border-blue-500"
          clearable
        />
        <Button
          label="Upload Encounters"
          icon="pi pi-upload"
          class="p-button-success"
          @click="triggerFileInput"
          :disabled="uploading"
        />
        <input
          ref="fileInput"
          type="file"
          accept=".csv"
          style="display: none"
          @change="handleFileUpload"
        />
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          class="p-button-secondary"
          @click="refresh"
        />
      </div>
    </div>
  
    <!-- Responsive scrollable DataTable -->
    <DataTable
      :value="encounters"
      :loading="loading"
      show-gridlines
      size="small"
      class="w-full mt-4 text-sm text-center"
      stripedRows
      paginator
      :rows="50"
      scrollable
  
      responsiveLayout="scroll"
    >
      <Column field="appointment_date" header="Appointment Date" sortable style="min-width: 140px; " />
      <Column field="start_date" header="Date Submitted" sortable style="min-width: 140px;" />
      <Column field="philhealth_transaction_no" header="Transaction No." sortable style="min-width: 140px;" />
      <Column field="philhealth_case_no" header="Case No." sortable style="min-width: 120px;" />
      <Column field="patient_name" header="Patient Name" sortable style="min-width: 180px;" />
      <Column field="patient_age" header="Age" sortable style="min-width: 50px;" />
      <Column field="patient_gender" header="Gender" sortable style="min-width: 100px;" />
      <Column field="clinician_name" header="Clinician" sortable style="min-width: 180px;" />
      <Column field="icd_codes" header="ICD Codes" sortable style="min-width: 200px;" />
      <Column field="lab_orders_total" header="Labs Total" sortable style="min-width: 100px;" />
      <Column field="medications" header="Medications" sortable style="min-width: 150px;" />
  
      <template #empty>
        <div class="text-center text-gray-500 py-6">
          No Encounters Found. Click "Upload Encounters" to create your first one.
        </div>
      </template>
  
      <template #loading>
        <div class="flex flex-col items-center justify-center py-8 text-blue-500">
          <i class="pi pi-spin pi-spinner text-4xl mb-2"></i>
          <span>Loading Encounters...</span>
        </div>
      </template>
    </DataTable>
  </template>
  
     
<script setup>
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useEncounterStore } from "../stores/encounterStore";
import { useToast } from "primevue/usetoast";
import ProgressBar from "primevue/progressbar";




const toast = useToast();
const encounterStore = useEncounterStore();
const { fetchEncounters, uploadFile } = encounterStore
const {encounters, totalEncounters, uploading, loading, allEncounters, error, progress, searchQuery} = storeToRefs(encounterStore)
const fileInput = ref(null);

function triggerFileInput() {
  fileInput.value.click();
}

async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const result = await uploadFile(file);

  if (result.success) {
    toast.add({
      severity: "success",
      summary: "Upload Complete",
      detail: `${result.message} • Inserted: ${result.inserted}, Updated: ${result.updated}, Skipped: ${result.skipped}`,
      life: 5000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Upload Failed",
      detail: result.error,
      life: 5000,
    });
  }

  event.target.value = null; // reset input
  }

  const refresh = async () => {
    // selectedUserType.value = null;
      await fetchEncounters();
    toast.add({
      severity: "success",
      summary: "Refreshed",
      detail: "Master list reloaded",
      life: 3000,
    });
  
    };
  
//   watch([searchQuery, selectedUserType], ([newSearch, newUserType]) => {
//     if(newSearch || newUserType) {
//       filterUsers(newSearch, newUserType);
//     } else {
//       loading.value = true;
//       users.value = [];
//       setTimeout(() => {
//         users.value = allUsers.value;
//         loading.value = false;
//       }, 300)
      
//     }
//   });
  onMounted(async () => {
      await fetchEncounters();
})
</script>
