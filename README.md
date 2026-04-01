# WanquanF's Personal Blog

这是一个追求极简、干净且专业的个人技术博客仓库。设计灵感来源于 Lilian Weng 的博客风格，专注于高质量的技术笔记与算法思考。

## 🏗 项目结构

```text
.
├── index.html          # 博客首页，包含自动更新的文章列表
├── posts/              # 文章存放目录
│   ├── template.html   # 文章创作模板（推荐使用）
│   ├── 2026-04-01-muon-optimizer.html
│   └── 2026-04-01-flow-grpo.html
└── README.md           # 本说明文件
```

## 🎨 开发准则 (Development Principles)

### 1. 干净清洁 (Keep it Clean)
- **无追踪脚本**: 拒绝任何 Google Analytics、广告或第三方追踪插件。
- **无冗余代码**: 移除所有浏览器插件残留（如 Chrome Ext 注入的代码）及无用的元数据。
- **资源最小化**: 仅通过 CDN 引入必要的样式和脚本（Tailwind, KaTeX）。

### 2. Lilian 风格 (Academic-Friendly)
- **排版优先**: 使用 Tailwind Typography 插件 (`prose` 类)，确保在各种屏幕上都有极佳的阅读体验。
- **数学公式**: 全面支持 KaTeX 渲染，支持 `$$` (行间) 和 `$` (行内) 公式。
- **引用规范**: 建议在文末提供 BibTeX 引用格式，方便他人引用你的笔记。

### 3. 极简技术栈
- **CSS**: Tailwind CSS (JIT mode via CDN).
- **Math**: KaTeX.
- **Font**: 系统默认无衬线字体族，追求原生速度。

## ✍️ 创作流程

1. **复制模板**:
   将 `posts/template.html` 复制并重命名为 `posts/YYYY-MM-DD-your-title.html`。

2. **填充内容**:
   替换模板中的占位符：
   - `{{ TITLE }}`: 文章标题
   - `{{ DATE }}`: 用于 `datetime` 属性的日期 (如 2026-04-01)
   - `{{ DATE_DISPLAY }}`: 显示给读者的日期 (如 2026 年 4 月 1 日)
   - `{{ READ_TIME }}`: 预估阅读时间
   - `{{ CONTENT }}`: 你的 Markdown 或 HTML 正文

3. **更新首页**:
   在 `index.html` 的 `<ul>` 列表中添加新的 `<li>` 项目。

## 🚀 部署
本博客为纯静态页面，可直接通过 GitHub Pages 或任何静态托管服务进行部署。