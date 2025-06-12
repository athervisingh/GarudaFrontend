<template>
  <div>
    <HeaderComponent />
    
    <main>
      <router-view />
    </main>
    
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'

export default {
  components: {
    HeaderComponent,
    FooterComponent
  }
}
</script>

<style>
/* Optional: Global styles */
</style>
