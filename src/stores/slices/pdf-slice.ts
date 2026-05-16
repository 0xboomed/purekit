import type { StateCreator } from 'zustand'
import type { PdfSettings } from '@/types/pdf'
import { DEFAULT_PDF_SETTINGS } from '@/types/pdf'

export interface PdfSlice {
  pdfSettings: PdfSettings
  showPdfPreview: boolean
  isExporting: boolean
  setPdfSettings: (settings: Partial<PdfSettings>) => void
  resetPdfSettings: () => void
  setShowPdfPreview: (show: boolean) => void
  setIsExporting: (exporting: boolean) => void
}

export const createPdfSlice: StateCreator<PdfSlice, [], [], PdfSlice> = (set) => ({
  pdfSettings: { ...DEFAULT_PDF_SETTINGS },
  showPdfPreview: false,
  isExporting: false,
  setPdfSettings: (settings) =>
    set((s) => ({ pdfSettings: { ...s.pdfSettings, ...settings } })),
  resetPdfSettings: () => set({ pdfSettings: { ...DEFAULT_PDF_SETTINGS } }),
  setShowPdfPreview: (show) => set({ showPdfPreview: show }),
  setIsExporting: (exporting) => set({ isExporting: exporting }),
})
