# PureKit 优化实施计划

> 版本：V1.0
> 日期：2026-05-30
> 基于 Lighthouse 实测：SEO 100 / Best Practices 96 / Accessibility 81

---

## Phase 1 — 稳定性修复（防崩溃 + PWA 可安装）

> 目标：消除白屏崩溃、修复 PWA 安装

### 1.1 React Error Boundary

**文件**: `src/components/shared/error-boundary.tsx`（新建）

- 创建通用 `<ErrorBoundary>` 组件，catch 子组件崩溃
- 展示友好的错误提示 + 重试按钮
- 包裹 `<App>` 根组件（`src/main.tsx`）

**涉及文件**:
- `src/components/shared/error-boundary.tsx` — 新建
- `src/main.tsx` — 用 ErrorBoundary 包裹 `<App />`

### 1.2 PWA 图标生成

**文件**: `public/pwa-192x192.png`、`public/pwa-512x512.png`（新建）

- 从现有 `public/icon.svg` 生成 PNG 图标（192x192、512x512）
- 验证 `vite.config.ts` manifest.icons 路径与实际文件一致

**涉及文件**:
- `public/pwa-192x192.png` — 新建
- `public/pwa-512x512.png` — 新建

### 1.3 PWA 离线回退页

**文件**: `vite.config.ts`

- 在 workbox 配置中添加 `navigateFallback: '/index.html'`
- 清理不存在的 `includeAssets: ['favicon.ico']`，改为 `['icon.svg']`
- 移除无效的 Google Fonts runtime caching 配置

**涉及文件**:
- `vite.config.ts` — 修改 workbox 配置

### 1.4 apple-touch-icon 修复

**文件**: `index.html`

- 将 `<link rel="apple-touch-icon" href="/icon.svg" />` 改为引用 PNG
- 如暂不生成 PNG，移除该标签避免 404

**涉及文件**:
- `index.html` — 修改 link 标签

---

## Phase 2 — 无障碍优化（A11y 提升）

> 目标：Accessibility 81 → 95+

### 2.1 交互元素 ARIA 标签

为所有 icon-only 按钮添加 `aria-label`：

**涉及文件与位置**:
- `src/components/home/home-page.tsx` — 主题切换按钮、语言切换按钮
- `src/components/layout/tool-layout.tsx` — 返回按钮（`title` → `aria-label`）
- `src/components/shared/copy-button.tsx` — 添加 `aria-label` + `aria-live="polite"` 通知复制状态
- `src/tools/diff/diff-tool.tsx` — 跳转按钮添加 `aria-label`

### 2.2 文件拖放区键盘可访问

**文件**: `src/components/shared/tool-file-drop.tsx`

- 外层 `<div>` 添加 `role="button"`、`tabIndex={0}`
- 添加 `onKeyDown` 处理 Enter/Space 触发文件选择
- 添加 `aria-label` 描述操作

### 2.3 Segmented Control ARIA 角色

**文件**: `src/components/shared/tool-segmented-control.tsx`

- 容器添加 `role="tablist"`
- 每个按钮添加 `role="tab"`、`aria-selected`
- 添加左右箭头键导航

### 2.4 搜索框关联 label

**文件**: `src/components/home/home-page.tsx`

- 给搜索 `<input>` 添加 `aria-label`（使用已有的 placeholder 文案）

### 2.5 Favicon 回退无障碍

**文件**: `src/components/home/home-page.tsx`

- `ToolFavicon` 组件的回退 `<div>` 添加 `role="img"` + `aria-label`

### 2.6 `<html lang>` 动态更新

**文件**: `src/i18n/context.tsx` 或 `src/main.tsx`

- locale 切换时同步更新 `document.documentElement.lang`（`zh-CN` / `en`）

---

## Phase 3 — SEO 补全

> 目标：社交媒体分享有预览、搜索引擎完整覆盖

### 3.1 Open Graph + Twitter Card

**文件**: `index.html`

添加 meta 标签：
```
og:title, og:description, og:url, og:type, og:image
twitter:card, twitter:title, twitter:description, twitter:image
```

> 注：`og:image` 需要一张 1200x630 的预览图，暂时可用 logo 拼接

