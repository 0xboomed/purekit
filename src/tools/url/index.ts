import { lazy } from 'react'
import { Link } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: 'URL 编解码',
  nameEn: 'URL Encoder/Decoder',
  path: '/url',
  description: 'URL 编码解码、参数解析、Query ↔ JSON 互转',
  descriptionEn: 'Encode/decode URLs, parse query params, convert Query ↔ JSON',
  icon: Link,
  category: 'encoder',
  keywords: ['url', 'encode', 'decode', 'uri', 'query', '参数', '编码'],
  component: lazy(() => import('./url-tool')),
})
