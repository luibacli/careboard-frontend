<template>
  <div v-if="loading" class="text-gray-500">Loading data...</div>
  <div v-else-if="error" class="text-red-500">{{ error }}</div>
  <div v-else-if="careGroup" class="p-6 space-y-6">
    <h1 class="text-2xl font-bold mb-4">{{ careGroup.client_name }}</h1>
    <Tabs value="0">
      <TabList>
        <Tab value="0">Summary</Tab>
        <Tab value="1">Encounters</Tab>
        <Tab value="2">Master List</Tab>
        <Tab value="3">SAP Validation</Tab>
        <Tab value="4">Users</Tab>
        <Tab value="5">Client Details</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <!-- Date Filters -->
          <div class="flex flex-col sm:flex-row gap-4 items-end p-3">
            <div>
              <label for="startDate" class="font-bold text-xs mb-2">Start Date</label>
              <DatePicker v-model="startDate" showIcon fluid :showOnFocus="false" inputId="startDate"
                dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" />
            </div>
            <div>
              <label for="endDate" class="font-bold text-xs mb-2">End Date</label>
              <DatePicker v-model="endDate" showIcon fluid :showOnFocus="false" inputId="endDate" dateFormat="dd/mm/yy"
                placeholder="dd/mm/yyyy" />
            </div>
            <Button label="Load Data" severity="info" @click="applyFilter" />
          </div>
          <!-- Konsulta Registered -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Konsulta Registered -->
            <Card class="shadow border border-gray-200">
              <template #content>
                <div class="flex items-center space-x-4">
                  <i class="pi pi-user-plus text-blue-500 text-2xl"></i>
                  <div>
                    <h2 class="text-sm text-gray-500 font-semibold">Konsulta Registered</h2>
                    <p class="text-2xl font-bold">{{ careGroupTotalPatients.toLocaleString() }}</p>
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
                    <p class="text-2xl font-bold">{{ totalFPE.toLocaleString() }}</p>
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
                    <p class="text-2xl font-bold">{{ totalFPC.toLocaleString() }}</p>
                  </div>
                </div>
              </template>
            </Card>
            <!-- Laboratories Provided -->
            <Card class="shadow border border-gray-200">
              <template #content>
                <div class="flex items-center space-x-4">
                  <i class="pi pi-shield text-pink-500 text-2xl"></i>
                  <div>
                    <h2 class="text-sm text-gray-500 font-semibold">Laboratory Orders</h2>
                    <p class="text-2xl font-bold">{{ totalLabs.toLocaleString() }}</p>
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
                    <p class="text-2xl font-bold">{{ totalMeds.toLocaleString() }}</p>
                  </div>
                </div>
              </template>
            </Card>
            <!-- FPE Pending Status -->
            <Card class="shadow border border-gray-200">
              <template #content>
                <div class="flex items-center space-x-4">
                  <i class="pi pi-spinner text-yellow-500 text-2xl"></i>
                  <div>
                    <h2 class="text-sm text-gray-500 font-semibold">FPE Pending Status</h2>
                    <p class="text-2xl font-bold">{{ totalFpePending.toLocaleString() }}</p>
                  </div>
                </div>
              </template>
            </Card>
            <!-- FPC Pending Status -->
            <Card class="shadow border border-gray-200">
              <template #content>
                <div class="flex items-center space-x-4">
                  <i class="pi pi-clock text-yellow-500 text-2xl"></i>
                  <div>
                    <h2 class="text-sm text-gray-500 font-semibold">FPC Pending Status</h2>
                    <p class="text-2xl font-bold">{{ totalFpcPending.toLocaleString() }}</p>
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </TabPanel>
        <TabPanel value="1">
          <div v-if="encounterStore.uploading" class="mt-2">
            <ProgressBar :value="progressPercentageEncounters" showValue>{{ progressPercentageEncounters }}%
            </ProgressBar>
          </div>
          <DataTable :value="encounters" :loading="loadingEncounters" class="w-full text-sm" stripedRows scrollable
            responsiveLayout="scroll" showGridlines paginator :rows="25">
            <template #header>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-xl font-bold">Encounters</span>
                <Button label="Upload Encounters" icon="pi pi-plus" @click="triggerFileInput"
                  :disabled="encounterStore.uploading" />
                <input ref="fileInput" type="file" accept=".csv" style="display: none" @change="handleFileUpload" />

              </div>
            </template>
            <Column field="appointment_date" header="Appointment Date" sortable style="min-width: 160px;" />
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
        </TabPanel>
        <TabPanel value="2">
          <div>

            <div v-if="onBoardedStore.uploading" class="mt-2">
              <ProgressBar :value="progressPercentageOnboarded" showValue>{{ progressPercentageOnboarded }}%
              </ProgressBar>
            </div>
            <DataTable :value="patientsByCareGroup" :loading="loadingEncounters" class="w-full text-sm" stripedRows
              scrollable responsiveLayout="scroll" showGridlines paginator :rows="25">
              <template #header>
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span class="text-xl font-bold">Master List</span>
                  <Button label="Upload Patients" icon="pi pi-plus" @click="triggerFileInput"
                    :disabled="onBoardedStore.uploading" />
                  <input ref="fileInput" type="file" accept=".csv" style="display: none"
                    @change="handleOnboardedFileUpload" />

                </div>
              </template>

              <Column field="client_name" header="Client Name" sortable />
              <Column field="group_name" header="Group Name" sortable />
              <Column field="first_name" header="First Name" sortable />
              <Column field="last_name" header="Last Name" sortable />
              <Column field="username" header="PIN" sortable />
              <Column field="created_at" header="Registered Date" sortable />
              <Column field="gender" header="Gender" sortable />
              <Column field="email" header="Email" sortable />
              <Column field="phone" header="Phone" sortable />
              <Column header="Active">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.active"
                    :severity="slotProps.data.active === 'yes' ? 'success' : 'danger'" />
                </template>
              </Column>
              <template #empty>
                <div class="text-center text-gray-500 py-6">
                  No encounters found for this client.
                </div>
              </template>
            </DataTable>

          </div>
        </TabPanel>
        <TabPanel value="3">
          <div>
            <p class="text-2xl font-bold">SAP Validation Content</p>
          </div>
        </TabPanel>
        <TabPanel value="4">
          <div>
            <p class="text-2xl font-bold">User Content</p>
          </div>
        </TabPanel>
        <TabPanel value="5">
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
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";
import { useCareGroupStore } from "../stores/careGroupStore";
import { useEncounterStore } from "../stores/encounterStore";
import { useOnboardedStore } from "../stores/onBoardedStore";

