# PureKit

零安装、全离线、隐私安全的综合工具箱。PDF 合并拆分、图片压缩裁剪、JSON 格式化、Base64 编解码等 30+ 工具，打开浏览器即用。

**[在线使用 → purekit-app.vercel.app](https://purekit-app.vercel.app)**

## 特性

- **零安装** — 打开浏览器即用，无需下载安装任何软件
- **全离线** — 所有处理在本地完成，文件不离开你的设备
- **隐私安全** — 零网络请求处理用户内容，无追踪无分析
- **中英双语** — 完整的国际化支持
- **PWA** — 可安装到桌面，支持离线使用

## 工具一览

| 分类 | 工具 |
|------|------|
| 文本处理 | JSON 格式化、YAML 格式化、SQL 格式化、Markdown 编辑器、Diff 对比、正则测试、Lorem Ipsum 生成 |
| 编码转换 | Base64 编解码、URL 编解码、JWT 解码、进制转换 |
| 生成器 | UUID 生成、密码生成、哈希计算、Cron 表达式、时间戳转换、API Key 生成 |
| PDF 工具 | PDF 合并、PDF 拆分、图片转 PDF |
| 图片工具 | 图片压缩、社交图片裁剪、图片格式转换、SVG 优化、二维码生成 |
| 开发工具 | HTTP 状态码、chmod 计算器、颜色选择器、API 调试 |

## 技术栈

- **框架**: Vite 6 + React 19 + TypeScript
- **样式**: Tailwind CSS v4
- **状态管理**: Zustand
- **部署**: Vercel

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查 + 生产构建
npm run build
```

## License

[MIT](./LICENSE)
