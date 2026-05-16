import Markdown from 'react-markdown'
import { useAppStore } from '@/stores/use-app-store'
import { remarkPlugins, rehypePlugins } from '@/lib/markdown-processor'
import { markdownComponents } from './markdown-components'
import { useDebounce } from '@/hooks/use-debounce'
import 'highlight.js/styles/github.css'
import '@/styles/preview.css'

export function PreviewPane() {
  const markdownContent = useAppStore((s) => s.markdownContent)
  const debouncedContent = useDebounce(markdownContent, 200)

  return (
    <div className="preview-pane h-full overflow-y-auto p-6">
      <Markdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={markdownComponents}
      >
        {debouncedContent}
      </Markdown>
    </div>
  )
}
