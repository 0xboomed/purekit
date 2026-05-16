import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createEditorSlice, type EditorSlice } from './slices/editor-slice'
import { createUISlice, type UISlice } from './slices/ui-slice'
import { createPdfSlice, type PdfSlice } from './slices/pdf-slice'

type StoreState = EditorSlice & UISlice & PdfSlice

export const useAppStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createEditorSlice(...a),
      ...createUISlice(...a),
      ...createPdfSlice(...a),
    }),
    {
      name: 'printdown-store',
      partialize: (state) => ({
        markdownContent: state.markdownContent,
        theme: state.theme,
        viewMode: state.viewMode,
        editorPaneRatio: state.editorPaneRatio,
        pdfSettings: state.pdfSettings,
        locale: state.locale,
      }),
    },
  ),
)
