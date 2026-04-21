import re

file_path = '/mnt/bn/wanquan--hl--data/code/bits_code/all_about_blog_creation/blog/posts/20250912_sde_derivation.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find the specific h3 tag
pattern = r'<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">\s*<span class="lang-zh">引用这篇文章</span><span class="lang-en">Cite this article</span>\s*</h3>'
replacement = r'<div class="text-lg font-bold text-gray-900 dark:text-white mb-2">\n                        <span class="lang-zh">引用这篇文章</span><span class="lang-en">Cite this article</span>\n                    </div>'

content, count = re.subn(pattern, replacement, content)

if count > 0:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Replaced {count} occurrences successfully.")
else:
    print("Pattern not found.")
