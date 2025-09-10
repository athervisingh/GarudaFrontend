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

// 🔹 Notification state
const notifications = ref<any[]>([]);
const unreadCount = ref(0);
const showDropdown = ref(false);
let eventSource: EventSource | null = null;

// 🔹 Profile dropdown state
const showProfileDropdown = ref(false);

// SSE connect
onMounted(() => {
  navSub = navigationService.currentView$.subscribe((view) => {
    canGoBack.value = navigationService.canGoBack();
    currentView.value = view;
  });
  
  const user = controller.getCurrentUser();
  if (user) {
    const userId = user.getUserID();
    eventSource = new EventSource(
      `http://localhost:3000/api/notifications/events/${userId}`
    );
    
    eventSource.onmessage = (event) => {
      if (!event.data) return;
      const data = JSON.parse(event.data);
      // Ignore keepalive
      if (data.type === "keepalive") return;
      notifications.value.push(data);
      unreadCount.value = notifications.value.length;
    };
    
    eventSource.onerror = (e) => {
      console.error("SSE error", e);
      eventSource?.close();
    };
  }
});

onBeforeUnmount(() => {
  navSub?.unsubscribe();
  eventSource?.close();
});

// 🔹 Mark as read API call
async function markAsRead(id: string) {
  const userId = controller.getCurrentUser()?.getUserID();
  if (!userId) return;
  
  try {
    await fetch("http://localhost:3000/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, notificationId: id }),
    });
    // Local remove
    notifications.value = notifications.value.filter((n) => n.id !== id);
    unreadCount.value = notifications.value.length;
  } catch (err) {
    console.error("Error marking as read", err);
  }
}

// 🔹 Profile dropdown functions
const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value;
};

const signOut = () => {
  // Set controller variables
  controller.logout();

  // Close dropdown
  showProfileDropdown.value = false;
  
  // Navigate to login
  navigationService.goTo("login");
};
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
      
      <!-- Notification Bell -->
      <div class="notification" @click="showDropdown = !showDropdown">
        <Bell class="icon" />
        <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
        <!-- Dropdown list -->
        <div v-if="showDropdown" class="dropdown">
          <div
            v-for="notif in notifications"
            :key="notif.id"
            class="notif-item"
            @click="markAsRead(notif.id)"
          >
            {{ notif.message }}
          </div>
          <div v-if="notifications.length === 0" class="empty">
            No notifications
          </div>
        </div>
      </div>
      
      <!-- User avatar -->
      <div class="user-profile" @click="toggleProfileDropdown">
        <img
          :src="controller.getUserProfilePicture()"
          :alt="controller.getUserName()"
          class="avatar"
        />
        <!-- Profile Dropdown -->
        <div v-if="showProfileDropdown" class="profile-dropdown">
          <div class="signout-item" @click="signOut">
            Sign Out
          </div>
        </div>
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
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
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

.dropdown {
  position: absolute;
  top: 2.5rem;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  width: 250px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 999;
}

.notif-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.notif-item:hover {
  background: #f9f9f9;
}

.empty {
  padding: 10px;
  text-align: center;
  color: #888;
}

/* Profile Dropdown Styles */
.profile-dropdown {
  position: absolute;
  top: 2.5rem;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  width: 120px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 999;
}

.signout-item {
  padding: 10px;
  cursor: pointer;
  text-align: center;
  font-size: 0.9rem;
  color: #dc2626;
  font-weight: 500;
}

.signout-item:hover {
  background: #f9f9f9;
}
</style>