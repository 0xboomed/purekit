import { lazy } from 'react'
import { Fingerprint } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: 'UUID 生成器',
  nameEn: 'UUID Generator',
  path: '/uuid',
  description: '批量生成 UUID v4，支持大小写、连字符、花括号等格式',
  descriptionEn: 'Batch generate UUID v4 with format options: uppercase, hyphens, braces',
  icon: Fingerprint,
  category: 'generator',
  keywords: ['uuid', 'guid', 'unique', 'id', 'identifier', '唯一', '标识符', 'v4'],
  component: lazy(() => import('./uuid-tool')),
})
