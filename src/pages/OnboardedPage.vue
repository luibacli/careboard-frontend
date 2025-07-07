<template>
    <Toast />

    <div v-if="uploading" class="mt-2">
        <ProgressBar :value="progress" showValue>{{ progress }}%</ProgressBar>
      </div>
    <div class="flex items-center justify-between mb-4 masterlist-header">
    
      
        <p class="text-2xl font-bold">Master List</p>
    
        <div>
            <InputText
      v-model="searchQuery"
      placeholder="Search by name"
      class="w-72 mr-2 border-gray-300 focus:border-blue-500"
      clearable
    />
    
            <Select
      v-model="selectedUserType"    
      :options="options"
      optionLabel="label"
      optionValue="value"
      placeholder="Filter by User Type"
      class="w-60 mr-2"
    />
            <Button label="Upload Users" icon="pi pi-upload" class="p-button-success mr-2" @click="triggerFileInput" :disabled="uploading"/>
               <!-- Hidden File Input -->
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
    <!-- Table for masterlist here -->
    <DataTable
      :value="patients"
      :loading="loading"
      class="w-full mt-4"
      stripedRows
      paginator
      :rows="10"
    >
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
          <Tag 
            :value="slotProps.data.active" 
            :severity="slotProps.data.active === 'yes' ? 'success' : 'danger'" 
          />
        </template>
      </Column>
    

    
    
      <template #empty>
        <div class="text-center text-gray-500 py-6">
          No care users found. Click "Upload Users" to create your first one.
        </div>
      </template>
    
      <template #loading>
        <div class="flex flex-col items-center justify-center py-8 text-blue-500">
          <i class="pi pi-spin pi-spinner text-4xl mb-2"></i>
          <span>Loading users...</span>
        </div>
      </template>
    </DataTable>
    
    
    
    
    
    
     </template>
     
<script setup>
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useOnboardedStore } from "../stores/onBoardedStore";
import { useToast } from "primevue/usetoast";
import ProgressBar from "primevue/progressbar";




const toast = useToast();
const onBoardedStore = useOnboardedStore()
const { fetchPatients, uploadFile, filterUsers, fetchUsers } = onBoardedStore
const {patients, users, allUsers, loading, progress, uploading, error, options, selectedUserType, searchQuery} = storeToRefs(onBoardedStore)
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
    selectedUserType.value = null;
    await fetchUsers();
    toast.add({
      severity: "success",
      summary: "Refreshed",
      detail: "Master list reloaded",
      life: 3000,
    });
  
    };
  
  watch([searchQuery, selectedUserType], ([newSearch, newUserType]) => {
    if(newSearch || newUserType) {
      filterUsers(newSearch, newUserType);
    } else {
      loading.value = true;
      users.value = [];
      setTimeout(() => {
        users.value = allUsers.value;
        loading.value = false;
      }, 300)
      
    }
  });
  onMounted(async () => {
    await fetchPatients();
})
</script>
