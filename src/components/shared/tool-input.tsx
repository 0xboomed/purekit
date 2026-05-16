interface ToolInputProps {
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  mono?: boolean
  className?: string
  rows?: number
}

export function ToolInput({
  value,
  onChange,
  placeholder,
  mono = true,
  className = '',
  rows,
}: ToolInputProps) {
  return (
    <textarea
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      rows={rows}
      spellCheck={false}
      className={`min-h-[120px] w-full resize-y rounded-lg border border-border bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-shadow placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200 dark:placeholder:text-gray-600 ${mono ? 'font-mono' : ''} ${className}`}
    />
  )
}
