from html.parser import HTMLParser

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.void_elements = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def handle_starttag(self, tag, attrs):
        if tag not in self.void_elements:
            self.stack.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        if tag not in self.void_elements:
            if not self.stack:
                print(f"Error: End tag </{tag}> at {self.getpos()} has no matching start tag.")
                return
            
            top_tag, top_pos = self.stack.pop()
            if top_tag != tag:
                print(f"Error: End tag </{tag}> at {self.getpos()} does not match start tag <{top_tag}> at {top_pos}.")
                # Try to recover by popping until we find the matching start tag
                found = False
                for i in range(len(self.stack)-1, -1, -1):
                    if self.stack[i][0] == tag:
                        found = True
                        print(f"  Recovered by assuming missing end tags for: {[t[0] for t in self.stack[i+1:]]}")
                        self.stack = self.stack[:i]
                        break
                if not found:
                    print(f"  Could not find matching start tag for </{tag}> in stack. Ignoring end tag.")
                    self.stack.append((top_tag, top_pos)) # Put back the top tag

with open("/mnt/bn/wanquan--hl--data/code/bits_code/all_about_blog_creation/blog/posts/20250912_sde_derivation.html", "r") as f:
    content = f.read()

parser = MyHTMLParser()
parser.feed(content)
if parser.stack:
    print("Unclosed tags remaining in stack:")
    for tag, pos in parser.stack:
        print(f"  <{tag}> at {pos}")
else:
    print("All tags balanced perfectly!")
