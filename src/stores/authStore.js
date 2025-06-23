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
                await this.fetchUser();
                console.log("Login Successfule", this.user) // Fetch user data after login
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
                return true;
            } catch (error) {
                console.error("Authentication check failed:", error);
                return false;
            }
        },

            async fetchUser() {
                try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token found");
                const response = await api.get("/auth/me", {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                });
                this.user = response.data;
                } catch (error) {
                console.error("Failed to fetch user data:", error);
                throw error;
                }
            },
          

        logout() {
            this.token = null;
            this.user = { id: null, username: "", email: "", role: "" };
            localStorage.removeItem("token");
            router.push("/login");
        },
    }
});

