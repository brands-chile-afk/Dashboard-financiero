print("Searching for style tags in Financial Dashboard_9.txt...")
with open('Financial Dashboard_9.txt', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
for idx, line in enumerate(lines):
    if '</style>' in line:
        print(f"Line {idx+1}: {line.strip()[:100]}")
