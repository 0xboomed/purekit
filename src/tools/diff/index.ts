import { lazy } from 'react'
import { GitCompare } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: '文本对比',
  nameEn: 'Diff Checker',
  path: '/diff',
  description: '对比两段文本差异，高亮增删改',
  descriptionEn: 'Compare two texts side by side with highlighted differences',
  icon: GitCompare,
  category: 'converter',
  keywords: ['diff', 'compare', '对比', '比较', '差异', '文本对比'],
  component: lazy(() => import('./diff-tool')),
})
