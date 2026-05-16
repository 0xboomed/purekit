import { useState, useCallback, useEffect } from 'react'
import { ToolPageDual } from '@/components/shared/tool-page-dual'
import { ToolCard } from '@/components/shared/tool-card'
import { ToolOutput } from '@/components/shared/tool-output'
import { ToolActionBar } from '@/components/shared/tool-action-bar'
import { ToolSegmentedControl } from '@/components/shared/tool-segmented-control'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'

export default function TimestampTool() {
  const { t, locale } = useT()
  const [now, setNow] = useState(Date.now())
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [unit, setUnit] = useState<'s' | 'ms'>('s')
  const [tz, setTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTs = useCallback((ts: number, isMs: boolean) => {
    const ms = isMs ? ts : ts * 1000
    const d = new Date(ms)
    if (isNaN(d.getTime())) return null
    return {
      local: d.toLocaleString(locale === 'en' ? 'en-US' : 'zh-CN', { timeZone: tz }),
      utc: d.toUTCString(),
      iso: d.toISOString(),
      relative: getRelative(ms, t),
    }
  }, [tz, locale, t])

  const toReadable = useCallback(() => {
    if (!input.trim()) return
    const ts = Number(input)
    if (isNaN(ts)) {
      setError(t('timestamp.invalidTs'))
      return
    }
    const result = formatTs(ts, unit === 'ms')
    if (!result) {
      setError(t('timestamp.invalidTs2'))
      return
    }
    setOutput([
      `${t('timestamp.local')}: ${result.local}`,
      `${t('timestamp.utc')}: ${result.utc}`,
      `ISO 8601: ${result.iso}`,
      `${t('timestamp.relative')}: ${result.relative}`,
    ].join('\n'))
    setError('')
  }, [input, unit, formatTs, t])

  const toTimestamp = useCallback(() => {
    if (!input.trim()) return
    const d = new Date(input)
    if (isNaN(d.getTime())) {
      setError(t('timestamp.invalidDate'))
      return
    }
    const ts = unit === 'ms' ? d.getTime() : Math.floor(d.getTime() / 1000)
    setOutput(String(ts))
    setError('')
  }, [input, unit, t])

  const setNowTs = useCallback(() => {
    const ts = unit === 'ms' ? Date.now() : Math.floor(Date.now() / 1000)
    setInput(String(ts))
  }, [unit])

  return (
    <ToolPageDual
      left={
        <>
          <ToolCard title={t('timestamp.currentTime')} titleAction={<CopyButton text={String(Math.floor(now / 1000))} />}>
            <div className="font-mono text-xl font-semibold text-gray-800 dark:text-gray-200">
              {Math.floor(now / 1000)}
            </div>
            <div className="mt-1 text-xs text-gray-400">
              {new Date(now).toLocaleString(locale === 'en' ? 'en-US' : 'zh-CN', { timeZone: tz })}
            </div>
          </ToolCard>

          <ToolCard
            title={t('common.input')}
            titleAction={
              <div className="flex items-center gap-2">
                <ToolSegmentedControl
                  options={[{ value: 's', label: t('timestamp.seconds') }, { value: 'ms', label: t('timestamp.milliseconds') }]}
                  value={unit}
                  onChange={setUnit}
                />
                <select value={tz} onChange={(e) => setTz(e.target.value)} className="rounded-md border border-border bg-white px-2 py-0.5 text-xs text-gray-600 dark:border-border-dark dark:bg-gray-900 dark:text-gray-300">
                  {['Asia/Shanghai', 'Asia/Tokyo', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'UTC'].map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>
            }
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('timestamp.inputPlaceholder')}
                spellCheck={false}
                className="flex-1 rounded-lg border border-border bg-white px-4 py-2.5 font-mono text-sm text-gray-700 outline-none transition-shadow placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200 dark:placeholder:text-gray-600"
              />
              <button onClick={setNowTs} className="shrink-0 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-bg-secondary dark:border-border-dark dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
                {t('timestamp.now')}
              </button>
            </div>
          </ToolCard>

          <ToolActionBar>
            <button onClick={toReadable} className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light">
              {t('timestamp.toDate')}
            </button>
            <button onClick={toTimestamp} className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-bg-secondary dark:border-border-dark dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
              {t('timestamp.toTimestamp')}
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
        <ToolCard title={t('common.output')} titleAction={<CopyButton text={output} />} className="flex-1">
          <ToolOutput value={output} placeholder={t('json.outputPlaceholder')} className="min-h-0 flex-1" />
        </ToolCard>
      }
    />
  )
}

function getRelative(ms: number, t: (key: string) => string): string {
  const diff = Date.now() - ms
  const abs = Math.abs(diff)
  const future = diff < 0

  if (abs < 60000) return future ? `${Math.floor(abs / 1000)}${t('timestamp.secondsLater')}` : `${Math.floor(abs / 1000)}${t('timestamp.secondsAgo')}`
  if (abs < 3600000) return future ? `${Math.floor(abs / 60000)}${t('timestamp.minutesLater')}` : `${Math.floor(abs / 60000)}${t('timestamp.minutesAgo')}`
  if (abs < 86400000) return future ? `${Math.floor(abs / 3600000)}${t('timestamp.hoursLater')}` : `${Math.floor(abs / 3600000)}${t('timestamp.hoursAgo')}`
  return future ? `${Math.floor(abs / 86400000)}${t('timestamp.daysLater')}` : `${Math.floor(abs / 86400000)}${t('timestamp.daysAgo')}`
}
