import urllib.request
import csv
import io

endpoints = {
    'gastos': '2058514573',
    'creditos': '690377335',
    'finiquitos': '1916149630',
    'cobranza': '602912984',
    'sueldos': '998795265',
    'gastosFijos': '1222067969'
}

sheet_base = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTj1EanSaF9L7EOt7uzJkaYM-4nSiJSe4cRG7Zp4oVai10WUghucUCUEhsHPcqnCFEAWyKLDD1AIyzB/pub?output=csv&gid='

for name, gid in endpoints.items():
    url = sheet_base + gid
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
        
        f = io.StringIO(html)
        reader = csv.reader(f)
        rows = list(reader)
        
        print(f"\n--- INSPECTING SHEET: {name} ({len(rows)} rows) ---")
        matches = 0
        for idx, r in enumerate(rows):
            row_str = " | ".join(r).lower()
            # Look for intercompany transfer or sister company keywords
            if 'gmd' in row_str or 'grafhika' in row_str or 'grupo marketing' in row_str or 'copy center' in row_str:
                print(f"Row {idx}: {' | '.join(r)}")
                matches += 1
                if matches >= 10:
                    print("... truncated ...")
                    break
        if matches == 0:
            print("No sister company keywords found.")
            
    except Exception as e:
        print(f"Error reading {name}: {e}")
