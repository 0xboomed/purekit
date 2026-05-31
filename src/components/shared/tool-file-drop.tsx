import { useRef } from 'react'
import { Upload } from 'lucide-react'

interface ToolFileDropProps {
  label: string
  onFile: (file: File) => void
  accept?: string
  className?: string
}

export function ToolFileDrop({ label, onFile, accept, className = '' }: ToolFileDropProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => inputRef.current?.click()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`flex min-h-[120px] cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-400 transition-colors hover:border-brand hover:text-brand focus:border-brand focus:text-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-gray-600 ${className}`}
    >
      <Upload size={16} />
      {label}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
        }}
      />
    </div>
  )
}
