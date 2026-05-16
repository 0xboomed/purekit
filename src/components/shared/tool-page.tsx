interface ToolPageProps {
  children: React.ReactNode
}

export function ToolPage({ children }: ToolPageProps) {
  return (
    <div className="flex h-full flex-col gap-5 overflow-auto p-6">
      {children}
    </div>
  )
}
