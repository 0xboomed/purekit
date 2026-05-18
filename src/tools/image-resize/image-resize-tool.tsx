import { useState, useCallback, useRef, useEffect } from 'react'
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

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function ImageResizeTool() {
  const { t, locale } = useT()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [targetW, setTargetW] = useState(900)
  const [targetH, setTargetH] = useState(383)
  const [activePreset, setActivePreset] = useState<string>('wechat-cover')
  const [format, setFormat] = useState<Format>('image/jpeg')
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState(0)

  useEffect(() => {
    return () => { if (outputUrl) URL.revokeObjectURL(outputUrl) }
  }, [outputUrl])

  const handleFile = useCallback((file: File) => {
    setOriginalFile(file)
    if (outputUrl) URL.revokeObjectURL(outputUrl)
    setOutputUrl(null)
    setOutputSize(0)
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setSrc(url)
    }
    img.src = url
  }, [outputUrl])

  const processImage = useCallback(() => {
    if (!src || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      const tw = targetW
      const th = targetH
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
          if (!blob) return
          if (outputUrl) URL.revokeObjectURL(outputUrl)
          const url = URL.createObjectURL(blob)
          setOutputUrl(url)
          setOutputSize(blob.size)
        },
        format,
        format === 'image/jpeg' ? 0.92 : undefined,
      )
    }
    img.src = src
  }, [src, targetW, targetH, format, outputUrl])

  useEffect(() => {
    if (src) processImage()
  }, [src, targetW, targetH, format, processImage])

  const download = useCallback(() => {
    if (!outputUrl || !originalFile) return
    const ext = format === 'image/jpeg' ? 'jpg' : 'png'
    const baseName = originalFile.name.replace(/\.[^.]+$/, '')
    const a = document.createElement('a')
    a.href = outputUrl
    a.download = `${baseName}_${targetW}x${targetH}.${ext}`
    a.click()
  }, [outputUrl, originalFile, format, targetW, targetH])

  const selectPreset = useCallback((preset: typeof PRESETS[number]) => {
    setActivePreset(preset.id)
    setTargetW(preset.w)
    setTargetH(preset.h)
  }, [])

  const inputClass = 'w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200'
  const btnSecondary = 'rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-border-dark dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'

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

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('imageresize.platform')}
              </label>
              <div className="flex max-h-52 flex-col gap-1 overflow-auto pr-1">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => selectPreset(preset)}
                    className={`rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                      activePreset === preset.id
                        ? 'bg-brand/10 text-brand font-medium'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="font-medium">{locale === 'en' ? preset.nameEn : preset.name}</span>
                    <span className="ml-1.5 text-gray-400">{preset.w}×{preset.h}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('imageresize.custom')}
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={targetW}
                    onChange={(e) => { setTargetW(Number(e.target.value)); setActivePreset('') }}
                    placeholder={t('imageresize.width')}
                    className={inputClass}
                  />
                </div>
                <span className="self-center text-gray-400">×</span>
                <div className="flex-1">
                  <input
                    type="number"
                    value={targetH}
                    onChange={(e) => { setTargetH(Number(e.target.value)); setActivePreset('') }}
                    placeholder={t('imageresize.height')}
                    className={inputClass}
                  />
                </div>
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
          </div>
        </ToolCard>
      }
      output={
        <ToolCard title={t('imageresize.result')}>
          <canvas ref={canvasRef} className="hidden" />
          {src && outputUrl ? (
            <div className="space-y-3">
              <img
                src={outputUrl}
                alt="Resized"
                className="max-w-full rounded-lg border border-border dark:border-border-dark"
              />
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{t('imageresize.outputSize')}: {targetW} × {targetH}px</span>
                <span>{formatSize(outputSize)}</span>
              </div>
              <button onClick={download} className={btnSecondary}>
                {t('imageresize.download')}
              </button>
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
