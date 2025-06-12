import { createRouter, createWebHistory } from "vue-router";
import HomeComponent from "../route/HomeComponent.vue";
import AddProject from "../route/AddProject.vue";
import DefineAOIMap from "../route/DefineAOIMap.vue"; // Assuming this is the correct import path

const routes = [
  { path: "/", name: "Home", component: HomeComponent },
  { path: "/add-project", name: "AddProject", component: AddProject },
  { path: "/define-aoi-map", name: "DefineAOIMap", component: DefineAOIMap },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
