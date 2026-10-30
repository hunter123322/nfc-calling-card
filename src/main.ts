import { createApp, createSSRApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/main.css'
import App from './App.vue'
import { createAppRouter } from './router'
import { installPortfolioGuards } from './router/guards'
import { useThemeStore } from './stores/theme'

const container = document.querySelector<HTMLDivElement>('#app')
const prerenderedRoute = container?.dataset.prerenderedRoute
const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'

// Hydrate only when the server markup belongs to this URL. A static host may
// serve dist/index.html as a fallback for unknown routes; in that case a fresh
// mount is both correct and avoids a hydration mismatch.
const canHydrate = prerenderedRoute !== undefined && prerenderedRoute === currentPath
const app = canHydrate ? createSSRApp(App) : createApp(App)
container?.removeAttribute('data-prerendered-route')

const pinia = createPinia()
const router = createAppRouter()

app.use(pinia)
installPortfolioGuards(router)
app.use(router)

useThemeStore(pinia).init()

// Wait for the initial route guard so the first paint already has portfolio data.
router.isReady().then(() => {
  app.mount('#app')
})
