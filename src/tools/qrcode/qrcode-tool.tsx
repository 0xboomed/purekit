import { useState, useCallback, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'
import { ToolPageSplit } from '@/components/shared/tool-page-split'
import { ToolCard } from '@/components/shared/tool-card'
import { ToolInput } from '@/components/shared/tool-input'
import { useT } from '@/i18n/context'

export default function QrcodeTool() {
  const { t } = useT()
  const [text, setText] = useState('https://github.com')
  const [size, setSize] = useState(256)
  const [fg, setFg] = useState('#000000')
  const [bg, setBg] = useState('#ffffff')
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generate = useCallback(async () => {
    if (!text.trim() || !canvasRef.current) return
    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        color: { dark: fg, light: bg },
        errorCorrectionLevel: level,
      })
    } catch (err) {
      console.error('QR generation failed:', err)
    }
  }, [text, size, fg, bg, level])

  useEffect(() => { generate() }, [generate])

  const download = useCallback(() => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `qrcode-${Date.now()}.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }, [])

  return (
    <ToolPageSplit
      settings={
        <ToolCard title={t('qrcode.content')}>
          <ToolInput value={text} onChange={setText} placeholder={t('qrcode.inputPlaceholder')} mono={false} rows={3} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">{t('qrcode.size')}</label>
              <input
                type="number"
                min={64}
                max={1024}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">{t('qrcode.errorLevel')}</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
              >
                <option value="L">L (7%)</option>
                <option value="M">M (15%)</option>
                <option value="Q">Q (25%)</option>
                <option value="H">H (30%)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">{t('qrcode.fgColor')}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-8 w-8 cursor-pointer rounded border" />
                <input value={fg} onChange={(e) => setFg(e.target.value)} className="flex-1 rounded-lg border border-border bg-white px-2 py-1 font-mono text-xs text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">{t('qrcode.bgColor')}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-8 w-8 cursor-pointer rounded border" />
                <input value={bg} onChange={(e) => setBg(e.target.value)} className="flex-1 rounded-lg border border-border bg-white px-2 py-1 font-mono text-xs text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200" />
              </div>
            </div>
          </div>
        </ToolCard>
      }
      output={
        <ToolCard className="flex flex-col items-center justify-center">
          <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
          <button
            onClick={download}
            disabled={!text.trim()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-light disabled:opacity-40"
          >
            <Download size={14} />
            {t('qrcode.download')}
          </button>
        </ToolCard>
      }
    />
  )
}
