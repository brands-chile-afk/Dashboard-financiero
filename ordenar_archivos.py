# Ordena scratch\ y analisis\: mueve (no borra) lo diario y viejo a historico\AAAA-MM\ y deja un registro
# historico\movimientos_AAAA-MM-DD.csv para poder deshacer. Uso: python ordenar_archivos.py [--dry]
import os, re, sys, shutil, datetime, csv
BASE = os.path.dirname(os.path.abspath(__file__))
DRY = "--dry" in sys.argv
hoy = datetime.date.today()
movs = []
import subprocess
TRACKED = set(subprocess.run(["git", "ls-files"], cwd=BASE, capture_output=True, text=True).stdout.split("
"))  # no mover lo que está en GitHub

def mes_de(nombre, ruta):
    m = re.search(r"(\d{2})-(\d{2})-(2026)", nombre)
    if m: return f"{m.group(3)}-{m.group(2)}"
    m = re.search(r"_(\d{2})(\d{2})(?:[._]|$)", nombre)
    if m and 1 <= int(m.group(2)) <= 12: return f"2026-{m.group(2)}"
    return datetime.date.fromtimestamp(os.path.getmtime(ruta)).strftime("%Y-%m")

def mover(carpeta, nombre, sub):
    if f"{carpeta}/{nombre}" in TRACKED: return
    src = os.path.join(BASE, carpeta, nombre)
    dst_dir = os.path.join(BASE, carpeta, "historico", sub)
    movs.append((carpeta, nombre, os.path.join("historico", sub, nombre)))
    if not DRY:
        os.makedirs(dst_dir, exist_ok=True)
        shutil.move(src, os.path.join(dst_dir, nombre))

# ---------- scratch ----------
S = os.path.join(BASE, "scratch")
BASE_S = {"gen_pagos_semanas.py", "unir_resumen_sinflujo.py", "gen_gastos_pdf.py", "resumen_2910.css", "resumen_base.css",
          "pagos_semanas.html", "pagos_semanas.json", "gastos_2026.html", "Gastos_2026_y_Proyeccion.pdf",
          "Estimacion_Remuneraciones_Octubre_04-11-2026.pdf", "gen_remu_oct.py", "correo_hilo.json"}
VARIOS = re.compile(r"^(search_|test_|temp_|run_babel|validate_merge|_mk)")
fechas = sorted({m.group(1) for f in os.listdir(S) for m in [re.match(r"gen_resumen_(\d{4})\.py$", f)] if m}, key=lambda x: (x[2:], x[:2]))
ult = fechas[-1] if fechas else None                      # DDMM del último resumen
ult_fecha = f"{ult[:2]}-{ult[2:]}-2026" if ult else None
for f in sorted(os.listdir(S)):
    p = os.path.join(S, f)
    if os.path.isdir(p) or f in BASE_S: continue
    if ult and (ult in f or ult_fecha in f): continue      # lo del último día queda a la vista
    if VARIOS.match(f): mover("scratch", f, "varios"); continue
    mover("scratch", f, mes_de(f, p))

# ---------- analisis ----------
A = os.path.join(BASE, "analisis")
BASE_A = {"flujo_caja.py", "gen_flujo_pdf.py", "recalc_flujo.ps1", "cobranza_base.py", "clasif_egresos.py",
          "cartolas_leer.py", "cartolas_pdf.py", "cartolas_base.py", "cartolas_clasificar.py", "cartolas_analisis.py",
          "Flujo_Caja_8_Semanas.xlsx", "flujo_caja_8_semanas.html", "flujo_layout.json", "flujo_valores.json",
          "cobranza_base.json", "cobranza_original_copia.xlsx", "gastos_resumen.json", "Analisis_Gastos_2026.xlsx",
          "cartolas_base.pkl", "cartolas_clasif.pkl", "cartolas_2026"}
datos = sorted([d for d in os.listdir(A) if re.fullmatch(r"datos_\d{4}b?", d)], key=lambda d: (d[8:10], d[6:8], d))
keep_datos = set(datos[-3:])                                   # últimas 3 fotos de la planilla
xls = sorted([f for f in os.listdir(A) if re.fullmatch(r"Flujo_Caja_8_Semanas_\d{2}-\d{2}-2026\.xlsx", f)], key=lambda f: (f[24:26], f[21:23]))
keep_xls = set(xls[-1:])
for f in sorted(os.listdir(A)):
    p = os.path.join(A, f)
    if f in BASE_A or f in keep_datos or f in keep_xls or f == "historico": continue
    if f.startswith("datos_"): mover("analisis", f, "fotos_planilla"); continue
    mover("analisis", f, mes_de(f, p))

if not DRY:
    for c in ("scratch", "analisis"):
        reg = os.path.join(BASE, c, "historico", f"movimientos_{hoy}.csv")
        if any(m[0] == c for m in movs):
            with open(reg, "w", newline="", encoding="utf-8") as fh:
                csv.writer(fh).writerows([("carpeta", "archivo", "nuevo_lugar")] + [m for m in movs if m[0] == c])
print(("[simulación] " if DRY else "") + f"{len(movs)} archivos/carpetas movidos")
for c in ("scratch", "analisis"):
    print(c, "→", sum(1 for m in movs if m[0] == c))
