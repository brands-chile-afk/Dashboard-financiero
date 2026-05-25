import re

with open('Financial Dashboard_9.txt', 'r', encoding='utf-8') as f:
    code = f.read()

lines = code.split('\n')
start = -1
for idx, line in enumerate(lines):
    if 'loadLiveData' in line:
        start = idx
        break

print(f"loadLiveData starts at line: {start+1}")

if start != -1:
    print("\n--- INSIDE loadLiveData (lines around start) ---")
    for idx in range(start, min(start + 250, len(lines))):
        if 'fetch' in lines[idx].lower() or 'movimientos' in lines[idx].lower() or 'mov_' in lines[idx].lower() or 'saldos' in lines[idx].lower():
            try:
                print(f"{idx+1}: {lines[idx].strip()}")
            except Exception:
                escaped = lines[idx].encode('ascii', errors='replace').decode('ascii')
                print(f"{idx+1} (escaped): {escaped.strip()}")
