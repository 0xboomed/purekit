import { useEffect, useRef, useState } from 'react'
import { X, Download, Loader2, FileText } from 'lucide-react'
import { useAppStore } from '@/stores/use-app-store'

export function PdfPreviewModal() {
  const showPdfPreview = useAppStore((s) => s.showPdfPreview)
  const setShowPdfPreview = useAppStore((s) => s.setShowPdfPreview)
  const setIsExporting = useAppStore((s) => s.setIsExporting)
  const isExporting = useAppStore((s) => s.isExporting)
  const markdownContent = useAppStore((s) => s.markdownContent)
  const pdfSettings = useAppStore((s) => s.pdfSettings)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!showPdfPreview) return

    let cancelled = false
    setLoading(true)
    setReady(false)

    import('@/lib/pdf-renderer').then(({ generatePreviewHtml }) => {
      if (cancelled) return
      return generatePreviewHtml(markdownContent, pdfSettings)
    }).then((html) => {
      if (cancelled || !iframeRef.current) return
      iframeRef.current.srcdoc = html ?? ''
    }).catch((err) => {
      if (cancelled) return
      console.error('Preview render failed:', err)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [showPdfPreview, markdownContent, pdfSettings])

  const handleIframeLoad = () => {
    setLoading(false)
    setReady(true)
  }

  const handleExport = () => {
    const win = iframeRef.current?.contentWindow
    if (!win) return
    setIsExporting(true)
    win.focus()
    win.print()
    setIsExporting(false)
  }

  const handleClose = () => {
    setShowPdfPreview(false)
    setReady(false)
    if (iframeRef.current) {
      iframeRef.current.srcdoc = ''
    }
  }

  if (!showPdfPreview) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-600/60 backdrop-blur-sm">
      {/* Toolbar */}
      <div className="no-print flex h-11 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-brand" />
          <span className="text-sm font-medium text-gray-700">PDF 预览</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={loading || !ready}
            className="flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-light disabled:opacity-40"
          >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            保存 PDF
          </button>
          <button
            onClick={handleClose}
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex-1 overflow-hidden bg-gray-200">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-200/80">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="animate-spin text-brand" />
              <span className="text-sm text-gray-500">正在渲染预览...</span>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          onLoad={handleIframeLoad}
          className="h-full w-full border-0"
          title="PDF Preview"
        />
      </div>
    </div>
  )
}
