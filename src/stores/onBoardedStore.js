import { defineStore } from 'pinia';
import api from '../lib/axios';
import { data } from 'autoprefixer';

export const useOnboardedStore = defineStore('onboarded', {
  state: () => ({
    patients: [],
    allPatients: [],
    users: [],
    allUsers: [],
    presenters: [],
    clinicians: [],
    totalUsers: 0,
    totalPresenters: 0,
    totalClinicians: 0,
    totalPatients: 0,
    loading: false,
    error: null,
    uploading: false,
    progress: 0,
    selectedUserType: null,
    searchQuery: "",
    options: [
      { label: "Patient", value: "patient" },
      { label: "Presenter", value: "presenter" },
      { label:"Clinician", value: "clinician"}
    ]
  }),

  actions: {
    async fetchPatients(page = 1, limit = 50, startDate = null, endDate = null) {
      this.loading = true;
      this.error = null;
      this.patients = [];
    
      try {
        const response = await api.get('/upload/onboarded/patients', {
          params: { page, limit, startDate, endDate }
        });
        
        setTimeout(() => {
          this.patients = response.data.data;
          this.allPatients = response.data.data;
          this.loading = false;
        }, 300)
    
        this.totalPatients = response.data.total;
  

        return response.data.total;
      
      
      } catch (err) {
        console.error('Error fetching patients:', err);
        this.error = 'Failed to fetch patients';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchUsers(page = 1, limit = 50) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('upload/onboarded', {
          params: { page, limit }
        });
        this.users = response.data.data;
        this.totalUsers = response.data.total;
        console.log("Total Users:", this.totalUsers);
      } catch (error) {
        console.error("Error Fething users", error);
        this.error = "Failed to fetch patients"
        
      } finally {
        this.loading = false;
      }

    },
    filterUsers(searchTerm) {
      this.loading = true;
      this.patients = [];

      let results = this.allPatients;
   
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        results = results.filter(cg => cg.first_name.toLowerCase().includes(lowerSearch));
      }

   
        this.patients = results;
        this.loading = false;
    
  },
  async uploadFile(file) {
      if (!file) {
        return { success: false, error: "No file selected." };
      }

      const formData = new FormData();
      formData.append("file", file);

      this.uploading = true;
      this.progress = 0;

      try {
        const response = await api.post("/upload/upload-onboarded", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.lengthComputable) {
              this.progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
            }
          },
        });

        const { inserted, updated, skipped, message } = response.data;

        return {
          success: true,
          inserted,
          updated,
          skipped,
          message,
        };
      } catch (error) {
        console.error("Upload error:", error);

        return {
          success: false,
          error: error.response?.data?.error || "Unknown error",
        };
      } finally {
        this.uploading = false;
        this.progress = 0;
      }
    },
  }
});
