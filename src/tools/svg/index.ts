import { lazy } from 'react'
import { PenTool } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: 'SVG 压缩',
  nameEn: 'SVG Optimizer',
  path: '/svg',
  description: '清理压缩 SVG 代码，移除冗余属性和注释',
  descriptionEn: 'Clean and optimize SVG code by removing redundant attributes and comments',
  icon: PenTool,
  category: 'image',
  keywords: ['svg', 'optimize', 'compress', 'minify', '压缩', '优化'],
  component: lazy(() => import('./svg-tool')),
})
