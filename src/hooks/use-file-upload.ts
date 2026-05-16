const ALLOWED_EXTENSIONS = ['.md', '.markdown', '.txt']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function useFileUpload() {
  function validateFile(file: File): string | null {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `不支持的文件格式: ${ext}。请上传 .md 或 .txt 文件。`
    }
    if (file.size > MAX_FILE_SIZE) {
      return `文件过大: ${(file.size / 1024 / 1024).toFixed(1)}MB。最大支持 5MB。`
    }
    return null
  }

  function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsText(file, 'UTF-8')
    })
  }

  return { validateFile, readFile }
}
