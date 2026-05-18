import { useState, useCallback, useRef } from 'react'
import { PDFDocument } from 'pdf-lib'
import { ToolPageSplit } from '@/components/shared/tool-page-split'
import { ToolCard } from '@/components/shared/tool-card'
import { useT } from '@/i18n/context'

interface PdfEntry {
  id: string
  file: File
  pageCount: number
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function PdfMergeTool() {
  const { t } = useT()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  const [files, setFiles] = useState<PdfEntry[]>([])
  const [merging, setMerging] = useState(false)
  const [mergedUrl, setMergedUrl] = useState<string | null>(null)
  const [mergedSize, setMergedSize] = useState(0)
  const [mergedPageCount, setMergedPageCount] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)

  const reorderFiles = useCallback((from: number, to: number) => {
    setFiles((prev) => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      if (item) next.splice(to, 0, item)
      return next
    })
    setMergedUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null })
  }, [])

  const addFiles = useCallback(async (incoming: FileList | File[]) => {
    const pdfs: PdfEntry[] = []
    for (const file of Array.from(incoming)) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) continue
      try {
        const buffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(buffer)
        pdfs.push({
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          pageCount: pdf.getPageCount(),
        })
      } catch {
        // skip invalid PDFs
      }
    }
    if (pdfs.length > 0) {
      setFiles((prev) => [...prev, ...pdfs])
      setMergedUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null })
    }
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    setMergedUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null })
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
    },
    [addFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files)
        e.target.value = ''
      }
    },
    [addFiles],
  )

  const mergePdfs = useCallback(async () => {
    if (files.length === 0) return
    setMerging(true)
    try {
      const merged = await PDFDocument.create()
      for (const entry of files) {
        const buffer = await entry.file.arrayBuffer()
        const srcPdf = await PDFDocument.load(buffer)
        const indices = srcPdf.getPageIndices()
        const copiedPages = await merged.copyPages(srcPdf, indices)
        for (const page of copiedPages) {
          merged.addPage(page)
        }
      }
      const bytes = await merged.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })
      if (mergedUrl) URL.revokeObjectURL(mergedUrl)
      const url = URL.createObjectURL(blob)
      setMergedUrl(url)
      setMergedSize(blob.size)
      setMergedPageCount(merged.getPageCount())
    } finally {
      setMerging(false)
    }
  }, [files, mergedUrl])

  const download = useCallback(() => {
    if (!mergedUrl || files.length === 0) return
    const baseName = files[0]!.file.name.replace(/\.pdf$/i, '')
    const a = document.createElement('a')
    a.href = mergedUrl
    a.download = `${baseName}_merged.pdf`
    a.click()
  }, [mergedUrl, files])

  const totalPages = files.reduce((sum, f) => sum + f.pageCount, 0)

  return (
    <ToolPageSplit
      settings={
        <ToolCard title={t('pdfmerge.settings')}>
          <div className="space-y-4">
            <div
              ref={dropRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => inputRef.current?.click()}
              className={`flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed text-sm transition-colors ${
                dragOver
                  ? 'border-brand bg-brand/5 text-brand'
                  : 'border-gray-300 text-gray-400 hover:border-brand hover:text-brand dark:border-gray-600'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              <span>{t('pdfmerge.dropLabel')}</span>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={handleInputChange}
            />

            {files.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {t('pdfmerge.files')} ({files.length} {t('pdfmerge.totalFiles')})
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {totalPages} {t('pdfmerge.pages')}
                  </span>
                </div>
                <div className="max-h-64 space-y-1.5 overflow-auto">
                  {files.map((entry, idx) => (
                    <div
                      key={entry.id}
                      draggable
                      onDragStart={() => setDragIdx(idx)}
                      onDragOver={(e) => { e.preventDefault(); setOverIdx(idx) }}
                      onDragEnd={() => { setDragIdx(null); setOverIdx(null) }}
                      onDrop={(e) => {
                        e.preventDefault()
                        if (dragIdx !== null && dragIdx !== idx) reorderFiles(dragIdx, idx)
                        setDragIdx(null); setOverIdx(null)
                      }}
                      className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2 transition-colors dark:bg-gray-900 ${
                        overIdx === idx && dragIdx !== null && dragIdx !== idx
                          ? 'border-brand border-dashed'
                          : 'border-border dark:border-border-dark'
                      } ${dragIdx === idx ? 'opacity-40' : ''}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 cursor-grab text-gray-300 active:cursor-grabbing dark:text-gray-600"><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="18" x2="16" y2="18" /></svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-red-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><polyline points="14 2 14 8 20 8" /></svg>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-gray-700 dark:text-gray-200">{entry.file.name}</div>
                        <div className="text-xs text-gray-400">
                          {entry.pageCount} {t('pdfmerge.pages')} · {formatSize(entry.file.size)}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(entry.id) }}
                        className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={mergePdfs}
                  disabled={merging}
                  className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light disabled:opacity-50"
                >
                  {merging ? t('pdfmerge.merging') : t('pdfmerge.merge')}
                </button>
              </div>
            )}
          </div>
        </ToolCard>
      }
      output={
        <ToolCard title={t('pdfmerge.result')}>
          {mergedUrl ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-gray-50 px-3 py-2 dark:border-border-dark dark:bg-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t('pdfmerge.totalPages')}</div>
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">{mergedPageCount}</div>
                </div>
                <div className="rounded-lg border border-border bg-gray-50 px-3 py-2 dark:border-border-dark dark:bg-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t('pdfmerge.files')}</div>
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">{files.length} {t('pdfmerge.totalFiles')}</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">{formatSize(mergedSize)}</div>
              <button
                onClick={download}
                className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light"
              >
                {t('pdfmerge.download')}
              </button>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400">
              {t('pdfmerge.noFiles')}
            </div>
          )}
        </ToolCard>
      }
    />
  )
}
