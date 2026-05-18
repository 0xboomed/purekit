import { useState, useCallback } from 'react'
import { ToolPage } from '@/components/shared/tool-page'
import { ToolCard } from '@/components/shared/tool-card'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'

interface BaseField {
  key: 'bin' | 'oct' | 'dec' | 'hex' | 'ascii'
  labelKey: string
  radix: number | null
  placeholder: string
}

const FIELDS: BaseField[] = [
  { key: 'bin', labelKey: 'baseconverter.binary', radix: 2, placeholder: '0b' },
  { key: 'oct', labelKey: 'baseconverter.octal', radix: 8, placeholder: '0o' },
  { key: 'dec', labelKey: 'baseconverter.decimal', radix: 10, placeholder: '0' },
  { key: 'hex', labelKey: 'baseconverter.hexadecimal', radix: 16, placeholder: '0x' },
  { key: 'ascii', labelKey: 'baseconverter.ascii', radix: null, placeholder: 'A' },
]

interface FieldValues {
  bin: string
  oct: string
  dec: string
  hex: string
  ascii: string
}

const EMPTY_VALUES: FieldValues = { bin: '', oct: '', dec: '', hex: '', ascii: '' }

export default function BaseConverterTool() {
  const { t } = useT()
  const [values, setValues] = useState<FieldValues>(EMPTY_VALUES)
  const [error, setError] = useState<string | null>(null)

  const handleChange = useCallback((field: BaseField, raw: string) => {
    const trimmed = raw.trim()

    if (trimmed === '') {
      setValues(EMPTY_VALUES)
      setError(null)
      return
    }

    if (field.key === 'ascii') {
      const char = trimmed.length > 0 ? trimmed[trimmed.length - 1] : ''
      if (!char) {
        setValues(EMPTY_VALUES)
        setError(null)
        return
      }
      const code = char.charCodeAt(0)
      setValues({
        bin: code.toString(2),
        oct: code.toString(8),
        dec: code.toString(10),
        hex: code.toString(16).toUpperCase(),
        ascii: char,
      })
      setError(null)
      return
    }

    const parsed = parseInt(trimmed, field.radix!)
    if (isNaN(parsed)) {
      setValues((prev) => ({ ...prev, [field.key]: trimmed }))
      setError(t('baseconverter.invalidNumber'))
      return
    }

    setValues({
      bin: parsed.toString(2),
      oct: parsed.toString(8),
      dec: parsed.toString(10),
      hex: parsed.toString(16).toUpperCase(),
      ascii: parsed >= 0 && parsed <= 0x10ffff ? String.fromCodePoint(parsed) : '',
    })
    setError(null)
  }, [t])

  const inputClass =
    'w-full rounded-lg border border-border bg-white px-3 py-2 font-mono text-sm text-gray-700 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200'

  return (
    <ToolPage>
      <div className="mx-auto max-w-2xl">
        <ToolCard>
          <div className="space-y-3">
            {FIELDS.map((field) => (
              <div key={field.key} className="flex items-center gap-3">
                <label className="w-28 shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400">
                  {t(field.labelKey)}
                </label>
                <input
                  type="text"
                  value={values[field.key]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={t('baseconverter.placeholder')}
                  spellCheck={false}
                  className={inputClass}
                />
                <CopyButton text={values[field.key]} />
              </div>
            ))}
            {error && (
              <p className="pt-1 text-xs text-red-500">{error}</p>
            )}
          </div>
        </ToolCard>
      </div>
    </ToolPage>
  )
}
