import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useT } from '@/i18n/context'
import { setToolJsonLd, clearToolJsonLd } from '@/lib/seo'

interface ToolLayoutProps {
  title: string
  titleEn: string
  description?: string
  descriptionEn?: string
  path?: string
  icon: LucideIcon
  children: React.ReactNode
}

export function ToolLayout({ title, titleEn, description, descriptionEn, path, icon: Icon, children }: ToolLayoutProps) {
  const navigate = useNavigate()
  const { t, locale, setLocale } = useT()

  const displayName = locale === 'en' ? titleEn : title

  useEffect(() => {
    document.title = `${displayName} - ${t('seo.title')} | PureKit`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      const desc = locale === 'en' ? descriptionEn : description
      meta.setAttribute('content', `${desc ?? ''}. ${t('common.freeOffline')}`)
    }
    if (path) {
      setToolJsonLd({
        name: displayName,
        description: (locale === 'en' ? descriptionEn : description) ?? displayName,
        path,
      })
    }
    return () => {
      document.title = `PureKit — ${t('seo.defaultTitle')}`
      if (meta) {
        meta.setAttribute('content', 'Zero-install, fully offline, privacy-first comprehensive toolkit.')
      }
      clearToolJsonLd()
    }
  }, [displayName, description, descriptionEn, path, locale, t])

  return (
    <div className="flex h-screen flex-col bg-white text-gray-900 dark:bg-surface-dark dark:text-gray-100">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-4 dark:border-border-dark dark:bg-surface-dark">
        <button
          onClick={() => navigate('/')}
          aria-label={t('common.back')}
          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-bg-secondary hover:text-gray-600 dark:text-gray-500 dark:hover:bg-bg-secondary-dark dark:hover:text-gray-300"
          title={t('common.back')}
        >
          <ArrowLeft size={16} />
        </button>
        <Icon size={20} className="text-brand" />
        <span className="text-sm font-semibold tracking-tight text-gray-800 dark:text-gray-200">
          {displayName}
        </span>
        {(description || descriptionEn) && (
          <span className="ml-2 hidden truncate text-xs text-gray-400 sm:inline dark:text-gray-500">
            {locale === 'en' ? descriptionEn : description}
          </span>
        )}
        <button
          onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
          aria-label={locale === 'zh' ? 'Switch to English' : '切换到中文'}
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
