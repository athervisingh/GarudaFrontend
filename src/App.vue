<template>
  <div>
    <!-- 🔵 Splash -->
    <SplashScreen v-if="showSplash" @finish="showSplash = false" />

    <!-- 🔝 Header -->
    <HeaderComponent
      v-if="
        !showSplash &&
        controller.isUserLoggedIn() &&
        navigationService.getCurrentView() !== 'login'
      "
      :user="controller.getCurrentUser()"
      :showSplash="showSplash"
    />
    <!-- 🔁 Main Content -->
    <main>
      <component :is="currentViewComponent" />
    </main>

    <!-- 🔻 Footer -->
    <FooterComponent
      v-if="!showSplash && navigationService.getCurrentView() !== 'login'"
      :year="controller.getCurrentYear()"
      :showSplash="showSplash"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Subscription } from "rxjs";
import controller from "./classes/Controller";
import SplashScreen from "./components/SplashScreen/SplashScreen.vue";

// 🔧 Layout
import HeaderComponent from "./components/HeaderComponent/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent/FooterComponent.vue";

// 🔧 View Components
import HomeComponent from "./components/HomeComponent/HomeComponent.vue";
import AddProject from "./components/HomeComponent/AddProject/AddProject.vue";
import ManageProjects from "./components/HomeComponent/ManageProject/ManageProject.vue";
import MonitorProjects from "./components/HomeComponent/MonitorProject/MonitorProject.vue";
import ProjectBasicInfoPopup from "./components/HomeComponent/AddProject/Steps/Step1/ProjectBasicInfoPopup.vue";
import DefineAOIMap from "./components/HomeComponent/AddProject/Steps/Step2/DefineAOIMap.vue";
import AddUser from "./components/HomeComponent/AddProject/Steps/Step4/AddUser.vue";
import Login from "./components/Login/Login.vue";

// 📡 Navigation service
import navigationService from "./services/navigationService";
import type { ViewKey } from "./services/navigationService";

const viewMap: Record<ViewKey, any> = {
  login: Login,
  home: HomeComponent,
  "add-project": AddProject,
  "manage-projects": ManageProjects,
  "monitor-projects": MonitorProjects,
  "project-basic-info-popup": ProjectBasicInfoPopup,
  "define-aoi-map": DefineAOIMap,
  "add-users": AddUser,
};

const showSplash = ref(true);
const currentViewComponent = ref(viewMap["login"]);

let navSub: Subscription;

onMounted(() => {
  navSub = navigationService.currentView$.subscribe((view) => {
    currentViewComponent.value = viewMap[view] || HomeComponent;
  });
});

onBeforeUnmount(() => {
  navSub?.unsubscribe();
});
</script>

<style scoped>
/* App.vue me ab koi splash-related style ki jarurat nahi */
</style>
