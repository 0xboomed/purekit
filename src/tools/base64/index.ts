import { lazy } from 'react'
import { Binary } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: 'Base64 编解码',
  nameEn: 'Base64 Codec',
  path: '/base64',
  description: '文本与 Base64 互转，支持 URL 安全模式',
  descriptionEn: 'Encode/decode text and files to Base64 with URL-safe mode',
  icon: Binary,
  category: 'encoder',
  keywords: ['base64', 'encode', 'decode', '编码', '解码', 'url safe'],
  component: lazy(() => import('./base64-tool')),
})
