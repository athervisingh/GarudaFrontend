<template>
  <!-- Overlay Background -->
  <div class="modal-overlay">
    <!-- Modal Box -->
    <div class="modal-box">
      <!-- Close Button -->
      <button @click="closeModal" class="close-button">
        <X class="icon" />
      </button>

      <h2 class="modal-title">Project Basic Info</h2>

      <!-- Project Name -->
      <label class="label">Project Name</label>
      <input
        v-model="projectName"
        type="text"
        class="input"
        placeholder="Enter project name"
      />

      <!-- Aux Data Fields -->
      <div v-if="extraFields.length > 0" class="aux-fields">
        <div
          v-for="(item, index) in extraFields"
          :key="index"
          class="field-row"
        >
          <input
            v-model="item.key"
            placeholder="Enter field name"
            class="input half"
          />
          <input
            v-model="item.value"
            placeholder="Enter field value"
            class="input half"
          />
        </div>
      </div>

      <!-- Add Field Button -->
      <button @click="addField" class="add-field-button">
        <div class="add-icon">+</div>
        Add More Fields
      </button>

      <!-- Submit Button -->
      <button @click="submit" class="submit-button">
        SUBMIT
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { X } from "lucide-vue-next";
import controller from "../../../../../classes/Controller";
import { stepTrackerService } from "../../../../../services/stepTrackerService";
import navigationService from "../../../../../services/navigationService";

const projectName = ref("");
const extraFields = ref([]);

function closeModal() {
  navigationService.goTo("add-project");
}

function addField() {
  // Check if previous fields are filled before adding new one
  if (extraFields.value.length > 0) {
    const lastField = extraFields.value[extraFields.value.length - 1];
    if (!lastField.key.trim() || !lastField.value.trim()) {
      alert("Please fill both field name and value before adding a new field!");
      return;
    }
  }
  
  extraFields.value.push({ key: "", value: "" });
}

async function submit() {
  if (!projectName.value.trim()) {
    alert("Project name is required!");
    return;
  }

  // Validate extra fields - if key is provided, value must also be provided
  for (let i = 0; i < extraFields.value.length; i++) {
    const field = extraFields.value[i];
    if (field.key.trim() && !field.value.trim()) {
      alert(`Please enter a value for field: "${field.key}"`);
      return;
    }
    if (!field.key.trim() && field.value.trim()) {
      alert(`Please enter a field name for value: "${field.value}"`);
      return;
    }
  }

  const auxData = extraFields.value.reduce((acc, { key, value }) => {
    if (key.trim() && value.trim()) acc[key] = value;
    return acc;
  }, {});

  try {
    controller.setBasicInfo(projectName.value);
    for (const [key, value] of Object.entries(auxData)) {
      controller.setProjectAuxField(key, value);
    }

    await controller.submitBasicInfoAndGetProjectId();

    stepTrackerService.completeStep(0);
    navigationService.goTo("add-project");
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgb(0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  position: relative;
  width: 90%;
  max-width: 400px;
  background-color: rgba(34, 64, 92, 0.8);
  padding: 24px;
  border: 4px solid #facc15; /* Yellow border */
  border-radius: 16px;
  color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
}

.close-button:hover {
  color: #f87171;
}

.icon {
  width: 24px;
  height: 24px;
}

.modal-title {
  text-align: center;
  font-weight: bold;
  font-size: 1.25rem;
  color: #facc15;
  margin-bottom: 1.5rem;
}

.label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  background-color: white;
  color: black;
  margin-bottom: 1rem;
  border: none;
  outline: none;
  box-sizing: border-box;
}

.input::placeholder {
  color: #9ca3af;
  opacity: 0.7;
}

.input:focus {
  outline: 2px solid #facc15;
}

.aux-fields {
  margin-bottom: 1rem;
}

.field-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.input.half {
  width: 50%;
}

.add-field-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

.add-icon {
  background-color: white;
  color: #3b82f6;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 20px;
}

.submit-button {
  width: 100%;
  padding: 0.5rem;
  border-radius: 9999px;
  background: linear-gradient(to bottom, #4ade80, #16a34a);
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.submit-button:hover {
  transform: scale(1.05);
  background: linear-gradient(to bottom, #22c55e, #15803d);
}

@media (max-width: 480px) {
  .modal-box {
    padding: 16px;
  }

  .modal-title {
    font-size: 1.1rem;
  }

  .submit-button {
    font-size: 0.9rem;
  }

  .add-icon {
    width: 28px;
    height: 28px;
    font-size: 16px;
  }
}
</style>