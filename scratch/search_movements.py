with open('app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("Occurrences of 'movimientos' in app.js:")
for idx, line in enumerate(lines):
    if 'movimientos' in line.lower():
        print(f"Line {idx+1}: {line.strip()}")
