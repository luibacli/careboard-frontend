<!-- setup sidebar should be set at the left side -->
<template>
  <div class="w-64 bg-white shadow-md h-screen">
    <div class="p-4">
      <h1 class="text-xl font-bold">CareBoard</h1>
    </div>
    <nav class="mt-4">
      <ul>
        <li class="p-2 hover:bg-gray-200">
          <router-link to="/home">Home</router-link>
        </li>
        <li class="p-2 hover:bg-gray-200">
          <router-link to="/about">About</router-link>
        </li>
        <li class="p-2 hover:bg-gray-200">
          <router-link to="/contact">Contact</router-link>
        </li>
      </ul>
    </nav>
   <!-- button for logout -->
    <div class="p-4">
      <button @click="logout" class="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { onMounted } from 'vue';
const authStore = useAuthStore();
const {logout} = authStore;
onMounted(() => {
  // Check if the user is authenticated
  if (!authStore.isAuthenticated) {
    // Redirect to login or handle unauthenticated state
    console.log('User is not authenticated');
  }
});

</script>