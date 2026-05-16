import type { PdfSettings } from '@/types/pdf'

export async function exportPdf(
  markdown: string,
  settings: PdfSettings,
): Promise<void> {
  const { generatePreviewHtml } = await import('@/lib/pdf-renderer')
  const html = await generatePreviewHtml(markdown, settings)

  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.left = '-9999px'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = 'none'
  document.body.appendChild(iframe)

  return new Promise((resolve) => {
    iframe.onload = () => {
      const win = iframe.contentWindow
      if (!win) {
        document.body.removeChild(iframe)
        resolve()
        return
      }

      win.addEventListener('afterprint', () => {
        document.body.removeChild(iframe)
        resolve()
      })

      win.focus()
      win.print()
    }
    iframe.srcdoc = html
  })
}
