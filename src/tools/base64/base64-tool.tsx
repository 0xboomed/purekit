import { useState, useCallback } from 'react'
import { ToolPageDual } from '@/components/shared/tool-page-dual'
import { ToolCard } from '@/components/shared/tool-card'
import { ToolInput } from '@/components/shared/tool-input'
import { ToolOutput } from '@/components/shared/tool-output'
import { ToolActionBar } from '@/components/shared/tool-action-bar'
import { ToolFileDrop } from '@/components/shared/tool-file-drop'
import { ToolSegmentedControl } from '@/components/shared/tool-segmented-control'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'

export default function Base64Tool() {
  const { t } = useT()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [urlSafe, setUrlSafe] = useState(false)
  const [mode, setMode] = useState<'text' | 'file'>('text')

  const encode = useCallback(() => {
    if (!input.trim()) return
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)))
      setOutput(urlSafe ? encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : encoded)
      setError('')
    } catch (e) {
      setError((e as Error).message)
    }
  }, [input, urlSafe])

  const decode = useCallback(() => {
    if (!input.trim()) return
    try {
      let decoded = input
      if (urlSafe) {
        decoded = decoded.replace(/-/g, '+').replace(/_/g, '/')
        const pad = decoded.length % 4
        if (pad) decoded += '='.repeat(4 - pad)
      }
      setOutput(decodeURIComponent(escape(atob(decoded))))
      setError('')
    } catch {
      setError(t('base64.decodeError'))
    }
  }, [input, urlSafe, t])

  const handleFile = useCallback(async (file: File) => {
    const buf = await file.arrayBuffer()
    const bytes = new Uint8Array(buf)
    let binary = ''
    bytes.forEach((b) => (binary += String.fromCharCode(b)))
    const encoded = btoa(binary)
    setOutput(urlSafe ? encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : encoded)
    setInput(`[${file.name}, ${formatSize(file.size)}]`)
    setError('')
  }, [urlSafe])

  return (
    <ToolPageDual
      left={
        <>
          <ToolCard
            title={t('common.input')}
            titleAction={
              <div className="flex items-center gap-2">
                <ToolSegmentedControl
                  options={[{ value: 'text', label: t('common.text') }, { value: 'file', label: t('common.file') }]}
                  value={mode}
                  onChange={(v) => { setMode(v); setInput(''); setOutput(''); setError('') }}
                />
                <label className="flex items-center gap-1 text-xs text-gray-400">
                  <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} className="rounded border-gray-300 text-brand focus:ring-brand" />
                  {t('base64.urlSafe')}
                </label>
                <button onClick={() => { setInput(''); setOutput(''); setError('') }} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {t('common.clear')}
                </button>
              </div>
            }
          >
            {mode === 'text' ? (
              <ToolInput value={input} onChange={setInput} placeholder={t('base64.inputPlaceholder')} />
            ) : (
              <ToolFileDrop label={input || t('common.clickToSelect')} onFile={handleFile} />
            )}
          </ToolCard>

          <ToolActionBar>
            <button onClick={encode} className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light">
              {t('base64.encode')}
            </button>
            <button onClick={decode} className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-bg-secondary dark:border-border-dark dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
              {t('base64.decode')}
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

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
