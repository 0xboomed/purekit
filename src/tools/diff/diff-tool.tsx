import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { diffLines, Change } from 'diff'
import { CopyButton } from '@/components/shared/copy-button'
import { useT } from '@/i18n/context'

interface SplitLine {
  leftNum?: number
  leftContent?: string
  rightNum?: number
  rightContent?: string
  type: 'added' | 'removed' | 'unchanged'
}

interface ChangeMarker {
  startPct: number
  heightPct: number
  type: 'added' | 'removed'
  lineIndex: number
}

function buildSplitLines(changes: Change[]): SplitLine[] {
  const lines: SplitLine[] = []
  let oldNum = 0
  let newNum = 0
  for (const change of changes) {
    const parts = change.value.split('\n')
    if (change.value.endsWith('\n')) parts.pop()
    for (const content of parts) {
      if (change.added) {
        lines.push({ type: 'added', rightNum: ++newNum, rightContent: content })
      } else if (change.removed) {
        lines.push({ type: 'removed', leftNum: ++oldNum, leftContent: content })
      } else {
        lines.push({ type: 'unchanged', leftNum: ++oldNum, leftContent: content, rightNum: ++newNum, rightContent: content })
      }
    }
  }
  return lines
}

function buildChangeMarkers(lines: SplitLine[]): ChangeMarker[] {
  if (lines.length === 0) return []
  const markers: ChangeMarker[] = []
  // Group consecutive same-type lines into blocks
  let i = 0
  while (i < lines.length) {
    if (lines[i]!.type !== 'unchanged') {
      const type = lines[i]!.type
      const startIdx = i
      while (i < lines.length && lines[i]!.type === type) i++
      markers.push({
        startPct: startIdx / lines.length * 100,
        heightPct: (i - startIdx) / lines.length * 100,
        type: type as 'added' | 'removed',
        lineIndex: startIdx,
      })
    } else {
      i++
    }
  }
  return markers
}

