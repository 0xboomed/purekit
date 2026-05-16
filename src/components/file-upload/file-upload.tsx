import { useCallback, useRef } from 'react'
import { useAppStore } from '@/stores/use-app-store'
import { useFileUpload } from '@/hooks/use-file-upload'

export function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const setMarkdownContent = useAppStore((s) => s.setMarkdownContent)
  const setFilePath = useAppStore((s) => s.setFilePath)
  const { validateFile, readFile } = useFileUpload()

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const error = validateFile(file)
      if (error) {
        console.warn(error)
        return
      }

      const content = await readFile(file)
      setMarkdownContent(content)
      setFilePath(file.name)
      e.target.value = ''
    },
    [validateFile, readFile, setMarkdownContent, setFilePath],
  )

  return (
    <input
      ref={inputRef}
      type="file"
      accept=".md,.markdown,.txt"
      onChange={handleChange}
      className="hidden"
    />
  )
}
