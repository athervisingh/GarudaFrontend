<template>
  <footer
    class="bottom-0 h-8 text-sm text-white fixed text-center content-center font-extrabold w-full z-10 transition-all duration-700"
    :style="{ backgroundColor: footerColor }"
  >
    © Copyright {{ year }} VEDAS, SAC, ISRO
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import controller from '../classes/Controller'
import navigationService from '../services/navigationService'
import type { ViewKey } from '../services/navigationService'
import { Subscription } from 'rxjs'

const year = controller.getCurrentYear()
const footerColor = ref('#01b0ef') // default color

// 🔵 Define colors for each view
const viewColorMap: Record<ViewKey, string> = {
  home: '#01b0ef',
  'add-project': '#01b0ef',
  'manage-projects': '#c2410c',
  'monitor-projects': '#c09201',
  'project-basic-info-popup': '#01b0ef',
  'define-aoi-map': '#01b0ef',
  'add-users': '#01b0ef'
}

let subscription: Subscription

onMounted(() => {
  // 🔄 Subscribe to view changes
  subscription = navigationService.currentView$.subscribe((view) => {
    footerColor.value = viewColorMap[view] || '#01b0ef'
  })
})

onUnmounted(() => {
  // 🧹 Cleanup
  subscription?.unsubscribe()
})
</script>
