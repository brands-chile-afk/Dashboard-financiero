import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

with open('Financial Dashboard_9.txt', 'r', encoding='utf-8') as f:
    code = f.read()

lines = code.split('\n')
app_start = -1
for idx, line in enumerate(lines):
    if 'function App()' in line:
        app_start = idx
        break

print(f"App starts at line: {app_start+1}")

if app_start != -1:
    print("\n--- APP COMPONENT CODE (250 lines) ---")
    for idx in range(app_start, min(app_start + 250, len(lines))):
        try:
            print(f"{idx+1}: {lines[idx]}")
        except Exception:
            escaped = lines[idx].encode('ascii', errors='replace').decode('ascii')
            print(f"{idx+1}: {escaped}")
