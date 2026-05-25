with open('Financial Dashboard_9.txt', 'r', encoding='utf-8') as f:
    code = f.read()

import re

# Find the activePage or activeTab usage in sidebar rendering
sidebar_block = re.findall(r'className=["\']sb["\'](?:.|\n)*?<\/div>', code)
print("Sidebar block matches:", len(sidebar_block))

# Let's search for navigation item rendering: ".ni" inside the JSX code
nav_items = re.findall(r'<div[^>]*?className=\{["\']ni[^"\'}]*?act(?:.|\n)*?<\/div>', code)
print(f"Interactive nav items found: {len(nav_items)}")

# Let's search for switch cases inside the main App return statement or rendering code
switch_matches = re.findall(r'activeTab\s*===\s*["\'](\w+)["\']', code)
print("\nTabs detected in switch/ternary expressions:")
for m in set(switch_matches):
    print("-", m)

# Let's search for all tab/page functions
funcs = re.findall(r'function\s+(\w+Page)\s*\(', code)
print("\nPage components found:")
for f in funcs:
    print("-", f)
