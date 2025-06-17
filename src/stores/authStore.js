import { defineStore } from "pinia";
import router from "../router";
import api from "../lib/axios";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        loginForm: {
          email: "",
          password: "", 
        },
        user: null,
        token: null,
    }),  
    actions: {
        async login() {
            try {
                const response = await api.post("/auth/login", this.loginForm);
                this.user = response.data.user;
                this.token = response.data.token;
                localStorage.setItem("token", this.token);
                console.log("Login successful:", this.use,);
                // Login successful, user data is set
                router.push("/");
            } catch (error) {
                console.error("Login failed:", error);
            }
        },
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem("token");
            router.push("/login");
        },
        async fetchUser() {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const response = await api.get("/auth/user", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    this.user = response.data;
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        }
    }
});

