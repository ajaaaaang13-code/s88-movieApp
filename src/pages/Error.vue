<template>
  <main class="auth-page">
    <section class="auth-card text-center">
      <p class="eyebrow">{{ isAdminError ? 'ACCESS RESTRICTED' : 'PAGE NOT FOUND' }}</p>
      <h1>{{ isAdminError ? 'Admin access required.' : "We couldn't find that page." }}</h1>
      <p class="muted">
        {{ isAdminError ? 'Sign in with an admin account to manage the catalog.' : 'The address may be outdated or typed incorrectly.' }}
      </p>
      <RouterLink :to="homePath" class="btn btn-accent">Return to the catalog</RouterLink>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useGlobalStore } from '@/stores/global'

const route = useRoute()
const user = useGlobalStore()
const isAdminError = computed(() => route.query.error === 'admin-required')
const homePath = computed(() => (user.isAuthenticated() ? '/movies' : '/login'))
</script>
