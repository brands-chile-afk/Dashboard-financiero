import os

paths_to_check = [
    os.path.expandvars(r'%APPDATA%\Claude\claude_desktop_config.json'),
    os.path.expandvars(r'%APPDATA%\antigravity\config.json'),
    os.path.expandvars(r'%USERPROFILE%\.gemini\antigravity\config.json'),
    os.path.expandvars(r'%APPDATA%\antigravity-mcp-config.json'),
    # Let's also check the parent AppData directory
    os.path.expandvars(r'%APPDATA%'),
    os.path.expandvars(r'%USERPROFILE%\.gemini\antigravity')
]

print("Checking common MCP configuration paths:")
for p in paths_to_check:
    exists = os.path.exists(p)
    status = "EXISTS (FILE)" if exists and os.path.isfile(p) else ("EXISTS (DIR)" if exists else "NOT FOUND")
    print(f"Path: {p} -> {status}")
