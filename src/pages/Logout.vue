<template>
  <main class="auth-page">
    <section class="auth-card text-center" role="status">
      <p class="eyebrow">SIGNED OUT</p>
      <h1>See you next time.</h1>
      <p class="muted">Your session has ended.</p>
      <RouterLink to="/login" class="btn btn-accent">Log in again</RouterLink>
    </section>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'

const router = useRouter()
const user = useGlobalStore()

onMounted(async () => {
  user.clearSession()
  await router.replace({ name: 'Login' })
})
</script>
