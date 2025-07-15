<template>
  <footer
    class="footer-bar"
    :style="{ backgroundColor: footerColor }"
  >
    © Copyright {{ year }} VEDAS, SAC, ISRO
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import controller from '../../classes/Controller'
import navigationService from '../../services/navigationService'
import type { ViewKey } from '../../services/navigationService'
import { Subscription } from 'rxjs'

const year = controller.getCurrentYear()
const footerColor = ref('#01b0ef') // default

const viewColorMap: Record<ViewKey, string> = {
  home: '#01b0ef',
  'add-project': '#01b0ef',
  'manage-projects': '#f0792a',
  'monitor-projects': '#c09201',
  'project-basic-info-popup': '#01b0ef',
  'define-aoi-map': '#01b0ef',
  'add-users': '#01b0ef'
}

let subscription: Subscription

onMounted(() => {
  subscription = navigationService.currentView$.subscribe((view) => {
    footerColor.value = viewColorMap[view] || '#01b0ef'
  })
})

onUnmounted(() => {
  subscription?.unsubscribe()
})
</script>

<style scoped>
.footer-bar {
  position: fixed;
  bottom: 0;
  height: 2rem; /* h-8 */
  width: 100%;
  color: white;
  font-size: 0.875rem; /* text-sm */
  font-weight: 800; /* font-extrabold */
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.7s ease;
}
</style>
