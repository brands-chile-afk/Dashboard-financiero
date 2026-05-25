import re

with open('Financial Dashboard_9.txt', 'r', encoding='utf-8') as f:
    code = f.read()

print("File size:", len(code), "bytes")

# Let's search for function components or class components
print("\n--- DETECTED REACT COMPONENTS AND ROUTING ---")
# Find all "const ... = () =>" or "function ...("
funcs = re.findall(r'const\s+(\w+)\s*=\s*(?:\([^)]*\)|[a-zA-Z_]\w*)\s*=>', code)
for f in funcs:
    if f[0].isupper():
        print(f"Component: {f}")

# Find navigation items or tab states
tab_states = re.findall(r'setActiveTab\("(\w+)"\)|activeTab\s*===\s*"(\w+)"', code)
print("\nTabs/Active Tab states found:")
for t in set(t[0] or t[1] for t in tab_states if t[0] or t[1]):
    print("-", t)

# Search for XLSX references or upload zone
print("\nUploader or XLSX features:")
if 'XLSX' in code:
    print("- XLSX library referenced (Excel file parser)")
if 'upload-zone' in code:
    print("- Drag and drop upload zone found")

# Let's inspect what tabs are rendered in the sidebar or main menu
sidebar_matches = re.findall(r'className=["\']ni[^"\']*["\']([^>]*>)', code)
print(f"\nSidebar items count: {len(sidebar_matches)}")
