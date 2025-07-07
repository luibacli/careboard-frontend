import { defineStore } from "pinia";
import api from "../lib/axios";


export const useEncounterStore = defineStore('encounter', {
    state: () => ({
        encounters: [],
        allEncounters: [],
        loading: false,
        error: null,
        uploading: false,
        progress: 0,
        searchQuery: "",

        
    }),
    actions: {

    }
})