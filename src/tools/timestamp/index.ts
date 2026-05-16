import { lazy } from 'react'
import { Clock } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: '时间戳转换',
  nameEn: 'Timestamp Converter',
  path: '/timestamp',
  description: 'Unix 时间戳与可读时间互转，支持毫秒/秒、时区切换',
  descriptionEn: 'Convert between Unix timestamps and readable dates with timezone support',
  icon: Clock,
  category: 'converter',
  keywords: ['timestamp', 'unix', 'epoch', '时间戳', '日期', '时区', 'date'],
  component: lazy(() => import('./timestamp-tool')),
})
