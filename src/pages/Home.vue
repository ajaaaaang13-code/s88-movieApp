<template>
  <main class="page-container catalog-page">
    <header class="catalog-hero">
      <div class="hero-copy">
        <p class="eyebrow"><span class="eyebrow-line"></span> YOUR NEXT GREAT STORY STARTS HERE</p>
        <h1>More than movies.<br /><span>Moments that stay.</span></h1>
        <p class="hero-description">
          Explore a hand-picked collection of stories, filmmakers, and worlds worth revisiting.
        </p>
        <div class="hero-actions">
          <a class="btn btn-accent" href="#movie-library">Explore the collection </a>
          <RouterLink v-if="user.isAdmin" to="/admin" class="hero-admin-link">Manage catalog <span aria-hidden="true">↗</span></RouterLink>
        </div>
        <div class="hero-stats" aria-label="Catalog summary">
          <div class="hero-stat">
            <strong>{{ movies.length }}</strong>
            <span>films to discover</span>
          </div>
          <span class="hero-stat-divider" aria-hidden="true"></span>
          <div class="hero-stat">
            <strong>{{ genreOptions.length }}</strong>
            <span>genres to explore</span>
          </div>
        </div>
      </div>
    </header>

    <p v-if="route.query.error === 'admin-required'" class="alert alert-warning" role="status">
      The admin dashboard is available to admin accounts only.
    </p>

    <section id="movie-library" class="catalog-section">
      <div class="section-heading collection-heading">
        <div>
          <p class="eyebrow">THE LIBRARY</p>
          <h2>Find your frame<span class="heading-dot">.</span></h2>
        </div>
        <span class="collection-count">{{ movies.length }} {{ movies.length === 1 ? 'title' : 'titles' }}</span>
      </div>

      <div class="catalog-toolbar">
        <label class="search-field">
          <span class="search-icon" aria-hidden="true">⌕</span>
          <span class="visually-hidden">Search movies</span>
          <input v-model.trim="search" class="form-control" type="search" placeholder="Search by title, director, or genre" />
        </label>
        <label class="genre-select">
          <span>Filter by genre</span>
          <select v-model="selectedGenre" class="form-select">
            <option value="">All genres</option>
            <option v-for="genre in genreOptions" :key="genre" :value="genre">{{ genre }}</option>
          </select>
        </label>
        <button class="btn btn-refresh" type="button" :disabled="isLoading" aria-label="Refresh movie catalog" @click="loadMovies">
          <span :class="{ 'is-spinning': isLoading }" aria-hidden="true">↻</span>
          <span class="refresh-label">{{ isLoading ? 'Loading' : 'Refresh' }}</span>
        </button>
      </div>

      <p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
      <div v-else-if="isLoading && !movies.length" class="movie-grid" aria-label="Loading movies">
        <div v-for="index in 6" :key="index" class="movie-skeleton" aria-hidden="true">
          <div class="skeleton-poster"></div>
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line skeleton-short"></div>
        </div>
      </div>
      <section v-else-if="filteredMovies.length" class="movie-grid" aria-label="Movie catalog">
        <MovieCard v-for="(movie, index) in filteredMovies" :key="movieId(movie, index)" :movie="movie" />
      </section>
      <section v-else class="empty-state">
        <span class="empty-icon" aria-hidden="true">✦</span>
        <h3>{{ movies.length ? 'Nothing in this frame' : 'The first reel is waiting' }}</h3>
        <p>
          {{ movies.length ? 'Try another title or choose a different genre.' : 'The collection will appear here as soon as movies are added.' }}
        </p>
        <button v-if="search || selectedGenre" class="btn btn-outline-light" type="button" @click="clearFilters">
          Clear filters
        </button>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import api, { getApiError } from '@/api'
import MovieCard from '@/components/MovieCard.vue'
import { useGlobalStore } from '@/stores/global'

const route = useRoute()
const user = useGlobalStore()
const movies = ref([])
const search = ref('')
const selectedGenre = ref('')
const error = ref('')
const isLoading = ref(false)

const genreOptions = computed(() =>
  [...new Set(
    movies.value
      .flatMap((movie) => (Array.isArray(movie.genre) ? movie.genre : [movie.genre]))
      .map((genre) => String(genre || '').trim())
      .filter(Boolean),
  )].sort((a, b) => a.localeCompare(b)),
)

const filteredMovies = computed(() => {
  const query = search.value.toLowerCase()

  return movies.value.filter((movie) =>
    (!selectedGenre.value ||
      (Array.isArray(movie.genre) ? movie.genre : [movie.genre]).includes(selectedGenre.value)) &&
    (!query ||
      [movie.title, movie.director, movie.genre, movie.description]
        .flat()
        .some((value) => String(value || '').toLowerCase().includes(query))),
  )
})

function clearFilters() {
  search.value = ''
  selectedGenre.value = ''
}

function movieId(movie, index) {
  return movie._id || movie.id || `${movie.title || 'movie'}-${index}`
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
