import { useAppStore } from '@/stores/use-app-store'
import { Toolbar } from '@/components/toolbar/toolbar'
import { StatusBar } from '@/components/status-bar/status-bar'
import { EditorPane } from '@/components/editor-pane/editor-pane'
import { PreviewPane } from '@/components/preview-pane/preview-pane'
import { DropZone } from '@/components/file-upload/drop-zone'
import { PdfSettingsPanel } from '@/components/pdf-export/pdf-settings-panel'
import { PenLine } from 'lucide-react'

export function App() {
  const theme = useAppStore((s) => s.theme)
  const viewMode = useAppStore((s) => s.viewMode)
  const setViewMode = useAppStore((s) => s.setViewMode)

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <DropZone />
      <div className="grid h-screen grid-rows-[40px_1fr_24px] bg-white text-gray-900 dark:bg-surface-dark dark:text-gray-100">
        <Toolbar />

        <main className="relative flex min-h-0 overflow-hidden">
          {/* Editor pane */}
          <div
            className={`h-full ${viewMode === 'preview' ? 'hidden' : ''} ${viewMode === 'split' || viewMode === 'editor' ? 'w-full' : 'hidden'} ${viewMode === 'split' ? 'md:w-1/2' : 'w-full'}`}
          >
            <EditorPane />
          </div>

          {/* Divider */}
          {viewMode === 'split' && (
            <div className="hidden w-px shrink-0 bg-border dark:bg-border-dark md:block" />
          )}

          {/* Preview pane */}
          <div
            className={`min-h-0 ${viewMode === 'editor' ? 'hidden' : ''} ${viewMode === 'split' ? 'hidden md:block md:w-1/2' : 'w-full'}`}
          >
            <PreviewPane />
          </div>

          {/* Mobile floating edit button */}
          {viewMode === 'preview' && (
            <button
              onClick={() => setViewMode('editor')}
              className="fixed bottom-14 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-transform hover:scale-105 hover:bg-brand-light md:hidden"
              title="编辑"
            >
              <PenLine size={20} />
            </button>
          )}
        </main>

        <StatusBar />
      </div>

      <PdfSettingsPanel />
    </div>
  )
}
