import { useState, useCallback, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'
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
    <div className="flex h-full flex-col gap-4 p-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">{t('qrcode.content')}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('qrcode.inputPlaceholder')}
          spellCheck={false}
          rows={3}
          className="w-full rounded-lg border border-border bg-white p-3 text-sm text-gray-700 outline-none transition-colors focus:border-brand dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">{t('qrcode.size')}</label>
          <input
            type="number"
            min={64}
            max={1024}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full rounded-md border border-border bg-white px-3 py-1.5 text-sm text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">{t('qrcode.errorLevel')}</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
            className="w-full rounded-md border border-border bg-white px-3 py-1.5 text-sm text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
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
            <input value={fg} onChange={(e) => setFg(e.target.value)} className="flex-1 rounded-md border border-border bg-white px-2 py-1 font-mono text-xs text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">{t('qrcode.bgColor')}</label>
          <div className="flex items-center gap-2">
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-8 w-8 cursor-pointer rounded border" />
            <input value={bg} onChange={(e) => setBg(e.target.value)} className="flex-1 rounded-md border border-border bg-white px-2 py-1 font-mono text-xs text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
      </div>

      <button
        onClick={download}
        disabled={!text.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand py-2 text-sm font-medium text-white hover:bg-brand-light disabled:opacity-40"
      >
        <Download size={14} />
        {t('qrcode.download')}
      </button>
    </div>
  )
}
