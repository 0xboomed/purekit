import { useState, useCallback } from 'react'
import { ToolPageSplit } from '@/components/shared/tool-page-split'
import { ToolCard } from '@/components/shared/tool-card'
import { CopyButton } from '@/components/shared/copy-button'
import { ToolSegmentedControl } from '@/components/shared/tool-segmented-control'
import { useT } from '@/i18n/context'

type GenerateType = 'paragraphs' | 'sentences' | 'words'
type Language = 'zh' | 'en'

const CHINESE_CORPUS =
  '天地玄黄宇宙洪荒日月盈昃辰宿列张寒来暑往秋收冬藏闰余成岁律吕调阳云腾致雨露结为霜金生丽水玉出昆冈剑号巨阙珠称夜光果珍李柰菜重芥姜海咸河淡鳞潜羽翔'

const CHINESE_PHRASES = [
  '在这个充满变化的时代里我们需要不断学习和成长',
  '技术的发展为人类带来了前所未有的机遇和挑战',
  '秋天的树叶在微风中轻轻摇曳仿佛在诉说着什么',
  '远处的山峦在云雾中若隐若现宛如一幅水墨画',
  '知识就是力量而学习是获取知识的唯一途径',
  '每一个清晨都是一个新的开始一个全新的机会',
  '时间如同流水般匆匆而过不留任何痕迹',
  '繁华的都市中隐藏着无数的故事和秘密',
  '春风拂面万物复苏大地一片生机勃勃的景象',
  '科技与创新是推动社会进步的重要力量',
  '大海的波涛翻滚着拍打着岸边的礁石',
  '人生的旅途充满了未知但也因此更加精彩',
  '夜空中繁星点点每一颗都在讲述着自己的故事',
  '阳光透过树叶的缝隙洒下斑驳的光影',
  '书籍是人类智慧的结晶值得我们细细品味',
  '在这个数字化的世界里信息传播的速度越来越快',
  '古老的城墙见证了历史的沧桑和岁月的变迁',
  '每一次失败都是通往成功的必经之路',
  '清晨的露珠在阳光下闪闪发光如同一颗颗珍珠',
  '文化的传承需要每一代人的共同努力和坚持',
]

const ENGLISH_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'voluptas', 'aspernatur', 'aut', 'odit', 'fugit',
]

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

function generateChineseSentence(): string {
  if (Math.random() < 0.5) {
    return pickRandom(CHINESE_PHRASES)
  }
  const len = randomInt(8, 18)
  let s = ''
  for (let i = 0; i < len; i++) {
    s += CHINESE_CORPUS[Math.floor(Math.random() * CHINESE_CORPUS.length)]!
  }
  return s
}

function generateEnglishSentence(): string {
  const len = randomInt(5, 12)
  const words: string[] = []
  for (let i = 0; i < len; i++) {
    words.push(pickRandom(ENGLISH_WORDS))
  }
  words[0] = words[0]!.charAt(0).toUpperCase() + words[0]!.slice(1)
  return words.join(' ') + '.'
}

function generate(lang: Language, type: GenerateType, count: number): string {
  const genSentence = lang === 'zh' ? generateChineseSentence : generateEnglishSentence

  if (type === 'words') {
    if (lang === 'zh') {
      const chars: string[] = []
      for (let i = 0; i < count; i++) {
        chars.push(CHINESE_CORPUS[Math.floor(Math.random() * CHINESE_CORPUS.length)]!)
      }
      return chars.join('')
    }
    return Array.from({ length: count }, () => pickRandom(ENGLISH_WORDS)).join(' ')
  }

  if (type === 'sentences') {
    return Array.from({ length: count }, () => genSentence()).join(lang === 'zh' ? '' : ' ')
  }

  // paragraphs
  return Array.from({ length: count }, () => {
    const sentenceCount = randomInt(3, 6)
    return Array.from({ length: sentenceCount }, () => genSentence()).join(lang === 'zh' ? '' : ' ')
  }).join('\n\n')
}

export default function LoremTool() {
  const { t } = useT()
  const [type, setType] = useState<GenerateType>('paragraphs')
  const [lang, setLang] = useState<Language>('zh')
  const [count, setCount] = useState(3)
  const [output, setOutput] = useState('')

  const handleGenerate = useCallback(() => {
    setOutput(generate(lang, type, count))
  }, [lang, type, count])

  const typeOptions: Array<{ value: GenerateType; label: string }> = [
    { value: 'paragraphs', label: t('lorem.paragraphs') },
    { value: 'sentences', label: t('lorem.sentences') },
    { value: 'words', label: t('lorem.words') },
  ]

  const langOptions: Array<{ value: Language; label: string }> = [
    { value: 'zh', label: t('lorem.chinese') },
    { value: 'en', label: t('lorem.english') },
  ]

  return (
    <ToolPageSplit
      settings={
        <ToolCard title={t('lorem.settings')}>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('lorem.type')}
              </label>
              <ToolSegmentedControl options={typeOptions} value={type} onChange={setType} />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('lorem.count')}
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-border-dark dark:bg-gray-900 dark:text-gray-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('lorem.language')}
              </label>
              <ToolSegmentedControl options={langOptions} value={lang} onChange={setLang} />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="mt-5 w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-light"
          >
            {t('lorem.generate')}
          </button>
        </ToolCard>
      }
      output={
        <ToolCard title={t('common.output')} titleAction={output ? <CopyButton text={output} /> : undefined}>
          {output ? (
            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-gray-700 dark:text-gray-200">
              {output}
            </pre>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">
              {t('common.processing')}
            </div>
          )}
        </ToolCard>
      }
    />
  )
}
