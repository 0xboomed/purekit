import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { ToolPage } from '@/components/shared/tool-page'
import { ToolCard } from '@/components/shared/tool-card'
import { CopyButton } from '@/components/shared/copy-button'
import { ToolSegmentedControl } from '@/components/shared/tool-segmented-control'
import { useT } from '@/i18n/context'

type Category = 'all' | '1xx' | '2xx' | '3xx' | '4xx' | '5xx'

interface HttpStatus {
  code: number
  name: string
  description: string
  descriptionEn: string
}

const STATUS_CODES: HttpStatus[] = [
  // 1xx Informational
  { code: 100, name: 'Continue', description: '客户端应继续发送请求', descriptionEn: 'Client should continue the request' },
  { code: 101, name: 'Switching Protocols', description: '服务器同意切换协议', descriptionEn: 'Server agrees to switch protocols' },
  // 2xx Success
  { code: 200, name: 'OK', description: '请求成功', descriptionEn: 'Request succeeded' },
  { code: 201, name: 'Created', description: '资源创建成功', descriptionEn: 'Resource created successfully' },
  { code: 204, name: 'No Content', description: '请求成功但无返回内容', descriptionEn: 'Successful but no content returned' },
  { code: 206, name: 'Partial Content', description: '部分资源返回成功', descriptionEn: 'Partial resource returned successfully' },
  // 3xx Redirection
  { code: 301, name: 'Moved Permanently', description: '资源已永久移动', descriptionEn: 'Resource moved permanently' },
  { code: 302, name: 'Found', description: '资源临时重定向', descriptionEn: 'Resource temporarily redirected' },
  { code: 304, name: 'Not Modified', description: '资源未修改，使用缓存', descriptionEn: 'Resource not modified, use cache' },
  { code: 307, name: 'Temporary Redirect', description: '临时重定向，保持请求方法', descriptionEn: 'Temporary redirect, preserves method' },
  { code: 308, name: 'Permanent Redirect', description: '永久重定向，保持请求方法', descriptionEn: 'Permanent redirect, preserves method' },
  // 4xx Client Error
  { code: 400, name: 'Bad Request', description: '请求格式错误', descriptionEn: 'Malformed request syntax' },
  { code: 401, name: 'Unauthorized', description: '未提供有效的身份认证', descriptionEn: 'Authentication required' },
  { code: 403, name: 'Forbidden', description: '服务器拒绝执行请求', descriptionEn: 'Server refuses to authorize request' },
  { code: 404, name: 'Not Found', description: '请求的资源不存在', descriptionEn: 'Requested resource not found' },
  { code: 405, name: 'Method Not Allowed', description: '请求方法不被允许', descriptionEn: 'HTTP method not supported' },
  { code: 408, name: 'Request Timeout', description: '请求超时', descriptionEn: 'Request timed out' },
  { code: 409, name: 'Conflict', description: '请求与服务器状态冲突', descriptionEn: 'Request conflicts with server state' },
  { code: 410, name: 'Gone', description: '资源已永久删除', descriptionEn: 'Resource permanently removed' },
  { code: 413, name: 'Payload Too Large', description: '请求体过大', descriptionEn: 'Request payload too large' },
  { code: 415, name: 'Unsupported Media Type', description: '不支持的媒体类型', descriptionEn: 'Unsupported media type' },
  { code: 418, name: "I'm a Teapot", description: '服务器拒绝煮咖啡', descriptionEn: 'Server refuses to brew coffee' },
  { code: 422, name: 'Unprocessable Entity', description: '请求格式正确但语义错误', descriptionEn: 'Well-formed but semantically invalid' },
  { code: 429, name: 'Too Many Requests', description: '请求频率过高', descriptionEn: 'Rate limit exceeded' },
  // 5xx Server Error
  { code: 500, name: 'Internal Server Error', description: '服务器内部错误', descriptionEn: 'Generic server error' },
  { code: 501, name: 'Not Implemented', description: '服务器不支持该功能', descriptionEn: 'Server does not support this feature' },
  { code: 502, name: 'Bad Gateway', description: '网关或代理收到无效响应', descriptionEn: 'Gateway received invalid response' },
  { code: 503, name: 'Service Unavailable', description: '服务暂时不可用', descriptionEn: 'Server temporarily unavailable' },
  { code: 504, name: 'Gateway Timeout', description: '网关或代理响应超时', descriptionEn: 'Gateway timed out' },
]

function getCategoryColor(code: number): string {
  if (code < 200) return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  if (code < 300) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
  if (code < 400) return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  if (code < 500) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
}

function getCategoryFromCode(code: number): Category {
  if (code < 200) return '1xx'
  if (code < 300) return '2xx'
  if (code < 400) return '3xx'
  if (code < 500) return '4xx'
  return '5xx'
}

export default function HttpStatusTool() {
  const { t, locale } = useT()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category>('all')

  const filtered = useMemo(() => {
    return STATUS_CODES.filter((s) => {
      if (category !== 'all' && getCategoryFromCode(s.code) !== category) return false
      if (!search) return true
      const q = search.toLowerCase()
      return (
        String(s.code).includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.descriptionEn.toLowerCase().includes(q)
      )
    })
  }, [search, category])

  return (
    <ToolPage>
      <div className="mx-auto max-w-3xl space-y-4">
        <ToolCard>
          <div className="space-y-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('httpstatus.search')}
                className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200 dark:placeholder:text-gray-500"
              />
            </div>
            <ToolSegmentedControl
              options={[
                { value: 'all' as Category, label: t('httpstatus.all') },
                { value: '1xx' as Category, label: t('httpstatus.informational') },
                { value: '2xx' as Category, label: t('httpstatus.success') },
                { value: '3xx' as Category, label: t('httpstatus.redirection') },
                { value: '4xx' as Category, label: t('httpstatus.clientError') },
                { value: '5xx' as Category, label: t('httpstatus.serverError') },
              ]}
              value={category}
              onChange={setCategory}
            />
          </div>
        </ToolCard>

        <div className="space-y-1.5">
          {filtered.map((status) => (
            <div
              key={status.code}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm dark:border-border-dark dark:bg-card-dark"
            >
              <span
                className={`shrink-0 rounded-md px-2.5 py-1 font-mono text-sm font-bold ${getCategoryColor(status.code)}`}
              >
                {status.code}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{status.name}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {locale === 'en' ? status.descriptionEn : status.description}
                </div>
              </div>
              <CopyButton text={`${status.code} ${status.name}`} />
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">
              {search ? `${t('httpstatus.search')} "${search}"` : ''}
            </div>
          )}
        </div>
      </div>
    </ToolPage>
  )
}
