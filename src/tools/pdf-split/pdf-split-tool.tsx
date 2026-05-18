import { useState, useCallback, useRef } from 'react'
import { PDFDocument } from 'pdf-lib'
import { ToolPageSplit } from '@/components/shared/tool-page-split'
import { ToolCard } from '@/components/shared/tool-card'
import { ToolFileDrop } from '@/components/shared/tool-file-drop'
import { useT } from '@/i18n/context'

type SplitMode = 'range' | 'everyN' | 'all'

interface SplitResult {
  name: string
  blob: Blob
  pages: string
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function parseRanges(input: string, maxPage: number): number[][] {
  return input
    .split(',')
    .map((part) => {
      const trimmed = part.trim()
      if (!trimmed) return []
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-')
        const start = Number(startStr)
        const end = Number(endStr)
        if (isNaN(start) || isNaN(end)) return []
        const s = Math.max(1, start)
        const e = Math.min(maxPage, end)
        if (s > e) return []
        return Array.from({ length: e - s + 1 }, (_, i) => s - 1 + i)
      }
      const n = Number(trimmed)
      if (isNaN(n) || n < 1 || n > maxPage) return []
      return [n - 1]
    })
    .filter((arr) => arr.length > 0)
}

async function splitByRanges(
  srcPdf: PDFDocument,
  srcBytes: ArrayBuffer,
  ranges: number[][],
  baseName: string,
): Promise<SplitResult[]> {
  const results: SplitResult[] = []
  for (let i = 0; i < ranges.length; i++) {
    const indices = ranges[i]!
    const newPdf = await PDFDocument.create()
    const copiedPages = await newPdf.copyPages(srcPdf, indices)
    for (const page of copiedPages) {
      newPdf.addPage(page)
    }
    const pdfBytes = await newPdf.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const pageRange =
      indices.length === 1
        ? `${indices[0]! + 1}`
        : `${indices[0]! + 1}-${indices[indices.length - 1]! + 1}`
    results.push({
      name: `${baseName}_part${i + 1}.pdf`,
      blob,
      pages: pageRange,
    })
  }
  void srcBytes
  return results
}

