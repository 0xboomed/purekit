import { useState, useCallback, useRef, useEffect } from 'react'
import { ToolPageSplit } from '@/components/shared/tool-page-split'
import { ToolCard } from '@/components/shared/tool-card'
import { useT } from '@/i18n/context'

type Format = 'image/jpeg' | 'image/webp'

const FORMATS: Array<{ value: Format; label: string; ext: string }> = [
  { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
]

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function ImageCompressTool() {
  const { t } = useT()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState({ w: 0, h: 0 })
  const [quality, setQuality] = useState(80)
  const [maxDim, setMaxDim] = useState(0)
  const [format, setFormat] = useState<Format>('image/webp')
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState(0)
  const [outputDimensions, setOutputDimensions] = useState({ w: 0, h: 0 })

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl)
    }
  }, [originalUrl])

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl)
    }
  }, [outputUrl])

  const handleFile = useCallback((file: File) => {
    if (originalUrl) URL.revokeObjectURL(originalUrl)
    if (outputUrl) URL.revokeObjectURL(outputUrl)

    const url = URL.createObjectURL(file)
    setOriginalFile(file)
    setOriginalUrl(url)
    setOutputUrl(null)
    setOutputSize(0)
    setOutputDimensions({ w: 0, h: 0 })

    const img = new Image()
    img.onload = () => {
      setOriginalSize({ w: img.width, h: img.height })
    }
    img.src = url
  }, [originalUrl, outputUrl])

  const compress = useCallback(() => {
    if (!originalUrl || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      let w = img.width
      let h = img.height

      if (maxDim > 0 && (w > maxDim || h > maxDim)) {
        const ratio = Math.min(maxDim / w, maxDim / h)
        w = Math.round(w * ratio)
        h = Math.round(h * ratio)
      }

      canvas.width = w
      canvas.height = h
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(img, 0, 0, w, h)

      canvas.toBlob(
        (blob) => {
          if (!blob) return
          if (outputUrl) URL.revokeObjectURL(outputUrl)
          const url = URL.createObjectURL(blob)
          setOutputUrl(url)
          setOutputSize(blob.size)
          setOutputDimensions({ w, h })
        },
        format,
        quality / 100,
      )
    }
    img.src = originalUrl
  }, [originalUrl, maxDim, format, quality, outputUrl])

  const download = useCallback(() => {
    if (!outputUrl || !originalFile) return
    const ext = FORMATS.find((f) => f.value === format)!.ext
    const baseName = originalFile.name.replace(/\.[^.]+$/, '')
    const a = document.createElement('a')
    a.href = outputUrl
    a.download = `${baseName}-compressed.${ext}`
    a.click()
  }, [outputUrl, originalFile, format])

  const ratio = originalFile && outputSize > 0
    ? ((1 - outputSize / originalFile.size) * 100).toFixed(1)
    : null

  return (
    <ToolPageSplit
      settings={
        <ToolCard title={t('imagecompress.settings')}>
          <div className="space-y-4">
            <div
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/png,image/jpeg,image/webp,image/gif,image/bmp'
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) handleFile(file)
                }
                input.click()
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const file = e.dataTransfer.files[0]
                if (file && file.type.startsWith('image/')) handleFile(file)
              }}
              className="flex min-h-[120px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-400 transition-colors hover:border-brand hover:text-brand dark:border-gray-600"
            >
              {t('imagecompress.dropLabel')}
            </div>

            {originalFile && (
              <>
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

                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {originalSize.w} x {originalSize.h}px &middot; {formatSize(originalFile.size)}
                </div>

                <button
                  onClick={compress}
                  className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-light"
                >
                  {t('imagecompress.compress')}
                </button>
              </>
            )}
          </div>
        </ToolCard>
      }
      output={
        <ToolCard title={t('imagecompress.result')}>
          <canvas ref={canvasRef} className="hidden" />
          {outputUrl ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                    {t('imagecompress.original')}
                  </div>
                  <img
                    src={originalUrl!}
                    alt="Original"
                    className="max-w-full rounded-lg border border-border dark:border-border-dark"
                  />
                  <div className="mt-1 text-[11px] text-gray-400">
                    {formatSize(originalFile!.size)}
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                    {t('imagecompress.compressed')}
                  </div>
                  <img
                    src={outputUrl}
                    alt="Compressed"
                    className="max-w-full rounded-lg border border-border dark:border-border-dark"
                  />
                  <div className="mt-1 text-[11px] text-gray-400">
                    {formatSize(outputSize)} &middot; {outputDimensions.w} x {outputDimensions.h}px
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">{t('imagecompress.compressionRatio')}</span>
                  <span className={`font-medium ${ratio && Number(ratio) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                    {ratio !== null ? `${Number(ratio) > 0 ? '-' : '+'}${Math.abs(Number(ratio))}%` : '-'}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${Math.min(Math.max(Number(ratio) || 0, 0), 100)}%` }}
                  />
                </div>
              </div>

              <button
                onClick={download}
                className="w-full rounded-lg border border-border bg-white py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-border-dark dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {t('imagecompress.download')}
              </button>
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
