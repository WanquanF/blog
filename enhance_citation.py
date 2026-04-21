import re

# 1. Update common.js
common_js_path = '/mnt/bn/wanquan--hl--data/code/bits_code/all_about_blog_creation/blog/assets/js/common.js'
with open(common_js_path, 'r', encoding='utf-8') as f:
    common_js_content = f.read()

scroll_fn = """
function scrollToCitation() {
    const el = document.getElementById('citation-section');
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a highlight effect
        el.style.transition = 'all 0.5s ease';
        el.style.boxShadow = '0 0 0 2px #3b82f6, 0 0 20px rgba(59, 130, 246, 0.5)';
        setTimeout(() => {
            el.style.boxShadow = '';
        }, 2000);
    }
}
"""

if 'function scrollToCitation' not in common_js_content:
    with open(common_js_path, 'a', encoding='utf-8') as f:
        f.write('\n' + scroll_fn)

# 2. Update the post HTML
html_path = '/mnt/bn/wanquan--hl--data/code/bits_code/all_about_blog_creation/blog/posts/20250912_sde_derivation.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Add ID to citation section at the bottom
bottom_old = 'class="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 not-prose"'
bottom_new = 'id="citation-section" class="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 not-prose transition-shadow duration-500"'
html_content = html_content.replace(bottom_old, bottom_new)

# Remove the old small inline button next to date
old_button_pattern = r'<span>•</span>\s*<button onclick="copyCitation[^>]+>[\s\S]*?</button>'
html_content = re.sub(old_button_pattern, '', html_content)

# Insert the new prominent callout box at the end of the header
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
        </div>"""

header_end = "</header>"
if callout_box not in html_content:
    html_content = html_content.replace(header_end, callout_box + "\n    " + header_end)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Citation enhanced successfully.")
