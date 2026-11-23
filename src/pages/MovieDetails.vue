<template>
  <main class="page-container detail-page">
    <RouterLink to="/movies" class="back-link">← Back to catalog</RouterLink>
    <p v-if="isLoading" class="empty-state" role="status">Loading movie…</p>
    <p v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
    <article v-else-if="movie" class="movie-detail-card">
      <div class="detail-accent" aria-hidden="true">{{ initial }}</div>
      <div class="detail-copy">
        <p class="eyebrow">{{ genreLabel || 'MOVIE DETAILS' }}</p>
        <h1>{{ movie.title || 'Untitled movie' }}</h1>
        <p class="detail-meta">{{ movie.year || 'Year unavailable' }} <span>•</span> Directed by {{ movie.director || 'Unknown' }}</p>
        <p class="detail-description">{{ movie.description || 'No description available.' }}</p>
        <section class="comments-section">
          <h2>Comments <span>{{ comments.length }}</span></h2>
          <ul v-if="comments.length" class="comment-list">
            <li v-for="(comment, index) in comments" :key="comment._id || comment.id || index">
              {{ commentText(comment) }}
            </li>
          </ul>
          <p v-else class="muted">No comments yet.</p>
        </section>
      </div>
    </article>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import api, { getApiError } from '@/api'

const route = useRoute()
const movie = ref(null)
const error = ref('')
const isLoading = ref(false)

const initial = computed(() => String(movie.value?.title || 'M').charAt(0).toUpperCase())
const genreLabel = computed(() => {
  const genre = movie.value?.genre
  return Array.isArray(genre) ? genre.join(' / ') : genre
})
const comments = computed(() => {
  const value = movie.value?.comments
  if (Array.isArray(value)) return value
  return value ? [value] : []
})

function commentText(comment) {
  if (typeof comment === 'string') return comment
  return comment?.comment || comment?.text || comment?.content || JSON.stringify(comment)
}

async function loadMovie() {
  isLoading.value = true
  error.value = ''

  try {
    const id = encodeURIComponent(String(route.params.id))
    const response = await api.get(`/movies/getMovie/${id}`)
    const data = response.data
    const result = data?.movie || data?.data || data
    if (!result || typeof result !== 'object' || Array.isArray(result)) {
      throw new Error('The movie API returned an unexpected movie response.')
    }
    movie.value = result
  } catch (requestError) {
    error.value = getApiError(requestError, 'Could not load this movie.')
  } finally {
    isLoading.value = false
  }
}

onMounted(loadMovie)
</script>
