file_path = '/mnt/bn/wanquan--hl--data/code/bits_code/all_about_blog_creation/blog/posts/20250912_sde_derivation.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_str1 = """<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        <span class="lang-zh">引用这篇文章</span><span class="lang-en">Cite this article</span>
                    </h3>"""
new_str1 = """<div class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        <span class="lang-zh">引用这篇文章</span><span class="lang-en">Cite this article</span>
                    </div>"""

if old_str1 in content:
    content = content.replace(old_str1, new_str1)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully.")
else:
    print("Not found! Trying to print exact snippet...")
    idx = content.find('Cite this article')
    if idx != -1:
        print(repr(content[idx-100:idx+100]))
    else:
        print("Cite this article not even found.")
