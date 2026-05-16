import { lazy } from 'react'
import { Palette } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: '颜色转换',
  nameEn: 'Color Converter',
  path: '/color',
  description: 'HEX ↔ RGB ↔ HSL 互转、取色器、对比度检查',
  descriptionEn: 'Convert between HEX, RGB, HSL with color picker and contrast checker',
  icon: Palette,
  category: 'generator',
  keywords: ['color', 'hex', 'rgb', 'hsl', '颜色', '色彩', '转换', 'picker'],
  component: lazy(() => import('./color-tool')),
})
