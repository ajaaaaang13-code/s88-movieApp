import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

function decodeToken(token) {
  try {
    const encoded = token.split('.')[1]
    if (!encoded) return null

    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      Array.from(atob(base64), (character) =>
        `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`,
      ).join(''),
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

function loadProfile(token) {
  try {
    const storedProfile = localStorage.getItem('user')
    return storedProfile ? JSON.parse(storedProfile) : decodeToken(token) || {}
  } catch {
    return decodeToken(token) || {}
  }
}

export const useGlobalStore = defineStore('global', () => {
  const token = ref(localStorage.getItem('token') || null)
  const profile = ref(loadProfile(token.value))

  const isAdmin = computed(() => {
    const roles = profile.value.roles
    return (
      profile.value.isAdmin === true ||
      profile.value.admin === true ||
      String(profile.value.role || '').toLowerCase() === 'admin' ||
      (Array.isArray(roles) && roles.some((role) => String(role).toLowerCase() === 'admin'))
    )
  })

  function setSession(newToken, user = {}) {
    token.value = newToken
    profile.value = { ...decodeToken(newToken), ...user }
    delete profile.value.access
    delete profile.value.accessToken
    delete profile.value.token
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(profile.value))
  }

  function clearSession() {
    token.value = null
    profile.value = {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function isAuthenticated() {
    return Boolean(token.value)
  }

  return { token, profile, isAdmin, setSession, clearSession, isAuthenticated }
})
