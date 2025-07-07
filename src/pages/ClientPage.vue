<template>
    <div class="p-6 space-y-6">
      <h1 class="text-2xl font-bold mb-4">Care Group Details</h1>

      <!-- Konsulta Registered -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card class="shadow border border-gray-200">
    <template #content>
      <div class="flex items-center space-x-4">
        <i class="pi pi-user-plus text-blue-500 text-2xl"></i>
        <div>
          <h2 class="text-sm text-gray-500 font-semibold">Konsulta Registered</h2>
          <p class="text-2xl font-bold">{{ totalFPE }}</p>
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
          <p class="text-2xl font-bold">{{ totalFPE }}</p>
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
          <p class="text-2xl font-bold">{{ totalFPC }}</p>
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
          <p class="text-2xl font-bold">{{ totalLabs }}</p>
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
          <p class="text-2xl font-bold">{{ totalMeds }}</p>
        </div>
      </div>
    </template>
  </Card>
      </div>
  
</div>
  
      <div v-if="loading" class="text-gray-500">Loading data...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
  
      <div v-else-if="careGroup">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-white rounded shadow p-4">
            <h2 class="text-sm text-gray-500">Client Name</h2>
            <p class="text-lg font-semibold">{{ careGroup.client_name }}</p>
          </div>
          <div class="bg-white rounded shadow p-4">
            <h2 class="text-sm text-gray-500">Address</h2>
            <p class="text-lg">{{ careGroup.address }}</p>
          </div>
          <div class="bg-white rounded shadow p-4">
            <h2 class="text-sm text-gray-500">City</h2>
            <p class="text-lg">{{ careGroup.city }}</p>
          </div>
          <div class="bg-white rounded shadow p-4">
            <h2 class="text-sm text-gray-500">Province</h2>
            <p class="text-lg">{{ careGroup.province }}</p>
          </div>
          <div class="bg-white rounded shadow p-4">
            <h2 class="text-sm text-gray-500">Main Region</h2>
            <p class="text-lg">{{ careGroup.main }}</p>
          </div>
          <div class="bg-white rounded shadow p-4">
            <h2 class="text-sm text-gray-500">Status</h2>
            <p class="text-lg">{{ careGroup.status }}</p>
          </div>
        </div>
  
        <h2 class="text-xl font-bold mt-8 mb-2">Encounters</h2>
  
        <DataTable
          :value="encounters"
          :loading="loadingEncounters"
          class="w-full text-sm"
          stripedRows
          scrollable
          scrollHeight="400px"
          responsiveLayout="scroll"
          showGridlines
          paginator
          :rows="10"
        >
        <Column field="appointment_date" header="Appointment Date" sortable style="min-width: 160px; " />
      <Column field="start_date" header="Date Submitted" sortable style="min-width: 160px;" />
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
              No encounters found for this client.
            </div>
          </template>
        </DataTable>
      </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useCareGroupStore } from "../stores/careGroupStore";
  
  const route = useRoute();
const careGroupStore = useCareGroupStore();
const {fetchCareGroupById, fetchEncountersByClientName, fetchSummaryByClientName } = careGroupStore;
const {careGroup, encounters, loading, loadingEncounters, error, careGroupSummary, totalFPC, totalFPE, totalLabs, totalMeds } = storeToRefs(careGroupStore);

  
onMounted(async () => {
  try {
    // Fetch care group
      await fetchCareGroupById(route.params.id);
    console.log("Caregroup Data", careGroup.value);


    // Fetch encounters
    if (careGroup.value?.client_name) {
      await fetchEncountersByClientName(careGroup.value.client_name);
      await fetchSummaryByClientName(careGroup.value.client_name)
      console.log(careGroup.value);
      console.log("Client Summary:", careGroupSummary.value);
      console.log("Total FPE", totalFPE.value);
    }
  } catch (err) {
    console.error(err);
    error.value = "Failed to load care group or encounters.";
  }
});
  </script>
  