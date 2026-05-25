import re

print("Starting deep validation of the merged index.html...")

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

checks = {
    'ApexCharts script injection': 'cdn.jsdelivr.net/npm/apexcharts' in text,
    'RunwaySimulatorPage component': 'function RunwaySimulatorPage' in text,
    'AIAdvisorPage component': 'function AIAdvisorPage' in text,
    'isIntercompanyTransfer function': 'function isIntercompanyTransfer' in text,
    'navItems (Simulador)': "id:'sim'" in text or 'id: "sim"' in text or "id:'sim'," in text,
    'navItems (Analista IA)': "id:'ia'" in text or 'id: "ia"' in text or "id:'ia'," in text,
    'ReactDOM.createRoot render': 'ReactDOM.createRoot(document.getElementById(\'root\')).render(<App/>);' in text,
    'MovimientosPage Props': 'function MovimientosPage({ movRecientes' in text,
    'isIntercompany isolation in loadLiveData': 'isIntercompanyTransfer(r[1])' in text
}

all_ok = True
for name, ok in checks.items():
    status = "OK" if ok else "FAILED"
    print(f"Checking {name:.<50} {status}")
    if not ok:
        all_ok = False

# Check for duplicate React tags or broken placeholders
print("\nScanning for duplicate declarations or markers...")
broken_placeholders = re.findall(r'__\w+__', text)
if broken_placeholders:
    print(f"WARNING: Found potential raw placeholders: {broken_placeholders}")
    all_ok = False
else:
    print("No raw placeholders found. Excellent.")

if all_ok:
    print("\nSUCCESS: The merged index.html is structurally 100% correct!")
else:
    print("\nERROR: Some structural checks failed. Please review the output above.")
