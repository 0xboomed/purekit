import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Globe, Moon, Sun } from 'lucide-react'
import { getToolsByCategory, searchTools, CATEGORIES } from '@/tools/registry'
import type { Category, ToolMeta } from '@/tools/registry'
import { useT } from '@/i18n/context'
import { useAppStore } from '@/stores/use-app-store'

interface RecommendedTool {
  name: string
  nameEn: string
  url: string
  description: string
  descriptionEn: string
}

interface RecommendedCategory {
  name: string
  nameEn: string
  tools: RecommendedTool[]
}

const RECOMMENDED: RecommendedCategory[] = [
  {
    name: '编辑器 / IDE',
    nameEn: 'Editor / IDE',
    tools: [
      { name: 'VS Code', nameEn: 'VS Code', url: 'https://code.visualstudio.com', description: '微软开源代码编辑器', descriptionEn: 'Open-source code editor by Microsoft' },
      { name: 'Cursor', nameEn: 'Cursor', url: 'https://cursor.com', description: 'AI-first 代码编辑器', descriptionEn: 'AI-first code editor' },
      { name: 'Windsurf', nameEn: 'Windsurf', url: 'https://windsurf.com', description: 'Codeium 出品 AI 编辑器', descriptionEn: 'AI editor by Codeium' },
      { name: 'Zed', nameEn: 'Zed', url: 'https://zed.dev', description: 'Rust 编写的高性能编辑器', descriptionEn: 'High-performance editor built in Rust' },
      { name: 'JetBrains', nameEn: 'JetBrains', url: 'https://www.jetbrains.com', description: '专业 IDE 全家桶', descriptionEn: 'Professional IDE suite' },
      { name: 'Neovim', nameEn: 'Neovim', url: 'https://neovim.io', description: '现代化的 Vim 编辑器', descriptionEn: 'Modern Vim-based editor' },
    ],
  },
  {
    name: '终端 / Shell',
    nameEn: 'Terminal / Shell',
    tools: [
      { name: 'Warp', nameEn: 'Warp', url: 'https://www.warp.dev', description: 'AI 驱动的现代终端', descriptionEn: 'AI-powered modern terminal' },
      { name: 'iTerm2', nameEn: 'iTerm2', url: 'https://iterm2.com', description: 'macOS 上的终端替代品', descriptionEn: 'Terminal replacement for macOS' },
      { name: 'Windows Terminal', nameEn: 'Windows Terminal', url: 'https://aka.ms/terminal', description: 'Windows 官方现代终端', descriptionEn: 'Official modern terminal for Windows' },
    ],
  },
  {
    name: 'AI 工具',
    nameEn: 'AI Tools',
    tools: [
      { name: 'Claude Code', nameEn: 'Claude Code', url: 'https://docs.anthropic.com/en/docs/claude-code', description: 'Anthropic 的 AI 编程助手 CLI', descriptionEn: 'AI coding assistant CLI by Anthropic' },
      { name: 'OpenCode', nameEn: 'OpenCode', url: 'https://opencode.ai', description: '开源终端 AI 编程代理', descriptionEn: 'Open-source terminal AI coding agent' },
      { name: 'Hermes Agent', nameEn: 'Hermes Agent', url: 'https://hermes-agent.nousresearch.com', description: '自我学习的 AI 代理框架', descriptionEn: 'Self-improving AI agent framework' },
      { name: 'OpenClaw', nameEn: 'OpenClaw', url: 'https://openclaw.ai', description: '开源个人 AI 助手', descriptionEn: 'Open-source personal AI assistant' },
      { name: 'GitHub Copilot', nameEn: 'GitHub Copilot', url: 'https://github.com/features/copilot', description: 'AI 代码补全', descriptionEn: 'AI code completion' },
      { name: 'ChatGPT', nameEn: 'ChatGPT', url: 'https://chat.openai.com', description: 'OpenAI 对话式 AI', descriptionEn: 'Conversational AI by OpenAI' },
    ],
  },
  {
    name: 'API & 调试',
    nameEn: 'API & Debug',
    tools: [
      { name: 'Postman', nameEn: 'Postman', url: 'https://www.postman.com', description: 'API 开发和测试平台', descriptionEn: 'API development and testing platform' },
      { name: 'Insomnia', nameEn: 'Insomnia', url: 'https://insomnia.rest', description: '轻量级 REST 客户端', descriptionEn: 'Lightweight REST client' },
      { name: 'Hoppscotch', nameEn: 'Hoppscotch', url: 'https://hoppscotch.io', description: '开源 API 调试工具', descriptionEn: 'Open-source API debugging tool' },
    ],
  },
  {
    name: '版本控制',
    nameEn: 'Version Control',
    tools: [
      { name: 'GitHub', nameEn: 'GitHub', url: 'https://github.com', description: '代码托管和协作平台', descriptionEn: 'Code hosting and collaboration' },
      { name: 'GitKraken', nameEn: 'GitKraken', url: 'https://www.gitkraken.com', description: 'Git 可视化客户端', descriptionEn: 'Visual Git client' },
    ],
  },
  {
    name: '设计 / 截图',
    nameEn: 'Design / Screenshot',
    tools: [
      { name: 'Figma', nameEn: 'Figma', url: 'https://www.figma.com', description: '协作设计工具', descriptionEn: 'Collaborative design tool' },
      { name: 'Excalidraw', nameEn: 'Excalidraw', url: 'https://excalidraw.com', description: '手绘风格白板', descriptionEn: 'Hand-drawn style whiteboard' },
      { name: 'Carbon', nameEn: 'Carbon', url: 'https://carbon.now.sh', description: '代码截图美化', descriptionEn: 'Beautiful code screenshots' },
    ],
  },
]

