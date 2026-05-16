import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Wrench, Globe } from 'lucide-react'
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
      return filteredTools.some((t) => t.category === c.id)
    }
    return toolsByCategory.has(c.id)
  })

  const getTools = (categoryId: string): ToolMeta[] => {
    if (filteredTools) {
      return filteredTools.filter((t) => t.category === categoryId)
    }
    return toolsByCategory.get(categoryId as Category) ?? []
  }

  return (
    <div className="min-h-screen bg-bg-primary text-gray-900 dark:bg-surface-dark dark:text-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Wrench size={28} className="text-brand" />
            <h1 className="text-2xl font-bold tracking-tight">DevKit</h1>
            <button
              onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
              className="ml-2 flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <Globe size={12} />
              {locale === 'zh' ? 'En' : '中'}
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('home.subtitle')}
          </p>
        </div>

        <div className="relative mx-auto mb-10 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('home.search')}
            className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand dark:border-border-dark dark:bg-surface-dark dark:text-gray-200 dark:placeholder:text-gray-500"
          />
        </div>

        {categories.map((category) => {
          const tools = getTools(category.id)
          if (tools.length === 0) return null
          return (
            <section key={category.id} className="mb-8">
              <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {t(category.labelKey)}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {tools.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className="group flex flex-col gap-2 rounded-lg border border-border bg-white p-4 transition-all hover:border-brand hover:shadow-sm dark:border-border-dark dark:bg-surface-dark dark:hover:border-brand"
                  >
                    <tool.icon
                      size={22}
                      className="text-gray-400 transition-colors group-hover:text-brand dark:text-gray-500 dark:group-hover:text-brand"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {locale === 'en' ? tool.nameEn : tool.name}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-400 dark:text-gray-500 line-clamp-2">
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
