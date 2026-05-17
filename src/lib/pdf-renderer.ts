import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import type { PdfSettings } from '@/types/pdf'

const MERMAID_RE = /<pre[^>]*>\s*<code[^>]*class="[^"]*language-mermaid[^"]*"[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi

function decodeHtmlEntities(s: string): string {
  const el = document.createElement('textarea')
  el.innerHTML = s.replace(/<[^>]+>/g, '')
  return el.value.trim()
}

async function renderMermaidBlocks(html: string): Promise<string> {
  const matches = [...html.matchAll(MERMAID_RE)]
  if (matches.length === 0) return html

  const mermaid = (await import('mermaid')).default
  mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'strict' })

  let result = html
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i]!
    const code = decodeHtmlEntities(m[1]!)
    try {
      const { svg } = await mermaid.render(`pdf_mermaid_${i}`, code)
      result = result.replace(m[0], `<div class="mermaid-diagram">${svg}</div>`)
    } catch {
      result = result.replace(m[0], `<pre class="mermaid-error"><code>${decodeHtmlEntities(m[1]!)}</code></pre>`)
    }
  }
  return result
}

const PAGE_SIZES = {
  A4: [210, 297] as [number, number],
  A3: [297, 420] as [number, number],
  Letter: [215.9, 279.4] as [number, number],
  Legal: [215.9, 355.6] as [number, number],
}

export function getPageSizeMm(
  size: string,
  orientation: string,
): [number, number] {
  const dims = PAGE_SIZES[size as keyof typeof PAGE_SIZES] ?? PAGE_SIZES.A4
  const [w, h] = dims
  return orientation === 'landscape' ? [h, w] : [w, h]
}

async function markdownToHtml(markdown: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight, { plainText: ['mermaid'] })
    .use(rehypeSlug)
    .use(rehypeStringify)

  const result = await processor.process(markdown)
  const html = String(result)
  return renderMermaidBlocks(html)
}

export function generatePreviewHtml(
  markdown: string,
  settings: PdfSettings,
): Promise<string> {
  return markdownToHtml(markdown).then((htmlContent) => {
    const [w, h] = getPageSizeMm(settings.pageSize, settings.orientation)

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<style>
@page {
  size: ${w}mm ${h}mm;
  margin: ${settings.marginTop} ${settings.marginRight} ${settings.marginBottom} ${settings.marginLeft};
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC",
    "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 11pt;
  line-height: 1.7;
  color: #1a1a1a;
  margin: 0;
  padding: 0;
}

h1 {
  font-size: 20pt;
  font-weight: 700;
  border-bottom: 1px solid #d0d7de;
  padding-bottom: 0.3em;
  margin: 0.67em 0;
}

h2 {
  font-size: 15pt;
  font-weight: 600;
  border-bottom: 1px solid #d0d7de;
  padding-bottom: 0.3em;
  margin: 1em 0 0.67em;
}

h3 { font-size: 12pt; font-weight: 600; margin: 1em 0 0.5em; }
h4, h5, h6 { font-weight: 600; margin: 1em 0 0.5em; }

p { margin: 0.5em 0; }

ul, ol { padding-left: 2em; margin: 0.5em 0; }
li { margin: 0.25em 0; }
li > ul, li > ol { margin: 0; }

blockquote {
  border-left: 4px solid #d0d7de;
  padding: 0.5em 1em;
  margin: 0.5em 0;
  color: #656d76;
  background: #f6f8fa;
}

code {
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
  font-size: 0.875em;
  background: #eff1f3;
  padding: 0.15em 0.4em;
  border-radius: 3px;
}

pre {
  background: #f6f8fa;
  border-radius: 4px;
  padding: 0.8em 1em;
  margin: 0.75em 0;
  font-size: 0.85em;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

pre code {
  background: none;
  padding: 0;
  font-size: inherit;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin: 0.75em 0;
}

th, td {
  border: 1px solid #d0d7de;
  padding: 5px 10px;
  font-size: 10pt;
}

th {
  background: #f6f8fa;
  font-weight: 600;
}

tr:nth-child(even) { background: #f6f8fa; }

hr {
  border: none;
  border-top: 1px solid #d0d7de;
  margin: 1.5em 0;
}

img {
  max-width: 100%;
  border-radius: 2px;
}

input[type="checkbox"] { margin-right: 0.5em; }

ul:has(input[type="checkbox"]) {
  list-style: none;
  padding-left: 0.5em;
}

h1, h2, h3, h4, h5, h6 {
  break-after: avoid;
  page-break-after: avoid;
}

thead {
  display: table-header-group;
}

tr {
  break-inside: avoid;
  page-break-inside: avoid;
}

pre, img, blockquote {
  break-inside: avoid;
  page-break-inside: avoid;
}

.mermaid-diagram {
  margin: 0.75em 0;
  text-align: center;
  overflow-x: auto;
}

.mermaid-diagram svg {
  max-width: 100%;
  height: auto;
}
</style>
</head>
<body>
${htmlContent}
</body>
</html>`
  })
}
