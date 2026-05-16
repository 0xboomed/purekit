import { useState, useCallback } from 'react'
import { ToolPageSplit } from '@/components/shared/tool-page-split'
import { ToolCard } from '@/components/shared/tool-card'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'

const CHARSETS = {
  hex: '0123456789abcdef',
  base62: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  alnum: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
} as const

const CHARSET_KEYS = Object.keys(CHARSETS) as Array<keyof typeof CHARSETS>

interface Preset {
  name: string
  nameEn: string
  prefix: string
  length: number
  charset: keyof typeof CHARSETS
}

const PRESETS: Preset[] = [
  { name: 'Stripe', nameEn: 'Stripe', prefix: 'sk_live_', length: 24, charset: 'base62' },
  { name: 'OpenAI', nameEn: 'OpenAI', prefix: 'sk-', length: 48, charset: 'base62' },
  { name: 'GitHub', nameEn: 'GitHub', prefix: 'ghp_', length: 36, charset: 'base62' },
  { name: 'AWS', nameEn: 'AWS', prefix: 'AKIA', length: 16, charset: 'alnum' },
  { name: '通用', nameEn: 'Generic', prefix: 'sk_', length: 32, charset: 'base62' },
]

export default function ApikeyTool() {
  const { t } = useT()
  const [prefix, setPrefix] = useState('sk_')
  const [length, setLength] = useState(32)
  const [charset, setCharset] = useState<keyof typeof CHARSETS>('base62')
  const [count, setCount] = useState(3)
  const [keys, setKeys] = useState<string[]>([])

  const entropy = CHARSETS[charset].length > 0
    ? Math.floor(length * Math.log2(CHARSETS[charset].length))
    : 0

  const applyPreset = useCallback((preset: Preset) => {
    setPrefix(preset.prefix)
    setLength(preset.length)
    setCharset(preset.charset)
  }, [])

  const generate = useCallback(() => {
    const pool = CHARSETS[charset]
    const results: string[] = []
    for (let i = 0; i < count; i++) {
      const arr = new Uint32Array(length)
      crypto.getRandomValues(arr)
      const key = Array.from(arr, (n) => pool[n % pool.length]).join('')
      results.push(`${prefix}${key}`)
    }
    setKeys(results)
  }, [prefix, length, charset, count])

  const allText = keys.join('\n')

  return (
    <ToolPageSplit
      settings={
        <ToolCard title={t('apikey.generate')}>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">{t('apikey.presets')}</label>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.nameEn}
                    onClick={() => applyPreset(p)}
                    className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500 transition-colors hover:bg-brand/10 hover:text-brand dark:bg-gray-800 dark:text-gray-400 dark:hover:text-brand"
                  >
                    {p.nameEn}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">{t('apikey.prefix')}</label>
              <input
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="sk_"
                spellCheck={false}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 font-mono text-sm text-gray-700 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500">{t('apikey.length')}</label>
                <span className="font-mono text-xs text-brand">{length}</span>
              </div>
              <input
                type="range"
                min={8}
                max={128}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-brand"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>8</span>
                <span>128</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">{t('apikey.charset')}</label>
              <div className="flex flex-col gap-1.5">
                {CHARSET_KEYS.map((key) => (
                  <label
                    key={key}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                      charset === key
                        ? 'border-brand bg-brand/5 text-brand'
                        : 'border-gray-200 text-gray-400 dark:border-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="charset"
                      checked={charset === key}
                      onChange={() => setCharset(key)}
                      className="sr-only"
                    />
                    {t(`apikey.charset${key.charAt(0).toUpperCase()}${key.slice(1)}`)}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-500">{t('apikey.count')}</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(20, Number(e.target.value))))}
                  className="w-16 rounded-lg border border-border bg-white px-2 py-1 text-xs text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-gray-400">{t('apikey.entropy')}</span>
                <span className={`font-mono font-medium ${entropy >= 128 ? 'text-emerald-500' : entropy >= 64 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {entropy} {t('apikey.bits')}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={generate}
            className="mt-5 w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-light"
          >
            {t('apikey.generate')}
          </button>
        </ToolCard>
      }
      output={
        <ToolCard title={t('common.output')} titleAction={keys.length > 0 ? <CopyButton text={allText} /> : undefined}>
          {keys.length > 0 ? (
            <div className="space-y-2">
              {keys.map((key, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-gray-50 px-3 py-2.5 dark:border-border-dark dark:bg-gray-900/50"
                >
                  <code className="min-w-0 flex-1 break-all font-mono text-sm text-gray-700 dark:text-gray-200">{key}</code>
                  <CopyButton text={key} />
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
