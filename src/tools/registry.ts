import type { ComponentType, LazyExoticComponent } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface ToolMeta {
  name: string
  nameEn: string
  path: string
  description: string
  descriptionEn: string
  icon: LucideIcon
  category: Category
  keywords: string[]
  component: LazyExoticComponent<ComponentType>
}

export type Category =
  | 'converter'
  | 'generator'
  | 'encoder'
  | 'document'
  | 'pdf'
  | 'image'

export interface CategoryMeta {
  id: Category
  labelKey: string
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'converter', labelKey: 'category.converter' },
  { id: 'generator', labelKey: 'category.generator' },
  { id: 'encoder', labelKey: 'category.encoder' },
  { id: 'document', labelKey: 'category.document' },
  { id: 'pdf', labelKey: 'category.pdf' },
  { id: 'image', labelKey: 'category.image' },
]

const tools: ToolMeta[] = []

export function defineTool(meta: ToolMeta): ToolMeta {
  tools.push(meta)
  return meta
}

export function getTools(): ToolMeta[] {
  return tools
}

export function getToolsByCategory(): Map<Category, ToolMeta[]> {
  const map = new Map<Category, ToolMeta[]>()
  for (const tool of tools) {
    const list = map.get(tool.category) ?? []
    list.push(tool)
    map.set(tool.category, list)
  }
  return map
}

export function searchTools(query: string): ToolMeta[] {
  const q = query.toLowerCase().trim()
  if (!q) return tools
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.nameEn.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.descriptionEn.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.includes(q)),
  )
}
