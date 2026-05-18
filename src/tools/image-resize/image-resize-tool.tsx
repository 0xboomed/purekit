import { useState, useCallback, useRef, useEffect } from 'react'
import { Download } from 'lucide-react'
import { ToolPageSplit } from '@/components/shared/tool-page-split'
import { ToolCard } from '@/components/shared/tool-card'
import { ToolFileDrop } from '@/components/shared/tool-file-drop'
import { useT } from '@/i18n/context'

const PRESETS = [
  { id: 'wechat-cover', name: '微信公众号封面', nameEn: 'WeChat Cover', w: 900, h: 383 },
  { id: 'wechat-avatar', name: '微信头像', nameEn: 'WeChat Avatar', w: 640, h: 640 },
  { id: 'xiaohongshu-portrait', name: '小红书竖图', nameEn: 'Xiaohongshu Portrait', w: 1080, h: 1440 },
  { id: 'xiaohongshu-square', name: '小红书方图', nameEn: 'Xiaohongshu Square', w: 1080, h: 1080 },
  { id: 'douyin', name: '抖音封面', nameEn: 'Douyin Cover', w: 1080, h: 1920 },
  { id: 'weibo', name: '微博配图', nameEn: 'Weibo Image', w: 1000, h: 562 },
  { id: 'twitter', name: 'Twitter / X', nameEn: 'Twitter / X', w: 1200, h: 675 },
  { id: 'instagram-square', name: 'Instagram 方图', nameEn: 'Instagram Square', w: 1080, h: 1080 },
  { id: 'instagram-portrait', name: 'Instagram 竖图', nameEn: 'Instagram Portrait', w: 1080, h: 1350 },
  { id: 'facebook', name: 'Facebook', nameEn: 'Facebook', w: 1200, h: 630 },
  { id: 'youtube', name: 'YouTube 缩略图', nameEn: 'YouTube Thumbnail', w: 1280, h: 720 },
] as const

type Format = 'image/png' | 'image/jpeg'

interface ResizeResult {
  preset: typeof PRESETS[number]
  blob: Blob
  url: string
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function renderToCanvas(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  tw: number,
  th: number,
  format: Format,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) { reject(new Error('No canvas context')); return }

    canvas.width = tw
    canvas.height = th

    const scale = Math.max(tw / img.width, th / img.height)
    const sw = tw / scale
    const sh = th / scale
    const sx = (img.width - sw) / 2
    const sy = (img.height - sh) / 2

    ctx.clearRect(0, 0, tw, th)
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, tw, th)

    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('toBlob failed'))
      },
      format,
      format === 'image/jpeg' ? 0.92 : undefined,
    )
  })
}

