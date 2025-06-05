<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-blue-50 p-6">
    <h2 class="text-2xl font-bold text-center text-blue-800 mb-6">🚀 Add New Project</h2>

    <!-- Step Navigation -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <button
        v-for="(step, index) in steps"
        :key="step.id"
        class="flex flex-col items-center justify-center p-4 rounded-xl border shadow-md transition-all duration-300"
        :class="{
          'bg-blue-600 text-white shadow-lg scale-105': currentStep === index,
          'bg-green-500 text-white': step.completed && currentStep !== index,
          'bg-gray-100 text-gray-500 cursor-not-allowed': !step.active && !step.completed
        }"
        :disabled="!step.active && !step.completed"
        @click="goToStep(index)"
      >
        <component :is="step.icon" class="w-6 h-6 mb-2" />
        <span class="text-sm text-center font-medium">{{ step.title }}</span>
      </button>
    </div>

    <!-- Step Form -->
    <div class="bg-white border p-6 rounded-xl shadow-inner transition-all duration-500">
      <component :is="steps[currentStep].component" @completed="markStepComplete(currentStep)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Info, Ruler, FileStack, User } from 'lucide-vue-next'

// Import individual step components
import StepBasicInfo from './steps/StepBasicInfoComponent.vue'
import StepAOI from './steps/StepAOIComponent.vue'
import StepAOIWatch from './steps/StepAOIWatchComponent.vue'
import StepAddUsers from './steps/StepAddUsersComponent.vue'

const currentStep = ref(0)

const steps = ref([
  { id: 1, title: 'Basic Info', icon: Info, component: StepBasicInfo, active: true, completed: false },
  { id: 2, title: 'Define AOI', icon: Ruler, component: StepAOI, active: false, completed: false },
  { id: 3, title: 'AOI Watch', icon: FileStack, component: StepAOIWatch, active: false, completed: false },
  { id: 4, title: 'Add Users', icon: User, component: StepAddUsers, active: false, completed: false }
])

function goToStep(index: number) {
  if (steps.value[index].active || steps.value[index].completed) {
    currentStep.value = index
  }
}

function markStepComplete(index: number) {
  steps.value[index].completed = true
  if (index + 1 < steps.value.length) {
    steps.value[index + 1].active = true
    currentStep.value = index + 1
  }
}
</script>
