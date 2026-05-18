# DevKit 需求规格书

> 版本：V1.0 Draft
> 日期：2026-05-16
> 状态：待评审

---

## 一、产品定位

**一句话描述**：面向开发者的零安装、完全离线、隐私安全的在线工具箱。

**核心价值主张**：
- 打开浏览器即用，无需注册、无需安装
- 所有处理在本地完成，文件不离开用户设备
- PWA 安装后完全离线可用
- 零广告、零追踪、零数据上传

**市场差异化**：

```
                 我们的定位
                   ★
    ┌──────────────────────────────────┐
    │  React 生态 × 离线优先 × 隐私安全  │
    └──────────────────────────────────┘
    it-tools：Vue 生态，无中文优化
    BeJSON：老旧技术栈，有广告，无离线
    tool.lu：功能全但体验陈旧
    CyberChef：仅安全领域，不开箱即用
```

**竞争数据**：
- "markdown to pdf" 月搜索量 2-4 万，竞争度**低**（机会窗口）
- "json formatter" 月搜索量极高，竞争度高（需要差异化）
- BeJSON 日活 136 万，证明中文开发者工具市场需求巨大
- WordCounter 单工具年入 $640 万，证明精准切入 + 对的变现模式可行

---

## 二、工具矩阵

### 工具分级原则

- **M（Must）**：首版必须包含，高频刚需
- **S（Should）**：第二批次，扩充覆盖面
- **N（Nice）**：后续迭代，差异化竞争

### 第一梯队：M — 首版上线（10 个工具）

| # | 工具 | URL 路径 | 核心功能 | 依赖库 |
|---|------|----------|----------|--------|
| 1 | Markdown 编辑器 | `/markdown` | CM6 编辑 + 实时预览 + PDF 导出 | 已完成 |
| 2 | JSON 格式化 | `/json` | 格式化 / 压缩 / 校验 / JSON Path 查询 | 无 |
| 3 | Base64 编解码 | `/base64` | 文本↔Base64、文件↔Base64、URL 安全模式 | 无 |
| 4 | 时间戳转换 | `/timestamp` | Unix 时间戳↔可读时间、时区切换、差值计算 | 无 |
| 5 | 正则测试器 | `/regex` | 实时匹配高亮、捕获组展示、常用正则库 | 无 |
| 6 | 二维码生成 | `/qrcode` | 文本/URL→二维码、自定义尺寸/颜色/容错 | qrcode |
| 7 | 密码生成器 | `/password` | 长度/字符集/排除字符、批量生成、熵值显示 | 无 |
| 8 | URL 编解码 | `/url` | encode/decode、参数解析、Query↔JSON | 无 |
| 9 | 哈希计算 | `/hash` | MD5/SHA-1/SHA-256/SHA-512 文本/文件哈希 | 无（Web Crypto API） |
| 10 | 颜色转换 | `/color` | HEX↔RGB↔HSL↔CMYK、取色器、对比度检查 | 无 |

### 第二梯队：S — 第二版补充（6 个工具）

| # | 工具 | URL 路径 | 核心功能 |
|---|------|----------|----------|
| 11 | 图片压缩 | `/image-compress` | 拖拽压缩、质量/尺寸调节、格式转换 |
| 12 | 文本 Diff | `/diff` | 双栏对比、行级高亮、统一/分裂视图 |
| 13 | 字数统计 | `/word-count` | 中英文字数/词数/行数、词频分析、阅读时长 |
| 14 | JWT 解析 | `/jwt` | Header/Payload/Signature 解码展示 |
| 15 | UUID 生成 | `/uuid` | v1/v4 生成、批量、大/小写 |
| 16 | CSS 渐变生成器 | `/gradient` | 可视化拖拽、CSS 代码输出、预设模板 |

### 第三梯队：N — 后续迭代

| 工具 | 说明 |
|------|------|
| 图片格式转换 | PNG↔JPG↔WebP↔AVIF |
| SVG 预览/优化 | SVG 源码查看 + SVGO 压缩 |
| 数字进制转换 | 二/八/十/十六进制互转 |
| Markdown 表格生成器 | 可视化编辑表格 → Markdown 语法 |
| Cron 表达式解析 | 可视化编辑 + 下次执行时间预览 |
| 短链接生成 | 纯前端哈希方案（无服务器） |
| Unicode 查询 | 字符↔码点、Emoji 搜索 |
| 代码截图 | 代码 → 类 Carbon 美化截图 |

