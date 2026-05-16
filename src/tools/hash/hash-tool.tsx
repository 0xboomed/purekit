import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'

type Algo = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

const ALGOS: Algo[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

async function hashText(text: string, algo: Algo): Promise<string> {
  const buf = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest(algo, buf)
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function hashFile(file: File, algo: Algo): Promise<string> {
  const buf = await file.arrayBuffer()
  const hash = await crypto.subtle.digest(algo, buf)
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export default function HashTool() {
  const { t } = useT()
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [computing, setComputing] = useState(false)
  const [mode, setMode] = useState<'text' | 'file'>('text')

  const compute = useCallback(async () => {
    if (!input.trim() && mode === 'text') return
    setComputing(true)
    setError('')
    try {
      const r: Record<string, string> = {}
      for (const algo of ALGOS) {
        r[algo] = mode === 'text' ? await hashText(input, algo) : ''
      }
      if (mode === 'file') {
        const fileInput = document.getElementById('hash-file') as HTMLInputElement
        const file = fileInput?.files?.[0]
        if (!file) { setError(t('hash.selectFile')); return }
        for (const algo of ALGOS) {
          r[algo] = await hashFile(file, algo)
        }
      }
      setResults(r)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setComputing(false)
    }
  }, [input, mode, t])

  const computeSingleFile = useCallback(async (file: File) => {
    setComputing(true)
    setError('')
    try {
      const r: Record<string, string> = {}
      for (const algo of ALGOS) {
        r[algo] = await hashFile(file, algo)
      }
      setResults(r)
      setInput(`[${file.name}, ${formatSize(file.size)}]`)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setComputing(false)
    }
  }, [])

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500">{t('common.input')}</label>
          <div className="flex rounded-md bg-gray-100 p-0.5 dark:bg-gray-800">
            <button
              onClick={() => { setMode('text'); setInput(''); setResults({}) }}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${mode === 'text' ? 'bg-white text-gray-700 shadow-sm dark:bg-gray-700 dark:text-gray-200' : 'text-gray-400'}`}
            >
              {t('common.text')}
            </button>
            <button
              onClick={() => { setMode('file'); setInput(''); setResults({}) }}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${mode === 'file' ? 'bg-white text-gray-700 shadow-sm dark:bg-gray-700 dark:text-gray-200' : 'text-gray-400'}`}
            >
              {t('common.file')}
            </button>
          </div>
        </div>
        <button
          onClick={() => { setInput(''); setResults({}); setError('') }}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {t('common.clear')}
        </button>
      </div>

      {mode === 'text' ? (
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('hash.inputPlaceholder')}
          spellCheck={false}
          className="min-h-[140px] flex-1 rounded-lg border border-border bg-white p-3 font-mono text-sm text-gray-700 outline-none transition-colors focus:border-brand dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
        />
      ) : (
        <div
          onClick={() => document.getElementById('hash-file')?.click()}
          className="flex min-h-[120px] flex-1 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-400 transition-colors hover:border-brand hover:text-brand dark:border-gray-600"
        >
          {input || t('common.clickToSelect')}
          <input
            id="hash-file"
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) computeSingleFile(file)
            }}
          />
        </div>
      )}

      <button
        onClick={compute}
        disabled={computing}
        className="w-full rounded-md bg-brand py-2 text-sm font-medium text-white hover:bg-brand-light disabled:opacity-40"
      >
        {computing ? t('hash.computing') : t('hash.compute')}
      </button>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {Object.keys(results).length > 0 && (
        <div className="flex-1 space-y-2 overflow-auto">
          {ALGOS.map((algo) => (
            <div
              key={algo}
              className="flex items-start justify-between gap-2 rounded-lg border border-border bg-gray-50 px-3 py-2 dark:border-border-dark dark:bg-gray-900/50"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 text-xs font-medium text-gray-400">{algo}</div>
                <code className="break-all font-mono text-xs text-gray-700 dark:text-gray-300">
                  {results[algo]}
                </code>
              </div>
              <CopyButton text={results[algo] ?? ''} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
