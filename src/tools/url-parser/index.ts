import { lazy } from 'react'
import { Link2 } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: 'URL 解析',
  nameEn: 'URL Parser',
  path: '/url-parser',
  description: '解析 URL 各组成部分：协议、主机、路径、查询参数、哈希',
  descriptionEn: 'Parse URL components: protocol, host, path, query params, hash',
  icon: Link2,
  category: 'converter',
  keywords: ['url', 'parse', 'query', 'params', '解析', '链接', '参数'],
  component: lazy(() => import('./url-parser-tool')),
})
