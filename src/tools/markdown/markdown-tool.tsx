import { useAppStore } from '@/stores/use-app-store'
import { Toolbar } from '@/components/toolbar/toolbar'
import { StatusBar } from '@/components/status-bar/status-bar'
import { EditorPane } from '@/components/editor-pane/editor-pane'
import { PreviewPane } from '@/components/preview-pane/preview-pane'
import { DropZone } from '@/components/file-upload/drop-zone'
import { PdfSettingsPanel } from '@/components/pdf-export/pdf-settings-panel'
import { PenLine } from 'lucide-react'
import { useT } from '@/i18n/context'

export default function MarkdownTool() {
  const { t } = useT()
  const viewMode = useAppStore((s) => s.viewMode)
  const setViewMode = useAppStore((s) => s.setViewMode)

  return (
    <>
      <DropZone />
      <div className="flex h-full flex-col">
        <Toolbar />

        <main className="relative flex min-h-0 flex-1 overflow-hidden">
          <div
            className={`h-full ${viewMode === 'preview' ? 'hidden' : ''} ${viewMode === 'split' || viewMode === 'editor' ? 'w-full' : 'hidden'} ${viewMode === 'split' ? 'md:w-1/2' : 'w-full'}`}
          >
            <EditorPane />
          </div>

          {viewMode === 'split' && (
            <div className="hidden w-px shrink-0 bg-border dark:bg-border-dark md:block" />
          )}

          <div
            className={`min-h-0 ${viewMode === 'editor' ? 'hidden' : ''} ${viewMode === 'split' ? 'hidden md:block md:w-1/2' : 'w-full'}`}
          >
            <PreviewPane />
          </div>

          {viewMode === 'preview' && (
            <button
              onClick={() => setViewMode('editor')}
              className="fixed bottom-14 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-transform hover:scale-105 hover:bg-brand-light md:hidden"
              title={t('markdown.edit')}
            >
              <PenLine size={20} />
            </button>
          )}
        </main>

        <StatusBar />
      </div>

      <PdfSettingsPanel />
    </>
  )
}
