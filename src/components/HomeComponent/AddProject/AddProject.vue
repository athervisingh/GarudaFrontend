<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1 class="header-title">Add Project</h1>
    </div>

    <!-- Body -->
    <div class="body">
      <!-- Steps Component (NO emit listeners now) -->
      <Steps :steps="steps" ref="stepsRef" />

      <!-- Submit Button -->
      <div class="submit-container">
        <button
          @click="handleSubmit"
          :disabled="!allStepsCompleted"
          :class="getSubmitButtonClass()"
          class="submit-button"
        >
          SUBMIT
        </button>
      </div>
    </div>

    <!-- Bottom spacing -->
    <div class="bottom-spacing"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { stepTrackerService } from "../../../services/stepTrackerService";
import navigationService from "../../../services/navigationService";
import Steps from "./Steps/Steps.vue";
import { projectListService } from "../../../services/ProjectListService";
// Component reference
const stepsRef = ref();

// Steps data
const steps = [
  { id: 0, title: "Project Basic Info", icon: "/images/info.png" },
  { id: 1, title: "Define AOI", icon: "/images/defineAoi.png" },
  { id: 2, title: "Configure AOI Watch", icon: "/images/config.png" },
  { id: 3, title: "Add Users", icon: "/images/User.png" },
];

// Computed properties
const allStepsCompleted = computed(() => {
  if (!stepsRef.value) return false;
  return steps.every((step) => stepsRef.value.isCompleted(step.id));
});

const getSubmitButtonClass = () => {
  return allStepsCompleted.value ? "enabled" : "disabled";
};

// Submit handler
const handleSubmit = () => {
  if (!allStepsCompleted.value) return;
  projectListService.addProjectToUserLists();
  stepTrackerService.resetSteps();
  navigationService.goTo("home");
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: 20px;
}

.header {
  background-color: #01b0ef;
  color: white;
  padding: 10px 24px;
  position: relative;
  top: 40px;
  width: 100vw;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 0;
}

.body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  width: 100vw;
}

.submit-container {
  padding-top: 32px;
  display: flex;
  justify-content: center;
}

.submit-button {
  padding: 12px 64px;
  border-radius: 50px;
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  transform: translateY(0);
  min-width: 160px;
  border: none;
  cursor: pointer;
  outline: none;
  user-select: none;
}

.submit-button:focus {
  outline: 2px solid #01b0ef;
  outline-offset: 2px;
}

.submit-button.enabled {
  background: linear-gradient(to bottom, #4ade80, #16a34a);
  color: white;
  cursor: pointer;
}

.submit-button.enabled:hover {
  background: linear-gradient(to bottom, #22c55e, #15803d);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

.submit-button.enabled:active {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: scale(0.95);
}

.submit-button.disabled {
  background-color: #d1d5db;
  color: #6b7280;
  cursor: not-allowed;
}

.bottom-spacing {
  height: 32px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .header {
    padding: 12px 16px;
  }

  .header-title {
    font-size: 20px;
  }

  .body {
    padding: 24px 16px;
  }

  .submit-container {
    padding-top: 24px;
  }

  .submit-button {
    padding: 10px 40px;
    font-size: 14px;
    min-width: 140px;
  }

  .bottom-spacing {
    height: 24px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 10px 12px;
  }

  .header-title {
    font-size: 18px;
  }

  .body {
    padding: 16px 12px;
  }

  .submit-container {
    padding-top: 16px;
  }

  .submit-button {
    padding: 8px 32px;
    font-size: 12px;
    min-width: 120px;
  }

  .bottom-spacing {
    height: 16px;
  }
}

@media (min-width: 1024px) {
  .header {
    padding: 10px 12px;
    top: 40px;
  }

  .header-title {
    font-size: 28px;
  }

  .body {
    padding: 48px;
  }

  .submit-container {
    padding-top: 48px;
  }

  .submit-button {
    padding: 16px 80px;
    font-size: 18px;
    min-width: 200px;
  }

  .bottom-spacing {
    height: 48px;
  }
}
</style>
