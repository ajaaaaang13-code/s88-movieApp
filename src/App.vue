<template>
  <div class="app-shell">
    <NavbarComponent />
    <RouterView />
    <footer class="app-footer">REEL CATALOG <span>Stories worth keeping.</span></footer>
  </div>
</template>

<script setup>
import NavbarComponent from './components/NavbarComponent.vue'
</script>
