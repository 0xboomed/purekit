import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Download, Copy, Check, ImageIcon, X } from 'lucide-react'
import { ToolCard } from '@/components/shared/tool-card'
import { ToolSegmentedControl } from '@/components/shared/tool-segmented-control'
import { ToolFileDrop } from '@/components/shared/tool-file-drop'
import { useT } from '@/i18n/context'
import type { DotStyle, GradientConfig, RenderOptions } from './qrcode-renderer'
import { renderToCanvas, renderToSvg, getCapacityInfo } from './qrcode-renderer'
import type { TemplateType } from './qrcode-templates'
import { TemplateInput } from './qrcode-template-forms'

const inputClass = 'w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200'
const labelClass = 'mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400'

const GRADIENT_PRESETS: Array<{ name: string; colors: [string, string]; angle: number }> = [
  { name: 'Sunset', colors: ['#FF6B6B', '#FF8E53'], angle: 135 },
  { name: 'Ocean', colors: ['#667EEA', '#764BA2'], angle: 135 },
  { name: 'Forest', colors: ['#11998E', '#38EF7D'], angle: 135 },
  { name: 'Flame', colors: ['#F7971E', '#FFD200'], angle: 135 },
  { name: 'Berry', colors: ['#8E2DE2', '#4A00E0'], angle: 135 },
  { name: 'Aurora', colors: ['#00C9FF', '#92FE9D'], angle: 135 },
  { name: 'Midnight', colors: ['#232526', '#414345'], angle: 180 },
  { name: 'Rose', colors: ['#EE9CA7', '#FFDDE1'], angle: 135 },
]

