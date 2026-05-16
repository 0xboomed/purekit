import { lazy } from 'react'
import { QrCode } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: '二维码生成',
  nameEn: 'QR Code Generator',
  path: '/qrcode',
  description: '文本/URL 生成二维码，自定义尺寸、颜色、容错等级',
  descriptionEn: 'Generate QR codes from text/URL with custom size, color, and error correction',
  icon: QrCode,
  category: 'generator',
  keywords: ['qrcode', 'qr', '二维码', '条形码', 'barcode', 'scan'],
  component: lazy(() => import('./qrcode-tool')),
})
