import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useT } from '@/i18n/context'

interface ToolLayoutProps {
  title: string
  titleEn: string
  description?: string
  descriptionEn?: string
  icon: LucideIcon
  children: React.ReactNode
}

export function ToolLayout({ title, titleEn, description, descriptionEn, icon: Icon, children }: ToolLayoutProps) {
  const navigate = useNavigate()
  const { t, locale, setLocale } = useT()

  const displayName = locale === 'en' ? titleEn : title

  useEffect(() => {
    document.title = `${displayName} - ${t('seo.title')} | DevKit`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      const desc = locale === 'en' ? descriptionEn : description
      meta.setAttribute('content', `${desc ?? ''}. ${t('common.freeOffline')}`)
    }
    return () => {
      document.title = `DevKit — ${t('seo.defaultTitle')}`
      if (meta) {
        meta.setAttribute('content', 'Zero-install, fully offline, privacy-first developer toolkit.')
      }
    }
  }, [displayName, description, descriptionEn, locale, t])

  return (
    <div className="flex h-screen flex-col bg-white text-gray-900 dark:bg-surface-dark dark:text-gray-100">
      <header className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-surface px-3 dark:border-border-dark dark:bg-surface-dark">
        <button
          onClick={() => navigate('/')}
          className="rounded-md p-1 text-gray-400 transition-colors hover:bg-bg-secondary hover:text-gray-600 dark:text-gray-500 dark:hover:bg-bg-secondary-dark dark:hover:text-gray-300"
          title={t('common.back')}
        >
          <ArrowLeft size={16} />
        </button>
        <Icon size={18} className="text-brand" />
        <span className="text-sm font-semibold tracking-tight text-gray-800 dark:text-gray-200">
          {displayName}
        </span>
        <button
          onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
          className="ml-auto flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <Globe size={12} />
          {locale === 'zh' ? 'En' : '中'}
        </button>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  )
}
