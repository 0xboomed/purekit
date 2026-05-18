import { lazy } from 'react'
import { FileJson } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: 'YAML 格式化',
  nameEn: 'YAML Formatter',
  path: '/yaml',
  description: '格式化、压缩、校验 YAML 数据，支持 JSON 互转',
  descriptionEn: 'Format, minify, validate YAML, and convert between YAML and JSON',
  icon: FileJson,
  category: 'converter',
  keywords: ['yaml', 'yml', 'format', 'prettify', 'minify', 'validate', 'json', '格式化', '校验', '转换'],
  component: lazy(() => import('./yaml-tool')),
})
