import type { Components } from 'react-markdown'
import { MermaidDiagram } from './mermaid-diagram'

export const markdownComponents: Components = {
  code({ className, children }) {
    const match = /language-(\w+)/.exec(className || '')
    if (match?.[1] === 'mermaid') {
      return <MermaidDiagram code={String(children).replace(/\n$/, '')} />
    }
    return <code className={className}>{children}</code>
  },
  img: ({ node, ...props }) => (
    <img
      {...props}
      style={{ maxWidth: '100%', height: 'auto' }}
      loading="lazy"
    />
  ),
  a: ({ node, ...props }) => (
    <a {...props} target="_blank" rel="noopener noreferrer" />
  ),
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
}
