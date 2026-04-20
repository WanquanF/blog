import re

with open("/mnt/bn/wanquan--hl--data/code/bits_code/all_about_blog_creation/blog/posts/20250912_sde_derivation.html", "r") as f:
    content = f.read()

# find all open and close tags
stack = []
for m in re.finditer(r'<(div|/div|article|/article|main|/main|aside|/aside|body|/body|html|/html)[^>]*>', content):
    tag = m.group(0)
    tag_name = m.group(1)
    if not tag_name.startswith('/'):
        stack.append((tag_name, tag, m.start()))
    else:
        if stack:
            popped = stack.pop()
            expected_tag = '/' + popped[0]
            if tag_name != expected_tag:
                print(f"Mismatch at {m.start()}: Expected {expected_tag}, got {tag_name}")
        else:
            print(f"Unmatched closing tag at {m.start()}: {tag}")

for item in stack:
    print(f"Unmatched opening tag at {item[2]}: {item[1]}")
