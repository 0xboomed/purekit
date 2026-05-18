import { useState, useMemo } from 'react'
import { ToolPageDual } from '@/components/shared/tool-page-dual'
import { ToolCard } from '@/components/shared/tool-card'
import { ToolInput } from '@/components/shared/tool-input'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'

const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldktpdCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzM1Njg4MDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return atob(padded)
}

function tryParseJson(raw: string): { json: Record<string, unknown> } | { error: string } {
  try {
    const decoded = base64UrlDecode(raw)
    return { json: JSON.parse(decoded) }
  } catch {
    return { error: 'Failed to decode' }
  }
}

function formatJson(obj: Record<string, unknown>, indent = 2): string {
  return JSON.stringify(obj, null, indent)
}

function ExpirationBadge({ exp }: { exp: number }) {
  const { t } = useT()
  const expired = exp * 1000 < Date.now()

  if (expired) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
        {t('jwt.expired')}
      </span>
    )
  }

  const daysLeft = Math.ceil((exp * 1000 - Date.now()) / (1000 * 60 * 60 * 24))
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
      {t('jwt.valid')} · {daysLeft} {t('jwt.daysLeft')}
    </span>
  )
}

export default function JwtTool() {
  const { t } = useT()
  const [input, setInput] = useState('')

  const result = useMemo(() => {
    const token = input.trim()
    if (!token) return null

    const parts = token.split('.')
    if (parts.length !== 3) {
      return { error: t('jwt.invalidToken') }
    }

    const headerResult = tryParseJson(parts[0]!)
    if ('error' in headerResult) {
      return { error: t('jwt.invalidToken') }
    }

    const payloadResult = tryParseJson(parts[1]!)
    if ('error' in payloadResult) {
      return { error: t('jwt.invalidToken') }
    }

    const signature = parts[2]!

    return {
      header: headerResult.json,
      payload: payloadResult.json,
      signature,
    }
  }, [input, t])

  const fullOutput = useMemo(() => {
    if (!result || 'error' in result) return ''
    return [
      `--- ${t('jwt.header')} ---`,
      formatJson(result.header),
      '',
      `--- ${t('jwt.payload')} ---`,
      formatJson(result.payload),
      '',
      `--- ${t('jwt.signature')} ---`,
      result.signature,
    ].join('\n')
  }, [result, t])

  const error = result && 'error' in result ? result.error : null
  const decoded = result && !('error' in result) ? result : null

  return (
    <ToolPageDual
      left={
        <ToolCard
          title={t('common.input')}
          titleAction={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setInput(SAMPLE_JWT)}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {t('common.example')}
              </button>
              <button
                onClick={() => setInput('')}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {t('common.clear')}
              </button>
            </div>
          }
        >
          <ToolInput
            value={input}
            onChange={setInput}
            placeholder={t('jwt.inputPlaceholder')}
          />
        </ToolCard>
      }
      right={
        <ToolCard
          title={t('common.output')}
          titleAction={<CopyButton text={fullOutput} />}
          className="flex-1"
        >
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {decoded && (
            <div className="space-y-4">
              <div>
                <div className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">{t('jwt.header')}</div>
                <pre className="whitespace-pre-wrap rounded-lg border border-border bg-gray-50 p-3 font-mono text-sm text-gray-700 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200">
                  {formatJson(decoded.header)}
                </pre>
              </div>

              <div>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('jwt.payload')}</span>
                  {typeof decoded.payload.exp === 'number' && (
                    <ExpirationBadge exp={decoded.payload.exp} />
                  )}
                </div>
                <pre className="whitespace-pre-wrap rounded-lg border border-border bg-gray-50 p-3 font-mono text-sm text-gray-700 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200">
                  {formatJson(decoded.payload)}
                </pre>
              </div>

              {typeof decoded.payload.exp === 'number' && (
                <div className="flex items-center gap-2 rounded-lg border border-border bg-gray-50 px-3 py-2 dark:border-border-dark dark:bg-gray-900">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t('jwt.expires')}:</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                    {new Date(decoded.payload.exp * 1000).toLocaleString()}
                  </span>
                  <ExpirationBadge exp={decoded.payload.exp} />
                </div>
              )}

              <div>
                <div className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">{t('jwt.signature')}</div>
                <pre className="whitespace-pre-wrap break-all rounded-lg border border-border bg-gray-50 p-3 font-mono text-sm text-gray-700 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200">
                  {decoded.signature}
                </pre>
              </div>
            </div>
          )}

          {!error && !decoded && (
            <div className="flex items-center justify-center py-12 text-sm text-gray-400 dark:text-gray-500">
              {t('jwt.inputPlaceholder')}
            </div>
          )}
        </ToolCard>
      }
    />
  )
}
