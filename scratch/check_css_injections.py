import sys
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

print("Checking CSS injections in index.html...")
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
for idx, line in enumerate(lines):
    if 'ESTILOS DEL SIMULADOR' in line:
        print(f"Occurrence at line {idx+1}: {line.strip()[:100]}")
