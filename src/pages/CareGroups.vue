<template>
<Toast />
<div class="flex items-center justify-between mb-4 caregroup-header">

   
    <p class="text-2xl font-bold">All Caregroups</p>

    <div>
        <InputText
  v-model="searchQuery"
  placeholder="Search by client name"
  class="w-72 mr-2 border-gray-300 focus:border-blue-500"
  clearable
/>

        <Select
  v-model="selectedRegion"
  :options="regions"
  optionLabel="label"
  optionValue="value"
  placeholder="Filter by Main Region"
  class="w-60 mr-2"
/>
        <Button label="Add CareGroup" icon="pi pi-plus" class="p-button-success mr-2"  @click="dialogVisible = true"/>
        <Button
  label="Refresh"
  icon="pi pi-refresh"
  class="p-button-secondary"
  @click="refresh"
/>
    </div>
</div>
<!-- Dialog for CareGroup Creation -->
 <Dialog v-model:visible="dialogVisible"  header="Create CareGroup" modal :style="{ width: '50vw' }">
    <Form v-slot="$form" :resolver="resolver" :careGroupForm="careGroupForm" @submit="save">
        <div class="flex items-center gap-4 mb-4">
       <label for="name" class="font-semibold w-24">Client Name</label>
       <InputText id="name" class="flex-auto" autocomplete="off" v-model="careGroupForm.client_name" />
    </div>
    <div class="flex items-center gap-4 mb-4">
       <label for="address" class="font-semibold w-24">Address</label>
       <InputText id="address" class="flex-auto" autocomplete="off" v-model="careGroupForm.address"/>
    </div>
    <div class="flex items-center gap-4 mb-4">
       <label for="city" class="font-semibold w-24 text-sm">City/Municipality</label>
       <InputText id="city" class="flex-auto" autocomplete="off" v-model="careGroupForm.city" />
    </div>
    <div class="flex items-center gap-4 mb-4">
       <label for="province" class="font-semibold w-24">Province</label>
       <InputText id="province" class="flex-auto" autocomplete="off" v-model="careGroupForm.province" />
    </div>
    <div class="flex items-center mb-4 justify-between">
        <div class="flex items-center gap-4"> 
            <label for="main" class="font-semibold w-24">Main Region</label>
            <Select id="region" v-model="careGroupForm.main" :options="regions" optionLabel="label"
                    optionValue="value" placeholder="Select Region" class="w-50" />
        </div>
         <div>
            <Button label="Save" icon="pi pi-check" class="p-button-success ml-2" type="submit"/>
        </div>
      
    </div>
    </Form>
    
 </Dialog>

<!-- Table for caregroups here -->
<DataTable
  :value="careGroups"
  :loading="loading"
  class="w-full mt-4"
  stripedRows
  paginator
  :rows="10"
>
  <Column field="client_name" header="Client Name" sortable />
  <Column field="address" header="Address" sortable />
  <Column field="city" header="City" sortable />
  <Column field="province" header="Province" sortable />
  <Column field="main" header="Main Region" sortable />

  <Column header="Status">
    <template #body="slotProps">
      <Tag 
        :value="slotProps.data.status" 
        :severity="slotProps.data.status === 'active' ? 'success' : 'danger'" 
      />
    </template>
  </Column>

  <Column header="Actions" style="width: 180px;">
  <template #body="slotProps">
    <Button 
      icon="pi pi-pencil"
      class="p-button-text p-button-sm text-primary"
      @click="editCareGroup(slotProps.data)"
    />
    <Button 
      icon="pi pi-trash"
      class="p-button-text p-button-sm text-red-500"
      @click="removeCareGroup(slotProps.data._id)"
    />
  </template>
</Column>


  <template #empty>
    <div class="text-center text-gray-500 py-6">
      No care groups found. Click "Add CareGroup" to create your first one.
    </div>
  </template>

  <template #loading>
    <div class="flex flex-col items-center justify-center py-8 text-blue-500">
      <i class="pi pi-spin pi-spinner text-4xl mb-2"></i>
      <span>Loading care groups...</span>
    </div>
  </template>
</DataTable>






 </template>
 
 <script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia';
import Button from 'primevue/button'
import Message from 'primevue/message';
import { Select, Dialog, InputText } from 'primevue';
import { Form } from '@primevue/forms';
import { useCareGroupStore } from '../stores/careGroupStore';
import { useToast } from 'primevue/usetoast';
import {z} from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import Toast from 'primevue/toast';

const toast = useToast();
const careGroupStore = useCareGroupStore();
const { fetchCareGroups, createCareGroup, fetchCareGroupByMain, deleteCareGroup } = careGroupStore;
const { careGroups, careGroupForm, regions, selectedRegion, dialogVisible, loading } = storeToRefs(careGroupStore);



const resolver = ref(zodResolver(
  z.object({
    client_name: z.string().min(1, 'Client Name is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    province: z.string().min(1, 'Province is required'),
    main: z.string().min(1, 'Main region is required')
  })
));

const refresh = async () => {
  selectedRegion.value = null; // reset filter
  await fetchCareGroups();
  toast.add({
    severity: "success",
    summary: "Refreshed",
    detail: "Caregroups reloaded.",
    life: 3000,
  });
};

const save = async () => {
  saving.value = true;

  if (careGroupForm.value._id) {
    // Updating
    try {
      await careGroupStore.updateCareGroup(careGroupForm.value._id);
      toast.add({
        severity: "success",
        summary: "Updated",
        detail: "Care group updated successfully.",
        life: 3000,
      });
      await fetchCareGroups(); // ✅ Refetch all records
      dialogVisible.value = false;
      careGroupStore.resetCareGroupForm();
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Failed to update care group.",
        life: 3000,
      });
    } finally {
      saving.value = false;
    }
  } else {
    // Creating
    const result = await createCareGroup();
    if (result.success) {
      toast.add({
        severity: "success",
        summary: "Created",
        detail: "Care group created successfully.",
        life: 3000,
      });
      await fetchCareGroups(); // ✅ Refetch all records
      dialogVisible.value = false;
      careGroupStore.resetCareGroupForm();
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Failed to create care group.",
        life: 3000,
      });
    }
    saving.value = false;
  }
};



const editCareGroup = (careGroup) => {
  // Populate the form with the selected care group
    careGroupForm.value = { ...careGroup };
  console.log("Editing care group:", careGroupForm.value);
  dialogVisible.value = true;
};

const removeCareGroup = async (id) => {
  if (confirm("Are you sure you want to delete this care group?")) {
    try {
      await deleteCareGroup(id);
      toast.add({
        severity: "success",
        summary: "Deleted",
        detail: "Care group deleted successfully.",
        life: 3000,
      });
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete care group.",
        life: 3000,
      });
    }
  }
};



const searchQuery = ref("");
const saving = ref(false);


watch([searchQuery, selectedRegion], ([newSearch, newRegion]) => {
  if (newSearch || newRegion) {
    careGroupStore.filterCareGroups(newSearch, newRegion);
  } else {
    careGroupStore.loading = true;
    careGroupStore.careGroups = [];
    setTimeout(() => {
      careGroupStore.careGroups = careGroupStore.allCareGroups;
      careGroupStore.loading = false;
    }, 300);
  }
});





onMounted(async () => {
    await fetchCareGroups();
});

 </script>