<script setup lang="ts">
import { ArrowLeft, Bell } from "lucide-vue-next";
import { ref, onMounted, onBeforeUnmount } from "vue";
import navigationService from "../../services/navigationService";
import controller from "../../classes/Controller";
import { Subscription } from "rxjs";

const canGoBack = ref(navigationService.canGoBack());
const currentView = ref(navigationService.getCurrentView());
let navSub: Subscription;

const goBack = () => {
  navigationService.goBack();
};

onMounted(() => {
  navSub = navigationService.currentView$.subscribe((view) => {
    canGoBack.value = navigationService.canGoBack();
    currentView.value = view;
  });
});

onBeforeUnmount(() => {
  navSub?.unsubscribe();
});
</script>

<template>
  <div class="header-bar">
    <!-- Left: Logo -->
    <div class="header-left">
      <img src="/images/logo.png" alt="Garuda Logo" class="logo" />
    </div>
    <!-- Right: Back, Notification, Avatar -->
    <div class="header-right">
      <button
        v-if="canGoBack && currentView !== 'home'"
        @click="goBack"
        class="back-button"
      >
        <ArrowLeft class="icon" />
      </button>
      <div class="notification">
        <Bell class="icon" />
        <span class="badge">23</span>
      </div>
      <div class="user-profile">
        <img
          :src="controller.getUserProfilePicture()"
          :alt="controller.getUserName()"
          class="avatar"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 0;
  z-index: 100000;
  background-color: white;
  padding: 0.5rem 1rem;
  transition: all 0.7s ease;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  height: 2.25rem;
}

@media (min-width: 640px) {
  .logo {
    height: 2.75rem;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.back-button {
  padding: 0.4rem;
  border-radius: 9999px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: #f3f4f6;
  transform: scale(1.05);
}

.notification {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.notification:hover {
  transform: scale(1.05);
}

.badge {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: #dc2626;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 9999px;
  padding: 0 0.375rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 9999px;
  border: 2px solid white;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  object-fit: cover;
  transition: all 0.2s ease;
}

.avatar:hover {
  outline: 2px solid #3b82f6;
}

.icon {
  height: 1.75rem;
  width: 1.75rem;
  color: black;
}
</style>