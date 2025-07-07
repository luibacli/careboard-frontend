import { defineStore } from 'pinia';
import api from '../lib/axios';

export const useOnboardedStore = defineStore('onboarded', {
  state: () => ({
    patients: [],
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
    
      try {
        const response = await api.get('/upload/onboarded/patients', {
          params: { page, limit, startDate, endDate }
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
    filterUsers(searchTerm, userType) {
      this.loading = true;
      this.users = [];

      let results = this.allUsers;
      if (userType) {
        const allowed = ["Patient", "Presenter", "Clinician"];
        if (!allowed.includes(userType)) {
          throw new Error("Invalid User Type")
        }
        results = results.filter(cg => cg.user_type === userType )
      }

      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        results = results.filter(cg = cg.first_name.toLowerCase().includes(lowerSearch));
      }

      setTimeout(() => {
        this.users = results;
        this.loading = false;
      }, 300)
    
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
        const response = await api.post("/upload", formData, {
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
