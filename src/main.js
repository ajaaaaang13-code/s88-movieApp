import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import AddMovie from './pages/AddMovie.vue'
import AdminDashboard from './pages/AdminDashboard.vue'
import ErrorPage from './pages/Error.vue'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import Logout from './pages/Logout.vue'
import MovieDetails from './pages/MovieDetails.vue'
import Register from './pages/Register.vue'
import { useGlobalStore } from './stores/global'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/movies' },
    { path: '/register', name: 'Register', component: Register },
    { path: '/login', name: 'Login', component: Login },
    { path: '/logout', name: 'Logout', component: Logout },
    { path: '/movies', name: 'Movies', component: Home },
    { path: '/movies/:id', name: 'MovieDetails', component: MovieDetails, meta: { requiresAuth: true } },
    { path: '/admin', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAdmin: true } },
    { path: '/addMovie', name: 'AddMovie', component: AddMovie, meta: { requiresAdmin: true } },
    { path: '/:pathMatch(.*)*', name: 'Error', component: ErrorPage },
  ],
})

router.beforeEach((to) => {
  const user = useGlobalStore()

  if ((to.meta.requiresAuth || to.meta.requiresAdmin) && !user.isAuthenticated()) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresAdmin && !user.isAdmin) {
    return { name: 'Movies', query: { error: 'admin-required' } }
  }
  if ((to.name === 'Login' || to.name === 'Register') && user.isAuthenticated()) {
    return { name: 'Movies' }
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
