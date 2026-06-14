export type PageSize = 'A4' | 'A3' | 'Letter' | 'Legal'

export type Orientation = 'portrait' | 'landscape'

export interface PdfSettings {
  pageSize: PageSize
  orientation: Orientation
  marginTop: string
  marginBottom: string
  marginLeft: string
  marginRight: string
}

export const DEFAULT_PDF_SETTINGS: PdfSettings = {
  pageSize: 'A4',
  orientation: 'portrait',
  marginTop: '20mm',
  marginBottom: '20mm',
  marginLeft: '20mm',
  marginRight: '20mm',
}
