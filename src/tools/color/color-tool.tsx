import { useState, useCallback, useMemo } from 'react'
import { ToolPageSplit } from '@/components/shared/tool-page-split'
import { ToolCard } from '@/components/shared/tool-card'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  contrastRatio,
  type RGB,
  type HSL,
} from './color-logic'

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
    <ToolPageSplit
      settings={
        <ToolCard title="Color">
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
                className="w-20 rounded-lg border border-border bg-white px-2 py-1.5 text-center font-mono text-xs text-gray-700 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
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
                          className="w-full rounded-lg border border-border bg-white px-2 py-1 text-center font-mono text-xs text-gray-700 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
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
                        className="w-full rounded-lg border border-border bg-white px-2 py-1 text-center font-mono text-xs text-gray-700 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
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
                        className="w-full rounded-lg border border-border bg-white px-2 py-1 text-center font-mono text-xs text-gray-700 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
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
                        className="w-full rounded-lg border border-border bg-white px-2 py-1 text-center font-mono text-xs text-gray-700 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ToolCard>
      }
      output={
        <div className="flex flex-col gap-4">
          <ToolCard title={t('color.formats')}>
            <div className="space-y-2">
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
          </ToolCard>

          {rgb && (
            <ToolCard title={t('color.contrastCheck')}>
              <div className="flex gap-2">
                <div className="flex-1 rounded-lg border border-border p-3 dark:border-border-dark">
                  <div className="mb-1.5 flex items-center justify-between">
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
                <div className="flex-1 rounded-lg border border-border p-3 dark:border-border-dark">
                  <div className="mb-1.5 flex items-center justify-between">
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
            </ToolCard>
          )}
        </div>
      }
    />
  )
}
