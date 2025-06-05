<template>
  <Form :validation-schema="schema" :initial-values="initialValues" @submit="onSubmit" class="space-y-6">
    <div v-for="service in services" :key="service.key" class="p-4 border rounded-md">
      <h2 class="text-lg font-semibold capitalize mb-4">{{ service.label }} Config</h2>

      <div class="space-y-4">
        <!-- Frequency -->
        <div>
          <label class="block font-medium mb-1">Frequency</label>
          <Field :name="`${service.key}.frequency`" as="select" class="input">
            <option value="">Select Frequency</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Field>
          <ErrorMessage :name="`${service.key}.frequency`" class="text-red-600 text-sm mt-1" />
        </div>

        <!-- Alert Enable (no validation now) -->
        <div>
          <label class="inline-flex items-center">
            <Field :name="`${service.key}.alterenable`" type="checkbox" class="mr-2" />
            Enable Alerts
          </label>
        </div>

        <!-- Sensitivity -->
        <div>
          <label class="block font-medium mb-1">Sensitivity (1–10)</label>
          <Field :name="`${service.key}.sensitivity`" type="number" min="1" max="10" class="input" />
          <ErrorMessage :name="`${service.key}.sensitivity`" class="text-red-600 text-sm mt-1" />
        </div>

        <!-- Temperature -->
        <div>
          <label class="block font-medium mb-1">Temperature Threshold (°C)</label>
          <Field :name="`${service.key}.temperature`" type="text" class="input" />
          <ErrorMessage :name="`${service.key}.temperature`" class="text-red-600 text-sm mt-1" />
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
      Save & Continue
    </button>
  </Form>
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { TempStore } from '../../utils/TempStore'

const emit = defineEmits(['completed'])

const services = [
  { key: 'ridam', label: 'RIDAM' },
  { key: 'geoES', label: 'GeoEntityStats' },
  { key: 'sangrahi', label: 'Sangrahi' }
]

// Default initial values (alterenable: false)
const initialValues = {
  ridam: {
    frequency: '',
    alterenable: false,
    sensitivity: 1,
    temperature: ''
  },
  geoES: {
    frequency: '',
    alterenable: false,
    sensitivity: 1,
    temperature: ''
  },
  sangrahi: {
    frequency: '',
    alterenable: false,
    sensitivity: 1,
    temperature: ''
  }
}

// Schema without alterenable validation
const watchConfigSchema = yup.object({
  frequency: yup.string().required('Frequency is required'),
  sensitivity: yup.number().required('Sensitivity is required').min(1).max(10),
  temperature: yup.string().required('Temperature is required')
})

const schema = yup.object({
  ridam: watchConfigSchema,
  geoES: watchConfigSchema,
  sangrahi: watchConfigSchema
})

const onSubmit = (values: any) => {
  const project = TempStore.getProject()
  project.aoiWatchConfig = {
    ridam: values.ridam,
    geoES: values.geoES,
    sangrahi: values.sangrahi
  }
  emit('completed')
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
