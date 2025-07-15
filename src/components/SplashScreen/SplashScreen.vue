<template>
  <transition name="fade-slide" appear>
    <div v-if="visible" class="splash-screen">
      <img
        src="/images/logo.png"
        alt="Garuda Logo"
        class="animate-spin-slow logo-style"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import controller from '../../classes/Controller'
import navigationService from '../../services/navigationService'

const visible = ref(true)
const emit = defineEmits<{
  (e: 'finish'): void
}>()

onMounted(() => {
  setTimeout(() => {
    visible.value = false
    if (controller.isUserLoggedIn()) {
      navigationService.goTo('home')
    }
    emit('finish') // 🔔 Tell parent that splash is done
  }, 2500)
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
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

.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

.logo-style {
  height: 8rem;
  width: 8rem;
  border-radius: 9999px;
  border: 4px solid #3b82f6;
  padding: 2px;
  background: white;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

@media (min-width: 640px) {
  .logo-style {
    height: 10rem;
    width: 10rem;
  }
}
</style>
