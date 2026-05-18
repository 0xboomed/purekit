import { lazy } from 'react'
import { Image } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: '图片转换',
  nameEn: 'Image Converter',
  path: '/image',
  description: 'PNG/JPEG/WebP 格式互转，支持质量调节和尺寸缩放',
  descriptionEn: 'Convert images between PNG, JPEG and WebP with quality and size controls',
  icon: Image,
  category: 'image',
  keywords: ['image', 'convert', 'png', 'jpeg', 'webp', '图片', '转换', '压缩'],
  component: lazy(() => import('./image-tool')),
})
