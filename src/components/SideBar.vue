<!-- setup sidebar should be set at the left side -->
<template>
  <div class="w-64 bg-white shadow-md h-screen">
    <div class="p-4">
      <h1 class="text-xl font-bold">CareBoard</h1>
    </div>
    <nav class="mt-4">
      <ul>
        <li class="p-2 hover:bg-gray-200">
          <router-link to="/">Home</router-link>
        </li>
        <li class="p-2 hover:bg-gray-200">
          <router-link to="/about">About</router-link>
        </li>
        <li class="p-2 hover:bg-gray-200">
          <router-link to="/contact">Contact</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>