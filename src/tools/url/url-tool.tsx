import { useState, useCallback } from 'react'
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
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-500">{t('common.input')}</label>
        <button
          onClick={() => { setInput(''); setOutput(''); setError(''); setParams([]) }}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {t('common.clear')}
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t('url.inputPlaceholder')}
        spellCheck={false}
        className="min-h-[140px] flex-1 rounded-lg border border-border bg-white p-3 font-mono text-sm text-gray-700 outline-none transition-colors focus:border-brand dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
      />

      <div className="flex items-center gap-2">
        <button onClick={encode} className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-light">
          {t('url.encode')}
        </button>
        <button onClick={decode} className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          {t('url.decode')}
        </button>
        <button onClick={parseParams} className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          {t('url.parseParams')}
        </button>
        <button onClick={buildQuery} className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          {t('url.jsonToQuery')}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {params.length > 0 && (
        <div className="rounded-lg border border-border bg-gray-50 p-3 dark:border-border-dark dark:bg-gray-900/50">
          <div className="mb-2 text-xs font-medium text-gray-500">{t('url.paramsList')}</div>
          <div className="space-y-1">
            {params.map((p, i) => (
              <div key={i} className="flex items-center gap-2 font-mono text-xs">
                <span className="text-brand">{p.key}</span>
                <span className="text-gray-400">=</span>
                <span className="text-gray-700 dark:text-gray-300">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-500">{t('common.output')}</label>
        <CopyButton text={output} />
      </div>
      <textarea
        value={output}
        readOnly
        placeholder={t('json.outputPlaceholder')}
        className="min-h-[140px] flex-1 rounded-lg border border-border bg-gray-50 p-3 font-mono text-sm text-gray-700 dark:border-border-dark dark:bg-gray-900/50 dark:text-gray-200"
      />
    </div>
  )
}
