import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'

const SAMPLE = JSON.stringify(
  { name: 'DevKit', version: '1.0.0', features: ['json', 'base64', 'hash'], nested: { key: 'value' } },
  null,
  0,
)

export default function JsonTool() {
  const { t } = useT()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)

  const formatJson = useCallback(() => {
    if (!input.trim()) return
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indent))
      setError('')
    } catch (e) {
      setError((e as SyntaxError).message)
      setOutput('')
    }
  }, [input, indent])

  const minifyJson = useCallback(() => {
    if (!input.trim()) return
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (e) {
      setError((e as SyntaxError).message)
      setOutput('')
    }
  }, [input])

  const validateJson = useCallback(() => {
    if (!input.trim()) return
    try {
      JSON.parse(input)
      setError('')
      setOutput(t('json.valid'))
    } catch (e) {
      setError((e as SyntaxError).message)
      setOutput('')
    }
  }, [input, t])

  const sortKeys = useCallback(() => {
    if (!input.trim()) return
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(sortObjectKeys(parsed), null, indent))
      setError('')
    } catch (e) {
      setError((e as SyntaxError).message)
      setOutput('')
    }
  }, [input, indent])

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-500">{t('common.input')}</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setInput(SAMPLE); setOutput(''); setError('') }}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {t('common.example')}
          </button>
          <button
            onClick={() => { setInput(''); setOutput(''); setError('') }}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {t('common.clear')}
          </button>
        </div>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t('json.inputPlaceholder')}
        spellCheck={false}
        className="min-h-[160px] flex-1 rounded-lg border border-border bg-white p-3 font-mono text-sm text-gray-700 outline-none transition-colors focus:border-brand dark:border-border-dark dark:bg-gray-900 dark:text-gray-200 dark:placeholder:text-gray-600"
      />

      <div className="flex items-center gap-2">
        <button onClick={formatJson} className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-light">
          {t('json.format')}
        </button>
        <button onClick={minifyJson} className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          {t('json.minify')}
        </button>
        <button onClick={validateJson} className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          {t('json.validate')}
        </button>
        <button onClick={sortKeys} className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          {t('json.sortKeys')}
        </button>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-xs text-gray-400">{t('json.indent')}</span>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded border border-border bg-white px-1.5 py-0.5 text-xs text-gray-600 dark:border-border-dark dark:bg-gray-900 dark:text-gray-300"
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={8}>8</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
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
        className="min-h-[160px] flex-1 rounded-lg border border-border bg-gray-50 p-3 font-mono text-sm text-gray-700 dark:border-border-dark dark:bg-gray-900/50 dark:text-gray-200"
      />
    </div>
  )
}

function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortObjectKeys)
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortObjectKeys((obj as Record<string, unknown>)[key])
        return acc
      }, {})
  }
  return obj
}
