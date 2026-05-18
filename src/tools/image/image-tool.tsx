import { useState, useCallback, useRef, useEffect } from 'react'
import { ToolPageSplit } from '@/components/shared/tool-page-split'
import { ToolCard } from '@/components/shared/tool-card'
import { ToolFileDrop } from '@/components/shared/tool-file-drop'
import { useT } from '@/i18n/context'

type Format = 'image/png' | 'image/jpeg' | 'image/webp'

const FORMATS: Array<{ value: Format; label: string; ext: string }> = [
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
]

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function ImageTool() {
  const { t } = useT()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [format, setFormat] = useState<Format>('image/png')
  const [quality, setQuality] = useState(92)
  const [scale, setScale] = useState(100)
  const [originalSize, setOriginalSize] = useState({ w: 0, h: 0 })
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState(0)

  useEffect(() => {
    return () => { if (outputUrl) URL.revokeObjectURL(outputUrl) }
  }, [outputUrl])

  const handleFile = useCallback((file: File) => {
    setOriginalFile(file)
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setOriginalSize({ w: img.width, h: img.height })
      setSrc(url)
    }
    img.src = url
  }, [])

  const convert = useCallback(() => {
    if (!src || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      const w = Math.round(originalSize.w * scale / 100)
      const h = Math.round(originalSize.h * scale / 100)
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
        },
        format,
        quality / 100,
      )
    }
    img.src = src
  }, [src, originalSize, scale, format, quality, outputUrl])

  const download = useCallback(() => {
    if (!outputUrl || !originalFile) return
    const ext = FORMATS.find((f) => f.value === format)!.ext
    const baseName = originalFile.name.replace(/\.[^.]+$/, '')
    const a = document.createElement('a')
    a.href = outputUrl
    a.download = `${baseName}.${ext}`
    a.click()
  }, [outputUrl, originalFile, format])

  const btnClass = 'rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-border-dark dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'

  return (
    <ToolPageSplit
      settings={
        <ToolCard title={t('image.settings')}>
          <div className="space-y-4">
            <ToolFileDrop
              label={t('image.dropLabel')}
              onFile={handleFile}
              accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
            />

            {src && (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                    {t('image.originalSize')}
                  </label>
                  <div className="text-sm text-gray-700 dark:text-gray-200">{originalSize.w} × {originalSize.h}px</div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                    {t('image.format')}
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

                {format !== 'image/png' && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                      {t('image.quality')}: {quality}%
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
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                    {t('image.scale')}: {scale}%
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full accent-brand"
                  />
                </div>

                <button onClick={convert} className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-light">
                  {t('image.convert')}
                </button>
              </>
            )}
          </div>
        </ToolCard>
      }
      output={
        <ToolCard title={t('image.preview')}>
          <canvas ref={canvasRef} className="hidden" />
          {outputUrl ? (
            <div className="space-y-3">
              <img src={outputUrl} alt="Converted" className="max-w-full rounded-lg border border-border dark:border-border-dark" />
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{t('image.outputSize')}: {formatSize(outputSize)}</span>
                {originalFile && (
                  <span>{t('image.compression')}: {((1 - outputSize / originalFile.size) * 100).toFixed(1)}%</span>
                )}
              </div>
              <button onClick={download} className={btnClass}>
                {t('image.download')}
              </button>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400">
              {t('image.noPreview')}
            </div>
          )}
        </ToolCard>
      }
    />
  )
}
