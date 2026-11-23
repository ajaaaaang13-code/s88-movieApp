import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import clientConfig from './movieAppClient.json' with { type: 'json' }

const apiProxy = {
  target: clientConfig.url,
  changeOrigin: true,
  bypass: (request) => {
    if (request.headers.accept?.includes('text/html')) {
      return request.url
    }
  },
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/users': { ...apiProxy },
      '/movies': { ...apiProxy },
    },
  },
})
