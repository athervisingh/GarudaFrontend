<template>
  <div class="fixed inset-0 bg-black flex items-center justify-center z-[1000]">
    <div
      class="relative w-[400px] rounded-xl border-4 border-yellow-400 p-6 shadow-lg bg-[#22405c]/80 text-white"
    >
      <!-- ❌ Close Button -->
      <button
        @click="emit('cancel')"
        class="absolute top-2 right-2 text-white hover:text-red-400 transition-all"
      >
        <X class="w-6 h-6" />
      </button>

      <!-- 🟡 Title -->
      <h2 class="text-center text-yellow-300 font-bold text-xl mb-6">
        Add User
      </h2>

      <!-- ➕ Add User Button -->
      <div class="flex justify-between items-center mb-4">
        <button
          @click="toggleForm"
          class="bg-white text-blue-500 hover:bg-blue-100 font-semibold py-2 px-4 rounded-full transition-all"
        >
          {{ showForm ? "➖ Close" : "➕ Add User" }}
        </button>
      </div>

      <!-- 👤 Input Form -->
      <div v-if="showForm" class="space-y-4 mb-4">
        <div>
          <label class="block font-medium mb-1">VEDAS User ID</label>
          <input
            v-model="userId"
            placeholder="Enter VEDAS User ID"
            class="input"
          />
        </div>

        <div>
          <label class="block font-medium mb-1">User Name</label>
          <input
            v-model="userName"
            placeholder="Enter User Name"
            class="input"
          />
        </div>

        <div>
          <label class="block font-medium mb-1">Role</label>
          <select v-model="role" class="input">
            <option value="" disabled>Select Role</option>
            <option>Analyst</option>
            <option>Viewer</option>
          </select>
        </div>

        <!-- ✅ Submit Single User -->
        <button
          @click="handleAdd"
          class="bg-gradient-to-b from-green-400 to-green-600 text-white font-bold py-2 rounded-full w-full hover:scale-105 transition-transform"
        >
          Submit
        </button>
      </div>

      <!-- 🧾 User Table -->
      <div v-if="userList.length > 0" class="mt-4">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="text-yellow-300 border-b border-gray-500">
              <th class="py-1 text-left">UserID</th>
              <th class="py-1 text-left">Username</th>
              <th class="py-1 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in userList"
              :key="index"
              class="border-b border-gray-600"
            >
              <td class="py-1">{{ user.userId }}</td>
              <td class="py-1">{{ user.userName }}</td>
              <td class="py-1">{{ user.role }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 📤 Final Submit -->
      <div v-if="userList.length > 0" class="mt-4 text-center">
        <button
          @click="submitAllUsers"
          class="bg-gradient-to-b from-green-400 to-green-600 text-white font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform"
        >
          Final Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import controller from "../../classes/Controller";
import { X } from "lucide-vue-next";
import { stepTrackerService } from "../../services/stepTrackerService";
import { useRouter } from "vue-router";
const router = useRouter();

const emit = defineEmits(["cancel"]);

const showForm = ref(false);
const userId = ref("");
const userName = ref("");
const role = ref("");

const userList = ref([]);

function toggleForm() {
  showForm.value = !showForm.value;
  if (showForm.value) resetForm();
}

function resetForm() {
  userId.value = "";
  userName.value = "";
  role.value = "";
}

function handleAdd() {
  if (!userId.value || !userName.value || !role.value) {
    alert("Please fill all fields.");
    return;
  }

  userList.value.push({
    userId: userId.value,
    userName: userName.value,
    role: role.value,
  });

  resetForm();
  showForm.value = false;
}

function submitAllUsers() {
  controller.addProjectUsers(userList.value);
  stepTrackerService.completeStep(3);
  emit("next");
  resetForm();
  userList.value = [];
  // ✅ Navigate to add-project route
  router.push("/add-project");
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  background-color: white;
  color: black;
  outline: none;
  transition: box-shadow 0.2s ease;
}
.input:focus {
  box-shadow: 0 0 0 2px #60a5fa; /* Tailwind blue-400 */
}
</style>
