<template>
  <div class="min-h-screen bg-gray-50 flex flex-col relative">
    <!-- Header -->
    <div class="bg-[#01b0ef] text-white py-4 px-6 shadow-lg relative top-10">
      <h1 class="text-xl font-bold text-center">Add Project</h1>
    </div>

    <!-- Body -->
    <div class="flex-1 flex flex-col items-center justify-center p-6">
      <!-- Stepper Buttons -->
      <div class="w-full max-w-md space-y-4">
        <div v-for="step in steps" :key="step.id" class="relative">
          <button
            @click="handleStepClick(step.id)"
            :disabled="isCompleted(step.id)"
            :class="buttonClass(step.id)"
          >
            <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center">
              <svg
                v-if="isCompleted(step.id)"
                class="w-6 h-6 text-white"
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
                class="w-6 h-6 object-contain"
              />
            </div>
            <span class="flex-1 text-left text-base">{{ step.title }}</span>
            <div :class="badgeClass(step.id)">
              {{ isCompleted(step.id) ? "✓" : "" }}
            </div>
          </button>
        </div>

        <!-- Submit Button -->
        <div class="pt-6 flex justify-center">
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

    <!-- Step 0 Modal -->
    <div
      v-if="showPopup"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <ProjectBasicInfoPopup
        @next="closePopupAndComplete"
        @cancel="() => (showPopup = false)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
import ProjectBasicInfoPopup from "../components/steps/ProjectBasicInfoPopup.vue";
import { stepTrackerService } from "../services/stepTrackerService";
import { Subscription } from "rxjs";
import controller from "../classes/Controller";

const router = useRouter();
const showPopup = ref(false);
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

const allStepsCompleted = computed(() => {
  return steps.every(step => isCompleted(step.id));
});

const handleStepClick = (stepId: number) => {
  if (isCompleted(stepId)) return;

  switch (stepId) {
    case 0:
      showPopup.value = true;
      break;
    case 1:
      controller.mapInitialize();
      router.push("/define-aoi-map");
      break;
    case 2:
      controller.buildFinalProject();
      stepTrackerService.completeStep(2);
      // router.push("/configure-aoi-watch");
      break;
    case 3:
      router.push("/add-users");
      break;
  }
};

const closePopupAndComplete = () => {
  showPopup.value = false;
  stepTrackerService.completeStep(0);
};

const handleSubmit = () => {
  router.push("/");
};

const buttonClass = (id: number) => [
  "w-full py-4 px-6 rounded-2xl border font-semibold flex items-center gap-4 transition-all duration-300 shadow-md transform",
  isCompleted(id)
    ? "bg-green-500 text-white border-black cursor-not-allowed"
    : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:scale-105 active:scale-95",
];

const badgeClass = (id: number) => [
  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
  isCompleted(id) ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600",
];

const submitButtonClass = computed(() => [
  "px-12 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-200 transform",
  allStepsCompleted.value
    ? "bg-gradient-to-b from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700 hover:scale-105 active:scale-95 cursor-pointer"
    : "bg-gray-300 text-gray-500 cursor-not-allowed"
]);
</script>

<style scoped></style>