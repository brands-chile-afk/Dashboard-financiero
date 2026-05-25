with open('index.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("Occurrences of 'badge-traspaso' in index.css:")
for idx, line in enumerate(lines):
    if 'badge-traspaso' in line.lower():
        print(f"Line {idx+1}: {line.strip()}")
