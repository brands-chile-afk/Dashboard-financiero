import urllib.request
import csv
import io

url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTj1EanSaF9L7EOt7uzJkaYM-4nSiJSe4cRG7Zp4oVai10WUghucUCUEhsHPcqnCFEAWyKLDD1AIyzB/pub?output=csv&gid=365647797"

def is_intercompany_transfer(description):
    if not description:
        return False
    desc = description.lower()
    
    # 1. Detección de traspasos entre empresas hermanas (GMD y Grafhika)
    is_transfer = 'traspaso' in desc or 'transf' in desc or 'transfe' in desc or 'tef' in desc or 'trasp' in desc
    if is_transfer:
        has_gmd = 'gmd' in desc or 'grupo marketing digital' in desc or 'grupo marketing' in desc
        has_grafhika = 'grafhika' in desc or 'copy center' in desc or 'copycenter' in desc
        if has_gmd or has_grafhika:
            return True
            
    # 2. Detección de Rescates de Fondos Mutuos (movimientos internos de activos entre FFMM y Caja)
    is_rescate = 'rescate' in desc and ('fondo' in desc or 'ffmm' in desc or 'mutuo' in desc)
    if is_rescate:
        return True
        
    return False

try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
    
    f = io.StringIO(html)
    reader = csv.reader(f)
    rows = list(reader)
    
    for idx, r in enumerate(rows[1:]):
        if len(r) < 2 or not r[1]:
            continue
        desc = r[1]
        if 'rescate' in desc.lower():
            res = is_intercompany_transfer(desc)
            print(f"Row {idx+1}: Desc='{desc}' | is_intercompany_transfer={res} | Monto={r[2]} | Tipo={r[3]}")
except Exception as e:
    print("Error:", e)
