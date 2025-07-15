<template>
  <div class="home-wrapper">
    <div class="home-button-group">
      <AddProject />
      <ManageProject />
      <MonitorProject />  
    </div>
  </div>
</template>

<script setup>
import AddProject from "../../components/HomeComponent/AddProject/AddProjectButton.vue"
import ManageProject from "../../components/HomeComponent/ManageProject/ManageProjectButton.vue"
import MonitorProject from "../../components/HomeComponent/MonitorProject/MonitorProjectButton.vue";
</script>

<style scoped>
/* ✅ Outer wrapper to center everything */
.home-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* full screen height */
  background-color: #ffffff;
}

/* ✅ Vertical button group */
.home-button-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 400px;
  padding: 16px;
}
</style>
