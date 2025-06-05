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
          class="h-40 w-40 animate-spin-slow rounded-full ring-4 ring-blue-500 ring-offset-2 ring-offset-white shadow-xl"
        />
      </div>
    </transition>

    <!-- Header -->
    <HeaderComponent :showSplash="showSplash" />

    <!-- Buttons -->
    <div
      class="flex flex-col items-center justify-center flex-1 w-full max-w-xs space-y-5 z-10 transition-all duration-700"
      :class="{ 'opacity-0': showSplash }"
    >
      <button
        @click="goToAddProject"
        class="w-full py-3 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-transform duration-300 shadow-md hover:scale-105 bg-blue-500 text-white hover:bg-blue-600"
      >
        <Plus class="h-5 w-5" />
        <span>Add Project</span>
      </button>

      <button
        @click="goToManageProjects"
        class="w-full py-3 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-transform duration-300 shadow-md hover:scale-105 bg-orange-600 text-white hover:bg-orange-700"
      >
        <UserCog class="h-5 w-5" />
        <span>Manage Projects</span>
      </button>

      <button
        class="w-full py-3 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-transform duration-300 shadow-md hover:scale-105 bg-yellow-500 text-white hover:bg-yellow-600"
      >
        <Eye class="h-5 w-5" />
        <span>Monitor Projects</span>
      </button>
    </div>

    <!-- Footer -->
    <FooterComponent :showSplash="showSplash" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Bell, Plus, UserCog, Eye } from "lucide-vue-next";
import FooterComponent from "./FooterComponent.vue";
import HeaderComponent from "./HeaderComponent.vue";
import { useRouter } from "vue-router";
import { TempStore } from "../utils/TempStore";

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
  TempStore.createNewProject("u1");
  router.push("/add-project");
}

function goToManageProjects() {
  router.push('/manage-projects')
}

</script>

<!-- ✅ Remove scoped -->
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

/* Button styles are now applied directly in the template using Tailwind utility classes. */
</style>
