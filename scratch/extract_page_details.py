import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

with open('Financial Dashboard_9.txt', 'r', encoding='utf-8') as f:
    code = f.read()

lines = code.split('\n')
start = -1
for idx, line in enumerate(lines):
    if 'function HomePage' in line:
        start = idx
        break

print(f"HomePage starts at line: {start+1}")

if start != -1:
    print("\n--- HOMEPAGE COMPONENT CODE (200 lines) ---")
    for idx in range(start, min(start + 200, len(lines))):
        try:
            print(f"{idx+1}: {lines[idx]}")
        except Exception:
            escaped = lines[idx].encode('ascii', errors='replace').decode('ascii')
            print(f"{idx+1}: {escaped}")
