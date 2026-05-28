import os
import glob

print("Searching for any config.json or mcp configuration files...")

search_patterns = [
    os.path.expandvars(r'%APPDATA%\**\*config*.json'),
    os.path.expandvars(r'%LOCALAPPDATA%\**\*config*.json'),
    os.path.expandvars(r'%USERPROFILE%\.gemini\**\*.json'),
    os.path.expandvars(r'%APPDATA%\**\*mcp*.json'),
    os.path.expandvars(r'%LOCALAPPDATA%\**\*mcp*.json')
]

for pat in search_patterns:
    print(f"\nPattern: {pat}")
    # Search recursively, but let's limit depth to avoid freezing
    count = 0
    try:
        for f in glob.iglob(pat, recursive=True):
            print("Found:", f)
            count += 1
            if count >= 10:
                print("... truncated list after 10 matches")
                break
    except Exception as e:
        print("Error searching pattern:", e)
