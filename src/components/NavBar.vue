<template>
    <div class="card">
        <Menubar :model="items">
            <template #start>
                <svg width="50" height="50" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#3DB8A6"/>
                            <stop offset="100%" stop-color="#3C7DD9"/>
                        </linearGradient>
                    </defs>
                    <path d="M100 180L45 120C15 90 15 45 50 30C75 20 95 45 100 60C105 45 125 20 150 30C185 45 185 90 155 120L100 180Z" fill="url(#grad)"/>
                    <path d="M55 110H80L90 85L105 135L115 110H145" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </template>
            <template #end>
                <div class="flex items-center gap-2" style="position: relative;">
                    <InputText placeholder="Search" type="text" class="w-32 sm:w-auto" />
                    <Menu ref="profileMenuRef" :model="profileMenuItems" popup />
                    <Avatar
                        :style="{ width: '40px', height: '40px' }"
                        image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                        shape="circle"
                        style="cursor:pointer"
                        @click="onAvatarClick"
                    />
                </div>
            </template>
        </Menubar>
    </div>
</template>

<script setup>
import { useAuthStore } from "../stores/authStore";
import { ref } from "vue";
import { useRouter } from "vue-router";
import Menubar from "primevue/menubar";
import InputText from "primevue/inputtext";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";

const authStore = useAuthStore();
const { logout } = authStore;

const router = useRouter();

const items = ref([
    { label: 'Dashboard', icon: 'pi pi-chart-bar', command: () => router.push("/") },
    { label: 'Luzon', command: () => router.push('/luzon') },
    { label: 'Visayas', command: () => router.push('/visayas') },
    { label: 'Mindanao', command: () => router.push('/mindanao') },
    { label: 'Caregroups', command: () => router.push('/mindanao') },
]);

const profileMenuRef = ref();

const profileMenuItems = [
    {
        label: 'Amy Elsner',
        disabled: true,
        class: 'font-bold'
    },
    {
        separator: true
    },
    {
        label: 'Settings',
        icon: 'pi pi-cog'
    },
    {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
            logout();
        }
    }
];

function onAvatarClick(event) {
    profileMenuRef.value.toggle(event);
}


</script>

<style scoped>
.font-bold {
    font-weight: bold;
}
</style>
