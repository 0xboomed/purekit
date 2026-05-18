import { lazy } from 'react'
import { Type } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: '占位文本',
  nameEn: 'Lorem Ipsum',
  path: '/lorem',
  description: '生成中英文占位文本，支持段落、句子、单词',
  descriptionEn: 'Generate placeholder text in Chinese and English, paragraphs, sentences, or words',
  icon: Type,
  category: 'generator',
  keywords: ['lorem', 'ipsum', 'placeholder', 'text', 'dummy', '占位', '假文', '填充'],
  component: lazy(() => import('./lorem-tool')),
})
