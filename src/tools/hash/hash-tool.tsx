import { useState, useCallback } from 'react'
import { ToolPageDual } from '@/components/shared/tool-page-dual'
import { ToolCard } from '@/components/shared/tool-card'
import { ToolInput } from '@/components/shared/tool-input'
import { ToolFileDrop } from '@/components/shared/tool-file-drop'
import { ToolSegmentedControl } from '@/components/shared/tool-segmented-control'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'
import { Loader2 } from 'lucide-react'

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
                  onChange={(v) => { setMode(v); setInput(''); setResults({}) }}
                />
                <button onClick={() => { setInput(''); setResults({}); setError('') }} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {t('common.clear')}
                </button>
              </div>
            }
          >
            {mode === 'text' ? (
              <ToolInput value={input} onChange={setInput} placeholder={t('hash.inputPlaceholder')} />
            ) : (
              <ToolFileDrop label={input || t('common.clickToSelect')} onFile={computeSingleFile} />
            )}
          </ToolCard>

          <button
            onClick={compute}
            disabled={computing}
            className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-light disabled:opacity-40"
          >
            {computing ? <><Loader2 size={14} className="mr-1 inline animate-spin" />{t('hash.computing')}</> : t('hash.compute')}
          </button>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
        </>
      }
      right={
        <ToolCard title={t('common.output')} className="flex-1">
          {Object.keys(results).length > 0 ? (
            <div className="space-y-2">
              {ALGOS.map((algo) => (
                <div key={algo} className="flex items-start justify-between gap-2 rounded-lg border border-border bg-gray-50 px-3 py-2 dark:border-border-dark dark:bg-gray-900/50">
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 text-xs font-medium text-gray-400">{algo}</div>
                    <code className="break-all font-mono text-xs text-gray-700 dark:text-gray-300">{results[algo]}</code>
                  </div>
                  <CopyButton text={results[algo] ?? ''} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">
              {t('hash.inputPlaceholder')}
            </div>
          )}
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
