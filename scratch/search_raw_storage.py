import os
import re

appdata_local = os.path.expandvars(r'%LOCALAPPDATA%')
search_dirs = [
    os.path.join(appdata_local, 'Google', 'Chrome', 'User Data'),
    os.path.join(appdata_local, 'Microsoft', 'Edge', 'User Data'),
    os.path.join(appdata_local, 'BraveSoftware', 'Brave-Browser', 'User Data')
]

for d in search_dirs:
    if not os.path.exists(d):
        continue
    print(f"Searching in: {d}")
    for root, dirs, files in os.walk(d):
        if 'Local Storage' in root and 'leveldb' in root:
            for file in files:
                if file.endswith(('.ldb', '.log')):
                    p = os.path.join(root, file)
                    try:
                        with open(p, 'rb') as f:
                            content = f.read()
                            if b'apiKey' in content and b'authDomain' in content:
                                print(f"Found match in file: {p}")
                                # Search for apiKey and print context
                                for match in re.finditer(b'apiKey', content):
                                    start = max(0, match.start() - 100)
                                    end = min(len(content), match.end() + 300)
                                    snippet = content[start:end]
                                    print("Snippet:")
                                    print(snippet.decode('utf-8', errors='ignore'))
                                    print("-" * 50)
                    except Exception as e:
                        pass
