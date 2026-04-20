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
* **状态管理**: 使用 `LocalStorage` 纯前端持久化管理多语言 (`lang`)、黑夜模式 (`theme`) 和天气特效 (`weather`)。默认状态为“白天模式 + 无特效”。
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

**不要从零手写 HTML！** 请直接复制一篇现有的文章（例如 `posts/20250912_sde_derivation.html`），重命名后进行修改。

**修改步骤清单：**
1. **复用核心库 (Include Common Assets)**: 确保新页面的 `<head>` 中引入了 `assets/css/common.css` 和 `assets/js/common.js`。这是保证页面宽度一致、自动编号生效、暗色模式工作的核心。**不要在新 HTML 里手写重复的 CSS 和 JS 逻辑！**
2. **修改 `<title>`**: `<title>你的文章标题 | Wanquan Feng</title>` (Title 标签不需要双语 span，直接写主要的即可)。
3. **修改页面大标题 (H1)**: 替换双语 span 中的内容。
4. **修改日期与阅读时间**: 确保日期和阅读时间的双语准确。
5. **修改正文**: 在 `<div class="lang-zh">` 和 `<div class="lang-en">` 中分别填入内容。**不要破坏 `<article class="prose...">` 的外层包裹。**
6. **(可选) 侧边栏目录 (TOC)**: 博客支持在右侧显示悬浮目录。如需开启，请确保文章内容的 `<main>` 标签与 `<aside>` 侧边栏包裹在一个 `flex` 容器内。目录生成逻辑已在 `common.js` 的 `generateTOC()` 方法中自动处理，无需在每个 HTML 中重新编写。
7. **更新首页列表**: 回到 `blog/index.html`，在 `<main>` 中复制一个现有的 `<article class="post-entry ...">` 块，填入新文章的链接、双语标题、日期和双语摘要。

## 5. 样式参考字典 (Style Dictionary)
如果未来 AI 需要添加新的 UI 元素，请务必支持 Dark Mode，并参考以下 Tailwind Class 组合以保持风格统一：
* **外层容器限制**: `class="max-w-[1400px] mx-auto px-6 py-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"` (注意：使用 1400px 宽屏以适应长公式，且正文与右侧 TOC 需保留安全内边距如 `xl:pr-8`)。
* **导航链接**: `class="nav-link text-blue-600 dark:text-blue-400"`
* **首页文章卡片**: `class="post-entry group border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-sm hover:-translate-y-1 transition-all"`
* **正文容器**: `class="prose dark:prose-invert prose-slate prose-lg lg:prose-xl prose-blue max-w-none"`

### 5.1 论文级排版与数学公式规范 (Typography & Math Formulas)
为了让文章看起来像严谨的学术论文，请遵循以下具体的排版规则：
1. **标题自动编号 (Auto-numbering)**:
   * **绝对不要**在 HTML 的 `<h2>` 或 `<h3>` 标签中手动输入序号（如 "1.", "1.1"）或修饰符号（如 "【】", "[]"）。
   * 博客内置了基于 CSS `counter-reset` 和 `counter-increment` 的自动编号系统。直接写纯文本标题即可，CSS 会自动在 `<h2>` 前加上 "1. "，在 `<h3>` 前加上 "1.1 "。
2. **多行数学公式对齐 (Formula Alignment)**:
   * **绝对不要**在块级公式 `$$...$$` 中使用 `<br>` 强行换行。
   * 所有的多行推导必须使用 LaTeX 的 `\begin{aligned} ... \end{aligned}` 环境，并使用 `&` 对齐等号（`&=`），使用 `\\` 换行。
3. **证明过程高亮框 (Proof Highlight Box)**:
   * 所有的多行块级公式 (`$$...$$`) 被包裹在 `.katex-display` 中，该容器**不再有任何颜色或背景框**，仅用于自动换行和居中。
   * 对于证明过程（包含文字描述和相关的数学公式），必须被包裹在 `<div class="proof-box"> ... </div>` 容器内。
   * 博客已经全局配置了该 `.proof-box` 容器的样式：白天模式下为浅绿色背景圆角框，**黑夜模式下为专业深蓝灰 (`#0f172a`)，左侧带有青色高亮边框，且所有公式渲染为科技感青色 (`#67e8f9`)**。禁止写入其它 Tailwind 颜色类。
4. **强调与高亮 (Emphasis)**:
   * 尽量使用语义化的 `<strong>` 标签进行加粗强调。
   * **不要**使用大面积的红色字体（如 `text-red-600`）来标注正文，保持“极简学术风”的高对比度和克制。
   * 对于证明过程，不要专门起一个 `<h3>` 标题，请直接在段落中使用 `<p>✍️ <strong>证明：</strong></p>` 或 `<p>✍️ <strong>Proof:</strong></p>`。

## 6. 目录结构说明
```text
blog/
├── index.html                   # 博客首页 (文章列表，双语，主题特效控制)
├── readme.md                    # 本规范文档
├── assets/
│   ├── css/
│   │   └── common.css           # 核心共享样式 (包含响应式布局、编号、公式框、过渡效果等)
│   └── js/
│       ├── common.js            # 核心共享逻辑 (包含主题、多语言、特效切换、目录生成等)
│       └── rain-effects.js      # 核心视觉特效引擎 (8种特效+无特效切换)
└── posts/                       # 存放所有博客文章
    └── 20250912_sde_derivation.html
```

> **最终原则：如无必要，勿增实体 (Entities should not be multiplied beyond necessity)。保持代码干净、可读、直接。**