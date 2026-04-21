import os

file_path = '/mnt/bn/wanquan--hl--data/code/bits_code/all_about_blog_creation/blog/posts/20250912_sde_derivation.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace h3 with div for the citation block
old_str = """<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        <span class="lang-zh">引用这篇文章</span><span class="lang-en">Cite this article</span>
                    </h3>"""
new_str = """<div class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        <span class="lang-zh">引用这篇文章</span><span class="lang-en">Cite this article</span>
                    </div>"""

if old_str in content:
    content = content.replace(old_str, new_str)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced h3 with div successfully.")
else:
    print("String not found. Let's check the exact string.")
