import { useState, useCallback } from 'react'
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
    } catch (e) {
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
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500">{t('common.input')}</label>
          <div className="flex rounded-md bg-gray-100 p-0.5 dark:bg-gray-800">
            <button
              onClick={() => setMode('text')}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${mode === 'text' ? 'bg-white text-gray-700 shadow-sm dark:bg-gray-700 dark:text-gray-200' : 'text-gray-400'}`}
            >
              {t('common.text')}
            </button>
            <button
              onClick={() => setMode('file')}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${mode === 'file' ? 'bg-white text-gray-700 shadow-sm dark:bg-gray-700 dark:text-gray-200' : 'text-gray-400'}`}
            >
              {t('common.file')}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs text-gray-400">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="rounded border-gray-300 text-brand focus:ring-brand"
            />
            {t('base64.urlSafe')}
          </label>
          <button
            onClick={() => { setInput(''); setOutput(''); setError('') }}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {t('common.clear')}
          </button>
        </div>
      </div>

      {mode === 'text' ? (
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('base64.inputPlaceholder')}
          spellCheck={false}
          className="min-h-[160px] flex-1 rounded-lg border border-border bg-white p-3 font-mono text-sm text-gray-700 outline-none transition-colors focus:border-brand dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
        />
      ) : (
        <div
          onClick={() => document.getElementById('base64-file')?.click()}
          className="flex min-h-[120px] flex-1 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-400 transition-colors hover:border-brand hover:text-brand dark:border-gray-600"
        >
          {input || t('common.clickToSelect')}
          <input
            id="base64-file"
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <button onClick={encode} className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-light">
          {t('base64.encode')}
        </button>
        <button onClick={decode} className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          {t('base64.decode')}
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
        className="min-h-[160px] flex-1 rounded-lg border border-border bg-gray-50 p-3 font-mono text-sm text-gray-700 dark:border-border-dark dark:bg-gray-900/50 dark:text-gray-200"
      />
    </div>
  )
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
