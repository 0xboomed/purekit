import { RotateCcw, X } from 'lucide-react'
import { useAppStore } from '@/stores/use-app-store'
import { useT } from '@/i18n/context'
import type { PageSize } from '@/types/pdf'

const PAGE_SIZES: { value: PageSize; label: string }[] = [
  { value: 'A4', label: 'A4' },
  { value: 'A3', label: 'A3' },
  { value: 'Letter', label: 'Letter' },
  { value: 'Legal', label: 'Legal' },
]

export function PdfSettingsPanel() {
  const { t } = useT()
  const showSettingsPanel = useAppStore((s) => s.showSettingsPanel)
  const toggleSettingsPanel = useAppStore((s) => s.toggleSettingsPanel)
  const pdfSettings = useAppStore((s) => s.pdfSettings)
  const setPdfSettings = useAppStore((s) => s.setPdfSettings)
  const resetPdfSettings = useAppStore((s) => s.resetPdfSettings)

  if (!showSettingsPanel) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={toggleSettingsPanel}
      />

      {/* Panel */}
      <div className="pdf-settings-panel fixed right-0 top-0 z-50 flex h-full w-80 flex-col border-l border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex h-11 items-center justify-between border-b border-gray-200 px-4">
          <span className="text-sm font-semibold text-gray-700">
            {t('pdf.title')}
          </span>
          <button
            onClick={toggleSettingsPanel}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Page size */}
          <Section title={t('pdf.pageSize')}>
            <select
              value={pdfSettings.pageSize}
              onChange={(e) => setPdfSettings({ pageSize: e.target.value as PageSize })}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-brand"
            >
              {PAGE_SIZES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </Section>

          {/* Orientation */}
          <Section title={t('pdf.orientation')}>
            <div className="flex gap-2">
              <button
                onClick={() => setPdfSettings({ orientation: 'portrait' })}
                className={`flex-1 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  pdfSettings.orientation === 'portrait'
                    ? 'border-brand bg-blue-50 text-brand'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t('pdf.portrait')}
              </button>
              <button
                onClick={() => setPdfSettings({ orientation: 'landscape' })}
                className={`flex-1 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  pdfSettings.orientation === 'landscape'
                    ? 'border-brand bg-blue-50 text-brand'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t('pdf.landscape')}
              </button>
            </div>
          </Section>

          {/* Margins */}
          <Section title={t('pdf.margins')}>
            <div className="grid grid-cols-2 gap-2">
              <MarginInput
                label={t('pdf.marginTop')}
                value={pdfSettings.marginTop}
                onChange={(v) => setPdfSettings({ marginTop: v })}
              />
              <MarginInput
                label={t('pdf.marginBottom')}
                value={pdfSettings.marginBottom}
                onChange={(v) => setPdfSettings({ marginBottom: v })}
              />
              <MarginInput
                label={t('pdf.marginLeft')}
                value={pdfSettings.marginLeft}
                onChange={(v) => setPdfSettings({ marginLeft: v })}
              />
              <MarginInput
                label={t('pdf.marginRight')}
                value={pdfSettings.marginRight}
                onChange={(v) => setPdfSettings({ marginRight: v })}
              />
            </div>
          </Section>

          {/* Header */}
          <Section title={t('pdf.header')}>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={pdfSettings.showHeader}
                onChange={(e) => setPdfSettings({ showHeader: e.target.checked })}
                className="rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span className="text-sm text-gray-600">{t('pdf.showHeader')}</span>
            </label>
            {pdfSettings.showHeader && (
              <p className="mt-1.5 text-xs text-gray-400">
                {t('pdf.headerHint')}
              </p>
            )}
          </Section>

          {/* Footer */}
          <Section title={t('pdf.footer')}>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={pdfSettings.showFooter}
                onChange={(e) => setPdfSettings({ showFooter: e.target.checked })}
                className="rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span className="text-sm text-gray-600">{t('pdf.showFooter')}</span>
            </label>
            {pdfSettings.showFooter && (
              <label className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pdfSettings.showPageNumbers}
                  onChange={(e) => setPdfSettings({ showPageNumbers: e.target.checked })}
                  className="rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span className="text-sm text-gray-600">{t('pdf.showPageNumbers')}</span>
              </label>
            )}
          </Section>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={() => {
              resetPdfSettings()
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
          >
            <RotateCcw size={14} />
            {t('pdf.reset')}
          </button>
        </div>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-xs font-medium text-gray-400">{title}</h3>
      {children}
    </div>
  )
}

function MarginInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const numValue = parseInt(value, 10)

  return (
    <div className="flex items-center gap-1.5">
      <span className="w-4 text-xs text-gray-400">{label}</span>
      <input
        type="number"
        min={0}
        max={100}
        value={isNaN(numValue) ? '' : numValue}
        onChange={(e) => {
          const v = e.target.value
          if (v === '') return
          onChange(`${v}mm`)
        }}
        className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-700 outline-none focus:border-brand"
      />
    </div>
  )
}
