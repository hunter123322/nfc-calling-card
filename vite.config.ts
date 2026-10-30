import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

/**
 * `vite preview` does not resolve `/aldrin` to `dist/aldrin/index.html` (only
 * `/aldrin/`). Static hosts normally redirect, but the preview server needs a
 * hand so refresh works during verification.
 */
function cleanUrlPreview(): Plugin {
  return {
    name: 'portfolio-clean-url-preview',
    configurePreviewServer(server) {
      const outDir = path.resolve(server.config.root, server.config.build.outDir)
      server.middlewares.use((request, _response, next) => {
        if (!request.url || (request.method !== 'GET' && request.method !== 'HEAD')) {
          return next()
        }
        const url = new URL(request.url, 'http://localhost')
        let pathname: string
        try {
          pathname = decodeURIComponent(url.pathname)
        } catch {
          return next()
        }
        if (pathname === '/' || pathname.endsWith('/') || path.extname(pathname)) return next()

        const candidate = path.resolve(outDir, pathname.slice(1), 'index.html')
        if (!candidate.startsWith(`${outDir}${path.sep}`)) return next()
        if (existsSync(candidate)) request.url = `${pathname}/${url.search}`
        return next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), vueDevTools(), cleanUrlPreview()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // gray-matter uses Buffer; browsers get the browserify polyfill.
      buffer: 'buffer/',
    },
  },
  define: {
    global: 'globalThis',
  },
})
