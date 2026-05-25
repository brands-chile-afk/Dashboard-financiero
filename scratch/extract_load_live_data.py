import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

with open('Financial Dashboard_9.txt', 'r', encoding='utf-8') as f:
    code = f.read()

lines = code.split('\n')
start = 2790
end = 2860

print(f"Extracting lines {start} to {end}...")
for idx in range(start-1, min(end, len(lines))):
    try:
        print(f"{idx+1}: {lines[idx]}")
    except Exception:
        escaped = lines[idx].encode('ascii', errors='replace').decode('ascii')
        print(f"{idx+1} (escaped): {escaped}")
