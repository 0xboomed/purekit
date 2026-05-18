import { lazy } from 'react'
import { Scissors } from 'lucide-react'
import { defineTool } from '@/tools/registry'

defineTool({
  name: 'PDF 拆分',
  nameEn: 'PDF Split',
  path: '/pdf-split',
  description: '从 PDF 中提取指定页面',
  descriptionEn: 'Extract specific pages from a PDF',
  icon: Scissors,
  category: 'pdf',
  keywords: ['pdf', 'split', 'extract', '拆分', '拆分pdf', 'pdf拆分', '提取页面'],
  component: lazy(() => import('./pdf-split-tool')),
})
