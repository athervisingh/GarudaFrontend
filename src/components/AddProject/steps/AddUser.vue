<template>
  <div class="fixed inset-0 bg-black flex items-center justify-center z-[1000]">
    <div
      class="relative w-[400px] rounded-xl border-4 border-yellow-400 p-6 shadow-lg bg-[#22405c]/80 text-white"
    >
      <!-- ❌ Close Button -->
      <button
        @click="close"
        class="absolute top-2 right-2 text-white hover:text-red-400 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- 🟡 Title -->
      <h2 class="text-center text-yellow-300 font-bold text-xl mb-6">
        Add Users
      </h2>

      <!-- 👤 Input Form -->
      <div class="space-y-4 mb-4">
        <div>
          <label class="block font-medium mb-1">VEDAS User ID</label>
          <input
            v-model="userId"
            placeholder="Enter VEDAS User ID"
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

        <!-- ➕ Add/Update User Button -->
        <div class="flex justify-center mt-4">
          <button
            @click="handleAdd"
            :disabled="!userId || !role"
            class="w-full lg:w-48 justify-center py-2 rounded-full font-semibold transition-all duration-200 text-white disabled:bg-gray-500 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 hover:scale-105"
          >
            {{ editingIndex !== -1 ? '✏️ Update User' : '➕ Add User' }}
          </button>
        </div>
      </div>

      <!-- 🧾 User Table -->
      <div v-if="userList.length > 0" class="mt-4">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="text-yellow-300 border-b border-gray-500">
              <th class="py-1 text-left">UserID</th>
              <th class="py-1 text-left">Role</th>
              <th class="py-1 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in userList"
              :key="index"
              class="border-b border-gray-600"
            >
              <td class="py-1">{{ user.userId }}</td>
              <td class="py-1">{{ user.role }}</td>
              <td class="py-1 text-center">
                <div class="flex justify-center space-x-2">
                  <!-- Edit Button -->
                  <button
                    @click="editUser(index)"
                    class="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Edit User"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  
                  <!-- Delete Button -->
                  <button
                    @click="deleteUser(index)"
                    class="text-red-400 hover:text-red-300 transition-colors"
                    title="Delete User"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
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
import { Edit, Trash2 } from "lucide-vue-next";
import controller from "../../../classes/Controller";
import { stepTrackerService } from "../../../services/stepTrackerService";
import navigationService from "../../../services/navigationService";

const userId = ref("");
const role = ref("");
const userList = ref([]);
const editingIndex = ref(-1);

function resetForm() {
  userId.value = "";
  role.value = "";
  editingIndex.value = -1;
}

function handleAdd() {
  if (!userId.value || !role.value) return;

  if (editingIndex.value !== -1) {
    // Update existing user
    userList.value[editingIndex.value] = {
      userId: userId.value,
      role: role.value,
    };
  } else {
    // Add new user
    userList.value.push({
      userId: userId.value,
      role: role.value,
    });
  }

  resetForm();
}

function editUser(index) {
  const user = userList.value[index];
  userId.value = user.userId;
  role.value = user.role;
  editingIndex.value = index;
}

function deleteUser(index) {
  userList.value.splice(index, 1);
  // If we're editing the user being deleted, reset the form
  if (editingIndex.value === index) {
    resetForm();
  } else if (editingIndex.value > index) {
    // Adjust editing index if a user before the editing user was deleted
    editingIndex.value--;
  }
}

function submitAllUsers() {
  controller.addProjectUsers(userList.value);
  stepTrackerService.completeStep(3);
  userList.value = [];
  resetForm();
  navigationService.goTo("add-project");
}

function close() {
  navigationService.goTo("add-project");
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