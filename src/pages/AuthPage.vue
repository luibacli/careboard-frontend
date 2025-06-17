<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form class="bg-white p-6 rounded shadow-md w-full max-w-sm">
      <h2 class="text-xl font-bold mb-4">Login</h2>
      <div class="mb-4">
        <label class="block mb-1 text-gray-700">Email</label>
        <input type="email" class="w-full px-3 py-2 border rounded" v-model="loginForm.email" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 text-gray-700">Password</label>
        <input type="password" class="w-full px-3 py-2 border rounded" v-model="loginForm.password" />
      </div>
      <button
        type="submit"
        @click.prevent="login"
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Log In
      </button>
    </form>
  </div>
</template>

<script setup>
import {useAuthStore} from "../stores/authStore";
import {storeToRefs} from 'pinia';
const authStore = useAuthStore();
const {loginForm} = storeToRefs(authStore);
const {login} = authStore;




</script>
