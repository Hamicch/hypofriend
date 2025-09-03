/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.VITE_ENABLE_MOCKS': JSON.stringify(process.env.VITE_ENABLE_MOCKS || 'true')
  },
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss()
  ],
  test: {
    environment: 'jsdom',
    globals: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
