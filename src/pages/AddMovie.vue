<template>
  <main class="page-container add-movie-page">
    <RouterLink to="/admin" class="back-link">← Back to dashboard</RouterLink>
    <header class="page-heading">
      <div>
        <p class="eyebrow">CATALOG MANAGEMENT</p>
        <h1>Add a movie</h1>
        <p class="muted">Complete the movie details below.</p>
      </div>
    </header>

    <form class="movie-form" @submit.prevent="addMovie">
      <div class="form-row">
        <div class="form-field">
          <label for="movie-title">Title</label>
          <input id="movie-title" v-model.trim="form.title" class="form-control" maxlength="160" required />
        </div>
        <div class="form-field">
          <label for="movie-director">Director</label>
          <input id="movie-director" v-model.trim="form.director" class="form-control" maxlength="120" required />
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label for="movie-year">Year</label>
          <input id="movie-year" v-model.number="form.year" class="form-control" type="number" min="1888" :max="currentYear + 5" required />
        </div>
        <div class="form-field">
          <label for="movie-genre">Genre</label>
          <input id="movie-genre" v-model.trim="form.genre" class="form-control" maxlength="100" placeholder="e.g. Drama" required />
        </div>
      </div>
      <div class="form-field">
        <label for="movie-description">Description</label>
        <textarea id="movie-description" v-model.trim="form.description" class="form-control" rows="4" maxlength="2000" required></textarea>
      </div>
      <div class="form-field">
        <label for="movie-comments">Comments</label>
        <textarea id="movie-comments" v-model.trim="form.comments" class="form-control" rows="3" placeholder="Optional"></textarea>
      </div>
      <p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
      <div class="form-actions">
        <RouterLink to="/admin" class="btn btn-outline-light">Cancel</RouterLink>
        <button class="btn btn-accent" type="submit" :disabled="isSaving">
          {{ isSaving ? 'Adding movie…' : 'Add movie' }}
        </button>
      </div>
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import api, { getApiError } from '@/api'

const router = useRouter()
const currentYear = new Date().getFullYear()
const form = ref({
  title: '',
  director: '',
  year: currentYear,
  description: '',
  genre: '',
  comments: '',
})
const error = ref('')
const isSaving = ref(false)

async function addMovie() {
  error.value = ''
  isSaving.value = true

  try {
    const payload = {
      ...form.value,
      year: Number(form.value.year),
    }
    await api.post('/movies/addMovie', payload)
    await router.push({ name: 'AdminDashboard' })
  } catch (requestError) {
    error.value = getApiError(requestError, 'Could not add this movie.')
  } finally {
    isSaving.value = false
  }
}
</script>
