// stores/summaryStore.js
import { defineStore } from 'pinia'
import api from "../lib/axios"

export const useSummaryStore = defineStore('summary', {
  state: () => ({
    summaryData: null,
    loading: false,
    error: null
  }),

  actions: {
    async loadSummary(start = null, end = null, year = null) {
        this.loading = true;
        this.error = null;
        try {
          const params = {};
          if (start) params.start = start;
          if (end) params.end = end;
          if (year) params.year = year;
      
          const res = await api.get('/encounters/summary', { params });
          this.summaryData = res.data;
        } catch (err) {
          console.error(err);
          this.error = 'Failed to load summary data.';
        } finally {
          this.loading = false;
        }
      }
      
  }
})
