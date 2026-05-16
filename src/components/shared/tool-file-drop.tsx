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

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className={`flex min-h-[120px] cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-400 transition-colors hover:border-brand hover:text-brand dark:border-gray-600 ${className}`}
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
