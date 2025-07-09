<template>
  <div>
    <!-- 🔵 Splash -->
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

    <!-- 🔝 Header -->
    <HeaderComponent
      v-if="!showSplash && controller.isUserLoggedIn()"
      :user="controller.getCurrentUser()"
      :showSplash="showSplash"
    />

    <!-- 🔁 Main Content (Dynamic View) -->
    <main>
      <component :is="currentViewComponent" />
    </main>

    <!-- 🔻 Footer -->
    <FooterComponent
      v-if="!showSplash"
      :year="controller.getCurrentYear()"
      :showSplash="showSplash"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted ,onBeforeUnmount} from 'vue'
import { Subscription } from 'rxjs'
import controller from './classes/Controller'

// 🔧 Layout
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'

// 🔧 View Components
import HomeComponent from './components/HomeComponent.vue'
import AddProject from './components/AddProject/AddProject.vue'
import ManageProjects from './components/ManageProject/ManageProject.vue'
import MonitorProjects from './components/MonitorProject/MonitorProject.vue'
import ProjectBasicInfoPopup from './components/AddProject/steps/ProjectBasicInfoPopup.vue'
import DefineAOIMap from './components/AddProject/steps/DefineAOI/DefineAOIMap.vue'
import AddUser from './components/AddProject/steps/AddUser.vue'
// 📡 Navigation service
import navigationService from './services/navigationService'
import type { ViewKey } from './services/navigationService' // ✅ correct path

// 🔁 View mapping

const viewMap: Record<ViewKey, any> = {
  home: HomeComponent,
  'add-project': AddProject,
  'manage-projects': ManageProjects,
  'monitor-projects': MonitorProjects,
  'project-basic-info-popup': ProjectBasicInfoPopup,
  'define-aoi-map': DefineAOIMap,
  'add-users': AddUser,
}

const showSplash = ref(true)
const currentViewComponent = ref(viewMap['home'])

let navSub: Subscription


onMounted(() => {
  navSub = navigationService.currentView$.subscribe(view => {
    currentViewComponent.value = viewMap[view] || HomeComponent
  })

  setTimeout(() => {
    showSplash.value = false
    if (controller.isUserLoggedIn()) {
      navigationService.goTo('home')
    }
  }, 2500)
})

onBeforeUnmount(() => {
  navSub?.unsubscribe() // ✅ Clean up
})

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