---

## 三、技术架构

### 整体架构

```
┌─────────────────────────────────────────────────────┐
│                    Vite 6 + React 19                 │
├─────────────────────────────────────────────────────┤
│  React Router (SPA 路由)                             │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┐        │
│  │/json │/regex│/hash │/qr   │/md   │/url  │...     │
│  │懒加载 │懒加载│懒加载│懒加载│懒加载│懒加载│        │
│  └──────┴──────┴──────┴──────┴──────┴──────┘        │
├─────────────────────────────────────────────────────┤
│  共享层                                               │
│  ┌────────────┬─────────────┬──────────────┐        │
│  │ 主题系统    │ 布局框架     │ 工具注册表     │        │
│  │ 亮/暗切换   │ Header      │ defineTool()  │        │
│  │ Tailwind v4│ Sidebar     │ 分类/搜索/收藏 │        │
│  └────────────┴─────────────┴──────────────┘        │
├─────────────────────────────────────────────────────┤
│  Zustand (状态管理 + localStorage 持久化)              │
├─────────────────────────────────────────────────────┤
│  Service Worker (vite-plugin-pwa)                    │
│  完全离线可用                                          │
└─────────────────────────────────────────────────────┘
```

### 技术栈

| 类别 | 选择 | 说明 |
|------|------|------|
| 构建 | Vite 6 | 已在用 |
| 框架 | React 19 + TypeScript 5.7 | 已在用 |
| 路由 | React Router v7 | SPA 路由，每个工具懒加载 |
| CSS | Tailwind CSS v4 | 已在用 |
| 状态 | Zustand v5 | 已在用，slices 模式 |
| 图标 | Lucide React | 已在用 |
| 离线 | vite-plugin-pwa | Service Worker 缓存 |
| 重处理 | Web Workers | 图片压缩等不阻塞 UI |
| 分析 | 无 | 零追踪 |

### 工具注册机制（参考 it-tools）

```ts
// src/tools/registry.ts
interface ToolMeta {
  name: string           // 显示名称
  path: string           // URL 路径
  description: string    // 一句话描述
  icon: LucideIcon       // 图标
  category: Category     // 分类
  keywords: string[]     // 搜索关键词 + SEO
  component: () => Promise<Component>  // 懒加载
}

function defineTool(meta: ToolMeta): ToolMeta

// src/tools/json/index.ts
export default defineTool({
  name: 'JSON 格式化',
  path: '/json',
  description: '格式化、压缩、校验 JSON 数据',
  icon: Braces,
  category: 'converter',
  keywords: ['json', 'format', 'prettify', 'minify', 'validate'],
  component: () => import('./json-tool'),
})
```

### 文件结构

```
src/
  main.tsx
  app.tsx
  index.css
  tools/                        # 每个工具一个文件夹
    registry.ts                 # defineTool + 工具注册表
    categories.ts               # 分类定义
    json/
      index.ts                  # 工具注册元数据
      json-tool.tsx             # 工具 UI 组件
    regex/
      index.ts
      regex-tool.tsx
    markdown/
      index.ts
      components/               # 从现有 components/ 迁移
        editor-pane/
        preview-pane/
        ...
    ...
  shared/                       # 跨工具共享
    components/
      tool-layout.tsx           # 统一工具页面布局
      copy-button.tsx
      file-dropzone.tsx
      text-input.tsx
      text-output.tsx
    hooks/
      use-debounce.ts
      use-clipboard.ts
    stores/
      use-app-store.ts          # 全局状态（主题、收藏）
  styles/
    preview.css
    print.css
    tool-common.css             # 工具共享样式
```

---

## 四、用户界面

### 首页 — 工具网格

