import { lazy } from 'react'
import { ShieldCheck } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: '哈希计算',
  nameEn: 'Hash Calculator',
  path: '/hash',
  description: 'MD5/SHA-1/SHA-256/SHA-512 文本和文件哈希计算',
  descriptionEn: 'Compute MD5/SHA-1/SHA-256/SHA-512 hashes for text and files',
  icon: ShieldCheck,
  category: 'encoder',
  keywords: ['hash', 'md5', 'sha', 'sha256', 'sha512', '哈希', '摘要', 'digest'],
  component: lazy(() => import('./hash-tool')),
})
