
from html.parser import HTMLParser

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.void_elements = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def handle_starttag(self, tag, attrs):
        if tag not in self.void_elements:
            cls = dict(attrs).get('class', '')
            self.stack.append((tag, cls))
            indent = '  ' * (len(self.stack)-1)
            print(f'{indent}<{tag} class="{cls}">')

    def handle_endtag(self, tag):
        if tag not in self.void_elements:
            if not self.stack:
                print(f'EXTRA </{tag}>')
                return
            popped, cls = self.stack.pop()
            indent = '  ' * len(self.stack)
            if popped == tag:
                print(f'{indent}</{tag}>')
            else:
                print(f'{indent}MISMATCH: Expected </{popped}>, got </{tag}>')

with open('/mnt/bn/wanquan--hl--data/code/bits_code/all_about_blog_creation/blog/posts/20250912_sde_derivation.html', 'r') as f:
    content = f.read()

parser = MyHTMLParser()
parser.feed(content)
