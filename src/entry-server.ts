import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import { createAppRouter } from './router'
import { installPortfolioGuards } from './router/guards'

/**
 * SSR entry used by scripts/prerender.ts. Portfolio Markdown is read from
 * `globalThis.__PORTFOLIO_MARKDOWN__`, which the prerenderer fills before
 * rendering each route.
 */
export async function render(url: string): Promise<{ html: string }> {
  const app = createSSRApp(App)
  const pinia = createPinia()
  const router = createAppRouter(createMemoryHistory())

  app.use(pinia)
  installPortfolioGuards(router)
  app.use(router)

  await router.push(url)
  await router.isReady()

  const html = await renderToString(app)
  return { html }
}
