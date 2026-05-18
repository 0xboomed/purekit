import { lazy } from 'react'
import { Database } from 'lucide-react'
import { defineTool } from '../registry'

export default defineTool({
  name: 'SQL 格式化',
  nameEn: 'SQL Formatter',
  path: '/sql',
  description: '格式化、压缩、美化 SQL 语句，支持多种数据库方言',
  descriptionEn: 'Format, minify, and beautify SQL queries with multiple dialect support',
  icon: Database,
  category: 'converter',
  keywords: ['sql', 'format', 'prettify', 'minify', 'query', 'database', 'mysql', 'postgresql', 'sqlite', '格式化', '美化', '数据库'],
  component: lazy(() => import('./sql-tool')),
})
