import os
import shutil
import re
import json

appdata_local = os.path.expandvars(r'%LOCALAPPDATA%')
chrome_leveldb_path = os.path.join(appdata_local, 'Google', 'Chrome', 'User Data', 'Default', 'Local Storage', 'leveldb')
temp_dir = os.path.join(os.path.dirname(__file__), 'temp_leveldb')

if not os.path.exists(chrome_leveldb_path):
    print("Chrome Local Storage leveldb not found at:", chrome_leveldb_path)
    exit(1)

print("Copying leveldb files to prevent lock issues...")
os.makedirs(temp_dir, exist_ok=True)
for item in os.listdir(chrome_leveldb_path):
    s = os.path.join(chrome_leveldb_path, item)
    d = os.path.join(temp_dir, item)
    if os.path.isfile(s):
        try:
            shutil.copy2(s, d)
        except Exception as e:
            print(f"Failed to copy {item}: {e}")

found_configs = []

def extract_configs_from_bytes(data):
    # Regex for standard Firebase config format or JSON with apiKey and projectId
    matches = re.findall(b'\\{"apiKey":"AIzaSy[A-Za-z0-9_-]+"[^}]*\\}', data)
    for m in matches:
        try:
            parsed = json.loads(m.decode('utf-8', errors='ignore'))
            if 'apiKey' in parsed and 'projectId' in parsed:
                if parsed not in found_configs:
                    found_configs.append(parsed)
        except Exception:
            pass

    matches_broad = re.findall(b'\\{[^\\}]*AIzaSy[^\\}]*\\}', data)
    for m in matches_broad:
        try:
            text = m.decode('utf-8', errors='ignore')
            json_match = re.search(r'\{.*"apiKey".*\}', text)
            if json_match:
                parsed = json.loads(json_match.group(0))
                if 'apiKey' in parsed and 'projectId' in parsed:
                    if parsed not in found_configs:
                        found_configs.append(parsed)
        except Exception:
            pass

print("Scanning copied leveldb files...")
for file in os.listdir(temp_dir):
    if file.endswith(('.ldb', '.log')):
        p = os.path.join(temp_dir, file)
        try:
            with open(p, 'rb') as f:
                content = f.read()
                if b'apiKey' in content:
                    extract_configs_from_bytes(content)
        except Exception as e:
            print(f"Error reading {file}: {e}")

# Clean up
try:
    shutil.rmtree(temp_dir)
except Exception:
    pass

print(f"\nFound {len(found_configs)} potential Firebase configuration(s):")
for i, c in enumerate(found_configs, 1):
    print(f"\nConfiguration #{i}:")
    print(json.dumps(c, indent=2))
