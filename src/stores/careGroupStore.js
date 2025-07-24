import { defineStore } from "pinia";
import api from "../lib/axios";
import { io } from "socket.io-client";




export const useCareGroupStore = defineStore("careGroup", {
    state: () => ({
        careGroups: [],
        allCareGroups: [],
        careGroupSummary: null,
        careGroupForm: {
            id: null,
            client_name: "",
            address: "",
            city: "",
            province: "",
            main: "Luzon",
            type: "Public",
            status: "active"
    },
    careGroupTotalPatients: 0,
    summaryByRegion: 0,
    totalRegisteredByRegion: 0,
    totalFpeByRegion: 0,
    totalFpcByRegion: 0,
    monthlyFpeByRegion: 0,
    monthlyFpcByRegion: 0,
    allCareGroupsByRegion: [],
    publicCareGroupsByRegion: [],
    privateCareGroupsByRegion: [],
    patientsByCareGroup: [],
    socket: null,
    socketId: null,
    sapUploading: false,
    sapProcessed: 0,
    sapProgressPercentage: 0,
    sapUploadTotal: 0,
    showSapUpload: false,
    showValidateSapDialog: false,
    sapCompleted: false,
    sapResult: null,
    sapValidationData: null,
    discrepancies: [],
    encounterData: [],
    sapData: [],
    selectedTranche: null,
    selectedClient: null,
    trancheOption: [
      { label: "1", value: "1" },
      { label: "2", value: "2"}
    ],
    clientsOption: [],
    selectedPeriod: "",

          
        dialogVisible: false,
        selectedRegion: null,
        loading: false,
        regions: [
            { label: "Luzon", value: "Luzon" },
            { label: "Visayas", value: "Visayas" },
            { label: "Mindanao", value: "Mindanao" },
    ],
        selectedClinicType: null,
    clinicTypes: [
      {
            label: "Public", value: "public"
      },
      {
        label: "Private", value: "private"
      }
        ],
        careGroup: null,
        encounters: [],
        loadingEncounters: false,
        error: null,
    }),
    getters: {
        totalFPE: (state) => state.careGroupSummary?.fpe?.[0]?.count || 0,
        totalFPC: (state) => state.careGroupSummary?.fpc?.[0]?.count || 0,
        totalLabs: (state) => state.careGroupSummary?.labs?.[0]?.total || 0,
      totalMeds: (state) => state.careGroupSummary?.meds?.[0]?.total || 0,
      totalFpePending: (state) => state.careGroupSummary?.fpePending?.[0]?.count || 0,
      totalFpcPending: (state) => state.careGroupSummary?.fpcPending?.[0]?.count || 0,
    
    },
    actions: {
        async fetchCareGroups() {
            this.loading = true;
            this.careGroups = [];
          
            const res = await api.get("/caregroups");
          
            // Optional delay to make the spinner visible
        setTimeout(() => {
          this.allCareGroups = res.data;
          this.careGroups = res.data;
      

                this.loading = false;
                console.log("Care groups fetched:", res.data);
            }, 300);
      },
      

      async fetchAllCareGroups() {
        try {
          const res = await api.get("/caregroups");
             this.careGroups = res.data;
          this.clientsOption = res.data.map(cg => ({
            label: cg.client_name,
            value: cg.client_name,
          }))
          
        } catch (error) {
          console.log("Failed to fetch caregroups", error);
        }
      },
          
          
          async fetchCareGroupById(id) {
            this.loading = true;
            try {
              const res = await api.get(`/caregroups/${id}`);
              this.careGroup = res.data
            } catch (error) {
              console.error("Failed to fetch care group:", error);
              throw error;
            } finally {
              this.loading = false;
            }
        },
          
        async fetchEncountersByClientName(clientName) {
            this.loading = true;
            try {
              const res = await api.get(`/encounters?clients=${encodeURIComponent(clientName)}`);
                this.encounters = res.data.data
                console.log("Client Encounters Total",res.data.total);
            } catch (error) {
              console.error("Failed to fetch encounters:", error);
              throw error;
            } finally {
              this.loading = false;
            }
        },
        
        async fetchSummaryByClientName(clientName, startDate = null, endDate = null) {
          this.loading = true;
          try {
            const params = { facility: clientName };
            if (startDate && endDate) {
              params.start = startDate;
              params.end = endDate;
            }
        
            const res = await api.get("/summary", { params });
            this.careGroupSummary = res.data;
            console.log("client summar", this.careGroupSummary);
             console.log("api:", res.request.responseURL);
          } catch (error) {
            console.error("Failed to fetch client summary", error);
          } finally {
            this.loading = false;
          }
      },
        
      async fetchSummaryByRegion() {

      },
        
      async fetchCareGroupSummaryByRegion(regionName, startDate = null, endDate = null) {
        this.loading = true
        try {
          const params = { region: regionName }
          if (startDate && endDate) {
            params.start = startDate;
            params.end = endDate;
          }
          const summary = await api.get("/summary", { params });
          const res = await api.get("/summary/region-caregroups-summary", { params });
          
          this.summaryByRegion = summary.data
          this.allCareGroupsByRegion = res.data
          this.publicCareGroupsByRegion = res.data.filter(cg => cg.type === "public")
          this.privateCareGroupsByRegion = res.data.filter(cg => cg.type === "private")

          this.totalRegisteredByRegion = res.data.reduce((sum, cg) => sum + (cg.totals?.registered ?? 0), 0);
          this.totalFpeByRegion = res.data.reduce((sum, cg) => sum + (cg.totals?.fpe ?? 0), 0);
          this.totalFpcByRegion = res.data.reduce((sum, cg) => sum + (cg.totals?.fpc ?? 0), 0);


        } catch (error) {
          console.error("Failed to fetch each care group summary by region", error)
          this.error = error.message
        } finally {
          this.loading = false;
        }
        },
        
        
        async fetchPatientsByClientName(clientName, startDate = null, endDate = null) {
          this.loading = true;
          try {
            const params = { facility: clientName };
            if (startDate && endDate) {
              params.startDate = startDate;
              params.endDate = endDate;
            }
        
            const res = await api.get("/onboarded/patients", { params });
            this.patientsByCareGroup = res.data.data;
            this.careGroupTotalPatients = res.data.total;
          } catch (error) {
            console.error("Failed to fetch patients by client name", error);
    
          } finally {
            this.loading = false;
          }
        },
        
          
          
        filterCareGroups(searchTerm, mainRegion) {
            this.loading = true;
            this.careGroups = [];
          
            let results = this.allCareGroups;
          
            if (mainRegion) {
              const allowed = ["Luzon", "Visayas", "Mindanao"];
              if (!allowed.includes(mainRegion)) {
                throw new Error("Invalid region");
              }
              results = results.filter(cg => cg.main === mainRegion);
            }
          
            if (searchTerm) {
              const lowerSearch = searchTerm.toLowerCase();
              results = results.filter(cg => cg.client_name.toLowerCase().includes(lowerSearch));
            }
          
            // Delay setting the results so the spinner shows
            setTimeout(() => {
              this.careGroups = results;
              this.loading = false;
            }, 300);
          },
          
          
          
        filterCareGroupsByMain(main) {
          
            const allowed = ["Luzon", "Visayas", "Mindanao"];
            if (!allowed.includes(main)) {
              throw new Error("Invalid value for 'main' field.");
            }
            this.careGroups = this.allCareGroups.filter(cg => cg.main === main);
   
          },
          
          
        async fetchCareGroupByStatus(status) {
            const allowed = ["active", "inactive"];
            if (!allowed.includes(status)) {
                throw new Error("Invalid value for 'status' field.");
            }
            const res = await api.get(`/caregroups?status=${status}`);
            return res.data;
        },
        async createCareGroup() {
            try {
                if (!this.careGroupForm.client_name || !this.careGroupForm.address || !this.careGroupForm.city || !this.careGroupForm.province || !this.careGroupForm.main || !this.careGroupForm.type) {
                    throw new Error("All fields are required."); 
                }
                const res = await api.post("/caregroups", this.careGroupForm);
                this.careGroups.push(res.data);
                this.resetCareGroupForm();
                this.dialogVisible = false;
                console.log("Care group created:", res.data);
                return { success: true, data: res.data };
            } catch (error) {
                console.error("Failed to create care group:", error);
                console.error("Backend response:", error.response?.data); // 👈 Add this line
                return { success: false, error };
            }
        },
        async updateCareGroup(id) {
            this.validateMainField();
            try {
                const res = await api.put(`/caregroups/${id}`, this.careGroupForm);
                const index = this.careGroups.findIndex(cg => cg.id === id);
                if (index !== -1) {
                    this.careGroups[index] = res.data;
                }
                this.resetCareGroupForm();
                return res.data;
            } catch (error) {
                // Optionally handle error (e.g., show notification)
                throw error;
            }
        },
        async deleteCareGroup(id) {
            try {
                await api.delete(`/caregroups/${id}`);
                this.careGroups = this.careGroups.filter(cg => cg.id !== id);
            } catch (error) {
                // Optionally handle error (e.g., show notification)
                throw error;
            }
        },
        validateMainField() {
            const allowed = ["Luzon", "Visayas", "Mindanao"];
            if (!allowed.includes(this.careGroupForm.main)) {
                throw new Error("Invalid value for 'main' field.");
            }
        },
        resetCareGroupForm() {
            this.careGroupForm = {
              id: null,
              client_name: "",
              address: "",
              city: "",
              province: "",
              main: "Luzon",
              status: "active"
            };
      },
        
      startUpload() {
        this.sapUploading = true;
        this.sapCompleted = false;
        this.sapProcessed = 0;
        this.sapUploadTotal = 0;
        this.sapResult = null;
      },
          connectSocket() {
      this.socket = io('http://localhost:3000');
      this.socket.on('connect', () => {
        this.socketId = this.socket.id;
      });
      this.socket.on('uploadProgress', (data) => {
        this.sapProcessed = data.processed;
        this.sapUploadTotal = data.total;
        
      });
      this.socket.on('uploadComplete', (data) => {
        this.sapUploading = false;
        this.sapCompleted = true;
        this.showSapUpload = false;
        this.sapResult = data;
      });
    },
        
  async uploadSAP(file, client, period) {
  if (!file) {
    return { success: false, error: "No file selected." };
  }

  if (!client || !period) {
    return { success: false, error: "Please select client and period." };
  }

  const formData = new FormData();
  formData.append("file", file);

  this.startUpload();

  try {
    const response = await api.post(
      `/upload/upload-sap?socketId=${encodeURIComponent(this.socketId)}&client=${encodeURIComponent(client)}&period=${encodeURIComponent(period)}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    const { inserted, skipped, message } = response.data;

    return {
      success: true,
      inserted,
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

  
      async validateSap(client, startDate = null, endDate = null, period) {
        try {
          const params = {};
          if (!client || !startDate || !endDate || !period) {
            throw new Error("All fields are required")
          } else {
            params.client = client
            params.start = startDate
            params.end = endDate
            params.period = period
          }

          const res = await api.get("/upload/validate-sap", { params })
          this.sapValidationData = res.data
          this.discrepancies = res.data.discrepancies
          this.encounterData = res.data.encounterData
          this.sapData = res.data.sapData
          this.showValidateSapDialog = false;
          return { success: true}
      
        } catch (error) {
          console.error("Failed to validate SAP", error);
          return { success: false}
          
        }
    
  }

        
     
    }
});