interface ToolSegmentedControlProps<T extends string> {
  options: Array<{ value: T; label: string }>
  value: T
  onChange: (value: T) => void
  label?: string
}

export function ToolSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: ToolSegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex rounded-lg bg-bg-secondary p-0.5 dark:bg-bg-secondary-dark"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          role="tab"
          aria-selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            value === opt.value
              ? 'bg-white text-gray-700 shadow-sm dark:bg-gray-700 dark:text-gray-200'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
