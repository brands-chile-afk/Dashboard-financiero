import re

with open('Financial Dashboard_9.txt', 'r', encoding='utf-8') as f:
    code = f.read()

print("--- SHEET GIDs AND RETRIEVAL VARIABLES ---")
gids = re.findall(r'(?:const|let|var)\s+(GID_\w+|BASE|umbrales)\s*=\s*(.*?);', code)
for name, val in gids:
    print(f"{name} = {val}")

# Let's search for how GIDs are configured or fetched
print("\n--- DETECTED GID / SHEET URL CONFIGS ---")
lines = code.split('\n')
for idx, line in enumerate(lines):
    if 'gid' in line.lower() and ('const' in line or 'let' in line or 'var' in line):
        print(f"Line {idx+1}: {line.strip()}")
