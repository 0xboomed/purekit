import { lazy } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: '进制转换',
  nameEn: 'Base Converter',
  path: '/base-converter',
  description: '二进制、八进制、十进制、十六进制、ASCII 互相转换',
  descriptionEn: 'Convert between binary, octal, decimal, hexadecimal, and ASCII',
  icon: ArrowLeftRight,
  category: 'converter',
  keywords: ['binary', 'octal', 'decimal', 'hex', 'hexadecimal', 'ascii', 'radix', '进制', '转换', '二进制', '十六进制'],
  component: lazy(() => import('./base-converter-tool')),
})
