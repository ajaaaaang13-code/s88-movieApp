<template>
  <article class="movie-card" :class="posterTheme">
    <div class="movie-poster" aria-hidden="true">
      <div class="poster-topline">
        <span>REEL CATALOG</span>
        <span>{{ movie.year || '—' }}</span>
      </div>
     
     
      <div class="poster-bottomline">
        <span>{{ genreLabel || 'FEATURE' }}</span>
      
      </div>
    </div>
    <div class="movie-card-content">
      <h2>{{ movie.title || 'Untitled movie' }}</h2>
      <p class="movie-director"><span aria-hidden="true">DIRECTED BY</span> {{ movie.director || 'Unknown' }}</p>
      <p class="movie-description">{{ movie.description || 'No description available.' }}</p>
    </div>
    <div class="movie-card-footer">
      <span class="comment-count"><span aria-hidden="true">✦</span> {{ commentCount }} {{ commentCount === 1 ? 'comment' : 'comments' }}</span>
      <RouterLink v-if="moviePath" class="movie-link" :to="moviePath">View movie <span aria-hidden="true">→</span></RouterLink>
      <span v-else class="comment-count">Movie details unavailable</span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
})

const moviePath = computed(() => {
  const id = props.movie._id || props.movie.id
  return id ? `/movies/${encodeURIComponent(id)}` : ''
})
const initial = computed(() => String(props.movie.title || 'M').charAt(0).toUpperCase())
const posterTheme = computed(() => {
  const title = String(props.movie.title || 'movie')
  const theme = title.toLowerCase().split('').reduce((sum, character) => sum + character.charCodeAt(0), 0) % 4
  return `poster-theme-${theme + 1}`
})
const genreLabel = computed(() =>
  Array.isArray(props.movie.genre) ? props.movie.genre.join(', ') : props.movie.genre,
)
const commentCount = computed(() =>
  Array.isArray(props.movie.comments)
    ? props.movie.comments.length
    : props.movie.comments
      ? 1
      : 0,
)
</script>
