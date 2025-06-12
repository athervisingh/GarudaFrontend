<template>
 <div class="w-full flex justify-between items-center transition-all duration-700 absolute z-[100000] bg-white " :class="{ 'opacity-0': showSplash }">
  <div class="flex items-center ml-5">
    <!-- Back Button -->
    <button 
      @click="goBack"
      class="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 hover:scale-105"
      aria-label="Go back"
    >
      <ArrowLeft class="h-6 w-6 text-black" />
    </button>
    
    <!-- Logo -->
    <img src="/images/logo.png" alt="Garuda Logo" class="h-10 sm:h-12" />
  </div>

  <div class="flex items-center space-x-4 mr-5 mt-1">
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
import { Bell, ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

defineProps<{
  showSplash: boolean
}>()

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>