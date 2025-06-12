<template>
  <div class="relative w-[400px] mx-auto rounded-lg border-4 border-yellow-400 p-6 bg-cover bg-center shadow-lg text-white bg-[#22405c]/80">
    <!-- ❌ Cross Button -->
    <button
      @click="emit('cancel')"
      class="absolute top-2 right-2 text-white hover:text-red-400 transition-all"
    >
      <X class="w-6 h-6" />
    </button>

    <h2 class="text-center text-yellow-300 font-bold text-xl mb-6">Project Basic Info</h2>

    <!-- Project Name Input -->
    <label class="block text-white font-semibold mb-1">Project Name</label>
    <input
      v-model="projectName"
      type="text"
      class="w-full mb-4 px-3 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
    />

    <!-- Extra Fields -->
    <div v-if="extraFields.length > 0" class="mb-4">
      <div
        v-for="(item, index) in extraFields"
        :key="index"
        class="flex gap-2 mb-2"
      >
        <input
          v-model="item.key"
          placeholder="Field name"
          class="w-1/2 px-3 py-2 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          v-model="item.value"
          placeholder="Value"
          class="w-1/2 px-3 py-2 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>

    <!-- Add More Fields Button -->
    <button
      @click="addField"
      class="flex items-center gap-2 text-white font-semibold hover:scale-105 transition-transform mb-5"
    >
      <div class="bg-white text-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-xl">
        +
      </div>
      Add More Fields
    </button>

    <!-- Submit Button -->
    <button
      @click="submit"
      class="w-full bg-gradient-to-b from-green-400 to-green-600 text-white font-bold py-2 rounded-full hover:scale-105 transition-transform"
    >
      SUBMIT
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next' // ✅ Lucide cross icon
import { ProjectService } from '../../services/ProjectServices'

const emit = defineEmits(['next', 'cancel'])

const projectName = ref('')
const extraFields = ref([])
const ssoUserId = 'user-001' // Temporary static user ID

function addField() {
  extraFields.value.push({ key: '', value: '' })
}

async function submit() {
  if (!projectName.value.trim()) {
    alert('Project name is required!')
    return
  }

  const auxData = extraFields.value.reduce((acc, { key, value }) => {
    if (key.trim()) acc[key] = value
    return acc
  }, {})

  ProjectService.setBasicInfo(projectName.value, ssoUserId)

  for (const [key, value] of Object.entries(auxData)) {
    ProjectService.addAuxField(key, value)
  }

  try {
    await ProjectService.submitBasicInfoAndFetchGeoentitySourceId()
    emit('next')
  } catch (error) {
    alert(`Error: ${error.message}`)
  }
}
</script>