```
┌──────────────────────────────────────────────────────────┐
│  DevKit          🔍 搜索工具...          [☀️] [收藏]      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ── 转换工具 ──────────────────────────────────────────  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ { }     │ │ </>     │ │ Aa↔B64  │ │ 🔗      │       │
│  │JSON格式 │ │ 正则测试│ │ Base64  │ │URL编码   │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                          │
│  ── 生成工具 ──────────────────────────────────────────  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                    │
│  │ 🔲      │ │ 🔑      │ │ #       │                    │
│  │ 二维码   │ │ 密码生成│ │ 颜色转换 │                    │
│  └─────────┘ └─────────┘ └─────────┘                    │
│                                                          │
│  ── 编码工具 ──────────────────────────────────────────  │
│  ┌─────────┐ ┌─────────┐                                │
│  │ ⏱       │ │ 📝      │                                │
│  │ 时间戳   │ │ Hash    │                                │
│  └─────────┘ └─────────┘                                │
│                                                          │
│  ── 文档工具 ──────────────────────────────────────────  │
│  ┌─────────────────────────────────────┐                 │
│  │ 📄  Markdown 编辑器 (→ PDF)          │                 │
│  └─────────────────────────────────────┘                 │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  🔒 所有处理在本地完成 · 零数据上传 · 完全离线可用          │
└──────────────────────────────────────────────────────────┘
```

### 工具页布局

```
┌──────────────────────────────────────────────────────────┐
│  ← DevKit    JSON 格式化                    [☀️] [☆收藏] │
├──────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐  │
│  │  输入                          [粘贴] [示例] [清空] │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  { "name": "devkit" }                        │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  操作  [格式化] [压缩] [校验]                        │  │
│  │                                                    │  │
│  │  输出                          [复制] [下载]        │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  {                                          │  │  │
│  │  │    "name": "devkit"                          │  │  │
│  │  │  }                                          │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### 响应式策略

- **桌面端 ≥1024px**：网格首页，工具页全功能
- **平板 768-1023px**：2 列网格，工具页自适应
- **手机 <768px**：1 列网格，工具页上下排列

---

## 五、变现策略

### 阶段一：流量积累期（0-12 个月）

```
目标：建立流量和 SEO 权重
收入：$0
投入：开发时间 + 域名费用（~¥100/年）
```

- 全部工具免费使用
- 零广告（保持干净体验，建立口碑）
- GitHub 开源，吸引 Star 和外链
- Product Hunt 发布（SEO 反链价值 > 当天流量）

### 阶段二：收入验证期（12-18 个月）

```
目标：验证变现能力
预期：$500-2000/月
```

| 方式 | 预期收入 | 实施难度 |
|------|---------|---------|
| 联盟营销 | $200-1000/月 | 低（工具页底部推荐相关产品） |
| Carbon/EthicalAds | $100-500/月 | 中（需申请，需月访问 10K+） |
| GitHub Sponsors | $50-200/月 | 低 |

### 阶段三：规模变现期（18 个月+）

```
目标：可持续收入
预期：$2000-10000+/月
```

| 方式 | 预期收入 | 前提条件 |
|------|---------|---------|
| 联盟营销（主力） | $1000-5000/月 | 月访问 100K+ |
| 高级功能（Pro） | $500-3000/月 | 批量操作、API 调用、历史记录 |
| API 服务 | $500-2000/月 | 需要服务器，B 端用户 |

### 不做的变现方式

- **不投放 Google AdSense** — 开发者工具站放低质广告损害信任
- **不做订阅制** — 工具站不是高频 SaaS，用户反感月扣费
- **不做用户账号** — 纯前端工具强制登录是负体验
- **不做付费墙** — 工具基础功能永远免费

---

## 六、SEO 策略

### URL 设计

```
域名：devkit.dev / devkit.tools / 工具箱.dev
结构：/{tool-name}
示例：/json、/regex、/markdown-to-pdf、/timestamp

