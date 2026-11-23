<template>
  <main class="page-container admin-page">
    <header class="page-heading">
      <div>
        <p class="eyebrow">CATALOG MANAGEMENT</p>
        <h1>Admin dashboard</h1>
        <p class="muted">Review the movie catalog and add new titles.</p>
      </div>
      <RouterLink to="/addMovie" class="btn btn-accent">＋ Add movie</RouterLink>
    </header>

    <p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
    <p v-else-if="isLoading" class="empty-state" role="status">Loading catalog…</p>
    <section v-else class="table-wrap">
      <table class="table movie-table">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Director</th>
            <th scope="col">Year</th>
            <th scope="col">Genre</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(movie, index) in movies" :key="movie._id || movie.id || index">
            <td><RouterLink :to="`/movies/${encodeURIComponent(movie._id || movie.id || '')}`">{{ movie.title || 'Untitled movie' }}</RouterLink></td>
            <td>{{ movie.director || '—' }}</td>
            <td>{{ movie.year || '—' }}</td>
            <td>{{ genreLabel(movie.genre) || '—' }}</td>
          </tr>
          <tr v-if="!movies.length">
            <td colspan="4" class="table-empty">No movies are in the catalog yet.</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import api, { getApiError } from '@/api'

const movies = ref([])
const error = ref('')
const isLoading = ref(false)

function genreLabel(genre) {
  return Array.isArray(genre) ? genre.join(', ') : genre
}

async function loadMovies() {
  isLoading.value = true
  error.value = ''

  try {
    const response = await api.get('/movies/getMovies')
    const data = response.data
    const list = Array.isArray(data) ? data : data?.movies ?? data?.data
    if (!Array.isArray(list)) {
      throw new Error('The movie API returned an unexpected catalog response.')
    }
    movies.value = list
  } catch (requestError) {
    error.value = getApiError(requestError, 'Could not load the movie catalog.')
  } finally {
    isLoading.value = false
  }
}

onMounted(loadMovies)
</script>
