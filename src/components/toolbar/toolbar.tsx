import {
  FileUp,
  Moon,
  Sun,
  Download,
} from 'lucide-react'
import { useAppStore } from '@/stores/use-app-store'
import { FileUpload } from '@/components/file-upload/file-upload'

export function Toolbar() {
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const viewMode = useAppStore((s) => s.viewMode)
  const setViewMode = useAppStore((s) => s.setViewMode)

  return (
    <header className="flex h-10 shrink-0 items-center justify-between border-b border-border bg-surface px-4 dark:border-border-dark dark:bg-surface-dark">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-brand">Printdown</span>
      </div>

      <div className="flex items-center gap-1">
        {/* View mode toggles (tablet/mobile) */}
        <div className="mr-2 hidden gap-1 md:flex lg:hidden">
          {(['editor', 'split', 'preview'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`rounded px-2 py-0.5 text-xs ${viewMode === mode ? 'bg-brand text-white' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}
            >
              {mode === 'editor' ? '编辑' : mode === 'preview' ? '预览' : '双栏'}
            </button>
          ))}
        </div>

        <button
          onClick={toggleTheme}
          className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          title={theme === 'light' ? '切换暗色主题' : '切换亮色主题'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <label
          className="cursor-pointer rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          title="上传文件"
        >
          <FileUp size={18} />
          <FileUpload />
        </label>

        <button
          className="flex items-center gap-1.5 rounded bg-brand px-3 py-1 text-sm font-medium text-white hover:bg-brand-light disabled:opacity-40"
          title="导出 PDF（Phase 2）"
          disabled
        >
          <Download size={16} />
          <span className="hidden sm:inline">导出 PDF</span>
        </button>
      </div>
    </header>
  )
}
