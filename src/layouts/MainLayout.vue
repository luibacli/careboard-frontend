<template>
  <div class="flex flex-col min-h-screen bg-gray-100">

    <!-- Global NavBar -->
    <NavBar />

    <!-- Page Content -->
    <main class="flex-1 p-4">
      <slot />
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'


</script>



<!-- <template>
  <div class="flex min-h-screen">
    <main class="flex-1 p-4 bg-gray-100">
    <NavBar />
      <slot />
        <router-view />
    </main>

  </div>
</template>
<script setup>
import NavBar from '../components/NavBar.vue';
</script> -->