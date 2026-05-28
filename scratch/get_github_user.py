import urllib.request
import json
import sys
import os

# Configure stdout to UTF-8 for console output
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

token = os.environ.get("GITHUB_TOKEN", "")
repo_name = "dashboard-financiero"

headers = {
    "Authorization": f"token {token}",
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "Antigravity-AI"
}

# 1. Fetch user information
print("Fetching user profile from GitHub API...")
req_user = urllib.request.Request("https://api.github.com/user", headers=headers)
try:
    with urllib.request.urlopen(req_user) as response:
        user_data = json.loads(response.read().decode('utf-8'))
        username = user_data["login"]
        print(f"Authenticated as user: '{username}'")
except Exception as e:
    print("Error fetching user profile:", e)
    sys.exit(1)

# 2. Check if repository already exists
repo_url = f"https://api.github.com/repos/{username}/{repo_name}"
print(f"Checking if repository '{username}/{repo_name}' already exists...")
req_repo = urllib.request.Request(repo_url, headers=headers)
repo_exists = False
try:
    with urllib.request.urlopen(req_repo) as response:
        print(f"Repository '{repo_name}' already exists on GitHub!")
        repo_exists = True
except urllib.error.HTTPError as e:
    if e.code == 404:
        print(f"Repository '{repo_name}' does not exist yet.")
    else:
        print("Error checking repository:", e)
        sys.exit(1)
except Exception as e:
    print("Error checking repository:", e)
    sys.exit(1)

# 3. Create repository if it doesn't exist
if not repo_exists:
    print(f"Creating private repository '{repo_name}'...")
    create_url = "https://api.github.com/user/repos"
    payload = json.dumps({
        "name": repo_name,
        "description": "Dashboard financiero premium unificado",
        "private": True,
        "auto_init": False
    }).encode('utf-8')
    
    req_create = urllib.request.Request(create_url, data=payload, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req_create) as response:
            create_data = json.loads(response.read().decode('utf-8'))
            print(f"SUCCESS: Created repository '{repo_name}' at {create_data['html_url']}")
    except Exception as e:
        print("Error creating repository:", e)
        sys.exit(1)

# 4. Print push information
clone_url = f"https://github.com/{username}/{repo_name}.git"
print(f"\nTarget Clone URL: {clone_url}")
print(f"Push URL (authenticated): https://{token}@github.com/{username}/{repo_name}.git")
