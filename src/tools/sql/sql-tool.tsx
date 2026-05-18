import { useState, useCallback } from 'react'
import { format as sqlFormat } from 'sql-formatter'
import { ToolPageDual } from '@/components/shared/tool-page-dual'
import { ToolCard } from '@/components/shared/tool-card'
import { ToolInput } from '@/components/shared/tool-input'
import { ToolOutput } from '@/components/shared/tool-output'
import { ToolActionBar } from '@/components/shared/tool-action-bar'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'

const SAMPLE = `SELECT u.id, u.name, u.email, o.total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
AND o.total > 100
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 5
ORDER BY o.total DESC
LIMIT 20;`

type Dialect = 'sql' | 'mysql' | 'postgresql' | 'transactsql' | 'plsql' | 'mariadb' | 'sqlite'
type KeywordCase = 'upper' | 'lower' | 'preserve'

export default function SqlTool() {
  const { t } = useT()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const [dialect, setDialect] = useState<Dialect>('sql')
  const [keywordCase, setKeywordCase] = useState<KeywordCase>('upper')

  const formatSql = useCallback(() => {
    if (!input.trim()) return
    try {
      setOutput(sqlFormat(input, { tabWidth: indent, language: dialect, keywordCase }))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setOutput('')
    }
  }, [input, indent, dialect, keywordCase])

  const minifySql = useCallback(() => {
    if (!input.trim()) return
    try {
      const formatted = sqlFormat(input, { language: dialect, keywordCase })
      setOutput(formatted.replace(/\s+/g, ' ').replace(/\s*([,;()])\s*/g, '$1').trim())
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setOutput('')
    }
  }, [input, dialect, keywordCase])

  const btnClass = 'rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-border-dark dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'

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
            <ToolInput value={input} onChange={setInput} placeholder={t('sql.inputPlaceholder')} />
          </ToolCard>

          <ToolActionBar className="flex-wrap">
            <button onClick={formatSql} className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light">{t('sql.format')}</button>
            <button onClick={minifySql} className={btnClass}>{t('sql.minify')}</button>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">{t('sql.dialect')}</span>
                <select value={dialect} onChange={(e) => setDialect(e.target.value as Dialect)} className="rounded-md border border-border bg-white px-1.5 py-0.5 text-xs text-gray-600 outline-none dark:border-border-dark dark:bg-gray-800 dark:text-gray-300">
                  <option value="sql">SQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="postgresql">PostgreSQL</option>
                  <option value="transactsql">T-SQL</option>
                  <option value="plsql">PL/SQL</option>
                  <option value="mariadb">MariaDB</option>
                  <option value="sqlite">SQLite</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">{t('sql.indent')}</span>
                <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="rounded-md border border-border bg-white px-1.5 py-0.5 text-xs text-gray-600 outline-none dark:border-border-dark dark:bg-gray-800 dark:text-gray-300">
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">{t('sql.case')}</span>
                <select value={keywordCase} onChange={(e) => setKeywordCase(e.target.value as KeywordCase)} className="rounded-md border border-border bg-white px-1.5 py-0.5 text-xs text-gray-600 outline-none dark:border-border-dark dark:bg-gray-800 dark:text-gray-300">
                  <option value="upper">UPPER</option>
                  <option value="lower">lower</option>
                  <option value="preserve">{t('sql.preserve')}</option>
                </select>
              </div>
            </div>
          </ToolActionBar>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>
          )}
        </>
      }
      right={
        <ToolCard title={t('common.output')} titleAction={<CopyButton text={output} />} className="flex-1">
          <ToolOutput value={output} placeholder={t('sql.outputPlaceholder')} className="min-h-0 flex-1" />
        </ToolCard>
      }
    />
  )
}
