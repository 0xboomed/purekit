import type { Components } from 'react-markdown'

export const markdownComponents: Components = {
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
