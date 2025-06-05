<template>
  <Form :validation-schema="schema" :initial-values="initialValues" @submit="onSubmit" class="space-y-8">
    <div class="space-y-6">
      <div v-for="(user, userId) in users" :key="userId" class="border rounded-lg p-4 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold">User ID: {{ userId }}</h3>
          </div>
          <button type="button" @click="removeUser(userId)" class="text-red-600 hover:underline">Remove</button>
        </div>

        <!-- Role Assignment -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Role</label>
          <select v-model="users[userId].role" class="input">
            <option value="">Select Role</option>
            <option value="viewer">Viewer</option>
            <option value="analyst">Analyst</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <!-- Config Section (reuseable like AOIWatchConfig) -->
        <div v-for="service in services" :key="service.key" class="border p-4 rounded-md mb-4 bg-gray-50">
          <h4 class="font-semibold mb-3">{{ service.label }} Config</h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-medium mb-1">Frequency</label>
              <Field :name="`${userId}.${service.key}.frequency`" as="select" class="input">
                <option value="">Select Frequency</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Field>
              <ErrorMessage :name="`${userId}.${service.key}.frequency`" class="text-red-600 text-sm mt-1" />
            </div>

            <div class="flex items-center mt-6">
              <Field :name="`${userId}.${service.key}.alterenable`" type="checkbox" class="mr-2" />
              Enable Alerts
            </div>

            <div>
              <label class="block font-medium mb-1">Sensitivity (1–10)</label>
              <Field :name="`${userId}.${service.key}.sensitivity`" type="number" min="1" max="10" class="input" />
              <ErrorMessage :name="`${userId}.${service.key}.sensitivity`" class="text-red-600 text-sm mt-1" />
            </div>

            <div>
              <label class="block font-medium mb-1">Temperature Threshold (°C)</label>
              <Field :name="`${userId}.${service.key}.temperature`" type="text" class="input" />
              <ErrorMessage :name="`${userId}.${service.key}.temperature`" class="text-red-600 text-sm mt-1" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add User Input -->
    <div class="flex items-center gap-4">
      <input v-model="newUserId" type="text" placeholder="Enter User ID" class="input" />
      <button type="button" @click="addUser" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add User
      </button>
    </div>

    <!-- Submit Button -->
    <div class="text-right">
      <button type="submit" class="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700">
        Save & Finish
      </button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { TempStore } from '../../utils/TempStore'
import { ProjectService } from '../../services/ProjectServices'
import type { AssignedUsers } from '../../models/AssignedUsers'

import { useRouter } from 'vue-router'

const router = useRouter()

const emit = defineEmits(['completed'])

const newUserId = ref('')
const users = reactive<Record<string, { role: string }>>({})

const services = [
  { key: 'ridam', label: 'RIDAM' },
  { key: 'geoES', label: 'GeoEntityStats' },
  { key: 'sangrahi', label: 'Sangrahi' }
]

const defaultConfig = {
  frequency: '',
  alterenable: false,
  sensitivity: 1,
  temperature: ''
}

const initialValues: Record<string, any> = {}

const addUser = () => {
  const id = newUserId.value.trim()
  if (!id || users[id]) return
  users[id] = { role: '' }

  initialValues[id] = {
    ridam: { ...defaultConfig },
    geoES: { ...defaultConfig },
    sangrahi: { ...defaultConfig }
  }

  newUserId.value = ''
}

const removeUser = (id: string) => {
  delete users[id]
  delete initialValues[id]
}

const serviceSchema = yup.object({
  frequency: yup.string().required('Required'),
  sensitivity: yup.number().required().min(1).max(10),
  temperature: yup.string().required()
})

const generateSchema = () => {
  const userSchemas: Record<string, any> = {}
  for (const userId of Object.keys(users)) {
    userSchemas[userId] = yup.object({
      ridam: serviceSchema,
      geoES: serviceSchema,
      sangrahi: serviceSchema
    })
  }
  return yup.object(userSchemas)
}

const schema = generateSchema()
const onSubmit = async (values: any) => {
  const assignedUsers: AssignedUsers = {}

  for (const userId of Object.keys(users)) {
    assignedUsers[userId] = {
      role: users[userId].role,
      config: values[userId]
    }
  }

  const project = TempStore.getProject()
  project.setAssignedUsers(assignedUsers)

  try {
    await ProjectService.saveProjectToFile(project)
    alert('✅ Project submitted successfully!')
    router.push('/')
  } catch (err) {
    console.error('❌ Could not save project:', err)
    alert('❌ Failed to submit project. Please try again.')
  }
}

</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}
.input:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px #60a5fa;
}
</style>
