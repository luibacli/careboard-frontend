import { defineStore } from 'pinia';
import api from '../lib/axios';

export const useOnboardedStore = defineStore('onboarded', {
  state: () => ({
    patients: [],
    totalPatients: 0,
    loading: false,
    error: null,
    uploading: false,
    progress: 0,
  }),

  actions: {
    async fetchPatients(page = 1, limit = 50) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get('/upload/onboarded/patients', {
          params: { page, limit }
        });

        this.patients = response.data.data;
        this.totalPatients = response.data.total;
        console.log("Total Patients", this.totalPatients);
      } catch (err) {
        console.error('Error fetching patients:', err);
        this.error = 'Failed to fetch patients';
      } finally {
        this.loading = false;
      }       
    },
    async handleFileUpload(event) {
      const file = event.target.files[0],
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      this.uploading = true;
      this.progress = 0;

      try {
        const response = await api.post("/upload/upload-onboarded", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.lengthComputable) {
              this.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            }
          }
        });

        const { inserted, updated, skipped, message } = response.data;
        
      } catch (error) {
        
      }
    },
  }
});
