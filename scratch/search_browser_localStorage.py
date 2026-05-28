import os
import re
import json

appdata_local = os.path.expandvars(r'%LOCALAPPDATA%')
paths_to_search = [
    os.path.join(appdata_local, 'Google', 'Chrome', 'User Data'),
    os.path.join(appdata_local, 'Microsoft', 'Edge', 'User Data'),
    os.path.join(appdata_local, 'BraveSoftware', 'Brave-Browser', 'User Data'),
    os.path.join(os.path.expandvars(r'%APPDATA%'), 'Mozilla', 'Firefox', 'Profiles')
]

found_configs = []

def extract_configs_from_bytes(data):
    # Regex to find JSON-like objects with apiKey
    # Standard Firebase API key starts with AIzaSy
    matches = re.findall(b'\\{"apiKey":"AIzaSy[A-Za-z0-9_-]+"[^}]*\\}', data)
    for m in matches:
        try:
            parsed = json.loads(m.decode('utf-8', errors='ignore'))
            if 'apiKey' in parsed and 'projectId' in parsed:
                if parsed not in found_configs:
                    found_configs.append(parsed)
        except Exception:
            pass

    # Broad search
    matches_broad = re.findall(b'\\{[^\\}]*AIzaSy[^\\}]*\\}', data)
    for m in matches_broad:
        try:
            text = m.decode('utf-8', errors='ignore')
            # Extract JSON substring
            json_match = re.search(r'\{.*"apiKey".*\}', text)
            if json_match:
                parsed = json.loads(json_match.group(0))
                if 'apiKey' in parsed and 'projectId' in parsed:
                    if parsed not in found_configs:
                        found_configs.append(parsed)
        except Exception:
            pass

for base_path in paths_to_search:
    if not os.path.exists(base_path):
        continue
    print(f"Scanning storage in: {base_path}")
    for root, dirs, files in os.walk(base_path):
        # Scan chromium leveldb
        if 'Local Storage' in root and 'leveldb' in root:
            for file in files:
                if file.endswith(('.ldb', '.log')):
                    filepath = os.path.join(root, file)
                    try:
                        with open(filepath, 'rb') as f:
                            content = f.read()
                            if b'apiKey' in content:
                                extract_configs_from_bytes(content)
                    except Exception as e:
                        pass
        # Scan Firefox storage
        elif 'webappsstore.sqlite' in files:
            filepath = os.path.join(root, 'webappsstore.sqlite')
            try:
                with open(filepath, 'rb') as f:
                    content = f.read()
                    if b'apiKey' in content:
                        extract_configs_from_bytes(content)
            except Exception:
                pass

print(f"\nFound {len(found_configs)} potential Firebase configuration(s):")
for i, c in enumerate(found_configs, 1):
    print(f"\nConfiguration #{i}:")
    print(json.dumps(c, indent=2))
