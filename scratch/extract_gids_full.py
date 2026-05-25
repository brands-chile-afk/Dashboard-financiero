import sys
import re

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

with open('Financial Dashboard_9.txt', 'r', encoding='utf-8') as f:
    code = f.read()

print("--- ALL VARIABLES STARTING WITH GID_ OR SHEET IDs ---")
lines = code.split('\n')
for idx, line in enumerate(lines):
    if 'gid_' in line.lower() and ('const' in line or 'let' in line or 'var' in line):
        try:
            print(f"Line {idx+1}: {line.strip()}")
        except Exception:
            escaped = line.encode('ascii', errors='replace').decode('ascii')
            print(f"Line {idx+1} (escaped): {escaped.strip()}")
