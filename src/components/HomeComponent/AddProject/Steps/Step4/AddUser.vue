<template>
  <div class="overlay">
    <div class="modal">
      <!-- Close Button -->
      <button @click="close" class="close-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
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

      <!-- Title -->
      <h2 class="title">Add Users</h2>

      <!-- Input Form -->
      <div class="form-section">
        <div class="form-group">
          <label class="label">VEDAS User ID</label>
          <input
            v-model="userId"
            placeholder="Enter VEDAS User ID"
            class="input"
          />
        </div>

        <div class="form-group">
          <label class="label">Role</label>
          <select v-model="role" class="input">
            <option value="" disabled>Select Role</option>
            <option>Analyst</option>
            <option>Viewer</option>
          </select>
        </div>

        <!-- Add/Update User Button -->
        <div class="button-container">
          <button
            @click="handleAdd"
            :disabled="!userId || !role"
            class="primary-btn"
          >
            {{ editingIndex !== -1 ? '✏️ Update User' : '➕ Add User' }}
          </button>
        </div>
      </div>

      <!-- User Table -->
      <div v-if="userList.length > 0" class="table-section">
        <table class="user-table">
          <thead>
            <tr class="table-header">
              <th>UserID</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in userList"
              :key="index"
              class="table-row"
            >
              <td>{{ user.userId }}</td>
              <td>{{ user.role }}</td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <!-- Edit Button -->
                  <button
                    @click="editUser(index)"
                    class="edit-btn"
                    title="Edit User"
                  >
                    <Edit class="icon" />
                  </button>
                  
                  <!-- Delete Button -->
                  <button
                    @click="deleteUser(index)"
                    class="delete-btn"
                    title="Delete User"
                  >
                    <Trash2 class="icon" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Final Submit -->
      <div v-if="userList.length > 0" class="submit-section">
        <button @click="submitAllUsers" class="submit-btn">
          Final Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Edit, Trash2 } from "lucide-vue-next";
import controller from "../../../../../classes/Controller";
import { stepTrackerService } from "../../../../../services/stepTrackerService";
import navigationService from "../../../../../services/navigationService";

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
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  position: relative;
  width: 400px;
  background: rgba(34, 64, 92, 0.8);
  border: 4px solid #fbbf24;
  border-radius: 12px;
  padding: 24px;
  color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #ef4444;
}

.title {
  text-align: center;
  color: #fcd34d;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 24px;
}

.form-section {
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.label {
  display: block;
  font-weight: 500;
  margin-bottom: 4px;
}

.input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: white;
  color: black;
  border: none;
  outline: none;
  transition: box-shadow 0.2s ease;
  box-sizing: border-box;
}

.input:focus {
  box-shadow: 0 0 0 2px #60a5fa;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.primary-btn {
  width: 100%;
  max-width: 192px;
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 600;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #2563eb;
}

.primary-btn:hover:not(:disabled) {
  background: #1d4ed8;
  transform: scale(1.05);
}

.primary-btn:disabled {
  background: #6b7280;
  cursor: not-allowed;
}

.table-section {
  margin-top: 16px;
}

.user-table {
  width: 100%;
  font-size: 14px;
  border-collapse: collapse;
}

.table-header {
  color: #fcd34d;
  border-bottom: 1px solid #6b7280;
}

.table-header th {
  padding: 4px 0;
  text-align: left;
}

.table-header th:last-child {
  text-align: center;
}

.table-row {
  border-bottom: 1px solid #4b5563;
}

.table-row td {
  padding: 4px 0;
}

.actions-cell {
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.edit-btn {
  background: none;
  border: none;
  color: #60a5fa;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  transition: color 0.2s ease;
}

.edit-btn:hover {
  color: #93c5fd;
}

.delete-btn {
  background: none;
  border: none;
  color: #f87171;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  transition: color 0.2s ease;
}

.delete-btn:hover {
  color: #fca5a5;
}

.icon {
  width: 16px;
  height: 16px;
}

.submit-section {
  margin-top: 16px;
  text-align: center;
}

.submit-btn {
  background: linear-gradient(to bottom, #4ade80, #16a34a);
  color: white;
  font-weight: bold;
  padding: 8px 24px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.submit-btn:hover {
  transform: scale(1.05);
}
</style>