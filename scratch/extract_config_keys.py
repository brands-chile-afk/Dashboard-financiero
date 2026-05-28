import os
import shutil
import re
import json

appdata_local = os.path.expandvars(r'%LOCALAPPDATA%')
paths = {
    'Chrome': os.path.join(appdata_local, 'Google', 'Chrome', 'User Data', 'Default', 'Local Storage', 'leveldb'),
    'Edge': os.path.join(appdata_local, 'Microsoft', 'Edge', 'User Data', 'Default', 'Local Storage', 'leveldb')
}

for name, path in paths.items():
    if not os.path.exists(path):
        continue
    temp_dir = os.path.join(os.path.dirname(__file__), f'temp_{name}_extract')
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
                    
                    # Search for 'FIREBASE_CONFIG' (case-insensitive) or 'apiKey'
                    idx = 0
                    while True:
                        idx = content.find(b'FIREBASE_CONFIG', idx)
                        if idx == -1:
                            break
                        # Extract around it
                        start = max(0, idx - 50)
                        end = min(len(content), idx + 1000)
                        sub = content[start:end]
                        # Look for JSON-like string
                        json_match = re.search(rb'\{[^{}]*"apiKey"[^{}]*\}', sub)
                        if json_match:
                            try:
                                parsed = json.loads(json_match.group(0).decode('utf-8', errors='ignore'))
                                if 'apiKey' in parsed:
                                    print(f"[{name}] Found FIREBASE_CONFIG in {file}:")
                                    print(json.dumps(parsed, indent=2))
                            except Exception:
                                pass
                        else:
                            # Let's print the raw characters around it to inspect
                            print(f"[{name}] Raw match in {file} (idx {idx}):")
                            print(sub.decode('utf-8', errors='ignore'))
                            print("-" * 40)
                        idx += 15
            except Exception as e:
                pass
                
    shutil.rmtree(temp_dir, ignore_errors=True)
