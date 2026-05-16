import { useState, useCallback } from 'react'
import { ToolPageSplit } from '@/components/shared/tool-page-split'
import { ToolCard } from '@/components/shared/tool-card'
import { CopyButton } from '@/components/shared/copy-button'
import { ToolSegmentedControl } from '@/components/shared/tool-segmented-control'
import { useT } from '@/i18n/context'

type UuidVersion = 'v1' | 'v4' | 'v7'

const GREGORIAN_OFFSET = 122192928000000000n

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function formatUuid(bytes: Uint8Array): string {
  const hex = bytesToHex(bytes)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function generateV1(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)

  const now = BigInt(Date.now())
  const ts100ns = now * 10000n + GREGORIAN_OFFSET

  const timeLow = Number(ts100ns & 0xffffffffn)
  const timeMid = Number((ts100ns >> 32n) & 0xffffn)
  const timeHi = Number((ts100ns >> 48n) & 0x0fffn)

  bytes[0] = (timeLow >>> 24) & 0xff
  bytes[1] = (timeLow >>> 16) & 0xff
  bytes[2] = (timeLow >>> 8) & 0xff
  bytes[3] = timeLow & 0xff
  bytes[4] = (timeMid >>> 8) & 0xff
  bytes[5] = timeMid & 0xff
  bytes[6] = (timeHi >>> 8) | 0x10
  bytes[7] = timeHi & 0xff
  bytes[8] = (bytes[8]! & 0x3f) | 0x80

  return formatUuid(bytes)
}

function generateV4(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6]! & 0x0f) | 0x40
  bytes[8] = (bytes[8]! & 0x3f) | 0x80
  return formatUuid(bytes)
}

function generateV7(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)

  const ts = Date.now()
  bytes[0] = (ts / 2 ** 40) & 0xff
  bytes[1] = (ts / 2 ** 32) & 0xff
  bytes[2] = (ts / 2 ** 24) & 0xff
  bytes[3] = (ts / 2 ** 16) & 0xff
  bytes[4] = (ts / 2 ** 8) & 0xff
  bytes[5] = ts & 0xff

  bytes[6] = (bytes[6]! & 0x0f) | 0x70
  bytes[8] = (bytes[8]! & 0x3f) | 0x80

  return formatUuid(bytes)
}

const GENERATORS: Record<UuidVersion, () => string> = {
  v1: generateV1,
  v4: generateV4,
  v7: generateV7,
}

export default function UuidTool() {
  const { t } = useT()
  const [version, setVersion] = useState<UuidVersion>('v4')
  const [count, setCount] = useState(5)
  const [uppercase, setUppercase] = useState(false)
  const [noHyphens, setNoHyphens] = useState(false)
  const [braces, setBraces] = useState(false)
  const [uuids, setUuids] = useState<string[]>([])

  const generate = useCallback(() => {
    const gen = GENERATORS[version]
    const results: string[] = []
    for (let i = 0; i < count; i++) {
      let uuid = gen()
      if (noHyphens) uuid = uuid.replace(/-/g, '')
      if (uppercase) uuid = uuid.toUpperCase()
      if (braces) uuid = `{${uuid}}`
      results.push(uuid)
    }
    setUuids(results)
  }, [version, count, uppercase, noHyphens, braces])

  const allText = uuids.join('\n')

  return (
    <ToolPageSplit
      settings={
        <ToolCard title={t('uuid.generate')}>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">{t('uuid.version')}</label>
              <ToolSegmentedControl
                options={[
                  { value: 'v1' as UuidVersion, label: 'v1' },
                  { value: 'v4' as UuidVersion, label: 'v4' },
                  { value: 'v7' as UuidVersion, label: 'v7' },
                ]}
                value={version}
                onChange={setVersion}
              />
              <p className="mt-1.5 text-[11px] text-gray-400">
                {t(`uuid.desc${version}`)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-500">{t('uuid.count')}</label>
              <input
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))}
                className="w-16 rounded-lg border border-border bg-white px-2 py-1 text-xs text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
              />
            </div>

            <div className="space-y-2">
              {([
                { key: 'uppercase', label: t('uuid.uppercase'), checked: uppercase, onChange: setUppercase },
                { key: 'noHyphens', label: t('uuid.noHyphens'), checked: noHyphens, onChange: setNoHyphens },
                { key: 'braces', label: t('uuid.braces'), checked: braces, onChange: setBraces },
              ] as const).map((opt) => (
                <label key={opt.key} className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={opt.checked}
                    onChange={(e) => opt.onChange(e.target.checked)}
                    className="rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            className="mt-5 w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-light"
          >
            {t('uuid.generate')}
          </button>
        </ToolCard>
      }
      output={
        <ToolCard title={t('common.output')} titleAction={uuids.length > 0 ? <CopyButton text={allText} /> : undefined}>
          {uuids.length > 0 ? (
            <div className="space-y-2">
              {uuids.map((uuid, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-gray-50 px-3 py-2.5 dark:border-border-dark dark:bg-gray-900/50"
                >
                  <code className="min-w-0 flex-1 break-all font-mono text-sm text-gray-700 dark:text-gray-200">{uuid}</code>
                  <CopyButton text={uuid} />
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
