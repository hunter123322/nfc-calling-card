import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ThemePreference } from '../types/portfolio'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'portfolio-theme'

const THEME_COLORS: Record<ThemeMode, string> = {
  light: '#f5f5f7',
  dark: '#050506',
}

function readStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

function systemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function persistTheme(mode: ThemeMode): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // Storage can be unavailable in private browsing; the theme still applies.
  }
}

function paintTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', mode === 'dark')
  root.style.colorScheme = mode

  let meta = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.appendChild(meta)
  }
  meta.content = THEME_COLORS[mode]
}

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>('light')
  const initialized = ref(false)
  let hintApplied = false

  const isDark = computed(() => mode.value === 'dark')

  /** Syncs the store with the class already applied by the inline boot script. */
  function init(): void {
    if (typeof window === 'undefined' || initialized.value) return
    mode.value = readStoredTheme() ?? systemTheme()
    initialized.value = true
    paintTheme(mode.value)

    const query = window.matchMedia('(prefers-color-scheme: dark)')
    query.addEventListener('change', (event) => {
      if (readStoredTheme()) return
      mode.value = event.matches ? 'dark' : 'light'
      paintTheme(mode.value)
    })
  }

  function toggle(): void {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    persistTheme(mode.value)
    paintTheme(mode.value)
  }

  /**
   * A portfolio may suggest a theme. It is honoured once per session, only when
   * the visitor has not chosen a theme themselves and the hint is explicit.
   */
  function applyPortfolioHint(preference: ThemePreference | undefined): void {
    if (typeof window === 'undefined' || hintApplied) return
    hintApplied = true
    if (readStoredTheme()) return
    if (preference !== 'light' && preference !== 'dark') return
    if (preference === mode.value) return
    mode.value = preference
    paintTheme(preference)
  }

  return { mode, isDark, initialized, init, toggle, applyPortfolioHint }
})
