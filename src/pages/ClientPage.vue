<template>
    <div class="p-6 space-y-6">
      <h1 class="text-2xl font-bold mb-4">Care Group Details</h1>
  
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
          class="w-full"
          stripedRows
          scrollable
          scrollHeight="400px"
          responsiveLayout="scroll"
          paginator
          :rows="10"
        >
          <Column field="appointment_date" header="Appointment Date" style="min-width: 140px;" />
          <Column field="patient_name" header="Patient Name" style="min-width: 180px;" />
          <Column field="patient_age" header="Age" style="min-width: 80px;" />
          <Column field="patient_gender" header="Gender" style="min-width: 100px;" />
          <Column field="clinician_name" header="Clinician" style="min-width: 180px;" />
          <Column field="philhealth_transaction_no" header="Transaction No." style="min-width: 140px;" />
  
          <template #empty>
            <div class="text-center text-gray-500 py-6">
              No encounters found for this client.
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCareGroupStore } from "../stores/careGroupStore";
  
  const route = useRoute();
  const careGroupStore = useCareGroupStore();
  
  const careGroup = ref(null);
  const encounters = ref([]);
  const loading = ref(false);
  const loadingEncounters = ref(false);
  const error = ref(null);
  
  onMounted(async () => {
    loading.value = true;
    try {
      // 1. Fetch care group by ID
      const cg = await careGroupStore.fetchCareGroupById(route.params.id);
        careGroup.value = cg;
      console.log(careGroup.value);
  
      // 2. Fetch encounters by client_name
      if (cg.client_name) {
        loadingEncounters.value = true;
        const encs = await careGroupStore.fetchEncountersByClientName(cg.client_name);
          encounters.value = encs.data;
        console.log("Client Encounters", encounters.value);
      }
    } catch (err) {
      console.error(err);
      error.value = "Failed to load care group or encounters.";
    } finally {
      loading.value = false;
      loadingEncounters.value = false;
    }
  });
  </script>
  