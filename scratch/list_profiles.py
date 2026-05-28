import os
chrome_path = os.path.expandvars(r'%LOCALAPPDATA%\Google\Chrome\User Data')
edge_path = os.path.expandvars(r'%LOCALAPPDATA%\Microsoft\Edge\User Data')

if os.path.exists(chrome_path):
    print("Chrome profiles:")
    for item in os.listdir(chrome_path):
        if os.path.isdir(os.path.join(chrome_path, item)):
            ls_path = os.path.join(chrome_path, item, 'Local Storage', 'leveldb')
            if os.path.exists(ls_path):
                print(f"  Chrome: {item} has leveldb")

if os.path.exists(edge_path):
    print("\nEdge profiles:")
    for item in os.listdir(edge_path):
        if os.path.isdir(os.path.join(edge_path, item)):
            ls_path = os.path.join(edge_path, item, 'Local Storage', 'leveldb')
            if os.path.exists(ls_path):
                print(f"  Edge: {item} has leveldb")
