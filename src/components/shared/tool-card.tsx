interface ToolCardProps {
  title?: string
  titleAction?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function ToolCard({ title, titleAction, children, className = '' }: ToolCardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-card shadow-sm dark:border-border-dark dark:bg-card-dark ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5 dark:border-border-dark">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</span>
          {titleAction}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}
