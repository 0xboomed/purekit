import { lazy } from 'react'
import { Clock } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: 'Cron 表达式',
  nameEn: 'Cron Parser',
  path: '/cron',
  description: '解析 Cron 表达式，显示人类可读描述和下次执行时间',
  descriptionEn: 'Parse cron expressions with human-readable descriptions and next execution times',
  icon: Clock,
  category: 'converter',
  keywords: ['cron', 'schedule', 'crontab', '定时', '调度', '表达式'],
  component: lazy(() => import('./cron-tool')),
})
