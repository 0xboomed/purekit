import { useState, useCallback } from 'react'
import { ToolPageSplit } from '@/components/shared/tool-page-split'
import { ToolCard } from '@/components/shared/tool-card'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'

const CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

export default function PasswordTool() {
  const { t } = useT()
  const [length, setLength] = useState(16)
  const [enabledChars, setEnabledChars] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })
  const [exclude, setExclude] = useState('')
  const [count, setCount] = useState(1)
  const [passwords, setPasswords] = useState<string[]>([])

  const charPool = Object.entries(CHARS)
    .filter(([key]) => enabledChars[key as keyof typeof enabledChars])
    .map(([, chars]) => chars)
    .join('')
    .split('')
    .filter((c) => !exclude.includes(c))

  const entropy = charPool.length > 0 ? Math.floor(length * Math.log2(charPool.length)) : 0

  const generate = useCallback(() => {
    if (charPool.length === 0) return
    const pool = charPool.join('')
    const results: string[] = []
    for (let i = 0; i < count; i++) {
      const arr = new Uint32Array(length)
      crypto.getRandomValues(arr)
      results.push(Array.from(arr, (n) => pool[n % pool.length]).join(''))
    }
    setPasswords(results)
  }, [charPool, length, count])

  const toggleChar = useCallback((key: keyof typeof enabledChars) => {
    setEnabledChars((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      if (!next.uppercase && !next.lowercase && !next.numbers && !next.symbols) return prev
      return next
    })
  }, [])

  return (
    <ToolPageSplit
      settings={
        <ToolCard title={t('password.generate')}>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500">{t('password.length')}</label>
                <span className="font-mono text-xs text-brand">{length}</span>
              </div>
              <input
                type="range"
                min={4}
                max={64}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-brand"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>4</span>
                <span>64</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">{t('password.charset')}</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(CHARS).map(([key]) => (
                  <label
                    key={key}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                      enabledChars[key as keyof typeof enabledChars]
                        ? 'border-brand bg-brand/5 text-brand'
                        : 'border-gray-200 text-gray-400 dark:border-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={enabledChars[key as keyof typeof enabledChars]}
                      onChange={() => toggleChar(key as keyof typeof enabledChars)}
                      className="sr-only"
                    />
                    {{ uppercase: t('password.uppercase'), lowercase: t('password.lowercase'), numbers: t('password.numbers'), symbols: t('password.symbols') }[key]!}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">{t('password.exclude')}</label>
              <input
                value={exclude}
                onChange={(e) => setExclude(e.target.value)}
                placeholder={t('password.excludePlaceholder')}
                spellCheck={false}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 font-mono text-sm text-gray-700 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-500">{t('password.count')}</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(20, Number(e.target.value))))}
                  className="w-16 rounded-lg border border-border bg-white px-2 py-1 text-xs text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
                />
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400">{t('password.entropy')}</span>
                <span className={`font-mono font-medium ${entropy >= 80 ? 'text-emerald-500' : entropy >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {entropy} {t('password.bits')}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={generate}
            className="mt-5 w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-light"
          >
            {t('password.generate')}
          </button>
        </ToolCard>
      }
      output={
        <ToolCard title={t('common.output')}>
          {passwords.length > 0 ? (
            <div className="space-y-2">
              {passwords.map((pw, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border bg-gray-50 px-3 py-2.5 dark:border-border-dark dark:bg-gray-900/50"
                >
                  <code className="min-w-0 flex-1 break-all font-mono text-sm text-gray-700 dark:text-gray-200">{pw}</code>
                  <CopyButton text={pw} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">
              {t('common.processing')}
            </div>
          )}
        </ToolCard>
      }
    />
  )
}
