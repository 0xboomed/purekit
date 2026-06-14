import { useState, useCallback } from 'react'
import { ToolPageSplit } from '@/components/shared/tool-page-split'
import { ToolCard } from '@/components/shared/tool-card'
import { useT } from '@/i18n/context'
import { getNextExecutions } from './cron-logic'

const PRESETS = [
  { label: '* * * * *', desc: 'everyMinute' },
  { label: '*/5 * * * *', desc: 'every5Minutes' },
  { label: '0 * * * *', desc: 'everyHour' },
  { label: '0 */2 * * *', desc: 'every2Hours' },
  { label: '0 0 * * *', desc: 'everyDay' },
  { label: '0 0 * * 1', desc: 'everyWeek' },
  { label: '0 0 1 * *', desc: 'everyMonth' },
  { label: '0 0 1 1 *', desc: 'everyYear' },
]

function formatDate(d: Date): string {
  return d.toLocaleString(undefined, {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

export default function CronTool() {
  const { t } = useT()
  const [expr, setExpr] = useState('*/5 * * * *')
  const [nextTimes, setNextTimes] = useState<string[]>([])
  const [error, setError] = useState('')

  const parse = useCallback((value: string) => {
    const result = getNextExecutions(value, 5)
    if (result.error) {
      setError(result.error)
      setNextTimes([])
    } else {
      setNextTimes(result.times.map(formatDate))
      setError('')
    }
  }, [])

  const handlePreset = useCallback((preset: string) => {
    setExpr(preset)
    parse(preset)
  }, [parse])

  return (
    <ToolPageSplit
      settings={
        <ToolCard title={t('cron.settings')}>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('cron.expression')}
              </label>
              <input
                type="text"
                value={expr}
                onChange={(e) => { setExpr(e.target.value); parse(e.target.value) }}
                placeholder="*/5 * * * *"
                className="w-full rounded-lg border border-border bg-white px-3 py-2 font-mono text-sm text-gray-700 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('cron.presets')}
              </label>
              <div className="space-y-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handlePreset(p.label)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                      expr === p.label
                        ? 'bg-brand/10 text-brand dark:bg-brand/20'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    <code className="font-mono">{p.label}</code>
                    <span>{t(`cron.preset_${p.desc}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ToolCard>
      }
      output={
        <ToolCard title={t('cron.result')}>
          {error ? (
            <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>
          ) : nextTimes.length > 0 ? (
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-400">{t('cron.nextExecutions')}</div>
                <div className="mt-2 space-y-1.5">
                  {nextTimes.map((time, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-xs font-medium text-brand">{i + 1}</span>
                      <span className="font-mono text-gray-700 dark:text-gray-200">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">{t('cron.enterExpression')}</div>
          )}
        </ToolCard>
      }
    />
  )
}
