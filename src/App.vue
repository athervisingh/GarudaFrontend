<template>
  <div>
    <!-- Splash -->
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

    <!-- Main Layout -->
    <HeaderComponent
      v-if="!showSplash && controller.isUserLoggedIn()"
      :user="controller.getCurrentUser()"
      :showSplash="showSplash"
    />

    <main>
      <router-view />
    </main>

    <FooterComponent
      v-if="!showSplash"
      :year="controller.getCurrentYear()"
      :showSplash="showSplash"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import controller from './classes/Controller';
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';

const showSplash = ref(true);
const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    showSplash.value = false;

    if (controller.isUserLoggedIn()) {
      router.push('/'); // 🔁 Redirect to Home
    }
  }, 2500);
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.8s, transform 0.8s;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: scale(1.2);
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>
