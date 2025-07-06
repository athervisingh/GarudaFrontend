// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import HomeComponent from '../route/HomeComponent.vue';
import AddProject from '../route/AddProject.vue';
import DefineAOIMap from '../route/DefineAOIMap.vue';
import AddUser from '../components/steps/AddUser.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeComponent },
  { path: '/add-project', name: 'AddProject', component: AddProject },
  { path: '/define-aoi-map', name: 'DefineAOIMap', component: DefineAOIMap },
  { path: '/add-users', name: 'AddUser', component: AddUser }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
