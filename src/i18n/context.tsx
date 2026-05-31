import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useAppStore } from '@/stores/use-app-store'
import { translations } from './translations'
import type { Locale } from './types'

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useAppStore((s) => s.locale)
  const setLocale = useAppStore((s) => s.setLocale)

  const t = (key: string): string => {
    return translations[locale]?.[key] ?? translations['zh']?.[key] ?? key
  }

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useT(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useT must be used within LocaleProvider')
  return ctx
}
