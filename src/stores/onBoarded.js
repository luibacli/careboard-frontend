import { defineStore } from 'pinia';
import api from '../lib/axios';

export const useOnboardedStore = defineStore('onboarded', {
  state: () => ({
    patients: [],
    totalPatients: 0,
    loading: false,
    error: null
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
    }
  }
});
