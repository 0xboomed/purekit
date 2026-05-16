import type { StateCreator } from 'zustand'
import type { Theme, ViewMode } from '@/types/editor'

export interface UISlice {
  theme: Theme
  viewMode: ViewMode
  showSettingsPanel: boolean
  editorPaneRatio: number
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setViewMode: (mode: ViewMode) => void
  toggleSettingsPanel: () => void
  setEditorPaneRatio: (ratio: number) => void
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  theme: 'light',
  viewMode: 'split',
  showSettingsPanel: false,
  editorPaneRatio: 0.5,
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleSettingsPanel: () => set((s) => ({ showSettingsPanel: !s.showSettingsPanel })),
  setEditorPaneRatio: (ratio) => set({ editorPaneRatio: ratio }),
})
