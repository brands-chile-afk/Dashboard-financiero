import sys

# Reconfigure stdout to use UTF-8 if possible
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

with open('Financial Dashboard_9.txt', 'r', encoding='utf-8') as f:
    code = f.read()

lines = code.split('\n')
babel_start = -1
for idx, line in enumerate(lines):
    if 'type="text/babel"' in line:
        babel_start = idx
        break

print(f"Babel script starts at line: {babel_start+1}")

if babel_start != -1:
    print("\n--- FIRST 250 LINES OF BABEL SCRIPT ---")
    for idx in range(babel_start, min(babel_start + 250, len(lines))):
        try:
            print(f"{idx+1}: {lines[idx]}")
        except Exception:
            # Escape non-ASCII characters if print still fails
            escaped = lines[idx].encode('ascii', errors='replace').decode('ascii')
            print(f"{idx+1}: {escaped}")
