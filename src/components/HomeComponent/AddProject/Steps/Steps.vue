<template>
  <div class="steps-container">
    <div v-for="step in steps" :key="step.id" class="step-item">
      <button
        @click="handleStepClick(step.id)"
        :disabled="isDisabled(step.id)"
        :class="getButtonClass(step.id)"
        class="step-button"
      >
        <!-- Always show icon -->
        <div class="icon-container">
          <img
            :src="step.icon"
            :alt="`${step.title} Icon`"
            class="step-icon"
          />
        </div>

        <!-- Title -->
        <span class="step-title">{{ step.title }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { stepTrackerService } from "../../../../services/stepTrackerService";
import { Subscription } from "rxjs";
import controller from "../../../../classes/Controller";
import navigationService from "../../../../services/navigationService";

// Props
interface Props {
  steps: Array<{
    id: number;
    title: string;
    icon: string;
  }>;
}

defineProps<Props>();

// Reactive
const completedSteps = ref(new Set<number>());
let subscription: Subscription;

// Lifecycle
onMounted(() => {
  subscription = stepTrackerService.step$.subscribe((val) => {
    completedSteps.value = val;
  });
});

onBeforeUnmount(() => {
  subscription?.unsubscribe();
});

// Methods
const isCompleted = (stepId: number) => completedSteps.value.has(stepId);

const isDisabled = (stepId: number) => {
  if (isCompleted(stepId)) return true;
  return stepId > 0 && !isCompleted(stepId - 1);
};

const handleStepClick = (stepId: number) => {
  if (isDisabled(stepId)) return;

  switch (stepId) {
    case 0:
      navigationService.goTo("project-basic-info-popup");
      break;
    case 1:
      navigationService.goTo("define-aoi-map");
      break;
    case 2:
      controller.buildFinalProject();
      stepTrackerService.completeStep(2);
      break;
    case 3:
      navigationService.goTo("add-users");
      break;
  }
};

const getButtonClass = (id: number) => {
  const completed = isCompleted(id);
  const disabled = isDisabled(id);

  if (completed) return 'completed';
  if (disabled) return 'disabled';
  return 'active';
};

// Expose (if needed by parent)
defineExpose({
  isCompleted,
  isDisabled,
  completedSteps
});
</script>

<style scoped>
.steps-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.step-item {
  margin-bottom: 16px;
}

.step-button {
  width: 100%;
  padding: 16px 24px;
  border-radius: 16px;
  border: 2px solid;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  outline: none;
  user-select: none;
}

.step-button:focus {
  outline: 2px solid #01b0ef;
  outline-offset: 2px;
}

.step-button.completed {
  background-color: #22c55e;
  color: white;
  border-color: #16a34a;
  cursor: not-allowed;
}

.step-button.disabled {
  background-color: #e5e7eb;
  color: #6b7280;
  cursor: not-allowed;
  border-color: #d1d5db;
}

.step-button.active {
  background-color: white;
  color: #1f2937;
  border-color: #e5e7eb;
}

.step-button.active:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transform: scale(1.02);
}

.step-button.active:active {
  transform: scale(0.98);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.icon-container {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.step-title {
  flex: 1;
  text-align: left;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
}
</style>
