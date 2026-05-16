import { lazy } from 'react'
import { KeyRound } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: 'API Key 生成器',
  nameEn: 'API Key Generator',
  path: '/apikey',
  description: '生成随机 API Key，支持自定义前缀、长度和字符集',
  descriptionEn: 'Generate random API keys with custom prefix, length, and charset',
  icon: KeyRound,
  category: 'generator',
  keywords: ['api', 'key', 'token', 'secret', 'apikey', '密钥', '令牌', '生成'],
  component: lazy(() => import('./apikey-tool')),
})