export default function ImageResizeTool() {
  const { t, locale } = useT()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set(['wechat-cover']))
  const [format, setFormat] = useState<Format>('image/jpeg')
  const [results, setResults] = useState<ResizeResult[]>([])
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    return () => { results.forEach((r) => URL.revokeObjectURL(r.url)) }
  }, [results])

  useEffect(() => {
    return () => { if (src) URL.revokeObjectURL(src) }
  }, [src])

  const handleFile = useCallback((file: File) => {
    setOriginalFile(file)
    results.forEach((r) => URL.revokeObjectURL(r.url))
    setResults([])
    if (src) URL.revokeObjectURL(src)
    const url = URL.createObjectURL(file)
    setSrc(url)
  }, [results, src])

  const togglePreset = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelected(new Set(PRESETS.map((p) => p.id)))
  }, [])

  const deselectAll = useCallback(() => {
    setSelected(new Set())
  }, [])

  const generateAll = useCallback(async () => {
    if (!src || !canvasRef.current) return
    const canvas = canvasRef.current
    const targets = PRESETS.filter((p) => selected.has(p.id))
    if (targets.length === 0) return

    setGenerating(true)
    results.forEach((r) => URL.revokeObjectURL(r.url))

    const img = new Image()
    img.onload = async () => {
      const next: ResizeResult[] = []
      for (const preset of targets) {
        try {
          const blob = await renderToCanvas(canvas, img, preset.w, preset.h, format)
          next.push({ preset, blob, url: URL.createObjectURL(blob) })
        } catch { /* skip failed renders */ }
      }
      setResults(next)
      setGenerating(false)
    }
    img.onerror = () => setGenerating(false)
    img.src = src
  }, [src, selected, format, results])

  const downloadOne = useCallback((result: ResizeResult) => {
    if (!originalFile) return
    const ext = format === 'image/jpeg' ? 'jpg' : 'png'
    const baseName = originalFile.name.replace(/\.[^.]+$/, '')
    const a = document.createElement('a')
    a.href = result.url
    a.download = `${baseName}_${result.preset.w}x${result.preset.h}.${ext}`
    a.click()
  }, [originalFile, format])

  const downloadAll = useCallback(() => {
    results.forEach((r) => downloadOne(r))
  }, [results, downloadOne])

  const inputClass = 'w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200'

  return (
    <ToolPageSplit
      settings={
        <ToolCard title={t('imageresize.settings')}>
          <div className="space-y-4">
            <ToolFileDrop
              label={t('imageresize.dropLabel')}
              onFile={handleFile}
              accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
            />

            {src && (
              <img
                src={src}
                alt="Original"
                className="max-w-full rounded-lg border border-border dark:border-border-dark"
              />
            )}

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {t('imageresize.platform')}
                </label>
                <span className="text-xs text-gray-400">
                  {selected.size} / {PRESETS.length}
                </span>
              </div>
              <div className="mb-2 flex gap-3 text-xs">
                <button
                  onClick={selectAll}
                  className="text-brand hover:underline"
                >
                  {t('imageresize.selectAll')}
                </button>
                <button
                  onClick={deselectAll}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {t('imageresize.deselectAll')}
                </button>
              </div>
              <div className="grid max-h-64 grid-cols-2 gap-1.5 overflow-auto pr-1">
                {PRESETS.map((preset) => {
                  const active = selected.has(preset.id)
                  return (
                    <button
                      key={preset.id}
                      onClick={() => togglePreset(preset.id)}
                      className={`rounded-lg border px-2.5 py-2 text-left text-xs transition-colors ${
                        active
                          ? 'border-brand bg-brand/10 text-brand font-medium'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="block leading-tight">{locale === 'en' ? preset.nameEn : preset.name}</span>
                      <span className={`block text-[10px] ${active ? 'text-brand/60' : 'text-gray-400'}`}>
                        {preset.w} × {preset.h}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('imageresize.format')}
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as Format)}
                className={inputClass}
              >
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
              </select>
            </div>

            <button
              onClick={generateAll}
              disabled={!src || selected.size === 0 || generating}
              className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating ? t('common.processing') : t('imageresize.generateAll')}
            </button>
          </div>
        </ToolCard>
      }
      output={
        <ToolCard
          title={t('imageresize.result')}
          titleAction={
            results.length > 0 ? (
              <button
                onClick={downloadAll}
                className="flex items-center gap-1 text-xs font-medium text-brand hover:underline"
              >
                <Download size={12} />
                {t('imageresize.downloadAll')}
              </button>
            ) : undefined
          }
        >
          <canvas ref={canvasRef} className="hidden" />
          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {results.map((result) => (
                <div
                  key={result.preset.id}
                  className="overflow-hidden rounded-lg border border-border dark:border-border-dark"
                >
                  <div className="aspect-video w-full overflow-hidden bg-gray-50 dark:bg-gray-800">
                    <img
                      src={result.url}
                      alt={result.preset.nameEn}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="space-y-1.5 p-2.5">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-200">
                          {locale === 'en' ? result.preset.nameEn : result.preset.name}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {result.preset.w} × {result.preset.h} · {formatSize(result.blob.size)}
                        </div>
                      </div>
                      <button
                        onClick={() => downloadOne(result)}
                        className="shrink-0 rounded-md border border-border p-1 text-gray-400 transition-colors hover:border-brand hover:text-brand dark:border-border-dark"
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-gray-400">
              {t('imageresize.noImage')}
            </div>
          )}
        </ToolCard>
      }
    />
  )
}