export default function QrcodeTool() {
  const { t } = useT()
  const [text, setText] = useState('https://github.com')
  const [size, setSize] = useState(512)
  const [fg, setFg] = useState('#000000')
  const [bg, setBg] = useState('#ffffff')
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const [dotStyle, setDotStyle] = useState<DotStyle>('square')
  const [format, setFormat] = useState<'png' | 'svg'>('png')
  const [template, setTemplate] = useState<TemplateType>('text')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null)
  const [logoDataUrl, setLogoDataUrl] = useState('')
  const [gradientIdx, setGradientIdx] = useState(-1) // -1 = solid

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const svgRef = useRef('')

  const effectiveLevel = logoImage ? 'H' as const : level
  const gradient: GradientConfig | null = gradientIdx >= 0 ? GRADIENT_PRESETS[gradientIdx]! : null
  const renderOpts: RenderOptions = useMemo(() => ({ size, margin: 2, fg, bg, dotStyle, gradient }), [size, fg, bg, dotStyle, gradient])

  const generate = useCallback(() => {
    if (!text.trim() || !canvasRef.current) return
    try {
      renderToCanvas(canvasRef.current, text, effectiveLevel, renderOpts, logoImage)
      svgRef.current = renderToSvg(text, effectiveLevel, renderOpts, logoImage ? logoDataUrl : null)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }, [text, effectiveLevel, renderOpts, logoImage, logoDataUrl])

  useEffect(() => { generate() }, [generate])

  const capacity = getCapacityInfo(text, effectiveLevel)

  const download = useCallback(() => {
    if (format === 'svg') {
      const blob = new Blob([svgRef.current], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `qrcode-${Date.now()}.svg`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } else if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = `qrcode-${Date.now()}.png`
      link.href = canvasRef.current.toDataURL('image/png')
      link.click()
    }
  }, [format])

  const copyImage = useCallback(async () => {
    if (!canvasRef.current) return
    try {
      const blob = await new Promise<Blob>((resolve) =>
        canvasRef.current!.toBlob((b) => resolve(b!), 'image/png')
      )
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard API not supported */ }
  }, [])

  const handleLogoFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setLogoDataUrl(dataUrl)
      const img = new Image()
      img.onload = () => setLogoImage(img)
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }, [])

  return (
    <div className="flex h-full flex-col gap-5 overflow-auto p-6 lg:flex-row lg:items-start">
      {/* Left: Settings */}
      <div className="w-full shrink-0 space-y-4 lg:w-[380px]">
        <ToolCard title={t('qrcode.content')}>
          <TemplateInput template={template} onTemplateChange={setTemplate} onChange={setText} />
          {capacity && capacity.total > 0 && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between">
                <span className={labelClass}>{t('qrcode.capacity')}</span>
                <span className="text-[10px] text-gray-400">{capacity.used} / {capacity.total}</span>
              </div>
              <div className="h-1 rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className={`h-full rounded-full transition-all ${capacity.percent > 90 ? 'bg-red-400' : capacity.percent > 70 ? 'bg-yellow-400' : 'bg-emerald-400'}`}
                  style={{ width: `${Math.min(capacity.percent, 100)}%` }}
                />
              </div>
            </div>
          )}
        </ToolCard>

        <ToolCard title={t('qrcode.style')}>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>{t('qrcode.dotStyle')}</label>
              <ToolSegmentedControl
                options={[
                  { value: 'square', label: t('qrcode.dotSquare') },
                  { value: 'rounded', label: t('qrcode.dotRounded') },
                  { value: 'circle', label: t('qrcode.dotCircle') },
                  { value: 'diamond', label: t('qrcode.dotDiamond') },
                ]}
                value={dotStyle}
                onChange={setDotStyle}
              />
            </div>
            <div>
              <label className={labelClass}>{t('qrcode.fgColor')}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={fg} onChange={(e) => { setFg(e.target.value); setGradientIdx(-1) }} className="h-8 w-8 shrink-0 cursor-pointer rounded border" />
                <input value={fg} onChange={(e) => { setFg(e.target.value); setGradientIdx(-1) }} className="w-full min-w-0 rounded-lg border border-border bg-white px-2 py-1 font-mono text-xs text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200" />
              </div>
              <div className="mt-2 flex gap-1.5">
                <button
                  onClick={() => setGradientIdx(-1)}
                  className={`h-6 w-6 shrink-0 rounded-full border-2 transition-all ${gradientIdx === -1 ? 'border-brand scale-110' : 'border-transparent hover:border-gray-300'}`}
                  style={{ background: fg }}
                  title={t('qrcode.solid')}
                />
                {GRADIENT_PRESETS.map((preset, i) => (
                  <button
                    key={preset.name}
                    onClick={() => setGradientIdx(i)}
                    className={`h-6 w-6 shrink-0 rounded-full border-2 transition-all ${gradientIdx === i ? 'border-brand scale-110' : 'border-transparent hover:border-gray-300'}`}
                    style={{ background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})` }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t('qrcode.bgColor')}</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-8 w-8 shrink-0 cursor-pointer rounded border" />
                  <input value={bg} onChange={(e) => setBg(e.target.value)} className="w-full min-w-0 rounded-lg border border-border bg-white px-2 py-1 font-mono text-xs text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200" />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t('qrcode.size')}</label>
                <input type="number" min={64} max={2048} value={size} onChange={(e) => setSize(Number(e.target.value))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t('qrcode.errorLevel')}</label>
                <select
                  value={effectiveLevel}
                  onChange={(e) => setLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                  disabled={!!logoImage}
                  className={inputClass}
                >
                  <option value="L">L (7%)</option>
                  <option value="M">M (15%)</option>
                  <option value="Q">Q (25%)</option>
                  <option value="H">H (30%)</option>
                </select>
                {logoImage && <p className="mt-1 text-[10px] text-amber-500">{t('qrcode.logoAutoLevel')}</p>}
              </div>
            </div>
            <div>
              <label className={labelClass}>{t('qrcode.logo')}</label>
              {logoImage ? (
                <div className="flex items-center gap-2">
                  <img src={logoDataUrl} alt="logo" className="h-10 w-10 rounded border object-contain" />
                  <button
                    onClick={() => { setLogoImage(null); setLogoDataUrl('') }}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X size={12} /> {t('qrcode.logoRemove')}
                  </button>
                </div>
              ) : (
                <ToolFileDrop label={t('qrcode.logoUpload')} onFile={handleLogoFile} accept="image/*" className="min-h-[56px]" />
              )}
            </div>
          </div>
        </ToolCard>
      </div>

      {/* Right: Preview + Actions */}
      <div className="flex flex-1 justify-center">
        <div className="w-full max-w-[400px]">
          <ToolCard
            title={t('common.output')}
            titleAction={
              <ToolSegmentedControl
                options={[
                  { value: 'png' as const, label: t('qrcode.formatPng') },
                  { value: 'svg' as const, label: t('qrcode.formatSvg') },
                ]}
                value={format}
                onChange={setFormat}
              />
            }
          >
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {t('qrcode.generationError')}: {error}
              </div>
            )}
            <div className="flex justify-center">
              <div
                className="inline-flex rounded-2xl p-4 transition-colors duration-200"
                style={{ backgroundColor: bg }}
              >
                <canvas
                  ref={canvasRef}
                  style={{ width: 288, height: 288, imageRendering: 'pixelated', opacity: error ? 0.3 : 1 }}
                  className="rounded-lg shadow-sm transition-opacity duration-200"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={copyImage}
                disabled={!text.trim() || !!error}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-40 ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'border border-border bg-white text-gray-600 hover:bg-gray-50 dark:border-border-dark dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? t('qrcode.copiedImage') : t('qrcode.copy')}
              </button>
              <button
                onClick={download}
                disabled={!text.trim() || !!error}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-light disabled:opacity-40"
              >
                {format === 'svg' ? <ImageIcon size={14} /> : <Download size={14} />}
                {format === 'svg' ? t('qrcode.formatSvg') : t('qrcode.formatPng')}
              </button>
            </div>
          </ToolCard>
        </div>
      </div>
    </div>
  )
}
