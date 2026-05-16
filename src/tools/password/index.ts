import { lazy } from 'react'
import { KeyRound } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: '密码生成器',
  nameEn: 'Password Generator',
  path: '/password',
  description: '自定义长度、字符集，批量生成密码，显示熵值',
  descriptionEn: 'Generate secure passwords with custom length, charset, and entropy display',
  icon: KeyRound,
  category: 'generator',
  keywords: ['password', 'generator', '密码', '生成', 'random', '随机'],
  component: lazy(() => import('./password-tool')),
})
