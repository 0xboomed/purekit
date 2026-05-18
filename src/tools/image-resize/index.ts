import { lazy } from 'react'
import { Crop } from 'lucide-react'
import { defineTool } from '@/tools/registry'

defineTool({
  name: '社交图片裁剪',
  nameEn: 'Social Image Resize',
  path: '/image-resize',
  description: '按社交平台预设尺寸裁剪图片',
  descriptionEn: 'Resize images to social media platform presets',
  icon: Crop,
  category: 'image',
  keywords: ['image', 'resize', 'crop', 'social', '社交', '裁剪', '微信', '小红书', '抖音', 'instagram'],
  component: lazy(() => import('./image-resize-tool')),
})
