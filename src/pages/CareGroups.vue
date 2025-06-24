<template>
<Toast />
<div class="flex items-center justify-between mb-4 caregroup-header">

   
    <p class="text-2xl font-bold">All Caregroups</p>

    <div>
       
        <Select v-model="selectedRegion" :options="regions" optionLabel="label"
                placeholder="Filter by Main Region" class="w-60 mr-2" />
        <Button label="Add CareGroup" icon="pi pi-plus" class="p-button-success mr-2"  @click="dialogVisible = true"/>
        <Button label="Refresh" icon="pi pi-refresh" class="p-button-secondary" @click="show"/>
    </div>
</div>
<!-- Dialog for CareGroup Creation -->
 <Dialog v-model:visible="dialogVisible"  header="Create CareGroup" modal :style="{ width: '50vw' }">
    <Form v-slot="$form" :careGroupForm="careGroupForm" @submit="create">
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
            <Button label="Create" icon="pi pi-check" class="p-button-success ml-2" type="submit"/>
        </div>
      
    </div>
    </Form>
    
 </Dialog>

<!-- Table for caregroups here -->
<div class="bg-white shadow-md rounded-lg p-4">
    <p class="text-gray-600">Caregroups will be listed here.</p>
</div>


 </template>
 
 <script setup>
import { ref, onMounted } from 'vue'
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
const { fetchCareGroups, createCareGroup } = careGroupStore;
const { careGroups, careGroupForm, regions, selectedRegion, dialogVisible } = storeToRefs(careGroupStore);



const resolver = ref(zodResolver(
    z.object({
        clien_name: z.string().min(1, 'Name is required'),
        address: z.string().min(1, 'Address is required'),
        city: z.string().min(1, 'City is required'),
        province: z.string().min(1, 'Province is required'),
        region: z.string().min(1, 'Region is required')
    })
));

const show = () => {
    toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
};


const create = async () => {
    const result = await createCareGroup();
    if (result.success) {
        toast.add({ severity: 'success', summary: 'Caregroup created', life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: 'Error creating caregroup', life: 3000 });
    }
};

onMounted(() => {
    fetchCareGroups();
});
 </script>