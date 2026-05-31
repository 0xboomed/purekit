import { useState, useCallback } from 'react'
import { Check, Copy } from 'lucide-react'
import { useT } from '@/i18n/context'

interface CopyButtonProps {
  text: string
  className?: string
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
  const { t } = useT()
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [text])

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      aria-label={copied ? t('common.copied') : t('common.copy')}
      className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
        copied
          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
          : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300'
      } ${!text ? 'opacity-40' : ''} ${className}`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? t('common.copied') : t('common.copy')}
    </button>
  )
}
