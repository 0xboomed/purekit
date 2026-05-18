import { lazy } from 'react'
import { KeyRound } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: 'JWT 解码',
  nameEn: 'JWT Decoder',
  path: '/jwt',
  description: '解码和检查 JSON Web Token，查看 Header、Payload 和过期时间',
  descriptionEn: 'Decode and inspect JSON Web Tokens, view Header, Payload and expiration',
  icon: KeyRound,
  category: 'converter',
  keywords: ['jwt', 'token', 'json web token', 'decode', 'inspect', '解码', '令牌'],
  component: lazy(() => import('./jwt-tool')),
})
