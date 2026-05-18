import { useState, useCallback, useRef } from 'react'
import { ToolPageSplit } from '@/components/shared/tool-page-split'
import { ToolCard } from '@/components/shared/tool-card'
import { useT } from '@/i18n/context'

type Format = 'image/jpeg' | 'image/webp'

interface FileEntry {
  id: string
  file: File
  url: string
}

interface CompressResult {
  id: string
  name: string
  originalSize: number
  compressedSize: number
  blob: Blob
}

const FORMATS: Array<{ value: Format; label: string; ext: string }> = [
  { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
]

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function compressImage(
  file: File,
  canvas: HTMLCanvasElement,
  quality: number,
  maxDim: number,
  format: Format,
): Promise<Blob> {
  const img = new Image()
  const url = URL.createObjectURL(file)
  img.src = url
  await new Promise(r => { img.onload = r })
  const ctx = canvas.getContext('2d')!
  let w = img.width, h = img.height
  if (maxDim > 0 && (w > maxDim || h > maxDim)) {
    const ratio = Math.min(maxDim / w, maxDim / h)
    w = Math.round(w * ratio)
    h = Math.round(h * ratio)
  }
  canvas.width = w
  canvas.height = h
  ctx.clearRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0, w, h)
  URL.revokeObjectURL(url)
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(), format, quality / 100)
  })
}

export default function ImageCompressTool() {
  const { t } = useT()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [files, setFiles] = useState<FileEntry[]>([])
  const [results, setResults] = useState<CompressResult[]>([])
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)
  const [quality, setQuality] = useState(80)
  const [maxDim, setMaxDim] = useState(0)
  const [format, setFormat] = useState<Format>('image/webp')

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const newEntries: FileEntry[] = []
    for (let i = 0; i < incoming.length; i++) {
      const file = incoming[i]!
      if (!file.type.startsWith('image/')) continue
      newEntries.push({
        id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        url: URL.createObjectURL(file),
      })
    }
    if (newEntries.length > 0) {
      setFiles(prev => [...prev, ...newEntries])
      setResults([])
    }
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const entry = prev.find(e => e.id === id)
      if (entry) URL.revokeObjectURL(entry.url)
      return prev.filter(e => e.id !== id)
    })
    setResults(prev => prev.filter(r => r.id !== id))
  }, [])

  const compressAll = useCallback(async () => {
    if (files.length === 0 || !canvasRef.current) return
    setProgress({ current: 0, total: files.length })
    const newResults: CompressResult[] = []
    for (let i = 0; i < files.length; i++) {
      const entry = files[i]!
      const blob = await compressImage(entry.file, canvasRef.current, quality, maxDim, format)
      const ext = FORMATS.find(f => f.value === format)!.ext
      const baseName = entry.file.name.replace(/\.[^.]+$/, '')
      newResults.push({
        id: entry.id,
        name: `${baseName}-compressed.${ext}`,
        originalSize: entry.file.size,
        compressedSize: blob.size,
        blob,
      })
      setProgress({ current: i + 1, total: files.length })
    }
    setResults(newResults)
    setProgress(null)
  }, [files, quality, maxDim, format])

  const downloadAll = useCallback(() => {
    for (const r of results) {
      const url = URL.createObjectURL(r.blob)
      const a = document.createElement('a')
      a.href = url
      a.download = r.name
      a.click()
      URL.revokeObjectURL(url)
    }
  }, [results])

  const downloadOne = useCallback((r: CompressResult) => {
    const url = URL.createObjectURL(r.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = r.name
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  return (
    <ToolPageSplit
      settings={
        <ToolCard title={t('imagecompress.settings')}>
          <div className="space-y-4">
            <div
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.multiple = true
                input.onchange = (e) => {
                  const fileList = (e.target as HTMLInputElement).files
                  if (fileList) addFiles(fileList)
                }
                input.click()
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
              }}
              className="flex min-h-[100px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-400 transition-colors hover:border-brand hover:text-brand dark:border-gray-600"
            >
              {t('imagecompress.dropLabel')}
            </div>

            {files.length > 0 && (
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {files.length} {t('imagecompress.files')}
              </div>
            )}

            {files.length > 0 && (
              <div className="max-h-[200px] space-y-1.5 overflow-y-auto pr-1">
                {files.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2.5 py-1.5 text-xs dark:bg-gray-800/60"
                  >
                    <span className="min-w-0 truncate text-gray-700 dark:text-gray-300">
                      {entry.file.name}
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-gray-400">{formatSize(entry.file.size)}</span>
                      <button
                        onClick={() => removeFile(entry.id)}
                        className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('imagecompress.quality')}: {quality}%
              </label>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('imagecompress.maxDimension')}: {maxDim > 0 ? `${maxDim}px` : t('imagecompress.noLimit')}
              </label>
              <input
                type="range"
                min={0}
                max={4096}
                step={64}
                value={maxDim}
                onChange={(e) => setMaxDim(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('imagecompress.format')}
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as Format)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
              >
                {FORMATS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={compressAll}
              disabled={files.length === 0 || progress !== null}
              className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              {progress !== null
                ? `${progress.current} / ${progress.total}`
                : t('imagecompress.compressAll')}
            </button>
          </div>
        </ToolCard>
      }
      output={
        <ToolCard
          title={t('imagecompress.result')}
          titleAction={
            results.length > 0
              ? (
                  <button
                    onClick={downloadAll}
                    className="text-xs font-medium text-brand hover:text-brand-light"
                  >
                    {t('imagecompress.downloadAll')}
                  </button>
                )
              : undefined
          }
        >
          <canvas ref={canvasRef} className="hidden" />

          {results.length > 0 ? (
            <div className="space-y-2.5">
              {results.map((r) => {
                const ratio = ((1 - r.compressedSize / r.originalSize) * 100).toFixed(1)
                const isReduction = Number(ratio) > 0
                return (
                  <div
                    key={r.id}
                    className="rounded-lg border border-border bg-white p-3 dark:border-border-dark dark:bg-gray-800/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                          {r.name}
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          {formatSize(r.originalSize)} → {formatSize(r.compressedSize)}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            isReduction
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                          }`}
                        >
                          {isReduction ? '-' : '+'}{Math.abs(Number(ratio))}%
                        </span>
                        <button
                          onClick={() => downloadOne(r)}
                          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand dark:hover:bg-gray-700 dark:hover:text-brand-light"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : progress !== null ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 text-sm text-gray-400">
              <div className="relative h-10 w-10">
                <svg className="h-10 w-10 animate-spin text-gray-300 dark:text-gray-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
              <span>
                {progress.current} / {progress.total}
              </span>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400">
              {t('imagecompress.noImage')}
            </div>
          )}
        </ToolCard>
      }
    />
  )
}
