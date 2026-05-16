import type { StateCreator } from 'zustand'
import type { Theme, ViewMode } from '@/types/editor'
import type { Locale } from '@/i18n/types'

export interface UISlice {
  theme: Theme
  viewMode: ViewMode
  showSettingsPanel: boolean
  editorPaneRatio: number
  locale: Locale
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setViewMode: (mode: ViewMode) => void
  toggleSettingsPanel: () => void
  setEditorPaneRatio: (ratio: number) => void
  setLocale: (locale: Locale) => void
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  theme: 'light',
  viewMode: 'split',
  showSettingsPanel: false,
  editorPaneRatio: 0.5,
  locale: 'zh',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleSettingsPanel: () => set((s) => ({ showSettingsPanel: !s.showSettingsPanel })),
  setEditorPaneRatio: (ratio) => set({ editorPaneRatio: ratio }),
  setLocale: (locale) => set({ locale }),
})
