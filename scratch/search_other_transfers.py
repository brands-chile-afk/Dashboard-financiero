import urllib.request
import csv
import io

url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTj1EanSaF9L7EOt7uzJkaYM-4nSiJSe4cRG7Zp4oVai10WUghucUCUEhsHPcqnCFEAWyKLDD1AIyzB/pub?output=csv&gid=365647797"

try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
    
    f = io.StringIO(html)
    reader = csv.reader(f)
    rows = list(reader)
    
    print("--- TRANSACTIONS CONTAINING SISTER KEYWORDS BUT NOT 'traspaso/transf' ---")
    matches = 0
    for idx, r in enumerate(rows[1:]):
        if len(r) < 2 or not r[1]:
            continue
        desc = r[1].lower()
        
        has_keywords = 'gmd' in desc or 'grafhika' in desc or 'grupo marketing' in desc or 'copy center' in desc
        is_trans = 'traspaso' in desc or 'transf' in desc or 'transfe' in desc or 'trasp' in desc
        
        if has_keywords and not is_trans:
            print(f"Row {idx+1}: Date={r[0]} | Desc='{r[1]}' | Monto={r[2]} | Tipo={r[3]} | Banco={r[4]}")
            matches += 1
            
    print(f"Total matches found: {matches}")
except Exception as e:
    print("Error:", e)
