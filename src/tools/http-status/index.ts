import { lazy } from 'react'
import { Globe } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: 'HTTP 状态码',
  nameEn: 'HTTP Status Codes',
  path: '/http-status',
  description: '查询 HTTP 状态码含义，支持搜索和分类筛选',
  descriptionEn: 'Look up HTTP status code meanings with search and category filtering',
  icon: Globe,
  category: 'converter',
  keywords: ['http', 'status', 'code', 'response', '200', '404', '500', '状态码', '响应码'],
  component: lazy(() => import('./http-status-tool')),
})
