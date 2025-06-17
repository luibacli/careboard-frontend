<!-- setup layout and import sidebar -->
<template>
  <div class="flex h-screen">
    <SideBar />
    <main class="flex-1 p-4 bg-gray-100">
      <slot />
        <router-view />
    </main>
  
  </div>
</template>
<script setup>
import SideBar from './SideBar.vue';
</script>