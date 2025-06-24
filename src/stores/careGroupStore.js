import { defineStore } from "pinia";
import api from "../lib/axios";



export const useCareGroupStore = defineStore("careGroup", {
    state: () => ({
        careGroups: [],
        careGroupForm: {
            client_name: "",
            address: "",
            city: "",
            province: "",
            /**
             * Allowed values: "Luzon", "Visayas", "Mindanao"
             * @type {"Luzon"|"Visayas"|"Mindanao"|""}
             */
            main: "Luzon", // Default to "Luzon"
            status: "active", // Default status
        },
        dialogVisible: false,
        selectedRegion: null,
        regions: [
            { label: "Luzon", value: "Luzon" },
            { label: "Visayas", value: "Visayas" },
            { label: "Mindanao", value: "Mindanao" },
        ]
    }),
    actions: {
        async fetchCareGroups() {
            const res = await api.get("/caregroups");
            this.careGroups = res.data;
            console.log("Fetched care groups:", this.careGroups);
            return this.careGroups;
        },
        async getCareGroup(id) {
            try {
                const res = await api.get(`/caregroups/${id}`);
                return res.data;
            } catch (error) {
                console.error("Failed to fetch care group:", error);
                return null;
            }
        },
        async fetchCareGroupByMain(main) {
            const allowed = ["Luzon", "Visayas", "Mindanao"];

            if (!allowed.includes(main)) {
                throw new Error("Invalid value for 'main' field.");
            }
            const res = await api.get(`/caregroups?main=${main}`);
            return res.data;
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
                if (!this.careGroupForm.client_name || !this.careGroupForm.address || !this.careGroupForm.city || !this.careGroupForm.province || !this.careGroupForm.main) {
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
                client_name: "",
                address: "",
                city: "",
                province: "",
                main: "Luzon",
                status: "active",
            };
        }
    }
});