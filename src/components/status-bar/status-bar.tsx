import { useAppStore } from '@/stores/use-app-store'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useT } from '@/i18n/context'

export function StatusBar() {
  const { t } = useT()
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
    <footer className="flex h-6 shrink-0 items-center justify-between border-t border-border bg-surface px-3 text-[11px] text-gray-400 dark:border-border-dark dark:bg-surface-dark dark:text-gray-500">
      <div className="flex items-center gap-4">
        <span>
          {t('status.lineCol').replace('{line}', String(cursorLine)).replace('{col}', String(cursorCol))}
        </span>
        <span>UTF-8</span>
        <span>Markdown</span>
      </div>
      <div className="flex items-center gap-1">
        {showSaved ? (
          <>
            <Check size={10} className="text-emerald-500" />
            <span className="text-emerald-500">{t('status.autoSaved')}</span>
          </>
        ) : (
          <span>{t('status.saved')}</span>
        )}
      </div>
    </footer>
  )
}
