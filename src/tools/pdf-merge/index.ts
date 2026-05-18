import { lazy } from 'react'
import { FileStack } from 'lucide-react'
import { defineTool } from '@/tools/registry'

defineTool({
  name: 'PDF 合并',
  nameEn: 'PDF Merge',
  path: '/pdf-merge',
  description: '将多个 PDF 文件合并为一个',
  descriptionEn: 'Merge multiple PDF files into one',
  icon: FileStack,
  category: 'pdf',
  keywords: ['pdf', 'merge', 'combine', '合并', '合并pdf', 'pdf合并'],
  component: lazy(() => import('./pdf-merge-tool')),
})
