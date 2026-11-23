<template>
  <main class="auth-page">
    <section class="auth-card">
      <p class="eyebrow">REEL CATALOG</p>
      <h1>Create your account</h1>
      <p class="muted">Create an account to view movie details.</p>

      <form class="form-stack" @submit.prevent="register">
        <label for="register-email">Email</label>
        <input
          id="register-email"
          v-model.trim="form.email"
          class="form-control"
          type="email"
          autocomplete="email"
          required
        />
        <label for="register-password">Password</label>
        <input
          id="register-password"
          v-model="form.password"
          class="form-control"
          type="password"
          autocomplete="new-password"
          required
        />
        <label for="register-confirm-password">Confirm password</label>
        <input
          id="register-confirm-password"
          v-model="form.confirmPassword"
          class="form-control"
          type="password"
          autocomplete="new-password"
          required
        />
        <p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
        <button class="btn btn-accent w-100" type="submit" :disabled="isLoading">
          {{ isLoading ? 'Creating account…' : 'Register' }}
        </button>
      </form>

      <p class="auth-footer">Already registered? <RouterLink to="/login">Log in</RouterLink></p>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import api, { getApiError } from '@/api'

const router = useRouter()
const form = ref({ email: '', password: '', confirmPassword: '' })
const error = ref('')
const isLoading = ref(false)

async function register() {
  error.value = ''
  isLoading.value = true

  try {
    if (form.value.password !== form.value.confirmPassword) {
      throw new Error('Passwords do not match.')
    }
    await api.post('/users/register', {
      email: form.value.email,
      password: form.value.password,
    })
    await router.push({ name: 'Login', query: { registered: '1' } })
  } catch (requestError) {
    error.value = getApiError(requestError, 'Could not create your account.')
  } finally {
    isLoading.value = false
  }
}
</script>
