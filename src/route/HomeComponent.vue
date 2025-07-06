<template>
  <div
    class="min-h-screen bg-white flex flex-col items-center justify-start p-4 space-y-6 relative overflow-hidden"
  >
    <!-- Splash Logo -->
    <transition name="fade-slide" appear>
      <div
        v-if="showSplash"
        class="fixed inset-0 z-50 flex items-center justify-center bg-white"
      >
        <img
          src="/images/logo.png"
          alt="Garuda Logo"
          class="h-32 w-32 sm:h-40 sm:w-40 animate-spin-slow rounded-full ring-4 ring-blue-500 ring-offset-2 ring-offset-white shadow-xl"
        />
      </div>
    </transition>

    <!-- Main Content Container -->
    <div
      class="flex flex-col items-center justify-center flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg space-y-4 sm:space-y-5 z-10 transition-all duration-700 px-2 sm:px-4"
      :class="{ 'opacity-0': showSplash }"
    >
      <!-- Add Project Button -->
      <button
        @click="goToAddProject"
        class="w-full py-3 sm:py-4 px-3 sm:px-4 rounded-xl font-semibold flex items-center justify-start gap-3 sm:gap-4 transition-all duration-300 shadow-md hover:scale-105 active:scale-95 bg-blue-500 text-white hover:bg-blue-600 text-sm sm:text-base min-h-[48px] sm:min-h-[56px]"
      >
        <div class="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
          <img
            src="/images/plus_AddProject.png"
            class="w-full h-full object-contain"
            alt="Add Icon"
          />
        </div>
        <span class="flex-1 text-left">Add Project</span>
      </button>

      <!-- Manage Projects Button -->
      <button
        @click="goToManageProjects"
        class="w-full py-3 sm:py-4 px-3 sm:px-4 rounded-xl font-semibold flex items-center justify-start gap-3 sm:gap-4 transition-all duration-300 shadow-md hover:scale-105 active:scale-95 bg-orange-600 text-white hover:bg-orange-700 text-sm sm:text-base min-h-[48px] sm:min-h-[56px]"
      >
        <div class="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
          <img
            src="/images/project_management.png"
            class="w-full h-full object-contain"
            alt="Manage Icon"
          />
        </div>
        <span class="flex-1 text-left">Manage Projects</span>
      </button>

      <!-- Monitor Projects Button -->
      <button
        class="w-full py-3 sm:py-4 px-3 sm:px-4 rounded-xl font-semibold flex items-center justify-start gap-3 sm:gap-4 transition-all duration-300 shadow-md hover:scale-105 active:scale-95 bg-yellow-500 text-white hover:bg-yellow-600 text-sm sm:text-base min-h-[48px] sm:min-h-[56px]"
      >
        <div class="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
          <img
            src="/images/eye_monitoring.png"
            class="w-full h-full object-contain"
            alt="Monitor Icon"
          />
        </div>
        <span class="flex-1 text-left">Monitor Projects</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import controller from '../classes/Controller';
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";


const router = useRouter();
const showSplash = ref(true);

onMounted(() => {
  const isFirstVisit = !localStorage.getItem("visitedGaruda");
  if (isFirstVisit) {
    localStorage.setItem("visitedGaruda", "true");
    setTimeout(() => {
      showSplash.value = false;
    }, 2500);
  } else {
    showSplash.value = false;
  }
});

function goToAddProject() {
  controller.initializeProject(); // ✅ call the method
  router.push("/add-project");
}

function goToManageProjects() {
  router.push("/manage-projects");
}
</script>

<style>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 2.5s linear;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.8s, transform 0.8s;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: scale(1.2);
}

@media (max-width: 640px) {
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: opacity 0.6s, transform 0.6s;
  }
}
</style>
