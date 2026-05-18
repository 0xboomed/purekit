import { useState, useCallback } from 'react'
import yaml from 'js-yaml'
import { ToolPageDual } from '@/components/shared/tool-page-dual'
import { ToolCard } from '@/components/shared/tool-card'
import { ToolInput } from '@/components/shared/tool-input'
import { ToolOutput } from '@/components/shared/tool-output'
import { ToolActionBar } from '@/components/shared/tool-action-bar'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'

const SAMPLE = `server:
  host: 0.0.0.0
  port: 8080
  ssl: true
database:
  host: localhost
  port: 5432
  name: myapp_production
  credentials:
    username: admin
    password: secret
logging:
  level: info
  file: /var/log/myapp.log
features:
  - authentication
  - caching
  - rate_limiting`

const btnClass = 'rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-border-dark dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'

export default function YamlTool() {
  const { t } = useT()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)

  const formatYaml = useCallback(() => {
    if (!input.trim()) return
    try {
      const obj = yaml.load(input)
      setOutput(yaml.dump(obj, { indent, lineWidth: 120, noRefs: true }))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setOutput('')
    }
  }, [input, indent])

  const minifyYaml = useCallback(() => {
    if (!input.trim()) return
    try {
      const obj = yaml.load(input)
      const compact = yaml.dump(obj, { indent: 1, lineWidth: -1, flowLevel: 0, noRefs: true, condenseFlow: true })
      setOutput(compact)
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setOutput('')
    }
  }, [input])

  const validateYaml = useCallback(() => {
    if (!input.trim()) return
    try {
      yaml.load(input)
      setError('')
      setOutput(t('yaml.valid'))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setOutput('')
    }
  }, [input, t])

  const toJson = useCallback(() => {
    if (!input.trim()) return
    try {
      const obj = yaml.load(input)
      setOutput(JSON.stringify(obj, null, indent))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setOutput('')
    }
  }, [input, indent])

  const fromJson = useCallback(() => {
    if (!input.trim()) return
    try {
      const obj = JSON.parse(input)
      setOutput(yaml.dump(obj, { indent, lineWidth: 120, noRefs: true }))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
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
                <button onClick={() => { setInput(SAMPLE); setOutput(''); setError('') }} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">{t('common.example')}</button>
                <button onClick={() => { setInput(''); setOutput(''); setError('') }} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">{t('common.clear')}</button>
              </div>
            }
          >
            <ToolInput value={input} onChange={setInput} placeholder={t('yaml.inputPlaceholder')} />
          </ToolCard>

          <ToolActionBar className="flex-wrap">
            <button onClick={formatYaml} className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light">{t('yaml.format')}</button>
            <button onClick={minifyYaml} className={btnClass}>{t('yaml.minify')}</button>
            <button onClick={validateYaml} className={btnClass}>{t('yaml.validate')}</button>
            <button onClick={toJson} className={btnClass}>{t('yaml.toJson')}</button>
            <button onClick={fromJson} className={btnClass}>{t('yaml.fromJson')}</button>
            <div className="ml-auto flex items-center gap-1">
              <span className="text-xs text-gray-400">{t('yaml.indent')}</span>
              <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="rounded-md border border-border bg-white px-1.5 py-0.5 text-xs text-gray-600 outline-none dark:border-border-dark dark:bg-gray-800 dark:text-gray-300">
                <option value={2}>2</option>
                <option value={4}>4</option>
              </select>
            </div>
          </ToolActionBar>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>
          )}
        </>
      }
      right={
        <ToolCard title={t('common.output')} titleAction={<CopyButton text={output} />} className="flex-1">
          <ToolOutput value={output} placeholder={t('yaml.outputPlaceholder')} className="min-h-0 flex-1" />
        </ToolCard>
      }
    />
  )
}
