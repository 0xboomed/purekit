interface ToolPageSplitProps {
  settings: React.ReactNode
  output: React.ReactNode
}

export function ToolPageSplit({ settings, output }: ToolPageSplitProps) {
  return (
    <div className="flex h-full flex-col gap-5 overflow-auto p-6 lg:flex-row">
      <div className="w-full shrink-0 overflow-auto lg:w-80">{settings}</div>
      <div className="min-w-0 flex-1">{output}</div>
    </div>
  )
}
