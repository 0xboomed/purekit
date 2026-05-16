import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createEditorSlice, type EditorSlice } from './slices/editor-slice'
import { createUISlice, type UISlice } from './slices/ui-slice'

type StoreState = EditorSlice & UISlice

export const useAppStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createEditorSlice(...a),
      ...createUISlice(...a),
    }),
    {
      name: 'printdown-store',
      partialize: (state) => ({
        markdownContent: state.markdownContent,
        theme: state.theme,
        viewMode: state.viewMode,
        editorPaneRatio: state.editorPaneRatio,
      }),
    },
  ),
)
