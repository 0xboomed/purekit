import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAppStore } from '@/stores/use-app-store'
import { useT } from '@/i18n/context'
import { HomePage } from '@/components/home/home-page'
import { ToolLayout } from '@/components/layout/tool-layout'
import { getTools } from '@/tools/registry'
import '@/tools'

export function App() {
  const theme = useAppStore((s) => s.theme)

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {getTools().map((tool) => (
          <Route
            key={tool.path}
            path={tool.path}
            element={
              <ToolLayout title={tool.name} titleEn={tool.nameEn} icon={tool.icon} description={tool.description} descriptionEn={tool.descriptionEn}>
                <Suspense fallback={<ToolLoading />}>
                  <tool.component />
                </Suspense>
              </ToolLayout>
            }
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

function ToolLoading() {
  return (
    <div className="flex h-screen items-center justify-center text-gray-400">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-brand" />
    </div>
  )
}

function NotFound() {
  const { t } = useT()
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 text-gray-400">
      <p className="text-lg font-medium">404</p>
      <p className="text-sm">{t('common.notFound')}</p>
    </div>
  )
}
