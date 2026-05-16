import { useState } from 'react'
import {
  FileUp,
  Moon,
  Sun,
  Download,
  FileText,
  Settings,
  Loader2,
} from 'lucide-react'
import { useAppStore } from '@/stores/use-app-store'
import { FileUpload } from '@/components/file-upload/file-upload'
import { exportPdf } from '@/lib/pdf-export'

export function Toolbar() {
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const viewMode = useAppStore((s) => s.viewMode)
  const setViewMode = useAppStore((s) => s.setViewMode)
  const toggleSettingsPanel = useAppStore((s) => s.toggleSettingsPanel)
  const markdownContent = useAppStore((s) => s.markdownContent)
  const pdfSettings = useAppStore((s) => s.pdfSettings)

  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      await exportPdf(markdownContent, pdfSettings)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  return (
    <header className="flex h-10 shrink-0 items-center justify-between border-b border-border bg-surface px-3 dark:border-border-dark dark:bg-surface-dark">
      <div className="flex items-center gap-2.5">
        <FileText size={20} className="text-brand" />
        <span className="text-sm font-semibold tracking-tight text-gray-800 dark:text-gray-200">
          Printdown
        </span>
      </div>

      <div className="flex items-center gap-0.5">
        {/* View mode toggle */}
        <div className="mr-1 flex items-center rounded-md bg-bg-secondary p-0.5 dark:bg-bg-secondary-dark">
          {(['editor', 'split', 'preview'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${
                viewMode === mode
                  ? 'bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-gray-100'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              {mode === 'editor' ? '编辑' : mode === 'preview' ? '预览' : '双栏'}
            </button>
          ))}
        </div>

        <button
          onClick={toggleTheme}
          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-bg-secondary hover:text-gray-600 dark:text-gray-500 dark:hover:bg-bg-secondary-dark dark:hover:text-gray-300"
          title={theme === 'light' ? '切换暗色主题' : '切换亮色主题'}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <label
          className="cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:bg-bg-secondary hover:text-gray-600 dark:text-gray-500 dark:hover:bg-bg-secondary-dark dark:hover:text-gray-300"
          title="上传文件"
        >
          <FileUp size={16} />
          <FileUpload />
        </label>

        <button
          onClick={toggleSettingsPanel}
          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-bg-secondary hover:text-gray-600 dark:text-gray-500 dark:hover:bg-bg-secondary-dark dark:hover:text-gray-300"
          title="PDF 设置"
        >
          <Settings size={16} />
        </button>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="ml-1 flex items-center gap-1.5 rounded-md bg-brand px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-brand-light disabled:opacity-40"
          title="导出 PDF"
        >
          {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          <span className="hidden sm:inline">{exporting ? '生成中...' : '导出 PDF'}</span>
        </button>
      </div>
    </header>
  )
}
