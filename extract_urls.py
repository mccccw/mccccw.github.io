import re
import sys

with open('gallery.html', 'r', encoding='utf-8') as f:
    content = f.read()

urls = re.findall(r'https://cdn\.modrinth\.com/data/[^"]+\.(?:png|jpg|webp)', content)
for url in list(set(urls))[:20]:
    print(url)
