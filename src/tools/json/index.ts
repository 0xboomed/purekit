import { lazy } from 'react'
import { Braces } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: 'JSON 格式化',
  nameEn: 'JSON Formatter',
  path: '/json',
  description: '格式化、压缩、校验 JSON 数据',
  descriptionEn: 'Format, minify, and validate JSON data',
  icon: Braces,
  category: 'converter',
  keywords: ['json', 'format', 'prettify', 'minify', 'validate', '格式化', '校验'],
  component: lazy(() => import('./json-tool')),
})
