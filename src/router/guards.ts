import type { Router } from 'vue-router'
import { useContactsStore } from '../stores/contacts'
import { usePortfolioStore } from '../stores/portfolio'

/**
 * Loads route data before the route resolves, so pages render complete content
 * on first paint and during prerendering.
 */
export function installPortfolioGuards(router: Router): void {
    router.beforeResolve(async (to) => {
        if (to.name === 'contact') {
            const parameter = to.params.code
            const code = Array.isArray(parameter) ? parameter[0] : parameter
            if (code) await useContactsStore().load(code)
            return true
        }

        if (to.name !== 'portfolio') return true
        const parameter = to.params.username
        const username = Array.isArray(parameter) ? parameter[0] : parameter
        if (!username) return true

        const store = usePortfolioStore()
        await store.load(username)
        return true
    })
}
