import { lazy } from 'react'
import { Regex } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: '正则测试器',
  nameEn: 'Regex Tester',
  path: '/regex',
  description: '实时正则匹配高亮、捕获组展示、常用正则库',
  descriptionEn: 'Real-time regex matching with capture groups and preset patterns',
  icon: Regex,
  category: 'converter',
  keywords: ['regex', 'regexp', 'regular', 'expression', '正则', '匹配', 'match'],
  component: lazy(() => import('./regex-tool')),
})
