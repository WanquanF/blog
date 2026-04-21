import re

html_path = '/mnt/bn/wanquan--hl--data/code/bits_code/all_about_blog_creation/blog/posts/20250912_sde_derivation.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

callout_box = """
        <div class="mt-8 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
            <div class="flex items-start gap-3">
                <div class="mt-0.5 text-blue-500 dark:text-blue-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div class="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                    <span class="lang-zh"><strong>需要引用本文？</strong>我们提供了标准的 BibTeX 格式，方便您在学术论文中引用。</span>
                    <span class="lang-en"><strong>Want to cite this post?</strong> Standard BibTeX format is available for your academic papers.</span>
                </div>
            </div>
            <button onclick="scrollToCitation()" class="flex-shrink-0 flex items-center gap-1.5 text-sm font-medium bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700/50 px-4 py-2 rounded-lg shadow-sm hover:shadow hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                <span class="lang-zh">前往引用</span><span class="lang-en">Go to Citation</span>
            </button>
        </div>
    </header>"""

if "需要引用本文" not in html_content:
    html_content = html_content.replace("</header>", callout_box)
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print("Injected banner")
else:
    print("Banner already there")

