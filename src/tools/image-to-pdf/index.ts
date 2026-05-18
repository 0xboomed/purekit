import { lazy } from 'react'
import { ImageDown } from 'lucide-react'
import { defineTool } from '@/tools/registry'

defineTool({
  name: '图片转 PDF',
  nameEn: 'Image to PDF',
  path: '/image-to-pdf',
  description: '将多张图片合并为一个 PDF 文件',
  descriptionEn: 'Combine multiple images into a single PDF',
  icon: ImageDown,
  category: 'pdf',
  keywords: ['pdf', 'image', '图片转pdf', '图片', 'jpg to pdf', 'png to pdf'],
  component: lazy(() => import('./image-to-pdf-tool')),
})
