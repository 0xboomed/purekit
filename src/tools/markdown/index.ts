import { lazy } from 'react'
import { FileText } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: 'Markdown 编辑器',
  nameEn: 'Markdown Editor',
  path: '/markdown',
  description: 'Markdown 实时预览 + PDF 导出，支持 GFM 语法',
  descriptionEn: 'Live Markdown preview + PDF export with GFM support',
  icon: FileText,
  category: 'document',
  keywords: ['markdown', 'md', 'pdf', '编辑器', '预览', 'gfm', '导出'],
  component: lazy(() => import('./markdown-tool')),
})
