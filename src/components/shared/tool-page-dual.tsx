interface ToolPageDualProps {
  left: React.ReactNode
  right: React.ReactNode
}

export function ToolPageDual({ left, right }: ToolPageDualProps) {
  return (
    <div className="flex h-full flex-col gap-5 overflow-auto p-6 lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-5">{left}</div>
      <div className="flex min-w-0 flex-1 flex-col gap-5">{right}</div>
    </div>
  )
}
