import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Mode = 'light' | 'dark' | 'system'

type ThemeState = {
  mode: Mode
  init: () => void
  setMode: (m: Mode) => void
  toggle: () => void
}

function apply(mode: Mode) {
  const root = document.documentElement
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  const isDark = mode === 'dark' || (mode === 'system' && prefersDark)
  root.classList.toggle('dark', isDark)
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      init: () => apply(get().mode),
      setMode: (m) => {
        set({ mode: m })
        apply(m)
      },
      toggle: () => {
        const next = get().mode === 'dark' ? 'light' : 'dark'
        set({ mode: next })
        apply(next)
      },
    }),
    { name: 'theme' }
  )
)

