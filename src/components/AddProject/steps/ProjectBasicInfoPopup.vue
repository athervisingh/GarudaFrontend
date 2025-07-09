<template>
  <!-- Overlay Background -->
  <div
    class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000]"
  >
    <!-- Modal Box -->
    <div
      class="relative w-[400px] rounded-xl border-4 border-yellow-400 p-6 shadow-lg bg-[#22405c]/80 text-white"
    >
      <!-- ❌ Close Button -->
      <button
        @click="closeModal"
        class="absolute top-2 right-2 text-white hover:text-red-400 transition-all"
      >
        <X class="w-6 h-6" />
      </button>

      <h2 class="text-center text-yellow-300 font-bold text-xl mb-6">
        Project Basic Info
      </h2>

      <!-- Project Name -->
      <label class="block text-white font-semibold mb-1">Project Name</label>
      <input
        v-model="projectName"
        type="text"
        class="w-full mb-4 px-3 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
      />

      <!-- Aux Data Fields -->
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

      <!-- Add Field Button -->
      <button
        @click="addField"
        class="flex items-center gap-2 text-white font-semibold hover:scale-105 transition-transform mb-5"
      >
        <div
          class="bg-white text-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-xl"
        >
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import { X } from "lucide-vue-next";
import controller from "../../../classes/Controller";
import { stepTrackerService } from "../../../services/stepTrackerService";
import navigationService from "../../../services/navigationService"; // 🆕 Add this

const emit = defineEmits(["next", "cancel"]);

const projectName = ref("");
const extraFields = ref([]);

function closeModal() {
  navigationService.goTo("add-project"); // navigate back to add-project
}

function addField() {
  extraFields.value.push({ key: "", value: "" });
}

async function submit() {
  if (!projectName.value.trim()) {
    alert("Project name is required!");
    return;
  }

  const auxData = extraFields.value.reduce((acc, { key, value }) => {
    if (key.trim()) acc[key] = value;
    return acc;
  }, {});

  try {
    controller.setBasicInfo(projectName.value);

    for (const [key, value] of Object.entries(auxData)) {
      controller.setProjectAuxField(key, value);
    }

    await controller.submitBasicInfoAndGetProjectId();

    // ✅ Mark step complete and return to AddProject view
    stepTrackerService.completeStep(0);
    navigationService.goTo("add-project");
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}
</script>
