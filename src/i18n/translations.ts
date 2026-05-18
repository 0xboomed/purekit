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
    'recommend.title': '精选推荐',

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
    'qrcode.style': '样式',
    'qrcode.size': '尺寸 (px)',
    'qrcode.errorLevel': '容错等级',
    'qrcode.fgColor': '前景色',
    'qrcode.solid': '纯色',
    'qrcode.bgColor': '背景色',
    'qrcode.download': '下载 PNG',
    'qrcode.inputPlaceholder': '输入文本或 URL...',

    // QRCode dot styles
    'qrcode.dotStyle': '点样式',
    'qrcode.dotSquare': '方形',
    'qrcode.dotRounded': '圆角',
    'qrcode.dotCircle': '圆形',
    'qrcode.dotDiamond': '菱形',

    // QRCode export
    'qrcode.formatPng': 'PNG',
    'qrcode.formatSvg': 'SVG',
    'qrcode.copy': '复制图片',
    'qrcode.copiedImage': '已复制',

    // QRCode error
    'qrcode.generationError': '生成失败',
    'qrcode.dataTooLong': '数据过长，请减少内容或降低容错等级',

    // QRCode capacity
    'qrcode.capacity': '容量',

    // QRCode templates
    'qrcode.template': '模板',
    'qrcode.templateText': '文本',
    'qrcode.templateUrl': 'URL',
    'qrcode.templateWifi': 'WiFi',
    'qrcode.templateVcard': '名片',
    'qrcode.templatePhone': '电话',
    'qrcode.templateEmail': '邮件',

    // WiFi template
    'qrcode.wifiSsid': '网络名称 (SSID)',
    'qrcode.wifiPassword': '密码',
    'qrcode.wifiEncryption': '加密方式',
    'qrcode.wifiWpa': 'WPA/WPA2',
    'qrcode.wifiWep': 'WEP',
    'qrcode.wifiNone': '无',

    // vCard template
    'qrcode.vcardName': '姓名',
    'qrcode.vcardPhone': '电话',
    'qrcode.vcardEmail': '邮箱',
    'qrcode.vcardOrg': '公司',

    // Phone template
    'qrcode.phoneNumber': '电话号码',
    'qrcode.phonePlaceholder': '+86 138 0000 0000',

    // Email template
    'qrcode.emailTo': '收件人',
    'qrcode.emailSubject': '主题',
    'qrcode.emailBody': '正文',

    // URL template
    'qrcode.urlPlaceholder': 'example.com',

    // Logo
    'qrcode.logo': 'Logo',
    'qrcode.logoUpload': '上传 Logo',
    'qrcode.logoRemove': '移除',
    'qrcode.logoAutoLevel': '已自动切换为高容错',
    'qrcode.logoHint': 'Logo 占用约 20% 面积',

    // SQL Formatter tool
    'sql.format': '格式化',
    'sql.minify': '压缩',
    'sql.dialect': '方言',
    'sql.indent': '缩进',
    'sql.case': '大小写',
    'sql.preserve': '保持',
    'sql.inputPlaceholder': '粘贴 SQL 语句...',
    'sql.outputPlaceholder': '格式化结果将显示在这里',

    // chmod Calculator tool
    'chmod.octal': '八进制',
    'chmod.symbolic': '符号表示',
    'chmod.octalInput': '输入八进制',
    'chmod.permissions': '权限设置',
    'chmod.presets': '常用预设',
    'chmod.value': '值',
    'chmod.perm_read': '读',
    'chmod.perm_write': '写',
    'chmod.perm_execute': '执行',
    'chmod.role_owner': '所有者',
    'chmod.role_group': '用户组',
    'chmod.role_other': '其他人',

    // YAML Formatter tool
    'yaml.format': '格式化',
    'yaml.minify': '压缩',
    'yaml.validate': '校验',
    'yaml.toJson': '转 JSON',
    'yaml.fromJson': 'JSON 转 YAML',
    'yaml.indent': '缩进',
    'yaml.valid': '✓ YAML 格式正确',
    'yaml.inputPlaceholder': '粘贴 YAML 数据...',
    'yaml.outputPlaceholder': '结果将显示在这里',

    // Base Converter tool
    'baseconverter.binary': '二进制 (BIN)',
    'baseconverter.octal': '八进制 (OCT)',
    'baseconverter.decimal': '十进制 (DEC)',
    'baseconverter.hexadecimal': '十六进制 (HEX)',
    'baseconverter.ascii': 'ASCII 字符',
    'baseconverter.placeholder': '输入数值...',
    'baseconverter.invalidNumber': '无效数值',

    // JWT Decoder tool
    'jwt.header': '头部',
    'jwt.payload': '载荷',
    'jwt.signature': '签名',
    'jwt.expires': '过期时间',
    'jwt.expired': '已过期',
    'jwt.valid': '有效',
    'jwt.daysLeft': '天后过期',
    'jwt.inputPlaceholder': '粘贴 JWT Token...',
    'jwt.invalidToken': '无效的 JWT 格式',

    // HTTP Status tool
    'httpstatus.search': '搜索状态码...',
    'httpstatus.all': '全部',
    'httpstatus.informational': '信息',
    'httpstatus.success': '成功',
    'httpstatus.redirection': '重定向',
    'httpstatus.clientError': '客户端错误',
    'httpstatus.serverError': '服务端错误',
    'httpstatus.copied': '已复制',

    // URL Parser tool
    'urlparser.protocol': '协议',
    'urlparser.hostname': '主机名',
    'urlparser.port': '端口',
    'urlparser.pathname': '路径',
    'urlparser.hash': '哈希',
    'urlparser.queryParams': '查询参数',
    'urlparser.key': '键',
    'urlparser.value': '值',
    'urlparser.noParams': '无查询参数',
    'urlparser.inputPlaceholder': '输入 URL...',
    'urlparser.invalidUrl': '无效的 URL 格式',

    // Lorem Ipsum tool
    'lorem.settings': '设置',
    'lorem.type': '类型',
    'lorem.paragraphs': '段落',
    'lorem.sentences': '句子',
    'lorem.words': '单词',
    'lorem.count': '数量',
    'lorem.language': '语言',
    'lorem.chinese': '中文',
    'lorem.english': 'English',
    'lorem.generate': '生成',

    // Cron
    'cron.settings': '设置',
    'cron.expression': 'Cron 表达式',
    'cron.presets': '预设',
    'cron.preset_everyMinute': '每分钟',
    'cron.preset_every5Minutes': '每 5 分钟',
    'cron.preset_everyHour': '每小时',
    'cron.preset_every2Hours': '每 2 小时',
    'cron.preset_everyDay': '每天',
    'cron.preset_everyWeek': '每周',
    'cron.preset_everyMonth': '每月',
    'cron.preset_everyYear': '每年',
    'cron.result': '解析结果',
    'cron.description': '描述',
    'cron.nextExecutions': '接下来 5 次执行',
    'cron.enterExpression': '输入 Cron 表达式查看解析结果',

    // Diff
    'diff.original': '原始文本',
    'diff.modified': '修改文本',
    'diff.originalPlaceholder': '粘贴原始文本...',
    'diff.modifiedPlaceholder': '粘贴修改后的文本...',
    'diff.compare': '对比',
    'diff.result': '对比结果',
    'diff.unchanged': '行未变',
    'diff.noDifference': '两段文本完全相同，没有差异',
    'diff.swap': '交换',
    'diff.edit': '编辑',
    'diff.lines': '行',

    // Image
    'image.settings': '设置',
    'image.dropLabel': '点击或拖拽上传图片',
    'image.originalSize': '原始尺寸',
    'image.format': '输出格式',
    'image.quality': '质量',
    'image.scale': '缩放',
    'image.convert': '转换',
    'image.preview': '预览',
    'image.outputSize': '输出大小',
    'image.compression': '压缩率',
    'image.download': '下载',
    'image.noPreview': '上传图片并转换后预览',

    // SVG
    'svg.optimize': '压缩',
    'svg.inputPlaceholder': '粘贴 SVG 代码...',
    'svg.outputPlaceholder': '压缩后的 SVG 将显示在这里...',
    'svg.original': '原始大小',
    'svg.optimized': '压缩后',

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
    'recommend.title': 'Recommended Tools',

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
    'qrcode.style': 'Style',
    'qrcode.size': 'Size (px)',
    'qrcode.errorLevel': 'Error Correction',
    'qrcode.fgColor': 'Foreground',
    'qrcode.solid': 'Solid',
    'qrcode.bgColor': 'Background',
    'qrcode.download': 'Download PNG',
    'qrcode.inputPlaceholder': 'Enter text or URL...',

    // QRCode dot styles
    'qrcode.dotStyle': 'Dot Style',
    'qrcode.dotSquare': 'Square',
    'qrcode.dotRounded': 'Rounded',
    'qrcode.dotCircle': 'Circle',
    'qrcode.dotDiamond': 'Diamond',

    // QRCode export
    'qrcode.formatPng': 'PNG',
    'qrcode.formatSvg': 'SVG',
    'qrcode.copy': 'Copy Image',
    'qrcode.copiedImage': 'Copied',

    // QRCode error
    'qrcode.generationError': 'Generation Failed',
    'qrcode.dataTooLong': 'Data too long, reduce content or lower error correction',

    // QRCode capacity
    'qrcode.capacity': 'Capacity',

    // QRCode templates
    'qrcode.template': 'Template',
    'qrcode.templateText': 'Text',
    'qrcode.templateUrl': 'URL',
    'qrcode.templateWifi': 'WiFi',
    'qrcode.templateVcard': 'Contact Card',
    'qrcode.templatePhone': 'Phone',
    'qrcode.templateEmail': 'Email',

    // WiFi template
    'qrcode.wifiSsid': 'Network Name (SSID)',
    'qrcode.wifiPassword': 'Password',
    'qrcode.wifiEncryption': 'Encryption',
    'qrcode.wifiWpa': 'WPA/WPA2',
    'qrcode.wifiWep': 'WEP',
    'qrcode.wifiNone': 'None',

    // vCard template
    'qrcode.vcardName': 'Full Name',
    'qrcode.vcardPhone': 'Phone',
    'qrcode.vcardEmail': 'Email',
    'qrcode.vcardOrg': 'Organization',

    // Phone template
    'qrcode.phoneNumber': 'Phone Number',
    'qrcode.phonePlaceholder': '+1 234 567 8900',

    // Email template
    'qrcode.emailTo': 'Recipient',
    'qrcode.emailSubject': 'Subject',
    'qrcode.emailBody': 'Body',

    // URL template
    'qrcode.urlPlaceholder': 'example.com',

    // Logo
    'qrcode.logo': 'Logo',
    'qrcode.logoUpload': 'Upload Logo',
    'qrcode.logoRemove': 'Remove',
    'qrcode.logoAutoLevel': 'Auto-switched to high error correction',
    'qrcode.logoHint': 'Logo covers ~20% of QR area',

    // SQL Formatter tool
    'sql.format': 'Format',
    'sql.minify': 'Minify',
    'sql.dialect': 'Dialect',
    'sql.indent': 'Indent',
    'sql.case': 'Case',
    'sql.preserve': 'Preserve',
    'sql.inputPlaceholder': 'Paste SQL query here...',
    'sql.outputPlaceholder': 'Formatted result will appear here',

    // chmod Calculator tool
    'chmod.octal': 'Octal',
    'chmod.symbolic': 'Symbolic',
    'chmod.octalInput': 'Enter Octal',
    'chmod.permissions': 'Permissions',
    'chmod.presets': 'Common Presets',
    'chmod.value': 'Value',
    'chmod.perm_read': 'Read',
    'chmod.perm_write': 'Write',
    'chmod.perm_execute': 'Execute',
    'chmod.role_owner': 'Owner',
    'chmod.role_group': 'Group',
    'chmod.role_other': 'Other',

    // YAML Formatter tool
    'yaml.format': 'Format',
    'yaml.minify': 'Minify',
    'yaml.validate': 'Validate',
    'yaml.toJson': 'To JSON',
    'yaml.fromJson': 'From JSON',
    'yaml.indent': 'Indent',
    'yaml.valid': '✓ Valid YAML',
    'yaml.inputPlaceholder': 'Paste YAML here...',
    'yaml.outputPlaceholder': 'Output will appear here',

    // Base Converter tool
    'baseconverter.binary': 'Binary (BIN)',
    'baseconverter.octal': 'Octal (OCT)',
    'baseconverter.decimal': 'Decimal (DEC)',
    'baseconverter.hexadecimal': 'Hexadecimal (HEX)',
    'baseconverter.ascii': 'ASCII Character',
    'baseconverter.placeholder': 'Enter value...',
    'baseconverter.invalidNumber': 'Invalid number',

    // JWT Decoder tool
    'jwt.header': 'Header',
    'jwt.payload': 'Payload',
    'jwt.signature': 'Signature',
    'jwt.expires': 'Expires',
    'jwt.expired': 'Expired',
    'jwt.valid': 'Valid',
    'jwt.daysLeft': 'days left',
    'jwt.inputPlaceholder': 'Paste JWT Token here...',
    'jwt.invalidToken': 'Invalid JWT format',

    // HTTP Status tool
    'httpstatus.search': 'Search status codes...',
    'httpstatus.all': 'All',
    'httpstatus.informational': '1xx Info',
    'httpstatus.success': '2xx Success',
    'httpstatus.redirection': '3xx Redirect',
    'httpstatus.clientError': '4xx Client',
    'httpstatus.serverError': '5xx Server',
    'httpstatus.copied': 'Copied',

    // URL Parser tool
    'urlparser.protocol': 'Protocol',
    'urlparser.hostname': 'Hostname',
    'urlparser.port': 'Port',
    'urlparser.pathname': 'Path',
    'urlparser.hash': 'Hash',
    'urlparser.queryParams': 'Query Params',
    'urlparser.key': 'Key',
    'urlparser.value': 'Value',
    'urlparser.noParams': 'No query params',
    'urlparser.inputPlaceholder': 'Enter URL...',
    'urlparser.invalidUrl': 'Invalid URL format',

    // Lorem Ipsum tool
    'lorem.settings': 'Settings',
    'lorem.type': 'Type',
    'lorem.paragraphs': 'Paragraphs',
    'lorem.sentences': 'Sentences',
    'lorem.words': 'Words',
    'lorem.count': 'Count',
    'lorem.language': 'Language',
    'lorem.chinese': 'Chinese',
    'lorem.english': 'English',
    'lorem.generate': 'Generate',

    // Cron
    'cron.settings': 'Settings',
    'cron.expression': 'Cron Expression',
    'cron.presets': 'Presets',
    'cron.preset_everyMinute': 'Every minute',
    'cron.preset_every5Minutes': 'Every 5 minutes',
    'cron.preset_everyHour': 'Every hour',
    'cron.preset_every2Hours': 'Every 2 hours',
    'cron.preset_everyDay': 'Every day',
    'cron.preset_everyWeek': 'Every week',
    'cron.preset_everyMonth': 'Every month',
    'cron.preset_everyYear': 'Every year',
    'cron.result': 'Result',
    'cron.description': 'Description',
    'cron.nextExecutions': 'Next 5 Executions',
    'cron.enterExpression': 'Enter a cron expression to see results',

    // Diff
    'diff.original': 'Original',
    'diff.modified': 'Modified',
    'diff.originalPlaceholder': 'Paste original text...',
    'diff.modifiedPlaceholder': 'Paste modified text...',
    'diff.compare': 'Compare',
    'diff.result': 'Diff Result',
    'diff.unchanged': 'lines unchanged',
    'diff.noDifference': 'Both texts are identical, no differences found',
    'diff.swap': 'Swap',
    'diff.edit': 'Edit',
    'diff.lines': 'lines',

    // Image
    'image.settings': 'Settings',
    'image.dropLabel': 'Click or drag to upload image',
    'image.originalSize': 'Original Size',
    'image.format': 'Format',
    'image.quality': 'Quality',
    'image.scale': 'Scale',
    'image.convert': 'Convert',
    'image.preview': 'Preview',
    'image.outputSize': 'Output Size',
    'image.compression': 'Compression',
    'image.download': 'Download',
    'image.noPreview': 'Upload an image and convert to preview',

    // SVG
    'svg.optimize': 'Optimize',
    'svg.inputPlaceholder': 'Paste SVG code...',
    'svg.outputPlaceholder': 'Optimized SVG will appear here...',
    'svg.original': 'Original',
    'svg.optimized': 'Optimized',

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
