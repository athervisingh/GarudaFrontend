<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Welcome Back</h2>
        <p>Please sign in to your account</p>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <input 
            v-model="username" 
            placeholder="Username" 
            required 
            class="form-input"
            type="text"
          />
          <label class="input-label">Username</label>
        </div>
        <div class="input-group">
          <input 
            type="password" 
            v-model="password" 
            placeholder="Password" 
            required 
            class="form-input"
          />
          <label class="input-label">Password</label>
        </div>
        <button type="submit" class="login-btn">
          Sign In
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import controller from "../../classes/Controller";
import navigationService from "../../services/navigationService";

const username = ref("");
const password = ref("");
const error = ref("");

async function handleLogin() {
  const success = await controller.login(username.value, password.value);
  if (success) {
    navigationService.goTo("home"); // ✅ login के बाद home पर जाएँ
  } else {
    error.value = "Invalid username or password";
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  color: #1f2937;
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.login-header p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #f9fafb;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:focus + .input-label,
.form-input:not(:placeholder-shown) + .input-label {
  transform: translateY(-1.5rem) scale(0.8);
  color: #667eea;
}

.input-label {
  position: absolute;
  left: 1rem;
  top: 1rem;
  color: #9ca3af;
  font-size: 1rem;
  pointer-events: none;
  transition: all 0.2s ease;
  background: white;
  padding: 0 0.25rem;
}

.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.login-btn:active {
  transform: translateY(0);
}

.error {
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  margin: 0;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
  
  .login-header h2 {
    font-size: 1.5rem;
  }
}
</style>