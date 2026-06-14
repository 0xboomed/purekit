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

  await new Promise<void>((resolve) => {
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      document.body.removeChild(iframe)
      resolve()
    }

    // Safety net: placed outside onload so it always starts, covering the
    // rare browser where print() returns immediately and no event fires.
    const safety = window.setTimeout(finish, 60_000)

    iframe.onload = () => {
      const win = iframe.contentWindow
      if (!win) {
        finish()
        return
      }

      // Backup signals for browsers where print() does not block.
      win.addEventListener('afterprint', finish, { once: true })
      const mediaQueryList = win.matchMedia('print')
      mediaQueryList.addEventListener('change', (e) => {
        if (!e.matches) finish()
      })

      win.focus()
      try {
        // In Chrome/Edge/Firefox, print() blocks until the print dialog is
        // dismissed — whether the user prints or cancels. Finishing right
        // after it returns reliably clears the loading state on cancel,
        // where afterprint/matchMedia are flaky.
        win.print()
      } catch {
        // Ignore print errors (e.g. user dismissed a pre-print prompt).
      } finally {
        window.clearTimeout(safety)
        finish()
      }
    }
    iframe.srcdoc = html
  })
}
