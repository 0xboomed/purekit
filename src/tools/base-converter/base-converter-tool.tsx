import { useState, useCallback } from 'react'
import { ToolPage } from '@/components/shared/tool-page'
import { ToolCard } from '@/components/shared/tool-card'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'
import {
  FIELDS,
  EMPTY_CONVERSION,
  convertFromAscii,
  convertFromRadix,
  type BaseField,
  type BaseConversion,
} from './base-converter-logic'

export default function BaseConverterTool() {
  const { t } = useT()
  const [values, setValues] = useState<BaseConversion>(EMPTY_CONVERSION)
  const [error, setError] = useState<string | null>(null)

  const handleChange = useCallback((field: BaseField, raw: string) => {
    const trimmed = raw.trim()

    if (trimmed === '') {
      setValues(EMPTY_CONVERSION)
      setError(null)
      return
    }

    if (field.key === 'ascii') {
      const char = trimmed.length > 0 ? trimmed[trimmed.length - 1] : ''
      if (!char) {
        setValues(EMPTY_CONVERSION)
        setError(null)
        return
      }
      setValues(convertFromAscii(char))
      setError(null)
      return
    }

    const result = convertFromRadix(trimmed, field.radix!)
    if (!result) {
      setValues((prev) => ({ ...prev, [field.key]: trimmed }))
      setError(t('baseconverter.invalidNumber'))
      return
    }

    setValues(result)
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
