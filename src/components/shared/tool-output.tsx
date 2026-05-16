interface ToolOutputProps {
  value: string
  placeholder?: string
  mono?: boolean
  className?: string
}

export function ToolOutput({ value, placeholder, mono = true, className = '' }: ToolOutputProps) {
  return (
    <div
      className={`min-h-[120px] rounded-lg border border-border bg-gray-50 px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap break-all dark:border-border-dark dark:bg-gray-900/50 dark:text-gray-200 ${mono ? 'font-mono' : ''} ${className}`}
    >
      {value || <span className="text-gray-400 dark:text-gray-600">{placeholder}</span>}
    </div>
  )
}
