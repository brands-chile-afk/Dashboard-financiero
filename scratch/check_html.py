import html.parser
import re

file_path = r"c:\Users\brand\Desktop\Claude\Dashboard financiero\index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's check for any basic unclosed brackets in the javascript/babel block
# We can find <script type="text/babel">...</script>
babel_match = re.search(r'<script type="text/babel">(.*?)</script>', content, re.DOTALL)
if not babel_match:
    print("ERROR: babel script tag not found")
    exit(1)

js_content = babel_match.group(1)

# Check brace matches
braces = []
for i, char in enumerate(js_content):
    if char == '{':
        braces.append(('{', i))
    elif char == '}':
        if not braces:
            print(f"ERROR: Unmatched closing brace at position {i}")
            # print surrounding context
            start = max(0, i-50)
            end = min(len(js_content), i+50)
            print("Context:", js_content[start:end])
            exit(1)
        braces.pop()

if braces:
    print(f"ERROR: Unmatched open braces! Count: {len(braces)}")
    for b in braces[:5]:
        i = b[1]
        print(f"Open brace at position {i}. Context:", js_content[i:i+100])
    exit(1)

print("SUCCESS: Javascript/Babel brace nesting is perfectly matched and valid!")
