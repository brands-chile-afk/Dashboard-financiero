with open('Financial Dashboard_9.txt', 'r', encoding='utf-8') as f:
    code = f.read()

import re

# Find the IC component declaration
lines = code.split('\n')
ic_start = -1
for idx, line in enumerate(lines):
    if 'const IC = ' in line:
        ic_start = idx
        break

print(f"IC starts at line: {ic_start+1}")

if ic_start != -1:
    print("\n--- IC COMPONENT DEFINITIONS ---")
    for idx in range(ic_start, ic_start + 40):
        print(f"{idx+1}: {lines[idx]}")
