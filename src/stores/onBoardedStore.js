import { defineStore } from 'pinia';
import api from '../lib/axios';
import { io } from "socket.io-client";

export const useOnboardedStore = defineStore('onboarded', {
  state: () => ({
     socket: null,
        socketId: null,
        processed: 0,
        total: 0,
    completed: 0,
    result: null,
    patients: [],
    allPatients: [],
    clientPatients: [],
    clientPatientsTotal: [],
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
           connectSocket() {
      this.socket = io('http://localhost:3000');
      this.socket.on('connect', () => {
        this.socketId = this.socket.id;
      });
      this.socket.on('uploadProgress', (data) => {
        this.processed = data.processed;
        this.total = data.total;
      });
      this.socket.on('uploadComplete', (data) => {
        this.uploading = false;
        this.completed = true;
        this.result = data;
      });
    },
      startUpload() {
      this.uploading = true;
      this.completed = false;
      this.processed = 0;
      this.total = 0;
      this.result = null;
    },
    async fetchPatients(page = 1, limit = 50, startDate = null, endDate = null) {
      this.loading = true;
      this.error = null;
      this.patients = [];
    
      try {
        const response = await api.get('/onboarded/patients', {
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

    async fetchPatientsByClient(clientName, page = 1, limit = 50, startDate = null, endDate = null) {
      this.loading = true;
      const params = { facility: clientName, page, limit }
      if (startDate, endDate) {
        params.start = startDate;
        params.end = endDate;
      }
      try {
        const response = await api.get('/onboarded/patients', {params});
        this.clientPatients = response.data;
        this.clientPatientsTotal = response.data.toal
      } catch (err) {
        console.error('Error fetching patients by client:', err);
        this.error = 'Failed to fetch patients by client';
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

  // Reset state
  this.startUpload();

  try {
    const response = await api.post(
      `/onboarded?socketId=${this.socketId}`, // 💡 this is critical
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

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
  }
},
  }
});
