<template>
  <main class="auth-page">
    <section class="auth-card">
      <p class="eyebrow">REEL CATALOG</p>
      <h1>Welcome back</h1>
      <p class="muted">Log in to explore the movie catalog.</p>
      <p v-if="route.query.registered" class="alert alert-success" role="status">
        Account created. Log in to continue.
      </p>

      <form class="form-stack" @submit.prevent="login">
        <label for="login-email">Email</label>
        <input
          id="login-email"
          v-model.trim="form.email"
          class="form-control"
          type="email"
          autocomplete="email"
          required
        />
        <label for="login-password">Password</label>
        <input
          id="login-password"
          v-model="form.password"
          class="form-control"
          type="password"
          autocomplete="current-password"
          required
        />
        <p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
        <button class="btn btn-accent w-100" type="submit" :disabled="isLoading">
          {{ isLoading ? 'Logging in…' : 'Log in' }}
        </button>
      </form>

      <p class="auth-footer">New to Reel? <RouterLink to="/register">Create an account</RouterLink></p>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import api, { getApiError } from '@/api'
import { useGlobalStore } from '@/stores/global'

const route = useRoute()
const router = useRouter()
const user = useGlobalStore()
const form = ref({ email: '', password: '' })
const error = ref('')
const isLoading = ref(false)

async function login() {
  error.value = ''
  isLoading.value = true

  try {
    const response = await api.post('/users/login', form.value)
    const token = response.data?.access || response.data?.token || response.data?.accessToken
    if (typeof token !== 'string' || !token) {
      throw new Error('The login response did not contain an access token.')
    }

    const profile = {
      ...response.data,
      ...(response.data?.user || response.data?.profile || {}),
    }
    user.setSession(token, profile)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/movies'
    await router.push(redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/movies')
  } catch (requestError) {
    error.value = getApiError(requestError, 'Could not log in.')
  } finally {
    isLoading.value = false
  }
}
</script>
