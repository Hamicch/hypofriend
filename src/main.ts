import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

const app = createApp(App)

if (import.meta.env.VITE_ENABLE_MOCKS === 'true') {
  const { worker } = await import('@/mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

app.mount('#app')
