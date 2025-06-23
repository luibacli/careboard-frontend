<template>
<div class="flex items-center justify-between mb-4 caregroup-header">
    <p class="text-2xl font-bold">All Caregroups</p>

    <div>
       
        <Select v-model="selectedRegion" :options="regions" optionLabel="label"
                placeholder="Filter by Main Region" class="w-60 mr-2" />
        <Button label="Add CareGroup" icon="pi pi-plus" class="p-button-success mr-2" />
        <Button label="Refresh" icon="pi pi-refresh" class="p-button-secondary" />
    </div>
</div>

<!-- Table for caregroups here -->
<div class="bg-white shadow-md rounded-lg p-4">
    <p class="text-gray-600">Caregroups will be listed here.</p>
</div>


 </template>
 
 <script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import { Select } from 'primevue';

const selectedRegion = ref(null);
const regions = ref([
    { label: 'Luzon', value: 'luzon' },
    { label: 'Visayas', value: 'visayas' },
    { label: 'Mindanao', value: 'mindanao' }
]);
 </script>