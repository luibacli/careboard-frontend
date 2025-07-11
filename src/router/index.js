import { createRouter, createWebHistory } from "vue-router";
import Layout from "../components/Layout.vue";
import HomePage from "../pages/HomePage.vue";
import AuthPage from "../pages/AuthPage.vue";
import AboutPage from "../pages/AboutPage.vue";
import MainLayout from "../layouts/MainLayout.vue";
import ReportsPage from "../pages/ReportsPage.vue";
import CareGroups from "../pages/CareGroups.vue";
import OnboardedPage from "../pages/OnboardedPage.vue";
import EncountersPage from "../pages/EncountersPage.vue";
import ClientPage from "../pages/ClientPage.vue";

const routes = [
    {
        path: "/",
        component: MainLayout,
        children: [
            {
                path: "/",
                name: "Home",
                component: HomePage
            },
            {
                path: "reports/:name",
                name: "Reports",
                component: ReportsPage
            },
            {
                path: "caregroups",
                name: "CareGroups",
                component: CareGroups
            },
            {
                path: "caregroups/:id",
                name: "Client",
                component: ClientPage,
                props: true,
            },
            {
                path: "encounters",
                name: "Encounters",
                component: EncountersPage
            },
            {
                path: "onboarded",
                name: "onboarded",
                component: OnboardedPage
            },

              
             {
                path: "about",
                name: "About",
                component: AboutPage
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

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem("token") !== null;

    if (to.name !== "Login" && !isAuthenticated) {
        next({ name: "Login" });
        console.log("Redirecting to login page you must log in first");
    } else {
        next();
    }
});

export default router;