<template>
  <div class="w-full flex justify-between items-center z-10 transition-all duration-700" :class="{ 'opacity-0': showSplash }">
    <img src="/images/logo.png" alt="Garuda Logo" class="h-10 sm:h-12" />

    <div class="flex items-center space-x-4">
      <!-- Notification Icon -->
      <div class="relative cursor-pointer hover:scale-105 transition-transform">
        <Bell class="h-7 w-7 text-black" />
        <span class="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5">23</span>
      </div>

      <!-- Profile Icon -->
      <div class="cursor-pointer hover:ring-2 ring-blue-400 rounded-full transition-shadow">
        <img
          src="/images/profile.jpg"
          alt="Profile"
          class="h-10 w-10 rounded-full border-2 border-white shadow-lg object-cover"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bell } from 'lucide-vue-next'
defineProps<{
  showSplash: boolean
}>()
</script>