async function splitEveryN(
  srcPdf: PDFDocument,
  totalPages: number,
  n: number,
  baseName: string,
): Promise<SplitResult[]> {
  const results: SplitResult[] = []
  let part = 1
  for (let start = 0; start < totalPages; start += n) {
    const end = Math.min(start + n, totalPages)
    const indices = Array.from({ length: end - start }, (_, i) => start + i)
    const newPdf = await PDFDocument.create()
    const copiedPages = await newPdf.copyPages(srcPdf, indices)
    for (const page of copiedPages) {
      newPdf.addPage(page)
    }
    const pdfBytes = await newPdf.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    results.push({
      name: `${baseName}_part${part}.pdf`,
      blob,
      pages: `${start + 1}-${end}`,
    })
    part++
  }
  return results
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function PdfSplitTool() {
  const { t } = useT()
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [mode, setMode] = useState<SplitMode>('range')
  const [rangeInput, setRangeInput] = useState('')
  const [everyN, setEveryN] = useState(1)
  const [results, setResults] = useState<SplitResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const srcPdfRef = useRef<PDFDocument | null>(null)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    setResults([])
    setError('')
    try {
      const buffer = await f.arrayBuffer()
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
      srcPdfRef.current = pdf
      setPageCount(pdf.getPageCount())
    } catch {
      srcPdfRef.current = null
      setPageCount(0)
      setError(t('pdfsplit.invalidRange'))
    }
  }, [t])

  const handleSplit = useCallback(async () => {
    const srcPdf = srcPdfRef.current
    if (!srcPdf || !file) return

    const baseName = file.name.replace(/\.pdf$/i, '')
    setLoading(true)
    setError('')
    setResults([])

    try {
      let splitResults: SplitResult[]

      if (mode === 'all') {
        splitResults = await splitByRanges(
          srcPdf,
          await file.arrayBuffer(),
          Array.from({ length: pageCount }, (_, i) => [i]),
          baseName,
        )
      } else if (mode === 'range') {
        if (!rangeInput.trim()) {
          setError(t('pdfsplit.invalidRange'))
          setLoading(false)
          return
        }
        const ranges = parseRanges(rangeInput, pageCount)
        if (ranges.length === 0) {
          setError(t('pdfsplit.invalidRange'))
          setLoading(false)
          return
        }
        splitResults = await splitByRanges(srcPdf, await file.arrayBuffer(), ranges, baseName)
      } else {
        if (everyN < 1) {
          setError(t('pdfsplit.invalidRange'))
          setLoading(false)
          return
        }
        splitResults = await splitEveryN(srcPdf, pageCount, everyN, baseName)
      }

      setResults(splitResults)
    } catch {
      setError(t('pdfsplit.invalidRange'))
    } finally {
      setLoading(false)
    }
  }, [file, mode, rangeInput, everyN, pageCount, t])

  const handleDownload = useCallback((result: SplitResult) => {
    downloadBlob(result.blob, result.name)
  }, [])

  const handleDownloadAll = useCallback(() => {
    for (const result of results) {
      downloadBlob(result.blob, result.name)
    }
  }, [results])

  const handleClear = useCallback(() => {
    setFile(null)
    setPageCount(0)
    setResults([])
    setError('')
    setRangeInput('')
    srcPdfRef.current = null
  }, [])

  const btnClass =
    'rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-border-dark dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'

  return (
    <ToolPageSplit
      settings={
        <ToolCard title={t('pdfsplit.settings')}>
          <div className="space-y-4">
            {!file ? (
              <ToolFileDrop
                label={t('pdfsplit.dropLabel')}
                onFile={handleFile}
                accept="application/pdf"
              />
            ) : (
              <>
                <div className="rounded-lg border border-border bg-gray-50 p-3 dark:border-border-dark dark:bg-gray-900/50">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {t('pdfsplit.fileInfo')}
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{t('pdfsplit.pageCount')}</span>
                      <span className="font-medium">{pageCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{'Size'}</span>
                      <span className="font-medium">{formatSize(file.size)}</span>
                    </div>
                  </div>
                  <div className="mt-2 truncate text-xs text-gray-400" title={file.name}>
                    {file.name}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                    {t('pdfsplit.mode')}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMode('all')}
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                        mode === 'all'
                          ? 'border-brand bg-brand/10 text-brand'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                      }`}
                    >
                      {t('pdfsplit.allPages')}
                    </button>
                    <button
                      onClick={() => setMode('range')}
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                        mode === 'range'
                          ? 'border-brand bg-brand/10 text-brand'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                      }`}
                    >
                      {t('pdfsplit.byRange')}
                    </button>
                    <button
                      onClick={() => setMode('everyN')}
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                        mode === 'everyN'
                          ? 'border-brand bg-brand/10 text-brand'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                      }`}
                    >
                      {t('pdfsplit.everyN')}
                    </button>
                  </div>
                </div>

                {mode === 'range' ? (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      {t('pdfsplit.byRange')}
                    </label>
                    <input
                      value={rangeInput}
                      onChange={(e) => setRangeInput(e.target.value)}
                      placeholder={t('pdfsplit.rangePlaceholder')}
                      spellCheck={false}
                      className="w-full rounded-lg border border-border bg-white px-3 py-2 font-mono text-sm text-gray-700 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                ) : mode === 'everyN' ? (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      {t('pdfsplit.pagesPer')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={pageCount}
                      value={everyN}
                      onChange={(e) => setEveryN(Math.max(1, Number(e.target.value)))}
                      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                ) : (
                  <div className="rounded-lg bg-brand/5 px-3 py-2 text-xs text-brand dark:bg-brand/10">
                    {t('pdfsplit.allPagesHint').replace('{0}', String(pageCount))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleSplit}
                    disabled={loading}
                    className="flex-1 rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-light disabled:opacity-50"
                  >
                    {loading ? '...' : t('pdfsplit.split')}
                  </button>
                  <button onClick={handleClear} className={btnClass}>
                    {'Clear'}
                  </button>
                </div>
              </>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
          </div>
        </ToolCard>
      }
      output={
        <ToolCard title={t('pdfsplit.result')} titleAction={
          results.length > 0 ? (
            <button onClick={handleDownloadAll} className="text-xs font-medium text-brand hover:underline">
              {t('pdfsplit.downloadAll')}
            </button>
          ) : undefined
        }>
          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border bg-gray-50 px-3 py-2.5 dark:border-border-dark dark:bg-gray-900/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                      {result.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {t('pdfsplit.pages')}: {result.pages} ({formatSize(result.blob.size)})
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(result)}
                    className="ml-3 shrink-0 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-border-dark dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {t('pdfsplit.download')}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400">
              {file ? t('pdfsplit.noFile') : t('pdfsplit.noFile')}
            </div>
          )}
        </ToolCard>
      }
    />
  )
}
