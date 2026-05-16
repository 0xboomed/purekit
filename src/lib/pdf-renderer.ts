import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import type { PdfSettings } from '@/types/pdf'

const PAGE_SIZES: Record<string, [number, number]> = {
  A4: [210, 297],
  A3: [297, 420],
  Letter: [215.9, 279.4],
  Legal: [215.9, 355.6],
}

export function getPageSizeMm(
  size: string,
  orientation: string,
): [number, number] {
  const [w, h] = PAGE_SIZES[size] ?? PAGE_SIZES.A4
  return orientation === 'landscape' ? [h, w] : [w, h]
}

async function markdownToHtml(markdown: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(rehypeStringify)

  const result = await processor.process(markdown)
  return String(result)
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
</style>
</head>
<body>
${htmlContent}
</body>
</html>`
  })
}
