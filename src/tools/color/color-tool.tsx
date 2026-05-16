import { useState, useCallback, useMemo } from 'react'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'

interface RGB { r: number; g: number; b: number }
interface HSL { h: number; s: number; l: number }

function hexToRgb(hex: string): RGB | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  if (!m) return null
  return { r: parseInt(m[1]!, 16), g: parseInt(m[2]!, 16), b: parseInt(m[3]!, 16) }
}

function rgbToHex(rgb: RGB): string {
  return '#' + [rgb.r, rgb.g, rgb.b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(hsl: HSL): RGB {
  const s = hsl.s / 100, l = hsl.l / 100, h = hsl.h / 360
  if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v } }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  }
}

function relativeLuminance(rgb: RGB): number {
  const values = [rgb.r, rgb.g, rgb.b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * values[0]! + 0.7152 * values[1]! + 0.0722 * values[2]!
}

function contrastRatio(rgb1: RGB, rgb2: RGB): number {
  const l1 = relativeLuminance(rgb1)
  const l2 = relativeLuminance(rgb2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export default function ColorTool() {
  const { t } = useT()
  const [hex, setHex] = useState('#3b82f6')
  const [pickerColor, setPickerColor] = useState('#3b82f6')

  const rgb = useMemo(() => hexToRgb(hex), [hex])
  const hsl = useMemo(() => rgb ? rgbToHsl(rgb) : null, [rgb])
  const contrastWithWhite = useMemo(() => rgb ? contrastRatio(rgb, { r: 255, g: 255, b: 255 }) : 0, [rgb])
  const contrastWithBlack = useMemo(() => rgb ? contrastRatio(rgb, { r: 0, g: 0, b: 0 }) : 0, [rgb])

  const updateFromRgb = useCallback((newRgb: RGB) => {
    setHex(rgbToHex(newRgb))
  }, [])

  const updateFromHsl = useCallback((newHsl: HSL) => {
    const newRgb = hslToRgb(newHsl)
    setHex(rgbToHex(newRgb))
  }, [])

  const formats = useMemo(() => {
    if (!rgb || !hsl) return {}
    return {
      HEX: hex.toUpperCase(),
      RGB: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      RGBA: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
      HSL: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    }
  }, [hex, rgb, hsl])

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
          <input
            type="color"
            value={pickerColor}
            onChange={(e) => { setPickerColor(e.target.value); setHex(e.target.value) }}
            className="h-20 w-20 cursor-pointer rounded-lg border border-border dark:border-border-dark"
          />
          <input
            value={hex}
            onChange={(e) => {
              const v = e.target.value
              setHex(v)
              if (/^#[0-9a-f]{6}$/i.test(v)) setPickerColor(v)
            }}
            spellCheck={false}
            className="w-20 rounded-md border border-border bg-white px-2 py-1 text-center font-mono text-xs text-gray-700 outline-none focus:border-brand dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3">
          {rgb && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">RGB</label>
              <div className="flex gap-2">
                {(['r', 'g', 'b'] as const).map((ch) => (
                  <div key={ch} className="flex-1">
                    <div className="mb-0.5 text-center text-[10px] uppercase text-gray-400">{ch}</div>
                    <input
                      type="number"
                      min={0}
                      max={255}
                      value={rgb[ch]}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(255, Number(e.target.value)))
                        updateFromRgb({ ...rgb, [ch]: val })
                      }}
                      className="w-full rounded-md border border-border bg-white px-2 py-1 text-center font-mono text-xs text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {hsl && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">HSL</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="mb-0.5 text-center text-[10px] text-gray-400">H</div>
                  <input
                    type="number"
                    min={0}
                    max={360}
                    value={hsl.h}
                    onChange={(e) => updateFromHsl({ ...hsl, h: Math.max(0, Math.min(360, Number(e.target.value))) })}
                    className="w-full rounded-md border border-border bg-white px-2 py-1 text-center font-mono text-xs text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-0.5 text-center text-[10px] text-gray-400">S%</div>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={hsl.s}
                    onChange={(e) => updateFromHsl({ ...hsl, s: Math.max(0, Math.min(100, Number(e.target.value))) })}
                    className="w-full rounded-md border border-border bg-white px-2 py-1 text-center font-mono text-xs text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-0.5 text-center text-[10px] text-gray-400">L%</div>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={hsl.l}
                    onChange={(e) => updateFromHsl({ ...hsl, l: Math.max(0, Math.min(100, Number(e.target.value))) })}
                    className="w-full rounded-md border border-border bg-white px-2 py-1 text-center font-mono text-xs text-gray-700 outline-none dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500">{t('color.formats')}</label>
        {Object.entries(formats).map(([fmt, val]) => (
          <div
            key={fmt}
            className="flex items-center justify-between rounded-lg border border-border bg-gray-50 px-3 py-2 dark:border-border-dark dark:bg-gray-900/50"
          >
            <div className="flex items-center gap-2">
              <span className="w-10 text-xs font-medium text-gray-400">{fmt}</span>
              <code className="font-mono text-xs text-gray-700 dark:text-gray-300">{val}</code>
            </div>
            <CopyButton text={val} />
          </div>
        ))}
      </div>

      {rgb && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500">{t('color.contrastCheck')}</label>
          <div className="flex gap-2">
            <div className="flex-1 rounded-lg border border-border p-2 dark:border-border-dark">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-gray-400">{t('color.vsWhite')}</span>
                <span className={`text-xs font-medium ${contrastWithWhite >= 4.5 ? 'text-emerald-500' : contrastWithWhite >= 3 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {contrastWithWhite.toFixed(2)}:1
                </span>
              </div>
              <div
                className="flex h-8 items-center justify-center rounded text-xs font-medium"
                style={{ backgroundColor: hex, color: '#fff' }}
              >
                {t('color.sampleText')}
              </div>
            </div>
            <div className="flex-1 rounded-lg border border-border p-2 dark:border-border-dark">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-gray-400">{t('color.vsBlack')}</span>
                <span className={`text-xs font-medium ${contrastWithBlack >= 4.5 ? 'text-emerald-500' : contrastWithBlack >= 3 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {contrastWithBlack.toFixed(2)}:1
                </span>
              </div>
              <div
                className="flex h-8 items-center justify-center rounded text-xs font-medium"
                style={{ backgroundColor: hex, color: '#000' }}
              >
                {t('color.sampleText')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
