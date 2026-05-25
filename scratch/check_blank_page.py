import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's extract the Babel script block
babel_match = re.search(r'<script type="text/babel">(.*?)</script>', text, re.DOTALL)
if babel_match:
    js_code = babel_match.group(1)
    print("Found Babel script block of size:", len(js_code))
    
    # 1. Let's check for parentheses matching
    stack = []
    lines = js_code.split('\n')
    for idx, line in enumerate(lines):
        for char_idx, char in enumerate(line):
            if char == '{':
                stack.append(('{', idx+1, char_idx+1))
            elif char == '}':
                if not stack:
                    print(f"Error: unmatched '}}' at line {idx+1}:{char_idx+1}")
                else:
                    stack.pop()
            elif char == '(':
                stack.append(('(', idx+1, char_idx+1))
            elif char == ')':
                if not stack:
                    print(f"Error: unmatched ')' at line {idx+1}:{char_idx+1}")
                else:
                    top, l, c = stack[-1]
                    if top == '(':
                        stack.pop()
                    else:
                        print(f"Warning: closed '(' with '}}' or vice-versa at line {idx+1}:{char_idx+1}")
                        
    if stack:
        print(f"Error: {len(stack)} unclosed brackets/braces remaining at end of file!")
        print("First few unclosed:", stack[:5])
    else:
        print("Braces and parentheses are perfectly balanced!")
else:
    print("Babel script block not found!")
