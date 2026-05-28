import os
import shutil
import re

appdata_local = os.path.expandvars(r'%LOCALAPPDATA%')
paths = {
    'Chrome': os.path.join(appdata_local, 'Google', 'Chrome', 'User Data', 'Default', 'Local Storage', 'leveldb'),
    'Edge': os.path.join(appdata_local, 'Microsoft', 'Edge', 'User Data', 'Default', 'Local Storage', 'leveldb')
}

for name, path in paths.items():
    if not os.path.exists(path):
        continue
    print(f"\n=== Scanning {name} ===")
    temp_dir = os.path.join(os.path.dirname(__file__), f'temp_{name}')
    os.makedirs(temp_dir, exist_ok=True)
    
    # Copy files
    for item in os.listdir(path):
        s = os.path.join(path, item)
        d = os.path.join(temp_dir, item)
        if os.path.isfile(s) and not item.endswith('LOCK'):
            try:
                shutil.copy2(s, d)
            except Exception:
                pass
                
    # Read files
    for file in os.listdir(temp_dir):
        if file.endswith(('.ldb', '.log')):
            p = os.path.join(temp_dir, file)
            try:
                with open(p, 'rb') as f:
                    content = f.read()
                    if b'localhost' in content or b'firebase' in content or b'FIREBASE' in content:
                        print(f"Found match in {file}")
                        # Print snippets
                        for match in re.finditer(b'localhost', content):
                            start = max(0, match.start() - 50)
                            end = min(len(content), match.end() + 200)
                            print("  Snippet (localhost):", content[start:end].decode('utf-8', errors='ignore'))
                        for match in re.finditer(b'FIREBASE_CONFIG', content):
                            start = max(0, match.start() - 50)
                            end = min(len(content), match.end() + 400)
                            print("  Snippet (FIREBASE_CONFIG):", content[start:end].decode('utf-8', errors='ignore'))
            except Exception as e:
                pass
                
    shutil.rmtree(temp_dir, ignore_errors=True)
