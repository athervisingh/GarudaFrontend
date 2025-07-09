<template>
  <div class="min-h-screen bg-gray-50 flex flex-col relative">
    <!-- Header -->
    <div class="bg-[#01b0ef] text-white py-3 sm:py-4 px-4 sm:px-6 shadow-lg relative top-10">
      <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-center">Add Project</h1>
    </div>

    <!-- Body -->
    <div class="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <!-- Stepper Buttons -->
      <div class="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl space-y-3 sm:space-y-4">
        <div v-for="step in steps" :key="step.id" class="relative">
          <button
            @click="handleStepClick(step.id)"
            :disabled="isDisabled(step.id)"
            :class="buttonClass(step.id)"
          >
            <!-- Icon Container -->
            <div class="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center">
              <svg
                v-if="isCompleted(step.id)"
                class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <img
                v-else
                :src="step.icon"
                :alt="`${step.title} Icon`"
                class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 object-contain"
              />
            </div>
            
            <!-- Title -->
            <span class="flex-1 text-left text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-tight">
              {{ step.title }}
            </span>
            
            <!-- Badge -->
            <div :class="badgeClass(step.id)">
              {{ isCompleted(step.id) ? "✓" : "" }}
            </div>
          </button>
        </div>

        <!-- Submit Button -->
        <div class="pt-4 sm:pt-6 md:pt-8 flex justify-center">
          <button
            @click="handleSubmit"
            :disabled="!allStepsCompleted"
            :class="submitButtonClass"
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom spacing for mobile -->
    <div class="h-4 sm:h-6 md:h-8"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { stepTrackerService } from "../../services/stepTrackerService";
import { Subscription } from "rxjs";
import controller from "../../classes/Controller";
import navigationService from "../../services/navigationService";

const completedSteps = ref(new Set<number>());
let subscription: Subscription;

const steps = [
  { id: 0, title: "Project Basic Info", icon: "/images/info.png" },
  { id: 1, title: "Define AOI", icon: "/images/defineAoi.png" },
  { id: 2, title: "Configure AOI Watch", icon: "/images/config.png" },
  { id: 3, title: "Add Users", icon: "/images/User.png" },
];

onMounted(() => {
  subscription = stepTrackerService.step$.subscribe((val) => {
    completedSteps.value = val;
  });
});

onBeforeUnmount(() => {
  subscription?.unsubscribe();
});

const isCompleted = (stepId: number) => completedSteps.value.has(stepId);

const isDisabled = (stepId: number) => {
  if (isCompleted(stepId)) return true;
  return stepId > 0 && !isCompleted(stepId - 1);
};

const allStepsCompleted = computed(() => {
  return steps.every((step) => isCompleted(step.id));
});

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

const handleSubmit = () => {
  stepTrackerService.resetSteps(); 
  navigationService.goTo("home"); 
};

const buttonClass = (id: number) => {
  const completed = isCompleted(id);
  const disabled = isDisabled(id);

  return [
    "w-full py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-8 rounded-xl sm:rounded-2xl border font-semibold flex items-center gap-3 sm:gap-4 md:gap-5 transition-all duration-300 shadow-md transform",
    completed
      ? "bg-green-500 text-white border-green-600 cursor-not-allowed"
      : disabled
      ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
      : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:border-gray-300 hover:shadow-lg active:shadow-sm sm:hover:scale-[1.02] active:scale-[0.98]",
  ];
};

const badgeClass = (id: number) => [
  "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0",
  isCompleted(id) ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600",
];

const submitButtonClass = computed(() => [
  "px-8 sm:px-10 md:px-12 lg:px-16 py-2.5 sm:py-3 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg shadow-lg transition-all duration-200 transform min-w-[120px] sm:min-w-[140px] md:min-w-[160px]",
  allStepsCompleted.value
    ? "bg-gradient-to-b from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700 hover:shadow-xl active:shadow-md sm:hover:scale-105 active:scale-95 cursor-pointer"
    : "bg-gray-300 text-gray-500 cursor-not-allowed",
]);
</script>

<style scoped>
/* Additional responsive utilities */
@media (max-width: 374px) {
  .text-xs {
    font-size: 0.7rem;
  }
}

@media (min-width: 1536px) {
  .container-2xl {
    max-width: 1536px;
  }
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: transform, box-shadow, background-color, border-color;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

/* Enhanced focus states for accessibility */
button:focus-visible {
  outline: 2px solid #01b0ef;
  outline-offset: 2px;
}

/* Prevent text selection on buttons */
button {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>