export default function DiffTool() {
  const { t } = useT()
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')
  const [changes, setChanges] = useState<Change[]>([])
  const [mode, setMode] = useState<'edit' | 'diff'>('edit')

  const splitLines = useMemo(() => (mode === 'diff' ? buildSplitLines(changes) : []), [changes, mode])
  const changeMarkers = useMemo(() => (mode === 'diff' ? buildChangeMarkers(splitLines) : []), [splitLines, mode])

  const stats = useMemo(() => {
    let added = 0, removed = 0, unchanged = 0
    for (const c of changes) {
      if (c.added) added += c.count ?? 0
      else if (c.removed) removed += c.count ?? 0
      else unchanged += c.count ?? 0
    }
    const oldTotal = removed + unchanged
    const newTotal = added + unchanged
    return { added, removed, unchanged, oldTotal, newTotal }
  }, [changes])

  const handleCompare = useCallback(() => {
    if (!left.trim() && !right.trim()) return
    setChanges(diffLines(left, right))
    setMode('diff')
  }, [left, right])

  const handleSwap = useCallback(() => {
    const tmp = left
    setLeft(right)
    setRight(tmp)
    if (mode === 'diff') setChanges(diffLines(right, tmp))
  }, [left, right, mode])

  const handleEdit = useCallback(() => setMode('edit'), [])

  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const syncing = useRef<'left' | 'right' | null>(null)

  const updateViewport = useCallback((src: HTMLDivElement) => {
    const vp = viewportRef.current
    if (!vp) return
    const { scrollTop, scrollHeight, clientHeight } = src
    if (scrollHeight <= clientHeight) {
      vp.style.top = '0%'
      vp.style.height = '100%'
    } else {
      vp.style.top = `${scrollTop / scrollHeight * 100}%`
      vp.style.height = `${clientHeight / scrollHeight * 100}%`
    }
  }, [])

  const handleScroll = useCallback((source: 'left' | 'right') => {
    if (syncing.current) return
    syncing.current = source
    const src = source === 'left' ? leftRef.current : rightRef.current
    const dst = source === 'left' ? rightRef.current : leftRef.current
    if (src && dst) {
      dst.scrollTop = src.scrollTop
      updateViewport(src)
    }
    requestAnimationFrame(() => { syncing.current = null })
  }, [updateViewport])

  useEffect(() => {
    if (mode !== 'diff') return
    requestAnimationFrame(() => {
      const src = leftRef.current
      if (src) updateViewport(src)
    })
  }, [mode, updateViewport])

  const handleMarkerClick = useCallback((lineIndex: number) => {
    const target = leftRef.current
    if (!target) return
    // Each line is 24px (text-[13px] leading-6)
    const lineH = 24
    target.scrollTop = lineIndex * lineH - target.clientHeight / 3
  }, [])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex shrink-0 items-center gap-3 border-b border-border bg-white px-4 py-2 dark:border-border-dark dark:bg-gray-900">
        {mode === 'edit' ? (
          <>
            <button onClick={handleCompare} className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-light">{t('diff.compare')}</button>
            <button onClick={handleSwap} className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-border-dark dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">{t('diff.swap')}</button>
          </>
        ) : (
          <>
            <button onClick={handleEdit} className="rounded-lg border border-border bg-white px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-border-dark dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">{t('diff.edit')}</button>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-gray-500 dark:text-gray-400">{stats.oldTotal}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-300 dark:text-gray-600"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              <span className="font-semibold text-gray-700 dark:text-gray-200">{stats.newTotal}</span>
              {(() => {
                const net = stats.newTotal - stats.oldTotal
                if (net > 0) return <span className="rounded bg-green-100 px-1.5 py-0.5 text-[11px] font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">+{net}</span>
                if (net < 0) return <span className="rounded bg-red-100 px-1.5 py-0.5 text-[11px] font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-400">{net}</span>
                return <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">±0</span>
              })()}
            </div>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />+{stats.added}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />-{stats.removed}</span>
            </div>
            <div className="ml-auto">
              <CopyButton text={splitLines.map((l) => `${l.type === 'added' ? '+' : l.type === 'removed' ? '-' : ' '} ${l.type === 'removed' ? l.leftContent : l.rightContent}`).join('\n')} />
            </div>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {mode === 'edit' ? (
          <>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-r border-border dark:border-border-dark">
              <div className="flex shrink-0 items-center gap-2 border-b border-border bg-gray-50 px-4 py-1.5 dark:border-border-dark dark:bg-gray-800/60">
                <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('diff.original')}</span>
                {left && <button onClick={() => setLeft('')} className="ml-auto text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">{t('common.clear')}</button>}
              </div>
              <textarea
                value={left}
                onChange={(e) => setLeft(e.target.value)}
                placeholder={t('diff.originalPlaceholder')}
                spellCheck={false}
                className="min-h-0 flex-1 resize-none bg-white px-4 py-3 font-mono text-[13px] leading-6 text-gray-700 outline-none placeholder:text-gray-400 dark:bg-gray-900 dark:text-gray-200 dark:placeholder:text-gray-600"
              />
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="flex shrink-0 items-center gap-2 border-b border-border bg-gray-50 px-4 py-1.5 dark:border-border-dark dark:bg-gray-800/60">
                <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('diff.modified')}</span>
                {right && <button onClick={() => setRight('')} className="ml-auto text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">{t('common.clear')}</button>}
              </div>
              <textarea
                value={right}
                onChange={(e) => setRight(e.target.value)}
                placeholder={t('diff.modifiedPlaceholder')}
                spellCheck={false}
                className="min-h-0 flex-1 resize-none bg-white px-4 py-3 font-mono text-[13px] leading-6 text-gray-700 outline-none placeholder:text-gray-400 dark:bg-gray-900 dark:text-gray-200 dark:placeholder:text-gray-600"
              />
            </div>
          </>
        ) : (
          <>
            {/* Left panel (original) */}
            <div ref={leftRef} onScroll={() => handleScroll('left')} className="scrollbar-none min-h-0 flex-1 overflow-auto">
              <div className="flex shrink-0 items-center gap-2 border-b border-border bg-gray-50 px-4 py-1.5 dark:border-border-dark dark:bg-gray-800/60">
                <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('diff.original')}</span>
                <span className="ml-1 text-[11px] text-gray-400">{stats.oldTotal} {t('diff.lines')}</span>
              </div>
              <table className="w-full border-collapse font-mono text-[13px] leading-6">
                <tbody>
                  {splitLines.map((line, i) => (
                    <tr key={i} className={
                      line.type === 'removed'
                        ? 'bg-red-50/80 dark:bg-red-900/20'
                        : line.type === 'added'
                          ? 'bg-gray-50/40 dark:bg-gray-800/20'
                          : ''
                    }>
                      <td className="w-10 select-none whitespace-nowrap border-r border-border px-2 text-right text-[11px] text-gray-300 dark:border-border-dark dark:text-gray-600">
                        {line.leftNum ?? ''}
                      </td>
                      <td className={
                        line.type === 'removed'
                          ? 'whitespace-pre pl-3 pr-4 text-red-700 dark:text-red-300'
                          : line.type === 'added'
                            ? 'whitespace-pre pl-3 pr-4 text-gray-300 dark:text-gray-700'
                            : 'whitespace-pre pl-3 pr-4 text-gray-700 dark:text-gray-300'
                      }>
                        {line.leftContent ?? ''}
                      </td>
                    </tr>
                  ))}
                  {splitLines.length === 0 && (
                    <tr><td colSpan={2} className="py-16 text-center text-sm text-gray-400">{t('diff.noDifference')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Center overview rail — VS Code style */}
            <div className="relative flex w-4 shrink-0 flex-col bg-gray-100/70 dark:bg-gray-800/50">
              {changeMarkers.map((m, i) => (
                <button
                  key={i}
                  onClick={() => handleMarkerClick(m.lineIndex)}
                  className={`absolute left-[3px] w-2.5 cursor-pointer rounded-[1px] transition-opacity hover:opacity-80 ${
                    m.type === 'added'
                      ? 'bg-[#48985D] dark:bg-[#487E02]'
                      : 'bg-[#E51400] dark:bg-[#F14C4C]'
                  }`}
                  style={{
                    top: `${m.startPct}%`,
                    height: `${Math.max(m.heightPct, 0.6)}%`,
                    minHeight: '2px',
                  }}
                />
              ))}
              {/* Viewport indicator */}
              <div
                ref={viewportRef}
                className="pointer-events-none absolute left-0 w-full rounded-[1px] bg-gray-500/20 dark:bg-gray-400/15"
                style={{
                  top: '0%',
                  height: '100%',
                  minHeight: '8px',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.04)',
                }}
              />
            </div>

            {/* Right panel (modified) */}
            <div ref={rightRef} onScroll={() => handleScroll('right')} className="scrollbar-none min-h-0 flex-1 overflow-auto">
              <div className="flex shrink-0 items-center gap-2 border-b border-border bg-gray-50 px-4 py-1.5 dark:border-border-dark dark:bg-gray-800/60">
                <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('diff.modified')}</span>
                <span className="ml-1 text-[11px] text-gray-400">{stats.newTotal} {t('diff.lines')}</span>
              </div>
              <table className="w-full border-collapse font-mono text-[13px] leading-6">
                <tbody>
                  {splitLines.map((line, i) => (
                    <tr key={i} className={
                      line.type === 'added'
                        ? 'bg-green-50/80 dark:bg-green-900/20'
                        : line.type === 'removed'
                          ? 'bg-gray-50/40 dark:bg-gray-800/20'
                          : ''
                    }>
                      <td className="w-10 select-none whitespace-nowrap border-r border-border px-2 text-right text-[11px] text-gray-300 dark:border-border-dark dark:text-gray-600">
                        {line.rightNum ?? ''}
                      </td>
                      <td className={
                        line.type === 'added'
                          ? 'whitespace-pre pl-3 pr-4 text-green-700 dark:text-green-300'
                          : line.type === 'removed'
                            ? 'whitespace-pre pl-3 pr-4 text-gray-300 dark:text-gray-700'
                            : 'whitespace-pre pl-3 pr-4 text-gray-700 dark:text-gray-300'
                      }>
                        {line.rightContent ?? ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
