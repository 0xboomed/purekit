import { lazy } from 'react'
import { FileDown } from 'lucide-react'
import { defineTool } from '@/tools/registry'

defineTool({
  name: '图片压缩',
  nameEn: 'Image Compress',
  path: '/image-compress',
  description: '在浏览器中压缩图片，减小文件大小',
  descriptionEn: 'Compress images in the browser to reduce file size',
  icon: FileDown,
  category: 'image',
  keywords: ['image', 'compress', '图片压缩', '压缩图片', 'tinypng', 'optimize'],
  component: lazy(() => import('./image-compress-tool')),
})