**涉及文件**:
- `index.html` — 添加 meta 标签
- `public/og-image.png` — 新建（1200x630 社交预览图）

### 3.2 robots.txt

**文件**: `public/robots.txt`（新建）

```
User-agent: *
Allow: /
Sitemap: https://purekit-app.vercel.app/sitemap.xml
```

### 3.3 sitemap.xml

**文件**: `public/sitemap.xml`（新建）

- 列出首页 + 所有 28+ 工具页面 URL
- 工具路径从 `src/tools/registry.ts` 的 `getTools()` 获取
- 可手动维护或写脚本生成

### 3.4 动态页面标题优化

**文件**: `src/components/layout/tool-layout.tsx`

- 已有动态 title 逻辑，确认所有工具的 `titleEn` / `title` 正确即可
- 此项当前已正常工作，仅需验证

---

## Phase 4 — 构建优化（包体积 + 加载性能）

> 目标：更好的缓存命中、更快的首屏加载

### 4.1 Vite manualChunks 拆包

**文件**: `vite.config.ts`

将重型依赖拆成独立 chunk，提高缓存命中率：

```
vendor-react    → react, react-dom, react-router-dom
vendor-editor   → @codemirror/*, @lezer/*
vendor-pdf      → pdf-lib, jspdf, pagedjs
vendor-mermaid  → mermaid + 子图
vendor-katex    → katex
vendor-hljs     → highlight.js
```

**涉及文件**:
- `vite.config.ts` — 添加 `build.rollupOptions.output.manualChunks`

### 4.2 清理无效代码

- 移除 `vite.config.ts` 中 Google Fonts runtime caching（项目未使用 Google Fonts）
- 移除 `src/components/preview-pane/preview-pane.tsx` 中无条件导入的 `highlight.js/styles/github.css`（仅在 Markdown 工具中需要）

**涉及文件**:
- `vite.config.ts` — 移除 dead config
- `src/components/preview-pane/preview-pane.tsx` — 条件化 highlight.js CSS 导入

### 4.3 PDF 合并工具 — 内联 SVG 替换为 Lucide 图标

**文件**: `src/tools/pdf-merge/pdf-merge-tool.tsx`

- 将 4 处内联 `<svg>` 替换为 Lucide 图标组件（GripVertical、X、Plus 等）
- 保持视觉一致性和 tree-shaking

### 4.4 Suspense 加载状态优化

**文件**: `src/app.tsx`

- `ToolLoading` 组件从单纯转圈改为带文字提示（"加载中..." / "Loading..."）
- 国际化加载文案

---

## Phase 5 — 代码质量 & 维护性

> 目标：减少重复代码、提升可维护性

### 5.1 样式去重

**问题**: preview.css / print.css / pdf-renderer.ts 三处重复相同的排版样式

**方案**:
- 提取公共排版样式到 `src/styles/typography.css`
- preview.css 和 print.css 通过 `@import` 引入
- pdf-renderer.ts 的内联 CSS 引入公共部分

**涉及文件**:
- `src/styles/typography.css` — 新建
- `src/styles/preview.css` — 精简
- `src/styles/print.css` — 精简
- `src/lib/pdf-renderer.ts` — 引用公共样式

### 5.2 PDF 合并错误处理

**文件**: `src/tools/pdf-merge/pdf-merge-tool.tsx`

- 空 catch 块改为 toast/提示，告知用户哪个文件解析失败

### 5.3 favicon 404 修复

**问题**: `aka.ms` 域名无法抓取 favicon，导致 `/favicons/aka.ms.png` 404

**方案**: 将 Windows Terminal URL 改为 `https://apps.microsoft.com/detail/9N0DX20HK701` 或手动下载其 favicon 放入 `public/favicons/`

---

## 实施时间表

| Phase | 预计耗时 | 优先级 |
|-------|----------|--------|
| Phase 1 — 稳定性修复 | 1-2 小时 | P0 |
| Phase 2 — 无障碍优化 | 1-2 小时 | P0 |
| Phase 3 — SEO 补全 | 30 分钟 | P1 |
| Phase 4 — 构建优化 | 1 小时 | P1 |
| Phase 5 — 代码质量 | 1 小时 | P2 |

**总计约 4-6 小时可完成全部优化。**
