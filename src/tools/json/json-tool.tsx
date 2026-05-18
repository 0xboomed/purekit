import { useState, useCallback } from 'react'
import { ToolPageDual } from '@/components/shared/tool-page-dual'
import { ToolCard } from '@/components/shared/tool-card'
import { ToolInput } from '@/components/shared/tool-input'
import { ToolOutput } from '@/components/shared/tool-output'
import { ToolActionBar } from '@/components/shared/tool-action-bar'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'

const SAMPLE = JSON.stringify(
  { name: 'PureKit', version: '1.0.0', features: ['json', 'base64', 'hash'], nested: { key: 'value' } },
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
      setOutput(JSON.stringify(JSON.parse(input), null, indent))
      setError('')
    } catch (e) {
      setError((e as SyntaxError).message)
      setOutput('')
    }
  }, [input, indent])

  const minifyJson = useCallback(() => {
    if (!input.trim()) return
    try {
      setOutput(JSON.stringify(JSON.parse(input)))
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
      setOutput(JSON.stringify(sortObjectKeys(JSON.parse(input)), null, indent))
      setError('')
    } catch (e) {
      setError((e as SyntaxError).message)
      setOutput('')
    }
  }, [input, indent])

  return (
    <ToolPageDual
      left={
        <>
          <ToolCard
            title={t('common.input')}
            titleAction={
              <div className="flex items-center gap-2">
                <button onClick={() => { setInput(SAMPLE); setOutput(''); setError('') }} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {t('common.example')}
                </button>
                <button onClick={() => { setInput(''); setOutput(''); setError('') }} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {t('common.clear')}
                </button>
              </div>
            }
          >
            <ToolInput value={input} onChange={setInput} placeholder={t('json.inputPlaceholder')} />
          </ToolCard>

          <ToolActionBar className="flex-wrap">
            <button onClick={formatJson} className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light">
              {t('json.format')}
            </button>
            <button onClick={minifyJson} className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-bg-secondary dark:border-border-dark dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
              {t('json.minify')}
            </button>
            <button onClick={validateJson} className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-bg-secondary dark:border-border-dark dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
              {t('json.validate')}
            </button>
            <button onClick={sortKeys} className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-bg-secondary dark:border-border-dark dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
              {t('json.sortKeys')}
            </button>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-xs text-gray-400">{t('json.indent')}</span>
              <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="rounded-md border border-border bg-white px-1.5 py-0.5 text-xs text-gray-600 dark:border-border-dark dark:bg-gray-900 dark:text-gray-300">
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={8}>8</option>
              </select>
            </div>
          </ToolActionBar>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
        </>
      }
      right={
        <ToolCard title={t('common.output')} titleAction={<CopyButton text={output} />} className="flex-1">
          <ToolOutput value={output} placeholder={t('json.outputPlaceholder')} className="min-h-0 flex-1" />
        </ToolCard>
      }
    />
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
