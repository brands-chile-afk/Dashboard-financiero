import re

print("Extracting Babel block from index.html...")
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

babel_match = re.search(r'<script type="text/babel">(.*?)</script>', text, re.DOTALL)
if babel_match:
    js_code = babel_match.group(1)
    with open('scratch/temp_app.js', 'w', encoding='utf-8') as f_out:
        f_out.write(js_code)
    print("Babel block successfully extracted to scratch/temp_app.js")
else:
    print("Babel block not found in index.html!")
