import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from '../components/HomeComponent.vue'
import AddProjectComponent from '../components/AddProjectComponent.vue'


const routes = [
  { path: '/', name: 'Home', component: HomeComponent },
  { path: '/add-project', name: 'AddProjectComponent', component: AddProjectComponent },


]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
