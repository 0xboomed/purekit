import { useState, useMemo } from 'react'
import { ToolPageSplit } from '@/components/shared/tool-page-split'
import { ToolCard } from '@/components/shared/tool-card'
import { ToolInput } from '@/components/shared/tool-input'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'
import { parseUrl } from './url-parser-logic'

const SAMPLE_URL = 'https://example.com:8080/path/to/page?name=devkit&version=2.0&theme=dark#section-1'

export default function UrlParserTool() {
  const { t } = useT()
  const [input, setInput] = useState('')

  const result = useMemo(() => parseUrl(input), [input])

  const parts = result.data
    ? [
        { label: t('urlparser.protocol'), value: result.data.protocol },
        { label: t('urlparser.hostname'), value: result.data.hostname },
        { label: t('urlparser.port'), value: result.data.port },
        { label: t('urlparser.pathname'), value: result.data.pathname },
        { label: t('urlparser.hash'), value: result.data.hash },
      ]
    : []

  return (
    <ToolPageSplit
      settings={
        <ToolCard
          title={t('common.input')}
          titleAction={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setInput(SAMPLE_URL)}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {t('common.example')}
              </button>
              <button
                onClick={() => setInput('')}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {t('common.clear')}
              </button>
            </div>
          }
        >
          <ToolInput
            value={input}
            onChange={setInput}
            placeholder={t('urlparser.inputPlaceholder')}
            mono
          />
        </ToolCard>
      }
      output={
        <div className="flex flex-col gap-4">
          {result.isError && (
            <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {t('urlparser.invalidUrl')}
            </div>
          )}

          {parts.length > 0 && (
            <ToolCard title={t('common.output')}>
              <div className="flex flex-col gap-0">
                {parts.map((part) => (
                  <div
                    key={part.label}
                    className="flex items-center gap-3 border-b border-gray-100 py-2 last:border-b-0 dark:border-gray-800"
                  >
                    <span className="w-16 shrink-0 text-xs font-medium text-gray-400">
                      {part.label}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-mono text-sm text-gray-700 dark:text-gray-200">
                      {part.value || '-'}
                    </span>
                    <CopyButton text={part.value} />
                  </div>
                ))}
              </div>
            </ToolCard>
          )}

          {parts.length > 0 && (
            <ToolCard title={t('urlparser.queryParams')}>
              {result.data!.params.length === 0 ? (
                <p className="text-sm text-gray-400">{t('urlparser.noParams')}</p>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-400">
                        <th className="pb-2 pr-3 font-medium">{t('urlparser.key')}</th>
                        <th className="pb-2 pr-3 font-medium">{t('urlparser.value')}</th>
                        <th className="pb-2 w-16" />
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {result.data!.params.map((param, i) => (
                        <tr
                          key={i}
                          className="border-t border-gray-100 dark:border-gray-800"
                        >
                          <td className="py-1.5 pr-3 font-medium text-brand">{param.key}</td>
                          <td className="py-1.5 pr-3 text-gray-600 dark:text-gray-300">
                            {param.value}
                          </td>
                          <td className="py-1.5">
                            <CopyButton text={param.value} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </ToolCard>
          )}

          {!input.trim() && !result.isError && (
            <div className="flex items-center justify-center py-16 text-sm text-gray-400">
              {t('urlparser.inputPlaceholder')}
            </div>
          )}
        </div>
      }
    />
  )
}
