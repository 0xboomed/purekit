import { lazy } from 'react'
import { Shield } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: 'chmod 计算器',
  nameEn: 'chmod Calculator',
  path: '/chmod',
  description: '可视化计算 Linux/Unix 文件权限，八进制与符号表示互转',
  descriptionEn: 'Visual Linux/Unix file permission calculator, convert between octal and symbolic notation',
  icon: Shield,
  category: 'converter',
  keywords: ['chmod', 'permission', 'linux', 'unix', 'octal', 'symbolic', '755', '644', '权限', '文件权限'],
  component: lazy(() => import('./chmod-tool')),
})
