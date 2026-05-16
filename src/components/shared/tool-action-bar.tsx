interface ToolActionBarProps {
  children: React.ReactNode
  className?: string
}

export function ToolActionBar({ children, className = '' }: ToolActionBarProps) {
  return <div className={`flex items-center gap-2 ${className}`}>{children}</div>
}
