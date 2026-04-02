# Wanquan Feng's Blog - 维护准则与开发指南 (Developer & AI Guide)

> **致未来的 AI 助手 (To future LLMs/VLMs):** 
> 当你接手这个项目并协助添加新功能或新文章时，**请务必严格遵守本文档中的所有规范**。这个博客追求极致的学术极简风，拒绝花哨的框架，采用纯静态、无构建工具的架构。

---

## 1. 核心设计哲学 (Design Philosophy)
* **极简学术风 (Minimalist & Academic)**：参考 Lilian Weng 博客风格。高对比度、留白充足。
* **纯静态、零构建 (Zero Build Process)**：直接使用 HTML/JS/CSS，通过 CDN 引入 Tailwind CSS。不需要 Webpack/Vite 等构建工具。
* **排版至上 (Typography First)**：
  * 英文：统一使用 `Times New Roman`。
  * 中文：回退至系统默认无衬线体 (`-apple-system`, `BlinkMacSystemFont` 等，即主页中文字体)。
* **优雅的视觉系统 (Elegant Visuals)**：底层自带黑夜/白天模式切换，同时拥有一个多状态的 Canvas 魔法特效引擎 (`rain-effects.js`)。支持多种特效：星空连线、雨天、雪天、萤火虫、樱花飞舞、微风蒲公英、互动水波纹、赛博网格。特效要求克制、优雅，并能根据黑夜/白天模式自动适配颜色。

## 2. 核心架构与技术栈 (Tech Stack)
* **CSS 框架**: Tailwind CSS (通过 CDN `https://cdn.tailwindcss.com` 引入)，正文排版使用 `@tailwindcss/typography` 插件（即 `<article class="prose ...">`）。
* **状态管理**: 使用 `LocalStorage` 纯前端持久化管理多语言 (`lang`)、黑夜模式 (`theme`) 和天气特效 (`weather`)。默认状态为“黑夜模式 + 星空连线”。
* **数学公式**: 使用 `KaTeX` (CDN 引入)。**注意：** 必须在页面的 `<script>` 中使用 `renderMathInElement` 初始化自动渲染，并配置好对应的定界符 (delimiters)，例如块级公式 `$$...$$` 和行内公式 `$...$` 等，否则页面上的 LaTeX 公式将无法被解析和渲染。
* **图标/字体**: 字体为系统自带 (英文为 Times New Roman，中文为系统默认)。

## 3. 🚨 核心准则：中英双语无缝切换 (The Bilingual System)
本博客采用**纯前端 DOM 切换 + LocalStorage 记忆**的双语方案。默认语言为英文 (`en`)。
**任何时候添加新内容，必须严格按照以下格式提供中英双份文案：**

### 3.1 行内文本双语格式 (对于标题、短句、按钮)
使用 `<span>` 标签和预设好的 `lang-zh` / `lang-en` 类名：
```html
<h1 class="text-4xl font-extrabold">
    <span class="lang-zh">这里是中文标题</span>
    <span class="lang-en">This is the English Title</span>
</h1>
```

### 3.2 段落正文双语格式 (对于文章主体内容)
使用 `<div>` 标签包裹各自语言的段落：
```html
<article class="prose prose-slate prose-lg lg:prose-xl prose-blue">
    <!-- 中文版内容 -->
    <div class="lang-zh">
        <p>这是第一段中文正文。</p>
        <div class="my-8">$$ E = mc^2 $$</div> <!-- 公式在两边都要放，或者放在双语 div 的外部如果无需翻译 -->
    </div>
    
    <!-- 英文版内容 -->
    <div class="lang-en">
        <p>This is the first paragraph in English.</p>
        <div class="my-8">$$ E = mc^2 $$</div>
    </div>
</article>
```
**注意：绝对不要在页面间使用跳转来切换语言。切换逻辑完全由 `html[lang="..."]` 属性和 CSS 控制。**

### 3.3 数学相关内容的翻译准则 (Translation Guidelines for Math Content)
在编写博客时，我们经常会从截图去提取或输入“中文+数学”的内容。当我们将这些内容翻译成英文时，**必须要像一本通顺的数学教材一样**。
这要求我们在翻译时必须采用**意译 (Free Translation)** 而不是生硬的直译 (Literal Translation)，确保学术表达的地道与自然，使读者在阅读英文推导和公式说明时毫无违和感。

## 4. 如何创建一篇新博客 (How to add a new post)

**不要从零手写 HTML！** 请直接复制一篇现有的文章（例如 `posts/2026-04-01-flow-grpo.html`），重命名后进行修改。

**修改步骤清单：**
1. **修改 `<title>`**: `<title>你的文章标题 | Wanquan Feng</title>` (Title 标签不需要双语 span，直接写主要的即可)。
2. **修改页面大标题 (H1)**: 替换双语 span 中的内容。
3. **修改日期与阅读时间**: 确保日期和阅读时间的双语准确。
4. **修改正文**: 在 `<div class="lang-zh">` 和 `<div class="lang-en">` 中分别填入内容。**不要破坏 `<article class="prose...">` 的外层包裹。**
5. **(可选) 侧边栏目录 (TOC)**: 博客支持在右侧显示悬浮目录。如需开启，请确保文章内容的 `<main>` 标签与 `<aside>` 侧边栏包裹在一个 `flex` 容器内，并在 JS 中引入 `generateTOC()` 方法（参考 `20250912_wanquanfeng.html` 的实现）。
6. **更新引用块 (Citation)**: 更新文末 `@article` 引用代码块中的 `title`, `year`, 和 `url`。
7. **更新首页列表**: 回到 `blog/index.html`，在 `<main>` 中复制一个现有的 `<article class="post-entry ...">` 块，填入新文章的链接、双语标题、日期和双语摘要。

## 5. 样式参考字典 (Style Dictionary)
如果未来 AI 需要添加新的 UI 元素，请务必支持 Dark Mode，并参考以下 Tailwind Class 组合以保持风格统一：
* **外层容器限制**: `class="max-w-6xl mx-auto px-6 py-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"`
* **导航链接**: `class="nav-link text-blue-600 dark:text-blue-400"`
* **首页文章卡片**: `class="post-entry group border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-sm hover:-translate-y-1 transition-all"`
* **正文容器**: `class="prose dark:prose-invert prose-slate prose-lg lg:prose-xl prose-blue max-w-none"`

## 6. 目录结构说明
```text
blog/
├── index.html                   # 博客首页 (文章列表，双语，主题特效控制)
├── readme.md                    # 本规范文档
├── assets/
│   └── js/
│       └── rain-effects.js      # 核心视觉特效引擎 (8种特效+无特效切换)
└── posts/                       # 存放所有博客文章
    └── 2026-04-01-flow-grpo.html
```

> **最终原则：如无必要，勿增实体 (Entities should not be multiplied beyond necessity)。保持代码干净、可读、直接。**