import { useState, useCallback } from 'react'
import { ToolPageDual } from '@/components/shared/tool-page-dual'
import { ToolCard } from '@/components/shared/tool-card'
import { ToolInput } from '@/components/shared/tool-input'
import { ToolOutput } from '@/components/shared/tool-output'
import { ToolActionBar } from '@/components/shared/tool-action-bar'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'

function optimizeSvg(input: string): string {
  let svg = input

  svg = svg.replace(/<\?xml[^?]*\?>\s*/g, '')
  svg = svg.replace(/<!--[\s\S]*?-->/g, '')
  svg = svg.replace(/<!DOCTYPE[^>]*>\s*/gi, '')
  svg = svg.replace(/<metadata[\s\S]*?<\/metadata>\s*/gi, '')
  svg = svg.replace(/<title[\s\S]*?<\/title>\s*/gi, '')
  svg = svg.replace(/<desc[\s\S]*?<\/desc>\s*/gi, '')
  svg = svg.replace(/\s(?:sketch|sodipodi|inkscape|illustrator|serif):[a-zA-Z-]+="[^"]*"/g, '')

  if (!svg.includes('xlink:')) {
    svg = svg.replace(/\s*xmlns:xlink="[^"]*"/g, '')
  }

  svg = svg.replace(/<g>\s*<\/g>/g, '')
  svg = svg.replace(/\sfill-opacity="1"/g, '')
  svg = svg.replace(/\sstroke-opacity="1"/g, '')
  svg = svg.replace(/\sopacity="1"/g, '')
  svg = svg.replace(/\sdisplay="inline"/g, '')
  svg = svg.replace(/\sfill="black"/g, '')
  svg = svg.replace(/\b(\d+)\.0+(\b)/g, '$1$2')
  svg = svg.replace(/\s{2,}/g, ' ')
  svg = svg.replace(/>\s+</g, '><')
  svg = svg.replace(/\s+>/g, '>')

  return svg.trim()
}

const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <!-- A simple circle -->
  <title>Circle</title>
  <desc>A red circle</desc>
  <metadata>Created with editor</metadata>
  <circle cx="50" cy="50" r="40" fill="red" fill-opacity="1" stroke="black" stroke-opacity="1" opacity="1" display="inline" />
</svg>`

export default function SvgTool() {
  const { t } = useT()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [stats, setStats] = useState<{ original: number; optimized: number; saved: number } | null>(null)

  const optimize = useCallback(() => {
    if (!input.trim()) return
    const result = optimizeSvg(input)
    setOutput(result)
    const original = new Blob([input]).size
    const optimized = new Blob([result]).size
    setStats({ original, optimized, saved: Math.round((1 - optimized / original) * 100) })
  }, [input])

  return (
    <ToolPageDual
      left={
        <>
          <ToolCard
            title={t('common.input')}
            titleAction={
              <div className="flex items-center gap-2">
                <button onClick={() => { setInput(SAMPLE); setOutput(''); setStats(null) }} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">{t('common.example')}</button>
                <button onClick={() => { setInput(''); setOutput(''); setStats(null) }} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">{t('common.clear')}</button>
              </div>
            }
          >
            <ToolInput value={input} onChange={setInput} placeholder={t('svg.inputPlaceholder')} />
          </ToolCard>

          <ToolActionBar>
            <button onClick={optimize} className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light">{t('svg.optimize')}</button>
            {stats && (
              <div className="ml-auto flex items-center gap-3 text-xs text-gray-400">
                <span>{t('svg.original')}: {(stats.original / 1024).toFixed(1)} KB</span>
                <span>{t('svg.optimized')}: {(stats.optimized / 1024).toFixed(1)} KB</span>
                <span className={stats.saved > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                  {stats.saved > 0 ? `-${stats.saved}%` : '0%'}
                </span>
              </div>
            )}
          </ToolActionBar>
        </>
      }
      right={
        <ToolCard title={t('common.output')} titleAction={<CopyButton text={output} />} className="flex-1">
          <ToolOutput value={output} placeholder={t('svg.outputPlaceholder')} className="min-h-0 flex-1" />
        </ToolCard>
      }
    />
  )
}
