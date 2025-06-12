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
        <div v-for="(step, index) in steps" :key="step.id" class="relative">
          <button
            @click="handleStepClick(step.id)"
            :disabled="isCompleted(step.id)"
            :class="[
              'w-full py-4 px-6 rounded-2xl border font-semibold flex items-center gap-4 transition-all duration-300 shadow-md transform',
              isCompleted(step.id)
                ? 'bg-green-500 text-white border-black cursor-not-allowed '
                : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:scale-105 active:scale-95',
            ]"
          >
            <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center">
              <svg
                v-if="isCompleted(step.id)"
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <img
                v-else
                :src="step.icon"
                :alt="`${step.title} Icon`"
                class="w-6 h-6 object-contain"
              />
            </div>
            <span class="flex-1 text-left text-base">{{ step.title }}</span>
            <div
              :class="[
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                isCompleted(step.id) ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600',
              ]"
            >
              {{ isCompleted(step.id) ? '✓' : '' }}
            </div>
          </button>
        </div>
      </div>

      <!-- Extra Buttons -->
      <div class="w-full max-w-md space-y-4 mt-6">
        <button class="w-full py-4 px-6 rounded-2xl bg-white text-gray-800 hover:bg-gray-50 border border-gray-300 font-semibold flex items-center gap-4 transition-all duration-300 shadow-md transform hover:scale-105 active:scale-95">
          <img src="/images/config.png" class="w-6 h-6" />
          <span class="flex-1 text-left text-base">Configure AOI Watch</span>
        </button>

        <button class="w-full py-4 px-6 rounded-2xl bg-white text-gray-800 hover:bg-gray-50 border border-gray-300 font-semibold flex items-center gap-4 transition-all duration-300 shadow-md transform hover:scale-105 active:scale-95">
          <img src="/images/User.png" class="w-6 h-6" />
          <span class="flex-1 text-left text-base">Add Users</span>
        </button>
      </div>

      <!-- Submit -->
      <button
        @click="handleSubmit"
        :disabled="completedSteps.size !== steps.length"
        :class="[
          'mt-8 px-8 py-3 rounded-lg font-bold text-white transition-all duration-300 shadow-lg transform hover:scale-105',
          completedSteps.size === steps.length
            ? 'bg-green-500 hover:bg-green-600 cursor-pointer'
            : 'bg-gray-400 cursor-not-allowed opacity-50',
        ]"
      >
        SUBMIT
      </button>
    </div>

    <!-- Project Basic Info Popup -->
    <div v-if="showPopup" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <ProjectBasicInfoPopup
        v-if="showPopup"
        @next="closePopupAndComplete"
        @cancel="showPopup = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ProjectBasicInfoPopup from '../components/steps/ProjectBasicInfoPopup.vue'
import { ProjectService } from '../services/ProjectServices'

// Router and popup state
const router = useRouter()
const route = useRoute()
const showPopup = ref(false)

// Step tracking
const completedSteps = reactive(new Set<number>())
const steps = [
  { id: 0, title: 'Project Basic Info', icon: '/images/info.png' },
  { id: 1, title: 'Define AOI', icon: '/images/defineAoi.png' },
]

// Restore step completion from query parameters
onMounted(() => {
  const basicInfoCompleted = route.query.basicInfoCompleted === 'true'
  const aoiCompleted = route.query.aoiCompleted === 'true'

  if (basicInfoCompleted) completedSteps.add(0)
  if (aoiCompleted) completedSteps.add(1)
})

// Check if step is completed
const isCompleted = (stepId: number) => completedSteps.has(stepId)

// Handle step clicks — disable completed ones
const handleStepClick = (stepId: number) => {
  if (isCompleted(stepId)) return

  if (stepId === 0) {
    showPopup.value = true
  } else if (stepId === 1) {
    router.push({
      path: '/define-aoi-map',
      query: {
        basicInfoCompleted: route.query.basicInfoCompleted || 'true',
      },
    })
  }
}

// When project basic info is completed
const closePopupAndComplete = () => {
  showPopup.value = false
  completedSteps.add(0)
  router.replace({
    path: route.path,
    query: {
      ...route.query,
      basicInfoCompleted: 'true',
    },
  })
}

// Final submit logic
const handleSubmit = async () => {
  if (completedSteps.size !== steps.length) {
    alert('⚠️ Please complete all steps before submitting.')
    return
  }

  try {
    // Get AOI geoentity IDs from ProjectService
    const geoIds = ProjectService.getAOIGeoentityIds()

    // Show in alert
    const message = geoIds
      .map(a => `✔️ ${a.name}: ${a.geoentityId}`)
      .join('\n')
    alert(`✅ Geoentity IDs:\n\n${message}`)

    alert('✅ Project submitted successfully!')
  } catch (error: any) {
    alert(`❌ Error while submitting project:\n${error.message}`)
  }
}
</script>