const route = useRoute();
const careGroupStore = useCareGroupStore();
const encounterStore = useEncounterStore();
const onBoardedStore = useOnboardedStore();

const toast = useToast();

const {
  fetchCareGroupById,
  fetchEncountersByClientName,
  fetchSummaryByClientName,
  fetchPatientsByClientName
} = careGroupStore;
const {
  careGroup,
  encounters,
  loading,
  loadingEncounters,
  error,
  careGroupSummary,
  totalFPC,
  totalFPE,
  totalLabs,
  totalMeds,
  totalFpePending,
  totalFpcPending,
  careGroupTotalPatients,
  patientsByCareGroup,
} = storeToRefs(careGroupStore);

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

const applyFilter = () => {
  if (startDate.value && endDate.value) {
    fetchSummaryByClientName(careGroup.value.client_name, startDate.value, endDate.value);
    fetchPatientsByClientName(careGroup.value.client_name, startDate.value, endDate.value);
  } else {
    fetchEncountersByClientName(careGroup.value.client_name);
    fetchPatientsByClientName(careGroup.value.client_name);
  }
};


const fileInput = ref(null);

function triggerFileInput() {
  fileInput.value.click();
}

async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const result = await encounterStore.uploadFile(file)

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

async function handleOnboardedFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const result = await onBoardedStore.uploadFile(file);

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

// encounters progress percentage
const progressPercentageEncounters = computed(() =>
  encounterStore.total ? Math.round((encounterStore.processed / encounterStore.total) * 100) : 0
);

const progressPercentageOnboarded = computed(() =>
  onBoardedStore.total ? Math.round((onBoardedStore.processed / onBoardedStore.total) * 100) : 0
);




onMounted(async () => {
  encounterStore.connectSocket();
  onBoardedStore.connectSocket();
  try {
    // Fetch care group
    await fetchCareGroupById(route.params.id);
    console.log("Caregroup Data", careGroup.value);

    // Fetch encounters
    if (careGroup.value?.client_name) {
      await fetchEncountersByClientName(careGroup.value.client_name);
      await fetchSummaryByClientName(careGroup.value.client_name);
      // Fetch Patients
      await fetchPatientsByClientName(careGroup.value.client_name);

      console.log("Patients by Client:", patientsByCareGroup.value);
    }
  } catch (err) {
    console.error(err);
    error.value = "Failed to load care group or encounters.";
  }

});
</script>
