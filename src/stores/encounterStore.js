import { defineStore } from "pinia";
import api from "../lib/axios";


export const useEncounterStore = defineStore('encounter', {
    state: () => ({
        encounters: [],
        allEncounters: [],
        totalEncounters: 0,
        loading: false,
        error: null,
        uploading: false,
        progress: 0,
        searchQuery: "",

        
    }),
    actions: {
        async fetchEncounters(page = 1, limit = 50) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get('upload/encounters', {
                    params: { page, limit }
                });
                this.encounters = response.data.data;
                this.totalEncounters = response.data.total;
                console.log("Total Encounters:", this.totalEncounters);
                
            } catch (error) {
                console.error("Error Fetching users", error)
                this.error = "Failed to catch encounters"
                
            } finally {
                this.loading = false;
            }
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
})