function ToolFavicon({ url, name }: { url: string; name: string }) {
  const domain = new URL(url).hostname
  const [error, setError] = useState(false)

  if (error) {
    const letter = name.charAt(0).toUpperCase()
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand/10 text-sm font-bold text-brand dark:bg-brand/15">
        {letter}
      </div>
    )
  }

  return (
    <img
      src={`/favicons/${domain}.png`}
      alt={name}
      onError={() => setError(true)}
      className="h-8 w-8 shrink-0 rounded-md object-contain"
    />
  )
}

export function HomePage() {
  const [query, setQuery] = useState('')
  const { t, locale, setLocale } = useT()
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

  useEffect(() => {
    document.title = `PureKit — ${t('seo.defaultTitle')}`
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
            {/* Top-right controls */}
            <div className="absolute right-0 top-0 flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center rounded-full border border-border p-1.5 text-gray-500 transition-colors hover:border-brand hover:text-brand dark:border-border-dark dark:text-gray-400 dark:hover:border-brand dark:hover:text-brand"
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <button
                onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
                className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-gray-500 transition-colors hover:border-brand hover:text-brand dark:border-border-dark dark:text-gray-400 dark:hover:border-brand dark:hover:text-brand"
              >
                <Globe size={12} />
                {locale === 'zh' ? 'En' : '中'}
              </button>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              PureKit
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

      {/* Recommended tools */}
      <div className="border-t border-border bg-bg-secondary dark:border-border-dark dark:bg-bg-secondary-dark">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="mb-6 flex items-center gap-2.5">
            <div className="h-4 w-1 rounded-full bg-brand" />
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('recommend.title')}
            </h2>
          </div>

          <div className="space-y-8">
            {RECOMMENDED.map((cat) => (
              <div key={cat.nameEn}>
                <h3 className="mb-3 text-xs font-medium text-gray-400 dark:text-gray-500">
                  {locale === 'en' ? cat.nameEn : cat.name}
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {cat.tools.map((tool) => (
                    <a
                      key={tool.nameEn}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md dark:border-border-dark dark:bg-gray-900/80 dark:hover:border-brand/40"
                    >
                      <ToolFavicon url={tool.url} name={tool.nameEn} />
                      <div className="min-w-0">
                        <div className="truncate text-xs font-semibold text-gray-700 group-hover:text-brand dark:text-gray-300 dark:group-hover:text-brand">
                          {tool.nameEn}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] text-gray-400 dark:text-gray-500">
                          {locale === 'en' ? tool.descriptionEn : tool.description}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
