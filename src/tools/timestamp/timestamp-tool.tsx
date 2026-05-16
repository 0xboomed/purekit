import { useState, useCallback, useEffect } from 'react'
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
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="rounded-lg border border-border bg-gray-50 p-3 dark:border-border-dark dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{t('timestamp.currentTime')}</span>
          <CopyButton text={String(Math.floor(now / 1000))} className="text-[11px]" />
        </div>
        <div className="mt-1 font-mono text-lg font-medium text-gray-800 dark:text-gray-200">
          {Math.floor(now / 1000)}
        </div>
        <div className="mt-1 text-xs text-gray-400">
          {new Date(now).toLocaleString(locale === 'en' ? 'en-US' : 'zh-CN', { timeZone: tz })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-500">{t('common.input')}</label>
        <div className="flex items-center gap-3">
          <div className="flex rounded-md bg-gray-100 p-0.5 dark:bg-gray-800">
            <button
              onClick={() => setUnit('s')}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${unit === 's' ? 'bg-white text-gray-700 shadow-sm dark:bg-gray-700 dark:text-gray-200' : 'text-gray-400'}`}
            >
              {t('timestamp.seconds')}
            </button>
            <button
              onClick={() => setUnit('ms')}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${unit === 'ms' ? 'bg-white text-gray-700 shadow-sm dark:bg-gray-700 dark:text-gray-200' : 'text-gray-400'}`}
            >
              {t('timestamp.milliseconds')}
            </button>
          </div>
          <select
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            className="rounded border border-border bg-white px-2 py-0.5 text-xs text-gray-600 dark:border-border-dark dark:bg-gray-900 dark:text-gray-300"
          >
            {['Asia/Shanghai', 'Asia/Tokyo', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'UTC'].map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('timestamp.inputPlaceholder')}
          spellCheck={false}
          className="flex-1 rounded-lg border border-border bg-white px-3 py-2 font-mono text-sm text-gray-700 outline-none transition-colors focus:border-brand dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
        />
        <button
          onClick={setNowTs}
          className="shrink-0 rounded-md bg-gray-100 px-3 py-2 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {t('timestamp.now')}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toReadable} className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-light">
          {t('timestamp.toDate')}
        </button>
        <button onClick={toTimestamp} className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          {t('timestamp.toTimestamp')}
        </button>
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
        className="min-h-[120px] flex-1 rounded-lg border border-border bg-gray-50 p-3 font-mono text-sm text-gray-700 dark:border-border-dark dark:bg-gray-900/50 dark:text-gray-200"
      />
    </div>
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
