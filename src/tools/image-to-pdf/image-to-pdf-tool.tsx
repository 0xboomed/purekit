import { useState, useCallback, useRef } from 'react'
import { jsPDF } from 'jspdf'
import { ToolPageSplit } from '@/components/shared/tool-page-split'
import { ToolCard } from '@/components/shared/tool-card'
import { useT } from '@/i18n/context'
import { Upload, X, ImageDown } from 'lucide-react'

interface ImageEntry {
  file: File
  url: string
  id: string
}

type Orientation = 'portrait' | 'landscape'
type PageSize = 'a4' | 'letter'

const PAGE_SIZES: Record<PageSize, { w: number; h: number }> = {
  a4: { w: 210, h: 297 },
  letter: { w: 215.9, h: 279.4 },
}

const MARGIN = 10

export default function ImageToPdfTool() {
  const { t } = useT()
  const inputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<ImageEntry[]>([])
  const [orientation, setOrientation] = useState<Orientation>('portrait')
  const [pageSize, setPageSize] = useState<PageSize>('a4')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const addFiles = useCallback((files: FileList | File[]) => {
    const entries: ImageEntry[] = []
    const allowed = ['image/png', 'image/jpeg', 'image/webp']
    for (const file of Array.from(files)) {
      if (!allowed.includes(file.type)) continue
      entries.push({ file, url: URL.createObjectURL(file), id: crypto.randomUUID() })
    }
    setImages((prev) => [...prev, ...entries])
  }, [])

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const entry = prev.find((e) => e.id === id)
      if (entry) URL.revokeObjectURL(entry.url)
      return prev.filter((e) => e.id !== id)
    })
  }, [])

  const loadImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })

  const generate = useCallback(async () => {
    if (images.length === 0) return
    setGenerating(true)
    if (pdfUrl) URL.revokeObjectURL(pdfUrl)

    try {
      const dims = PAGE_SIZES[pageSize]
      const doc = new jsPDF({ orientation, format: pageSize === 'a4' ? 'a4' : 'letter', unit: 'mm' })

      for (const [i, entry] of images.entries()) {
        if (i > 0) doc.addPage()

        const img = await loadImage(entry.url)
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) continue
        ctx.drawImage(img, 0, 0)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92)

        const pageW = orientation === 'portrait' ? dims.w : dims.h
        const pageH = orientation === 'portrait' ? dims.h : dims.w
        const maxW = pageW - MARGIN * 2
        const maxH = pageH - MARGIN * 2

        const ratio = Math.min(maxW / img.width, maxH / img.height, 1)
        const w = img.width * ratio
        const h = img.height * ratio
        const x = (pageW - w) / 2
        const y = (pageH - h) / 2

        doc.addImage(dataUrl, 'JPEG', x, y, w, h)
      }

      const blob = doc.output('blob')
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } finally {
      setGenerating(false)
    }
  }, [images, orientation, pageSize, pdfUrl])

  const download = useCallback(() => {
    if (!pdfUrl) return
    const a = document.createElement('a')
    a.href = pdfUrl
    a.download = 'output.pdf'
    a.click()
  }, [pdfUrl])

  const selectClass =
    'w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200'
  const btnPrimary =
    'w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-light disabled:opacity-50'
  const btnSecondary =
    'rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-border-dark dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'

  return (
    <ToolPageSplit
      settings={
        <ToolCard title={t('imagetopdf.settings')}>
          <div className="space-y-4">
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
              className={`flex min-h-[120px] cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed text-sm transition-colors ${
                dragOver
                  ? 'border-brand text-brand'
                  : 'border-gray-300 text-gray-400 hover:border-brand hover:text-brand dark:border-gray-600'
              }`}
            >
              <Upload size={16} />
              {t('imagetopdf.dropLabel')}
              <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => { if (e.target.files) addFiles(e.target.files) }}
              />
            </div>

            {images.length > 0 && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                  {t('imagetopdf.images')} ({images.length})
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((entry) => (
                    <div key={entry.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border dark:border-border-dark">
                      <img src={entry.url} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeImage(entry.id)}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('imagetopdf.orientation')}
              </label>
              <div className="flex gap-2">
                {(['portrait', 'landscape'] as const).map((o) => (
                  <button
                    key={o}
                    onClick={() => setOrientation(o)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      orientation === o
                        ? 'border-brand bg-brand/10 text-brand'
                        : 'border-border bg-white text-gray-600 hover:bg-gray-50 dark:border-border-dark dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {t(`imagetopdf.${o}`)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('imagetopdf.pageSize')}
              </label>
              <select value={pageSize} onChange={(e) => setPageSize(e.target.value as PageSize)} className={selectClass}>
                <option value="a4">A4 (210 × 297 mm)</option>
                <option value="letter">Letter (216 × 279 mm)</option>
              </select>
            </div>

            <button
              onClick={generate}
              disabled={images.length === 0 || generating}
              className={btnPrimary}
            >
              {generating ? t('imagetopdf.generating') : t('imagetopdf.generate')}
            </button>
          </div>
        </ToolCard>
      }
      output={
        <ToolCard title={t('imagetopdf.result')}>
          {pdfUrl ? (
            <div className="space-y-3">
              <iframe src={pdfUrl} className="h-[70vh] w-full rounded-lg border border-border dark:border-border-dark" title="PDF Preview" />
              <button onClick={download} className={`${btnSecondary} flex w-full items-center justify-center gap-2`}>
                <ImageDown size={16} />
                {t('imagetopdf.download')}
              </button>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400">
              {t('imagetopdf.noImages')}
            </div>
          )}
        </ToolCard>
      }
    />
  )
}
