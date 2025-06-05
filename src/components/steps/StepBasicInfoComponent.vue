<template>
  <Form :validation-schema="schema" @submit="onSubmit">
    <div class="space-y-4">
      <div>
        <label class="font-medium block mb-1">Description</label>
        <Field name="description" as="textarea" class="input h-24" />
        <ErrorMessage name="description" class="text-red-600 text-sm mt-1" />
      </div>

      <div>
        <label class="font-medium block mb-1">Location</label>
        <Field name="location" type="text" class="input" />
        <ErrorMessage name="location" class="text-red-600 text-sm mt-1" />
      </div>

      <div>
        <label class="font-medium block mb-1">Start Date</label>
        <Field name="startDate" type="date" class="input" />
        <ErrorMessage name="startDate" class="text-red-600 text-sm mt-1" />
      </div>

      <div>
        <label class="font-medium block mb-1">End Date</label>
        <Field name="endDate" type="date" class="input" />
        <ErrorMessage name="endDate" class="text-red-600 text-sm mt-1" />
      </div>

      <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
        Save & Continue
      </button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { TempStore } from '../../utils/TempStore'

const emit = defineEmits(['completed'])

const schema = yup.object({
  description: yup.string().required('Description is required'),
  location: yup.string().required('Location is required'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup
    .date()
    .required('End date is required')
    .min(yup.ref('startDate'), 'End date cannot be before start date'),
})

const onSubmit = (values: any) => {
  const project = TempStore.getProject()
  project.basicInfo = {
    description: values.description,
    location: values.location,
    startDate: values.startDate,
    endDate: values.endDate,
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
