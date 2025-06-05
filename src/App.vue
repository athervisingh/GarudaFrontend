<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { TempStore } from './utils/TempStore'
import { UserService } from './services/UserServices'

onMounted(async () => {
  const user = await UserService.fetchCurrentUser()
  if (user) {
    TempStore.setUser(user)
    console.log('✅ Logged-in user:', user.getUserId(), user.getRole())
  } else {
    console.warn('⚠️ Could not fetch user')
  }
})
</script>
