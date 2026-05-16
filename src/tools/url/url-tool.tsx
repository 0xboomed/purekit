import { useState, useCallback } from 'react'
import { ToolPageDual } from '@/components/shared/tool-page-dual'
import { ToolCard } from '@/components/shared/tool-card'
import { ToolInput } from '@/components/shared/tool-input'
import { ToolOutput } from '@/components/shared/tool-output'
import { ToolActionBar } from '@/components/shared/tool-action-bar'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'

export default function UrlTool() {
  const { t } = useT()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [params, setParams] = useState<Array<{ key: string; value: string }>>([])

  const encode = useCallback(() => {
    if (!input) return
    setOutput(encodeURIComponent(input))
    setError('')
  }, [input])

  const decode = useCallback(() => {
    if (!input) return
    try {
      setOutput(decodeURIComponent(input))
      setError('')
    } catch {
      setError(t('url.decodeError'))
    }
  }, [input])

  const parseParams = useCallback(() => {
    if (!input) return
    try {
      let url = input.trim()
      if (!url.includes('?')) {
        url = 'https://example.com?' + url
      }
      const urlObj = new URL(url.startsWith('http') ? url : 'https://example.com' + (url.startsWith('/') ? url : '/' + url))
      if (!input.includes('http') && input.includes('?')) {
        const qs = input.substring(input.indexOf('?') + 1)
        const sp = new URLSearchParams(qs)
        const parsed: Array<{ key: string; value: string }> = []
        sp.forEach((v, k) => parsed.push({ key: k, value: v }))
        setParams(parsed)
        setOutput(JSON.stringify(Object.fromEntries(sp), null, 2))
      } else {
        const parsed: Array<{ key: string; value: string }> = []
        urlObj.searchParams.forEach((v, k) => parsed.push({ key: k, value: v }))
        setParams(parsed)
        setOutput(JSON.stringify(Object.fromEntries(urlObj.searchParams), null, 2))
      }
      setError('')
    } catch {
      setError(t('url.parseError'))
    }
  }, [input])

  const buildQuery = useCallback(() => {
    if (!input) return
    try {
      const obj = JSON.parse(input)
      const sp = new URLSearchParams()
      for (const [k, v] of Object.entries(obj)) {
        sp.set(k, String(v))
      }
      setOutput(sp.toString())
      setError('')
    } catch {
      setError(t('url.jsonError'))
    }
  }, [input])

  return (
    <ToolPageDual
      left={
        <>
          <ToolCard
            title={t('common.input')}
            titleAction={
              <button onClick={() => { setInput(''); setOutput(''); setError(''); setParams([]) }} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                {t('common.clear')}
              </button>
            }
          >
            <ToolInput value={input} onChange={setInput} placeholder={t('url.inputPlaceholder')} />
          </ToolCard>

          <ToolActionBar className="flex-wrap">
            <button onClick={encode} className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light">
              {t('url.encode')}
            </button>
            <button onClick={decode} className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-bg-secondary dark:border-border-dark dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
              {t('url.decode')}
            </button>
            <button onClick={parseParams} className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-bg-secondary dark:border-border-dark dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
              {t('url.parseParams')}
            </button>
            <button onClick={buildQuery} className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-bg-secondary dark:border-border-dark dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
              {t('url.jsonToQuery')}
            </button>
          </ToolActionBar>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
        </>
      }
      right={
        <div className="flex flex-col gap-4">
          {params.length > 0 && (
            <ToolCard title={t('url.paramsList')}>
              <div className="space-y-1">
                {params.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-brand">{p.key}</span>
                    <span className="text-gray-400">=</span>
                    <span className="text-gray-700 dark:text-gray-300">{p.value}</span>
                  </div>
                ))}
              </div>
            </ToolCard>
          )}
          <ToolCard title={t('common.output')} titleAction={<CopyButton text={output} />} className="flex-1">
            <ToolOutput value={output} placeholder={t('json.outputPlaceholder')} className="min-h-0 flex-1" />
          </ToolCard>
        </div>
      }
    />
  )
}
