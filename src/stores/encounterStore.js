import { defineStore } from "pinia";
import api from "../lib/axios";
import { io } from "socket.io-client";



export const useEncounterStore = defineStore('encounter', {
  state: () => ({
        socket: null,
        socketId: null,
        processed: 0,
        total: 0,
    completed: 0,
    result: null,
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
    async fetchEncounters(page = 1, limit = 50) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/encounters', {
          params: { page, limit }
        });
        this.encounters = response.data.data;
        this.totalEncounters = response.data.total;
        

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

  // Reset state
  this.startUpload();

  try {
    const response = await api.post(
      `/encounters?socketId=${this.socketId}`, // 💡 this is critical
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
}

  }
})