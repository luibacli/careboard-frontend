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
            <!-- Upload Button -->
            <Button
              label="Upload Encounters"
              icon="pi pi-upload"
              @click="triggerFileInput"
              class="p-button-success"
              :disabled="uploading"
            />
            <!-- Hidden File Input -->
            <input
              ref="fileInput"
              type="file"
              accept=".csv"
              style="display: none"
              @change="handleFileUpload"
            />
  
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
  import api from "../lib/axios";
  
  const authStore = useAuthStore();
  const { logout } = authStore;
  
  const router = useRouter();
  const toast = useToast();
  
  const items = ref([
    { label: 'Dashboard', icon: 'pi pi-chart-bar', command: () => router.push("/") },
    { label: 'Luzon', command: () => router.push('/luzon') },
    { label: 'Visayas', command: () => router.push('/visayas') },
    { label: 'Mindanao', command: () => router.push('/mindanao') },
    { label: 'Caregroups', command: () => router.push('/caregroups') },
  ]);
  
  const profileMenuRef = ref();
  const fileInput = ref();
  const uploading = ref(false);
  const progress = ref(0);
  
  function onAvatarClick(event) {
    profileMenuRef.value.toggle(event);
  }
  
  function triggerFileInput() {
    fileInput.value.click();
  }
  
  async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    uploading.value = true;
    progress.value = 0;
  
    try {
      const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            progress.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          }
        },
      });
  
      const { inserted, updated, skipped, message } = response.data;
  
      toast.add({
        severity: "success",
        summary: "Upload Complete",
        detail: `${message} • Inserted: ${inserted}, Updated: ${updated}, Skipped: ${skipped}`,
        life: 5000
      });
    } catch (error) {
      console.error("Upload error:", error);
  
      toast.add({
        severity: "error",
        summary: "Upload Failed",
        detail: error.response?.data?.error || "Unknown error",
        life: 5000
      });
    } finally {
      uploading.value = false;
      progress.value = 0;
      event.target.value = null;
    }
  }
  </script>
  
  <style scoped>
  .font-bold {
    font-weight: bold;
  }
  </style>
  