import { defineStore } from "pinia";
import router from "../router";
import api from "../lib/axios";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        loginForm: {
          email: "",
          password: "", 
        },
        user: {
            id: null,
            username: "",
            email: "",
            role: "",
        },
        token: null,
    }),  
    actions: {
        async login() {
            try {
                const response = await api.post("/auth/login", this.loginForm);
                this.token = response.data.token;
                localStorage.setItem("token", this.token);
                api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
                await this.fetchUser();
                router.push("/");
            } catch (error) {
                console.error("Login failed:", error);
                throw error;
            }
        },

        async isAuthenticated() {
            try {
                const token = localStorage.getItem("token");
                if (!token) return false;
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                await this.fetchUser();
                return true;
            } catch (error) {
                console.error("Authentication check failed:", error);
                return false;
            }
        },

        async fetchUser() {
            try {
                const response = await api.get("/auth/me");
                this.user = response.data;
                console.log("User data fetched:", this.user);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                throw error;
            }
        },

        logout() {
            this.token = null;
            this.user = { id: null, username: "", email: "", role: "" };
            localStorage.removeItem("token");
            delete api.defaults.headers.common["Authorization"];
            router.push("/login");
        },
    }
});