规则：
- 简短，无 /tools/ 前缀
- 使用英文关键词（SEO 全球流量）
- 每个工具页独立 title + description + JSON-LD
```

### 每个工具页 SEO 元素

```html
<title>JSON 格式化 - 在线 JSON 工具 | DevKit</title>
<meta name="description" content="在线 JSON 格式化、压缩、校验工具。完全免费，无需安装，数据不上传。">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "JSON Formatter",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0" }
}
</script>
```

### 流量增长时间线

| 时间 | 预期月访问 | 关键动作 |
|------|-----------|---------|
| 1-3 月 | 100-500 | GitHub 开源、Product Hunt 发布 |
| 3-6 月 | 1K-5K | 长尾关键词开始排名 |
| 6-12 月 | 5K-50K | 内容营销（博客）、Reddit/V2EX 推荐 |
| 12-18 月 | 50K-100K | SEO 权重积累、品牌搜索增加 |

---

## 七、非功能需求

| 维度 | 指标 |
|------|------|
| 首屏加载 | < 1.5s（首页），每个工具 < 2s |
| 初始包体积 | < 300KB gzip（首页 + 布局） |
| 工具包体积 | 每个工具 < 100KB gzip（按需加载） |
| 浏览器兼容 | Chrome 90+、Firefox 90+、Safari 15+、Edge 90+ |
| 离线 | Service Worker 缓存后完全离线 |
| 安全 | 零网络请求处理用户数据 |
| 隐私 | 零追踪、零分析、零第三方资源 |
| PWA | 可安装到桌面/手机 |

---

## 八、开发路线图

### Phase 0 — 已完成

- [x] Printdown 基础研究（竞品分析、技术选型）
- [x] Phase 1：Markdown 编辑器 + 实时预览 + 双栏布局
- [x] Phase 2：PDF 导出（iframe + window.print）

### Phase 1 — 工具站架构重构（1 周）

- [ ] 引入 React Router，SPA 路由
- [ ] 工具注册系统（defineTool + 分类 + 搜索）
- [ ] 首页工具网格布局
- [ ] 工具页通用布局（ToolLayout 组件）
- [ ] 迁移现有 Markdown 工具到 `/markdown` 路由
- [ ] 404 页面

### Phase 2 — 第一批工具（2 周）

- [ ] JSON 格式化（`/json`）
- [ ] Base64 编解码（`/base64`）
- [ ] 时间戳转换（`/timestamp`）
- [ ] 正则测试器（`/regex`）
- [ ] 二维码生成（`/qrcode`）
- [ ] 密码生成器（`/password`）
- [ ] URL 编解码（`/url`）
- [ ] 哈希计算（`/hash`）
- [ ] 颜色转换（`/color`）

### Phase 3 — PWA + SEO + 上线（1 周）

- [ ] vite-plugin-pwa 集成
- [ ] 每个工具页独立 SEO 元数据
- [ ] Sitemap 生成
- [ ] 域名 + GitHub Pages / Cloudflare Pages 部署
- [ ] GitHub 开源发布
- [ ] Product Hunt 发布

### Phase 4 — 第二批工具 + 变现验证

- [ ] 图片压缩（`/image-compress`）
- [ ] 文本 Diff（`/diff`）
- [ ] 字数统计（`/word-count`）
- [ ] JWT 解析（`/jwt`）
- [ ] UUID 生成（`/uuid`）
- [ ] CSS 渐变生成器（`/gradient`）
- [ ] 联盟营销接入
- [ ] Carbon/EthicalAds 申请

---

## 九、成功指标

| 指标 | 3 个月目标 | 12 个月目标 |
|------|-----------|------------|
| GitHub Star | > 500 | > 2000 |
| 月访问量 | > 5K | > 50K |
| 工具数量 | 10 | 16+ |
| 月收入 | $0 | > $500 |
| Lighthouse 分数 | > 95 | > 95 |
| 离线可用率 | 100% | 100% |

---

## 附录

- [竞品分析详细报告](./01-竞品分析.md)
- [技术选型详细报告](./02-技术选型.md)
- [用户需求分析详细报告](./03-用户需求分析.md)
- [Printdown 原始需求规格书](./04-需求规格书.md)

### 调研数据来源

- [SimilarWeb - TinyWow](https://www.similarweb.com/website/tinywow.com/)：月访问 270 万
- [SimilarWeb - BeJSON](https://www.similarweb.com/website/bejson.com/)：全球排名 ~#8254
- [BoringCashCow - WordCounter $6.4M/年](https://boringcashcow.com/view/free-word-counting-website-generates-64-million-a-year)
- [GitHub - it-tools](https://github.com/CorentinTh/it-tools)：23K+ Stars，Vue 3 工具注册模式
- [GitHub - transform](https://github.com/ritz078/transform)：9K+ Stars，Web Worker 架构
- [GitHub - MikuTools](https://github.com/Ice-Hazymoon/MikuTools)：4K+ Stars，中文工具站
- [EthicalAds CPM](https://www.ethicalads.io/publishers/calculator/)：$2.25-2.75/千次
- [TinyPNG API Pricing](https://tinify.com/pricing/api)：$0.009/张
- [Smallpdf 统计](https://smallpdf.com/pdf-statistics)：17 亿用户，$20M+/年
