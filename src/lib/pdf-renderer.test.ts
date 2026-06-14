import { describe, it, expect } from 'vitest'
import { getPageSizeMm, generatePreviewHtml } from './pdf-renderer'
import { DEFAULT_PDF_SETTINGS } from '@/types/pdf'

describe('getPageSizeMm', () => {
  it('returns A4 portrait dimensions', () => {
    expect(getPageSizeMm('A4', 'portrait')).toEqual([210, 297])
  })

  it('returns A4 landscape dimensions (swapped)', () => {
    expect(getPageSizeMm('A4', 'landscape')).toEqual([297, 210])
  })

  it('returns A3 portrait dimensions', () => {
    expect(getPageSizeMm('A3', 'portrait')).toEqual([297, 420])
  })

  it('returns Letter portrait dimensions', () => {
    const [w, h] = getPageSizeMm('Letter', 'portrait')
    expect(w).toBeCloseTo(215.9, 1)
    expect(h).toBeCloseTo(279.4, 1)
  })

  it('returns Legal portrait dimensions', () => {
    const [w, h] = getPageSizeMm('Legal', 'portrait')
    expect(w).toBeCloseTo(215.9, 1)
    expect(h).toBeCloseTo(355.6, 1)
  })

  it('falls back to A4 for unknown size', () => {
    expect(getPageSizeMm('Unknown', 'portrait')).toEqual([210, 297])
  })

  it('landscape swaps width and height', () => {
    const [pw, ph] = getPageSizeMm('A3', 'portrait')
    const [lw, lh] = getPageSizeMm('A3', 'landscape')
    expect(lw).toBe(ph)
    expect(lh).toBe(pw)
  })
})

describe('generatePreviewHtml @page application', () => {
  it('applies page size and margins to @page rule', async () => {
    const html = await generatePreviewHtml('# Hello', {
      ...DEFAULT_PDF_SETTINGS,
      pageSize: 'A4',
      orientation: 'portrait',
      marginTop: '20mm',
      marginRight: '15mm',
      marginBottom: '20mm',
      marginLeft: '15mm',
    })

    expect(html).toContain('@page')
    expect(html).toContain('size: 210mm 297mm')
    expect(html).toContain('margin: 20mm 15mm 20mm 15mm')
  })

  it('reflects landscape orientation in page size', async () => {
    const html = await generatePreviewHtml('# Hello', {
      ...DEFAULT_PDF_SETTINGS,
      pageSize: 'A4',
      orientation: 'landscape',
    })

    expect(html).toContain('size: 297mm 210mm')
  })

  it('renders markdown content in body', async () => {
    const html = await generatePreviewHtml('# My Title\n\nSome text', DEFAULT_PDF_SETTINGS)
    expect(html).toContain('<h1')
    expect(html).toContain('My Title')
    expect(html).toContain('Some text')
  })

  it('includes pagination control CSS for headings and code blocks', async () => {
    const html = await generatePreviewHtml('# Test', DEFAULT_PDF_SETTINGS)
    expect(html).toContain('break-after: avoid')
    expect(html).toContain('break-inside: avoid')
  })
})
