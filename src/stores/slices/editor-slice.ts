import type { StateCreator } from 'zustand'

export interface EditorSlice {
  markdownContent: string
  cursorLine: number
  cursorCol: number
  filePath: string | null
  lastSavedAt: number
  setMarkdownContent: (content: string) => void
  setCursorPosition: (line: number, col: number) => void
  setFilePath: (path: string | null) => void
  resetContent: () => void
}

const DEFAULT_CONTENT = `# Welcome to Printdown

一个**零安装**、*完全离线*的 Markdown 转 PDF 工具。

## 功能特性

- 实时双栏编辑预览
- GFM 语法完整支持
- 代码块语法高亮
- 拖拽上传 .md 文件

## 代码示例

\`\`\`typescript
function hello(name: string): string {
  return \`Hello, \${name}!\`
}

console.log(hello('Printdown'))
\`\`\`

## 表格

| 功能 | 状态 |
|------|------|
| Markdown 编辑 | ✅ |
| 实时预览 | ✅ |
| PDF 导出 | 🔜 |

## 任务列表

- [x] 搭建项目框架
- [x] 集成 CodeMirror 编辑器
- [x] 实现 Markdown 预览
- [ ] PDF 导出功能

> 打开浏览器即用，所有处理在本地完成，文件不离开你的设备。
`

export const createEditorSlice: StateCreator<EditorSlice, [], [], EditorSlice> = (set) => ({
  markdownContent: DEFAULT_CONTENT,
  cursorLine: 1,
  cursorCol: 1,
  filePath: null,
  lastSavedAt: Date.now(),
  setMarkdownContent: (content) => set({ markdownContent: content, lastSavedAt: Date.now() }),
  setCursorPosition: (line, col) => set({ cursorLine: line, cursorCol: col }),
  setFilePath: (path) => set({ filePath: path }),
  resetContent: () => set({ markdownContent: DEFAULT_CONTENT, filePath: null, lastSavedAt: Date.now() }),
})
