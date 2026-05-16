import { useCallback, useEffect, useRef, useState } from 'react'
import { FileText } from 'lucide-react'
import { useAppStore } from '@/stores/use-app-store'
import { useFileUpload } from '@/hooks/use-file-upload'

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const setMarkdownContent = useAppStore((s) => s.setMarkdownContent)
  const setFilePath = useAppStore((s) => s.setFilePath)
  const { validateFile, readFile } = useFileUpload()

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    async (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      dragCounter.current = 0

      const file = e.dataTransfer?.files[0]
      if (!file) return

      const error = validateFile(file)
      if (error) {
        console.warn(error)
        return
      }

      const content = await readFile(file)
      setMarkdownContent(content)
      setFilePath(file.name)
    },
    [validateFile, readFile, setMarkdownContent, setFilePath],
  )

  useEffect(() => {
    document.addEventListener('dragenter', handleDragEnter)
    document.addEventListener('dragleave', handleDragLeave)
    document.addEventListener('dragover', handleDragOver)
    document.addEventListener('drop', handleDrop)
    return () => {
      document.removeEventListener('dragenter', handleDragEnter)
      document.removeEventListener('dragleave', handleDragLeave)
      document.removeEventListener('dragover', handleDragOver)
      document.removeEventListener('drop', handleDrop)
    }
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop])

  if (!isDragging) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-blue-500/10 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-blue-400 bg-white/90 px-12 py-10 dark:bg-gray-900/90">
        <FileText size={48} className="text-blue-500" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
          释放文件以加载
        </p>
        <p className="text-sm text-gray-400">支持 .md / .markdown / .txt</p>
      </div>
    </div>
  )
}
