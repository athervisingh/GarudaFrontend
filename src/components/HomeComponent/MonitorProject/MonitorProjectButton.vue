<template>
  <div class="button-wrapper">
    <button class="btn" @click="handleClick">
      <div class="icon-box">
        <img src="/images/eye_monitoring.png" class="icon" alt="Monitoring Icon" />
      </div>
      <span class="label">Monitor Project</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import navigationService from "../../../services/navigationService"

function handleClick() {
  navigationService.goTo("monitor-projects")
}
</script>

<style scoped>
.button-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 12px 0;
}

/* 🟦 Button Style */
.btn {
  width: 50%;
  max-width: 240px;
  padding: 10px 14px;
  background-color: #cc9e09;
  color: white;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, background-color 0.2s ease;
  min-height: 44px;
  cursor: pointer;
}
.btn:hover {
  background-color: #bd9207;
  transform: scale(1.05);
}

.icon-box {
  width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.label {
  flex: 1;
  text-align: left;
}

/* 📱 Responsive (optional tweak for very small screens) */
@media (max-width: 360px) {
  .btn {
    font-size: 12px;
    padding: 8px 12px;
    gap: 8px;
  }

  .icon-box {
    width: 20px;
    height: 20px;
  }
}
</style>
