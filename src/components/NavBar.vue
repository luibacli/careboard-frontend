<template>
    <div class="card">
      <Menubar :model="items">
        <template #start>
          <svg width="50" height="50" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#3DB8A6"/>
                <stop offset="100%" stop-color="#3C7DD9"/>
              </linearGradient>
            </defs>
            <path d="M100 180L45 120C15 90 15 45 50 30C75 20 95 45 100 60C105 45 125 20 150 30C185 45 185 90 155 120L100 180Z" fill="url(#grad)"/>
            <path d="M55 110H80L90 85L105 135L115 110H145" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </template>
  
        <template #end>
          <div class="flex items-center gap-2" style="position: relative;">
   
  
            <!-- Avatar Menu -->
            <Menu ref="profileMenuRef" :model="profileMenuItems" popup />
            <Avatar
              :style="{ width: '40px', height: '40px' }"
              image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
              shape="circle"
              style="cursor:pointer"
              @click="onAvatarClick"
            />
          </div>
        </template>
      </Menubar>
  
      <!-- Toast Component -->
      <Toast />
  
      <!-- Progress Bar -->
      <div v-if="uploading" class="mt-2">
        <ProgressBar :value="progress" showValue>{{ progress }}%</ProgressBar>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useToast } from "primevue/usetoast";
  import { useAuthStore } from "../stores/authStore";
  import Menubar from "primevue/menubar";
  import Button from "primevue/button";
  import Avatar from "primevue/avatar";
  import Menu from "primevue/menu";
  import Toast from "primevue/toast";
  import ProgressBar from "primevue/progressbar";

  
  const authStore = useAuthStore();
  const { logout } = authStore;
  
  const router = useRouter();
  const toast = useToast();
  const regions = ["Luzon", "Visayas", "Mindanao"];
  
  const items = ref([
    { label: 'Home', icon: 'pi pi-home', command: () => router.push("/") },
    {
      label: 'Reports', icon: 'pi pi-chart-bar', items: regions.map(region => ({
        label: region,
        command: () => router.push(`/reports/${region}`)
      
    }))},
    { label: 'Caregroups', icon: 'pi pi-building', command: () => router.push('/caregroups') },
    { label: 'Encounters', icon: 'pi pi-warehouse',command: () => router.push('/encounters') },
    { label: 'Master List', icon: 'pi pi-users', command: () => router.push('/onboarded') },
    { label: 'Users', icon: 'pi pi-user-plus'},
    
  ]);
  
  const profileMenuRef = ref();

  // Define profile menu items
  const profileMenuItems = [
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        logout();
        router.push('/login');
      }
    }
  ];
  
  function onAvatarClick(event) {
    profileMenuRef.value.toggle(event);
  }
  

  </script>
  
  <style scoped>
  .font-bold {
    font-weight: bold;
  }
  </style>
  