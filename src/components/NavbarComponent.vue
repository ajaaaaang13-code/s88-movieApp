<template>
  <header class="topbar">
    <div class="topbar-inner">
      <RouterLink class="brand" to="/movies" aria-label="Reel Catalog home">
        <span class="brand-mark"><span>R</span></span>
        <span>reel<span class="brand-dot">.</span></span>
      </RouterLink>

      <nav class="nav-links" aria-label="Main navigation">
        <RouterLink to="/movies">Discover</RouterLink>
        <RouterLink v-if="user.isAdmin" to="/admin">Dashboard</RouterLink>
      </nav>

      <nav v-if="user.isAuthenticated()" class="account-links" aria-label="Account navigation">
        <span class="account-label">
          <span class="account-avatar" aria-hidden="true">{{ accountInitial }}</span>
          <span>{{ user.isAdmin ? 'Administrator' : 'Member' }}</span>
        </span>
        <RouterLink to="/logout" class="account-logout">Log out <span aria-hidden="true">↗</span></RouterLink>
      </nav>
      <nav v-else class="account-links" aria-label="Account navigation">
        <RouterLink to="/login" class="account-login">Log in</RouterLink>
        <RouterLink class="nav-action" to="/register">Register</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useGlobalStore } from '@/stores/global'

const user = useGlobalStore()
const accountInitial = computed(() =>
  String(user.profile?.email || (user.isAdmin ? 'A' : 'M')).charAt(0).toUpperCase(),
)
</script>
