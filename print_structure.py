from html.parser import HTMLParser
import sys

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.void_elements = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def handle_starttag(self, tag, attrs):
        if tag not in self.void_elements:
            cls = dict(attrs).get('class', '')
            self.stack.append(tag)
            indent = '  ' * (len(self.stack)-1)
            print(f'{indent}<{tag} class="{cls}">')

    def handle_endtag(self, tag):
        if tag not in self.void_elements:
            if self.stack:
                popped = self.stack.pop()
            indent = '  ' * len(self.stack)
            print(f'{indent}</{tag}>')

with open('/mnt/bn/wanquan--hl--data/code/bits_code/all_about_blog_creation/blog/posts/20250912_sde_derivation.html', 'r') as f:
    content = f.read()

parser = MyHTMLParser()
parser.feed(content)
