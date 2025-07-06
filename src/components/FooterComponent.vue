<template>
  <footer
    class="bottom-0 h-8 text-sm text-white fixed bg-[#01b0ef] text-center content-center font-extrabold w-full z-10 transition-all duration-700"
    :class="{ 'opacity-0': false }"
  >
    © Copyright {{ year }} VEDAS, SAC, ISRO
  </footer>
</template>

<script setup lang="ts">
import controller from '../classes/Controller' // ✅ controller import

const year = controller.getCurrentYear(); // ✅ get year directly
</script>
