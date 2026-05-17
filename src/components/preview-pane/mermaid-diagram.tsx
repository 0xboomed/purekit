import { useEffect, useRef, useState, useId } from 'react'
import { useAppStore } from '@/stores/use-app-store'

let mermaidModule: typeof import('mermaid').default | null = null

async function loadMermaid(theme: 'dark' | 'default') {
  const m = (await import('mermaid')).default
  m.initialize({ startOnLoad: false, theme, securityLevel: 'strict' })
  mermaidModule = m
  return m
}

async function getMermaid(theme: 'dark' | 'default') {
  if (mermaidModule) {
    mermaidModule.initialize({ startOnLoad: false, theme })
    return mermaidModule
  }
  return loadMermaid(theme)
}

export function MermaidDiagram({ code }: { code: string }) {
  const [svg, setSvg] = useState('')
  const [error, setError] = useState('')
  const renderId = useRef(0)
  const uid = useId().replace(/:/g, '_')
  const theme = useAppStore((s) => s.theme)

  useEffect(() => {
    const id = ++renderId.current
    let cancelled = false

    getMermaid(theme === 'dark' ? 'dark' : 'default')
      .then((m) => m.render(`${uid}_${id}`, code))
      .then(({ svg }) => {
        if (!cancelled) {
          setSvg(svg)
          setError('')
        }
      })
      .catch((err) => {
        if (!cancelled) setError(String(err?.message ?? err))
      })

    return () => { cancelled = true }
  }, [code, uid, theme])

  if (error) {
    return (
      <pre className="mermaid-error">
        <code>{error}</code>
      </pre>
    )
  }

  if (!svg) {
    return <div className="mermaid-loading" />
  }

  return <div className="mermaid-diagram" dangerouslySetInnerHTML={{ __html: svg }} />
}
