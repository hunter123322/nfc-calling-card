import type { RouteRecordRaw, RouterHistory } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import ContactCard from '../pages/Contacts.vue'
import Portfolio from '../pages/Portfolio.vue'
import NotFound from '../pages/NotFound.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/contacts',
    redirect: { name: 'home' },
  },
  {
    path: '/contacts/:code',
    name: 'contact',
    component: ContactCard,
  },
  {
    path: '/:username',
    name: 'portfolio',
    component: Portfolio,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
]

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * History is injected so the same routes work in the browser (web history) and
 * during prerendering (memory history).
 */
export function createAppRouter(history?: RouterHistory) {
  return createRouter({
    history: history ?? createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return savedPosition
      const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
      if (to.hash) return { el: to.hash, top: 96, behavior }
      return { top: 0, behavior }
    },
  })
}
