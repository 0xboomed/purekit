import { useAppStore } from '@/stores/use-app-store'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'

export function StatusBar() {
  const cursorLine = useAppStore((s) => s.cursorLine)
  const cursorCol = useAppStore((s) => s.cursorCol)
  const lastSavedAt = useAppStore((s) => s.lastSavedAt)

  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    setShowSaved(true)
    const timer = setTimeout(() => setShowSaved(false), 2000)
    return () => clearTimeout(timer)
  }, [lastSavedAt])

  return (
    <footer className="flex h-6 shrink-0 items-center justify-between border-t border-border bg-surface px-3 text-xs text-gray-500 dark:border-border-dark dark:bg-surface-dark dark:text-gray-400">
      <div className="flex items-center gap-4">
        <span>
          行 {cursorLine}, 列 {cursorCol}
        </span>
        <span>UTF-8</span>
        <span>Markdown</span>
      </div>
      <div className="flex items-center gap-1">
        {showSaved ? (
          <>
            <Check size={12} className="text-green-500" />
            <span className="text-green-500">自动保存</span>
          </>
        ) : (
          <span>已保存</span>
        )}
      </div>
    </footer>
  )
}
