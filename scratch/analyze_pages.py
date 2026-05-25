import re
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

with open('Financial Dashboard_9.txt', 'r', encoding='utf-8') as f:
    code = f.read()

# Find all page functions like "function ...Page"
pages = re.findall(r'function\s+(\w+Page)\s*\(', code)
print("--- DETECTED PAGES ---")
for p in pages:
    print("-", p)

# Find all other component functions
components = re.findall(r'function\s+(\w+)\s*\(', code)
print("\n--- ALL DETECTED FUNCTIONS ---")
for c in components:
    if c[0].isupper() and not c.endswith('Page'):
        print("-", c)

# Let's search for the main rendering App component to see how it renders these pages
lines = code.split('\n')
app_start = -1
for idx, line in enumerate(lines):
    if 'function App()' in line or 'const App = () =>' in line:
        app_start = idx
        break

print(f"\nApp component starts at line: {app_start+1}")
if app_start != -1:
    print("\n--- APP COMPONENT RENDER AND ROUTING LOGIC ---")
    for idx in range(app_start, min(app_start + 180, len(lines))):
        try:
            print(f"{idx+1}: {lines[idx]}")
        except Exception:
            escaped = lines[idx].encode('ascii', errors='replace').decode('ascii')
            print(f"{idx+1}: {escaped}")
