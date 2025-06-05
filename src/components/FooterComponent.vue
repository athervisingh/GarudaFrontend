<template>
      <footer class=" bottom-0 h-8  text-sm text-white fixed  bg-blue-400 text-center content-center font-extrabold w-full z-10 transition-all duration-700" :class="{ 'opacity-0': showSplash }">
      © Copyright 2024 VEDAS, SAC, ISRO
    </footer>
</template>
<script setup lang="ts">
defineProps<{
  showSplash: boolean
}>()
</script>