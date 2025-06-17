import { createRouter, createWebHistory } from "vue-router";
import Layout from "../components/Layout.vue";
import HomePage from "../pages/HomePage.vue";
import AuthPage from "../pages/AuthPage.vue";

const routes = [
    {
        path: "/",
        component: Layout,
        children: [
            {
                path: "",
                name: "Home",
                component: HomePage
            }
        ]
    },
    {
        path: "/login",
        name: "Login",
        component: AuthPage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;