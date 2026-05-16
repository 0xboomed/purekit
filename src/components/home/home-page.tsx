import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Globe } from 'lucide-react'
import { getToolsByCategory, searchTools, CATEGORIES } from '@/tools/registry'
import type { Category, ToolMeta } from '@/tools/registry'
import { useT } from '@/i18n/context'

export function HomePage() {
  const [query, setQuery] = useState('')
  const { t, locale, setLocale } = useT()

  useEffect(() => {
    document.title = `DevKit — ${t('seo.defaultTitle')}`
  }, [t])

  const toolsByCategory = useMemo(() => getToolsByCategory(), [])
  const filteredTools = useMemo(() => {
    if (!query.trim()) return null
    return searchTools(query)
  }, [query])

  const categories = CATEGORIES.filter((c) => {
    if (filteredTools) {
      return filteredTools.some((tool) => tool.category === c.id)
    }
    return toolsByCategory.has(c.id)
  })

  const getTools = (categoryId: string): ToolMeta[] => {
    if (filteredTools) {
      return filteredTools.filter((tool) => tool.category === categoryId)
    }
    return toolsByCategory.get(categoryId as Category) ?? []
  }

  return (
    <div className="min-h-screen bg-bg-primary text-gray-900 dark:bg-surface-dark dark:text-gray-100">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-surface-dark dark:to-gray-900">
        <div className="mx-auto max-w-5xl px-4 pt-16 pb-12">
          <div className="relative text-center">
            {/* Language toggle */}
            <button
              onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
              className="absolute right-0 top-0 flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-gray-500 transition-colors hover:border-brand hover:text-brand dark:border-border-dark dark:text-gray-400 dark:hover:border-brand dark:hover:text-brand"
            >
              <Globe size={12} />
              {locale === 'zh' ? 'En' : '中'}
            </button>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              DevKit
            </h1>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {t('home.subtitle')}
            </p>

            {/* Search */}
            <div className="relative mx-auto mt-8 max-w-lg">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('home.search')}
                className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-4 text-sm text-gray-700 shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-brand focus:shadow-md focus:ring-2 focus:ring-brand/10 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:ring-brand/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tools grid */}
      <div className="mx-auto max-w-5xl px-4 py-10">
        {categories.map((category) => {
          const tools = getTools(category.id)
          if (tools.length === 0) return null
          return (
            <section key={category.id} className="mb-10">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="h-4 w-1 rounded-full bg-brand" />
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t(category.labelKey)}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className="group flex items-start gap-4 rounded-xl border border-border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md dark:border-border-dark dark:bg-gray-900/80 dark:hover:border-brand/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white dark:bg-brand/15">
                      <tool.icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-800 group-hover:text-brand dark:text-gray-200 dark:group-hover:text-brand">
                        {locale === 'en' ? tool.nameEn : tool.name}
                      </div>
                      <div className="mt-1 text-xs leading-relaxed text-gray-400 dark:text-gray-500 line-clamp-2">
                        {locale === 'en' ? tool.descriptionEn : tool.description}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
