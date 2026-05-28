import urllib.request
import json

keys = [
    "AIzaSyBtSZRpBnkfBaCzxkeFptH9qTpu609JK70",
    "AIzaSyCGmePPRezwaEkm26gMWfm6NsDv44d0rQI"
]

for key in keys:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={key}"
    headers = {"Content-Type": "application/json"}
    body = {
        "contents": [{"parts": [{"text": "Say OK in a single word."}]}]
    }
    
    req = urllib.request.Request(url, data=json.dumps(body).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            data = json.loads(res_body)
            print(f"Key: {key[:8]}... SUCCESS!")
            print(data['candidates'][0]['content']['parts'][0]['text'])
    except Exception as e:
        print(f"Key: {key[:8]}... FAILED: {e}")
