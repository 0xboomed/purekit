import { useState, useMemo } from 'react'
import { useT } from '@/i18n/context'

const PRESETS: Array<{ name: string; pattern: string; flags: string; test: string }> = [
  { name: '邮箱', pattern: '[\\w.-]+@[\\w.-]+\\.\\w+', flags: 'g', test: 'user@example.com' },
  { name: '手机号', pattern: '1[3-9]\\d{9}', flags: 'g', test: '13800138000' },
  { name: 'URL', pattern: 'https?://[\\w\\-._~:/?#\\[\\]@!$&\'()*+,;=%]+', flags: 'g', test: 'https://example.com/path?q=1' },
  { name: 'IPv4', pattern: '\\d{1,3}(\\.\\d{1,3}){3}', flags: 'g', test: '192.168.1.1' },
  { name: '中文字符', pattern: '[\\u4e00-\\u9fa5]+', flags: 'g', test: 'Hello 你好 World 世界' },
]

const PRESET_NAMES: Record<string, string> = {
  '邮箱': 'regex.presetEmail',
  '手机号': 'regex.presetPhone',
  '中文字符': 'regex.presetChinese',
}

export default function RegexTool() {
  const { t } = useT()
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testStr, setTestStr] = useState('')

  const result = useMemo(() => {
    if (!pattern) return { matches: [] as Array<{ text: string; index: number; groups: string[] }>, error: '', highlighted: testStr }
    try {
      const re = new RegExp(pattern, flags)
      const matches: Array<{ text: string; index: number; groups: string[] }> = []
      let m: RegExpExecArray | null

      if (flags.includes('g')) {
        const cloned = new RegExp(pattern, flags)
        while ((m = cloned.exec(testStr)) !== null) {
          matches.push({ text: m[0], index: m.index, groups: m.slice(1) })
          if (!m[0]) cloned.lastIndex++
        }
      } else {
        m = re.exec(testStr)
        if (m) matches.push({ text: m[0], index: m.index, groups: m.slice(1) })
      }

      const highlighted = buildHighlighted(testStr, matches)
      return { matches, error: '', highlighted }
    } catch (e) {
      return { matches: [], error: (e as Error).message, highlighted: testStr }
    }
  }, [pattern, flags, testStr])

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex gap-2">
        <div className="flex flex-1 items-center gap-1 rounded-lg border border-border bg-white px-3 py-2 dark:border-border-dark dark:bg-gray-900">
          <span className="text-sm text-gray-400">/</span>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder={t('regex.inputPlaceholder')}
            spellCheck={false}
            className="flex-1 bg-transparent font-mono text-sm text-gray-700 outline-none dark:text-gray-200"
          />
          <span className="text-sm text-gray-400">/</span>
          <input
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="gi"
            spellCheck={false}
            className="w-8 bg-transparent font-mono text-sm text-brand outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => { setPattern(p.pattern); setFlags(p.flags); setTestStr(p.test) }}
            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500 transition-colors hover:bg-brand/10 hover:text-brand dark:bg-gray-800 dark:text-gray-400 dark:hover:text-brand"
          >
            {PRESET_NAMES[p.name] ? t(PRESET_NAMES[p.name]!) : p.name}
          </button>
        ))}
      </div>

      {result.error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {result.error}
        </div>
      )}

      <label className="text-xs font-medium text-gray-500">{t('regex.testText')}</label>
      <textarea
        value={testStr}
        onChange={(e) => setTestStr(e.target.value)}
        placeholder={t('regex.testPlaceholder')}
        spellCheck={false}
        className="min-h-[120px] flex-1 rounded-lg border border-border bg-white p-3 font-mono text-sm text-gray-700 outline-none transition-colors focus:border-brand dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
      />

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500">{t('regex.matches')}</span>
        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
          {result.matches.length}{t('regex.matchCount')}
        </span>
      </div>

      <div
        className="min-h-[80px] flex-1 overflow-auto rounded-lg border border-border bg-gray-50 p-3 font-mono text-sm whitespace-pre-wrap break-all dark:border-border-dark dark:bg-gray-900/50 dark:text-gray-200"
        dangerouslySetInnerHTML={{ __html: result.highlighted }}
      />

      {result.matches.length > 0 && (
        <div className="max-h-[150px] overflow-auto rounded-lg border border-border bg-gray-50 p-3 dark:border-border-dark dark:bg-gray-900/50">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-1 pr-3 font-medium">#</th>
                <th className="pb-1 pr-3 font-medium">{t('regex.match')}</th>
                <th className="pb-1 pr-3 font-medium">{t('regex.position')}</th>
                <th className="pb-1 font-medium">{t('regex.groups')}</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {result.matches.map((m, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-1 pr-3 text-gray-400">{i + 1}</td>
                  <td className="py-1 pr-3 text-brand">{m.text}</td>
                  <td className="py-1 pr-3 text-gray-500">{m.index}</td>
                  <td className="py-1 text-gray-600 dark:text-gray-400">
                    {m.groups.length > 0 ? m.groups.map((g, gi) => (
                      <span key={gi}>{gi > 0 && ', '}{g || t('regex.empty')}</span>
                    )) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function buildHighlighted(text: string, matches: Array<{ index: number; text: string }>): string {
  if (!matches.length) return escapeHtml(text)
  const parts: string[] = []
  let lastIdx = 0
  for (const m of matches) {
    if (m.index > lastIdx) parts.push(escapeHtml(text.slice(lastIdx, m.index)))
    parts.push(`<mark class="bg-yellow-200 text-yellow-900 dark:bg-yellow-800/40 dark:text-yellow-200 rounded px-0.5">${escapeHtml(m.text)}</mark>`)
    lastIdx = m.index + m.text.length
  }
  if (lastIdx < text.length) parts.push(escapeHtml(text.slice(lastIdx)))
  return parts.join('')
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
