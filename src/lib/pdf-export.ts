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
    let removed = false
    const removeIframe = () => {
      if (removed) return
      removed = true
      document.body.removeChild(iframe)
    }

    iframe.onload = () => {
      const win = iframe.contentWindow
      if (!win) {
        removeIframe()
        resolve()
        return
      }

      // The print dialog is now open, which means the document is fully
      // prepared. Release the loading state right here: print() is
      // non-blocking in Chrome, so it returns immediately after queuing
      // the dialog. We intentionally do NOT wait for print completion,
      // because we cannot reliably detect whether the user prints or
      // cancels — and tying the button state to that is what caused the
      // stuck-on-cancel bug.

      // Best-effort iframe cleanup once the print truly finishes. Removing
      // it earlier destroys the preview content, so this is the ONLY place
      // we remove it.
      win.addEventListener('afterprint', removeIframe, { once: true })

      win.focus()
      try {
        win.print()
      } finally {
        resolve()
      }
    }
    iframe.srcdoc = html
  })
}
