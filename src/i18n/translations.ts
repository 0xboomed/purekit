type TranslationMap = Record<string, string>

export const translations: Record<string, TranslationMap> = {
  zh: {
    // Common
    'common.input': '输入',
    'common.output': '输出',
    'common.copy': '复制',
    'common.copied': '已复制',
    'common.clear': '清空',
    'common.example': '示例',
    'common.back': '返回首页',
    'common.file': '文件',
    'common.text': '文本',
    'common.clickToSelect': '点击选择文件',
    'common.processing': '计算中...',
    'common.notFound': '页面不存在',
    'common.freeOffline': '完全免费，无需安装，数据不上传',

    // Home
    'home.subtitle': '零安装 · 全离线 · 隐私安全的开发者工具箱',
    'home.search': '搜索工具...',

    // Categories
    'category.converter': '转换工具',
    'category.generator': '生成工具',
    'category.encoder': '编码工具',
    'category.document': '文档工具',
    'category.image': '图片工具',

    // JSON tool
    'json.format': '格式化',
    'json.minify': '压缩',
    'json.validate': '校验',
    'json.sortKeys': '排序键名',
    'json.indent': '缩进',
    'json.valid': '✓ JSON 格式正确',
    'json.inputPlaceholder': '粘贴 JSON 数据，如 {"key": "value"}',
    'json.outputPlaceholder': '结果将显示在这里',

    // Base64 tool
    'base64.encode': '编码 (Encode)',
    'base64.decode': '解码 (Decode)',
    'base64.urlSafe': 'URL 安全',
    'base64.inputPlaceholder': '输入要编码或解码的文本...',
    'base64.decodeError': '无法解码：输入不是有效的 Base64 字符串',

    // URL tool
    'url.encode': '编码',
    'url.decode': '解码',
    'url.parseParams': '解析参数',
    'url.jsonToQuery': 'JSON → Query',
    'url.paramsList': '参数列表',
    'url.inputPlaceholder': '输入 URL 或查询字符串...',
    'url.decodeError': '无法解码：输入不是有效的编码字符串',
    'url.parseError': '无法解析 URL',
    'url.jsonError': '输入必须是有效的 JSON 对象',

    // Timestamp tool
    'timestamp.currentTime': '当前时间',
    'timestamp.seconds': '秒 (s)',
    'timestamp.milliseconds': '毫秒 (ms)',
    'timestamp.now': '当前',
    'timestamp.toDate': '时间戳 → 日期',
    'timestamp.toTimestamp': '日期 → 时间戳',
    'timestamp.inputPlaceholder': '输入时间戳或日期字符串...',
    'timestamp.invalidTs': '请输入有效的数字时间戳',
    'timestamp.invalidTs2': '无效的时间戳',
    'timestamp.invalidDate': '无法解析日期，试试格式: 2024-01-01 或 2024-01-01T12:00:00',
    'timestamp.local': '本地时间',
    'timestamp.utc': 'UTC 时间',
    'timestamp.relative': '相对时间',
    'timestamp.secondsAgo': '秒前',
    'timestamp.secondsLater': '秒后',
    'timestamp.minutesAgo': '分钟前',
    'timestamp.minutesLater': '分钟后',
    'timestamp.hoursAgo': '小时前',
    'timestamp.hoursLater': '小时后',
    'timestamp.daysAgo': '天前',
    'timestamp.daysLater': '天后',

    // Regex tool
    'regex.testText': '测试文本',
    'regex.matches': '匹配结果',
    'regex.matchCount': '个匹配',
    'regex.inputPlaceholder': '输入正则表达式',
    'regex.testPlaceholder': '输入测试文本...',
    'regex.match': '匹配',
    'regex.position': '位置',
    'regex.groups': '捕获组',
    'regex.empty': '(empty)',

    // Regex presets
    'regex.presetEmail': '邮箱',
    'regex.presetPhone': '手机号',
    'regex.presetChinese': '中文字符',

    // Password tool
    'password.length': '密码长度',
    'password.charset': '字符集',
    'password.uppercase': '大写 A-Z',
    'password.lowercase': '小写 a-z',
    'password.numbers': '数字 0-9',
    'password.symbols': '符号 !@#',
    'password.exclude': '排除字符',
    'password.excludePlaceholder': '如: 0OlI1',
    'password.count': '生成数量',
    'password.entropy': '熵值',
    'password.bits': 'bits',
    'password.generate': '生成密码',

    // Hash tool
    'hash.compute': '计算哈希',
    'hash.computing': '计算中...',
    'hash.selectFile': '请选择文件',
    'hash.inputPlaceholder': '输入要计算哈希的文本...',
    'hash.fileInfo': '文件: {name}, {size}',

    // Color tool
    'color.formats': '格式输出',
    'color.contrastCheck': '对比度检查',
    'color.vsWhite': 'vs 白色',
    'color.vsBlack': 'vs 黑色',
    'color.sampleText': 'Aa 文本',

    // QRCode tool
    'qrcode.content': '内容',
    'qrcode.size': '尺寸 (px)',
    'qrcode.errorLevel': '容错等级',
    'qrcode.fgColor': '前景色',
    'qrcode.bgColor': '背景色',
    'qrcode.download': '下载 PNG',
    'qrcode.inputPlaceholder': '输入文本或 URL...',

    // Markdown tool
    'markdown.edit': '编辑',

    // Toolbar
    'toolbar.editor': '编辑',
    'toolbar.preview': '预览',
    'toolbar.split': '双栏',
    'toolbar.themeLight': '切换暗色主题',
    'toolbar.themeDark': '切换亮色主题',
    'toolbar.upload': '上传文件',
    'toolbar.pdfSettings': 'PDF 设置',
    'toolbar.exportPdf': '导出 PDF',
    'toolbar.exporting': '生成中...',

    // Status bar
    'status.lineCol': '行 {line}, 列 {col}',
    'status.autoSaved': '自动保存',
    'status.saved': '已保存',

    // Drop zone
    'dropzone.release': '释放文件以加载',
    'dropzone.support': '支持 .md / .markdown / .txt',

    // PDF settings
    'pdf.title': 'PDF 设置',
    'pdf.pageSize': '页面大小',
    'pdf.orientation': '方向',
    'pdf.portrait': '纵向',
    'pdf.landscape': '横向',
    'pdf.margins': '页边距 (mm)',
    'pdf.marginTop': '上',
    'pdf.marginBottom': '下',
    'pdf.marginLeft': '左',
    'pdf.marginRight': '右',
    'pdf.header': '页眉',
    'pdf.showHeader': '显示页眉',
    'pdf.headerHint': '自动提取第一个标题作为页眉',
    'pdf.footer': '页脚',
    'pdf.showFooter': '显示页脚',
    'pdf.showPageNumbers': '显示页码',
    'pdf.reset': '恢复默认',
    'pdf.preview': 'PDF 预览',
    'pdf.savePdf': '保存 PDF',
    'pdf.rendering': '正在渲染预览...',

    // UUID tool
    'uuid.generate': '生成',
    'uuid.version': '版本',
    'uuid.count': '数量',
    'uuid.uppercase': '大写',
    'uuid.noHyphens': '无连字符',
    'uuid.braces': '花括号',
    'uuid.descv1': '基于时间戳，有序但可能暴露生成时间',
    'uuid.descv4': '纯随机，最广泛使用的版本',
    'uuid.descv7': '毫秒时间戳 + 随机，有序且适合数据库索引',

    // API Key tool
    'apikey.generate': '生成',
    'apikey.prefix': '前缀',
    'apikey.length': '长度',
    'apikey.charset': '字符集',
    'apikey.count': '数量',
    'apikey.presets': '预设模板',
    'apikey.entropy': '熵值',
    'apikey.bits': 'bits',
    'apikey.charsetHex': 'Hex (0-9a-f)',
    'apikey.charsetBase62': 'Base62 (0-9a-zA-Z)',
    'apikey.charsetAlnum': '字母+数字 (a-zA-Z0-9)',

    // SEO
    'seo.title': '在线工具',
    'seo.defaultTitle': '开发者工具箱',
  },

  en: {
    // Common
    'common.input': 'Input',
    'common.output': 'Output',
    'common.copy': 'Copy',
    'common.copied': 'Copied',
    'common.clear': 'Clear',
    'common.example': 'Example',
    'common.back': 'Back',
    'common.file': 'File',
    'common.text': 'Text',
    'common.clickToSelect': 'Click to select a file',
    'common.processing': 'Processing...',
    'common.notFound': 'Page not found',
    'common.freeOffline': 'Free, no installation, data stays on your device',

    // Home
    'home.subtitle': 'Zero-install · Fully offline · Privacy-first developer toolkit',
    'home.search': 'Search tools...',

    // Categories
    'category.converter': 'Converters',
    'category.generator': 'Generators',
    'category.encoder': 'Encoders',
    'category.document': 'Documents',
    'category.image': 'Image',

    // JSON tool
    'json.format': 'Format',
    'json.minify': 'Minify',
    'json.validate': 'Validate',
    'json.sortKeys': 'Sort Keys',
    'json.indent': 'Indent',
    'json.valid': '✓ Valid JSON',
    'json.inputPlaceholder': 'Paste JSON here, e.g. {"key": "value"}',
    'json.outputPlaceholder': 'Output will appear here',

    // Base64 tool
    'base64.encode': 'Encode',
    'base64.decode': 'Decode',
    'base64.urlSafe': 'URL Safe',
    'base64.inputPlaceholder': 'Enter text to encode or decode...',
    'base64.decodeError': 'Cannot decode: not a valid Base64 string',

    // URL tool
    'url.encode': 'Encode',
    'url.decode': 'Decode',
    'url.parseParams': 'Parse Params',
    'url.jsonToQuery': 'JSON → Query',
    'url.paramsList': 'Parameters',
    'url.inputPlaceholder': 'Enter URL or query string...',
    'url.decodeError': 'Cannot decode: invalid encoded string',
    'url.parseError': 'Cannot parse URL',
    'url.jsonError': 'Input must be a valid JSON object',

    // Timestamp tool
    'timestamp.currentTime': 'Current time',
    'timestamp.seconds': 'Sec (s)',
    'timestamp.milliseconds': 'Milli (ms)',
    'timestamp.now': 'Now',
    'timestamp.toDate': 'Timestamp → Date',
    'timestamp.toTimestamp': 'Date → Timestamp',
    'timestamp.inputPlaceholder': 'Enter timestamp or date string...',
    'timestamp.invalidTs': 'Please enter a valid numeric timestamp',
    'timestamp.invalidTs2': 'Invalid timestamp',
    'timestamp.invalidDate': 'Cannot parse date. Try: 2024-01-01 or 2024-01-01T12:00:00',
    'timestamp.local': 'Local',
    'timestamp.utc': 'UTC',
    'timestamp.relative': 'Relative',
    'timestamp.secondsAgo': ' sec ago',
    'timestamp.secondsLater': ' sec later',
    'timestamp.minutesAgo': ' min ago',
    'timestamp.minutesLater': ' min later',
    'timestamp.hoursAgo': ' hr ago',
    'timestamp.hoursLater': ' hr later',
    'timestamp.daysAgo': ' day ago',
    'timestamp.daysLater': ' day later',

    // Regex tool
    'regex.testText': 'Test String',
    'regex.matches': 'Matches',
    'regex.matchCount': ' matches',
    'regex.inputPlaceholder': 'Enter regex pattern',
    'regex.testPlaceholder': 'Enter test string...',
    'regex.match': 'Match',
    'regex.position': 'Pos',
    'regex.groups': 'Groups',
    'regex.empty': '(empty)',

    // Regex presets
    'regex.presetEmail': 'Email',
    'regex.presetPhone': 'Phone',
    'regex.presetChinese': 'Chinese',

    // Password tool
    'password.length': 'Password Length',
    'password.charset': 'Character Set',
    'password.uppercase': 'Upper A-Z',
    'password.lowercase': 'Lower a-z',
    'password.numbers': 'Digits 0-9',
    'password.symbols': 'Symbols !@#',
    'password.exclude': 'Exclude Chars',
    'password.excludePlaceholder': 'e.g. 0OlI1',
    'password.count': 'Count',
    'password.entropy': 'Entropy',
    'password.bits': 'bits',
    'password.generate': 'Generate Password',

    // Hash tool
    'hash.compute': 'Compute Hash',
    'hash.computing': 'Computing...',
    'hash.selectFile': 'Please select a file',
    'hash.inputPlaceholder': 'Enter text to hash...',
    'hash.fileInfo': 'File: {name}, {size}',

    // Color tool
    'color.formats': 'Format Output',
    'color.contrastCheck': 'Contrast Check',
    'color.vsWhite': 'vs White',
    'color.vsBlack': 'vs Black',
    'color.sampleText': 'Aa Text',

    // QRCode tool
    'qrcode.content': 'Content',
    'qrcode.size': 'Size (px)',
    'qrcode.errorLevel': 'Error Correction',
    'qrcode.fgColor': 'Foreground',
    'qrcode.bgColor': 'Background',
    'qrcode.download': 'Download PNG',
    'qrcode.inputPlaceholder': 'Enter text or URL...',

    // Markdown tool
    'markdown.edit': 'Edit',

    // Toolbar
    'toolbar.editor': 'Edit',
    'toolbar.preview': 'Preview',
    'toolbar.split': 'Split',
    'toolbar.themeLight': 'Switch to dark theme',
    'toolbar.themeDark': 'Switch to light theme',
    'toolbar.upload': 'Upload file',
    'toolbar.pdfSettings': 'PDF Settings',
    'toolbar.exportPdf': 'Export PDF',
    'toolbar.exporting': 'Exporting...',

    // Status bar
    'status.lineCol': 'Ln {line}, Col {col}',
    'status.autoSaved': 'Auto-saved',
    'status.saved': 'Saved',

    // Drop zone
    'dropzone.release': 'Drop file to load',
    'dropzone.support': 'Supports .md / .markdown / .txt',

    // PDF settings
    'pdf.title': 'PDF Settings',
    'pdf.pageSize': 'Page Size',
    'pdf.orientation': 'Orientation',
    'pdf.portrait': 'Portrait',
    'pdf.landscape': 'Landscape',
    'pdf.margins': 'Margins (mm)',
    'pdf.marginTop': 'Top',
    'pdf.marginBottom': 'Bottom',
    'pdf.marginLeft': 'Left',
    'pdf.marginRight': 'Right',
    'pdf.header': 'Header',
    'pdf.showHeader': 'Show header',
    'pdf.headerHint': 'Auto-extract first heading as header',
    'pdf.footer': 'Footer',
    'pdf.showFooter': 'Show footer',
    'pdf.showPageNumbers': 'Show page numbers',
    'pdf.reset': 'Reset Defaults',
    'pdf.preview': 'PDF Preview',
    'pdf.savePdf': 'Save PDF',
    'pdf.rendering': 'Rendering preview...',

    // UUID tool
    'uuid.generate': 'Generate',
    'uuid.version': 'Version',
    'uuid.count': 'Count',
    'uuid.uppercase': 'Uppercase',
    'uuid.noHyphens': 'No Hyphens',
    'uuid.braces': 'Braces',
    'uuid.descv1': 'Timestamp-based, ordered but may leak generation time',
    'uuid.descv4': 'Fully random, the most widely used version',
    'uuid.descv7': 'Unix ms timestamp + random, ordered and index-friendly',

    // API Key tool
    'apikey.generate': 'Generate',
    'apikey.prefix': 'Prefix',
    'apikey.length': 'Length',
    'apikey.charset': 'Charset',
    'apikey.count': 'Count',
    'apikey.presets': 'Presets',
    'apikey.entropy': 'Entropy',
    'apikey.bits': 'bits',
    'apikey.charsetHex': 'Hex (0-9a-f)',
    'apikey.charsetBase62': 'Base62 (0-9a-zA-Z)',
    'apikey.charsetAlnum': 'Alphanumeric (a-zA-Z0-9)',

    // SEO
    'seo.title': 'Online Tool',
    'seo.defaultTitle': 'Developer Toolkit',
  },
}
