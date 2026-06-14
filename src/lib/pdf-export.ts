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

    iframe.onload = () => {
      const win = iframe.contentWindow
      if (!win) {
        finish()
        return
      }

      // afterprint fires when the dialog closes (print OR cancel), but is
      // unreliable for iframe printing in some browsers. matchMedia('print')
      // is the dependable signal: it flips to false when leaving print mode,
      // whether the user printed or cancelled.
      win.addEventListener('afterprint', finish, { once: true })

      const mediaQueryList = win.matchMedia('print')
      mediaQueryList.addEventListener('change', (e) => {
        if (!e.matches) finish()
      })

      // Safety net: never leave the button loading forever, even if both
      // signals somehow fail to fire.
      window.setTimeout(finish, 30_000)

      win.focus()
      win.print()
    }
    iframe.srcdoc = html
  })
}
