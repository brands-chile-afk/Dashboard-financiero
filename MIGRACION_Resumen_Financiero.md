# Migración del Resumen Financiero a otro computador o a la nube

> Creado el 2026-11-19. Complementa `Documentacion_Final_Dashboard.md` (secciones 16 y 17), que explica **cómo** se hace el resumen. Este documento explica **qué hay que llevar** y **dónde puede correr**.
> Aquí no hay contraseñas ni claves: solo dónde están. Al copiarlas, hacerlo por un medio seguro (pendrive propio o gestor de contraseñas), nunca por correo, GitHub ni chat.

---

## 1. Qué se produce y con qué

| Entregable | Script principal | Se envía |
|---|---|---|
| `scratch/Resumen_y_Pagos_DD-MM-AAAA.pdf` (4 páginas: resumen, caja y pagos del mes, créditos vs inversiones, hoja de pagos) | `scratch/gen_resumen_DDMM.py` + `scratch/unir_resumen_sinflujo.py` + `scratch/gen_pagos_semanas.py` | Sí (todos los días) |
| `scratch/Flujo_Caja_DD-MM-AAAA.pdf` y `analisis/Flujo_Caja_8_Semanas_DD-MM-AAAA.xlsx` | `analisis/flujo_caja.py` + `analisis/recalc_flujo.ps1` + `analisis/gen_flujo_pdf.py` | Solo si Brandon lo pide |
| `analisis/Analisis_Gastos_2026.xlsx` y `scratch/Gastos_2026_y_Proyeccion.pdf` | `analisis/cartolas_*.py` + `scratch/gen_gastos_pdf.py` | A pedido |

Flujo diario completo: ver `Documentacion_Final_Dashboard.md`, sección 16 ("Pasos" y "Envío automático diario").

---

## 2. Dependencias

### 2.1 Fuentes de datos
| Fuente | Cómo se lee | Requisito |
|---|---|---|
| Planilla Google "Base movimientos" (`10T__JciuHVK9ogMxL5cQTIMPxz5ef0qISAplO7Ku2mU`): Movimientos, Gastos, Creditos, SUELDOS, GASTOS_FIJOS, Fondos | `sii-dashboard/gsheets.py` (cuenta de servicio) | Archivo JSON de la cuenta de servicio |
| Saldos y cartolas bancarias | Los carga el **VPS** (`brands-vps`) en la planilla; Santander, BCI, Banco Consorcio e Inversiones Santo Domingo son manuales por **Taildrop** | Tailscale instalado y con sesión |
| Libro de cobranza de Gloria (`2026 LIBRO VENTA GMD - COBRANZA_ original.xlsx`) | Copia local desde OneDrive | OneDrive de Brandon sincronizado (`C:\Users\brand\OneDrive\Grafhika\...\Grafhika Gloria\Libro Venta - GMD\`) |
| SII (ventas, compras, IVA) | `sii-dashboard/ingest.py` → `sii-dashboard/sii.db` | Certificados digitales `.pfx` + contraseñas en `.env` |
| Cartolas históricas (análisis de gastos) | Carpeta compartida **2026_CAD** en OneDrive (`C:\Users\brand\OneDrive\G M D`, `I M P R E S O R E S`, `INV STO DOMINGO`) | OneDrive con la carpeta agregada a "Mis archivos" |

### 2.2 Credenciales (NO están en este documento; copiar aparte y de forma segura)
| Qué | Ruta actual |
|---|---|
| Cuenta de servicio de Google Sheets | `C:\Users\brand\Desktop\Claude\N8n, openclaw\02 - Codigo fuente\scraper-bancario\google_sheets_credentials.json` |
| Certificados SII | `C:\Users\brand\Desktop\Claude\Certificado ecert brandon.pfx` (Grafhika, Inversiones, Editorial) y `Certificado E-Certchile BRIAN.pfx` (GMD) |
| Contraseñas de los certificados | `.env` en `N8n, openclaw\02 - Codigo fuente\scraper-bancario\` (variables `SII_CERT_PASSWORD_*`; el mismo archivo tiene credenciales bancarias que **no** usa el resumen) |
| Rutas de todo lo anterior | `sii-dashboard\config.json` (ajustar si cambian las rutas en el PC nuevo) |

### 2.3 Software
| Programa | Para qué | Notas |
|---|---|---|
| Python 3.11 + `pandas`, `openpyxl`, `pypdf`, `xlrd`, `requests`, `cryptography` | Todo | `pip install pandas openpyxl pypdf xlrd requests cryptography` |
| Microsoft Excel (escritorio) | Recalcular el Excel del flujo (`recalc_flujo.ps1`, vía COM) | Solo Windows. En la nube se reemplaza (ver §4) |
| Google Chrome | Imprimir los PDF (`chrome.exe --headless --print-to-pdf`) | Ruta usada: `%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe` |
| OneDrive | Libro de cobranza y cartolas 2026_CAD | Sesión de Brandon |
| Tailscale | Enviar cartolas manuales al VPS | `tailscale file cp <archivo> brands-vps:` |
| App de escritorio de Claude (Claude Code) | Ejecutar todo, tarea programada, Remote Control | Misma cuenta |

---

## 3. Mover a otro computador (Windows)

1. **Instalar**: Python 3.11, los paquetes de §2.3, Excel, Chrome, OneDrive (con la sesión de Brandon), Tailscale (con la misma cuenta) y la app de Claude.
2. **Copiar carpetas** (mismas rutas si es posible, para no tocar los scripts):
   - `C:\Users\brand\Desktop\Claude\Dashboard financiero\` (scripts, `analisis\`, `scratch\`, documentación).
   - `C:\Users\brand\Desktop\Claude\sii-dashboard\` (incluye `sii.db`; **fuera de OneDrive**).
   - Solo lo necesario de `N8n, openclaw\02 - Codigo fuente\scraper-bancario\`: `google_sheets_credentials.json` y `.env`.
   - Certificados `.pfx`.
3. **Si cambian las rutas** (otro usuario de Windows): actualizar `sii-dashboard\config.json` y buscar `C:\Users\brand` en los scripts (`flujo_caja.py`, `cobranza_base.py`, `recalc_flujo.ps1`, `gen_pagos_semanas.py`, `gen_resumen_*.py`).
4. **Memoria de Claude**: copiar `docs_claude\memoria\*.md` (en esta carpeta) a la memoria del proyecto en el PC nuevo: `C:\Users\<usuario>\.claude\projects\<carpeta-del-proyecto>\memory\` (incluye `MEMORY.md`). Si no, basta con decirle a Claude al empezar: "lee `MIGRACION_Resumen_Financiero.md`, `Documentacion_Final_Dashboard.md` y `docs_claude\memoria\`".
5. **Tarea programada diaria**: está en `docs_claude\tarea_programada_SKILL.md`. En el PC nuevo, pedirle a Claude: "crea la tarea programada diaria con este prompt, lunes a viernes 11:00". Luego conectar Gmail en la app y hacer "Run now" una vez para aprobar permisos.
6. **Probar**: pedir "actualiza el resumen" y comparar con el último PDF de este PC.

---

## 4. Mover a la nube (opciones)

| Opción | Qué resuelve | Qué falta / costo de cambio |
|---|---|---|
| **A. Remote Control (hoy)** | Manejar todo desde el celular o la web (claude.ai/code, app de Claude → Code) | El PC tiene que estar prendido con la app abierta |
| **B. PC/VM Windows en la nube** (Azure, AWS, Windows 365) | Es "otro computador" siempre prendido: funciona igual que §3, con Excel, Chrome, OneDrive y la tarea programada | Costo mensual de la VM y licencia de Office; instalar todo como en §3 y usar Remote Control para entrar desde el celular |
| **C. VPS Linux existente (`brands-vps`)** | Ya tiene el scraper bancario, Tailscale y n8n; correría el resumen sin depender del PC | Hay que adaptar: (1) recalcular el flujo **sin Excel** (calcular en Python o con LibreOffice), (2) PDF con Chrome/Chromium headless en Linux, (3) el libro de cobranza y las cartolas 2026_CAD por **Microsoft Graph / rclone** en vez de OneDrive local, (4) llevar certificados y credenciales al VPS, (5) Claude Code CLI en Linux + `cron` para la tarea diaria y envío de correo (o n8n, que también podría mandarlo por WhatsApp) |
| **D. Sesión de Claude en la nube** | — | No sirve sola: no tiene acceso a OneDrive, Excel, certificados ni a la planilla con estas credenciales |

**Recomendación:** seguir con **A** mientras el PC esté disponible. Si se quiere independencia del PC, **B** es el camino con menos cambios. **C** es la más barata a largo plazo, pero requiere una adaptación de los scripts (sobre todo reemplazar Excel y OneDrive).

---

## 5. Inventario de scripts

### `Dashboard financiero\analisis\`
- `cobranza_base.py` — lee el libro de cobranza (copia local) y deja `cobranza_base.json`.
- `flujo_caja.py` — modelo de flujo 8 semanas (lee `datos_DDMM\planilla.json` y `cobranza_base.json`); `recalc_flujo.ps1` lo recalcula con Excel y exporta `flujo_valores.json`; `gen_flujo_pdf.py` arma el HTML del flujo.
- `clasif_egresos.py` — clasifica egresos de la cartola (recuadro "lo realmente pagado").
- `cartolas_leer.py`, `cartolas_pdf.py`, `cartolas_base.py`, `cartolas_clasificar.py`, `cartolas_analisis.py` — análisis de gastos desde 2026_CAD.
- `datos_DDMM\planilla.json` — foto diaria de la planilla (sirve para comparar día contra día).

### `Dashboard financiero\scratch\`
- `gen_resumen_DDMM.py` — páginas del resumen (cada día se copia el del día anterior y se actualizan saldos, textos y "Qué cambió"). Base CSS: `resumen_2910.css`.
- `unir_resumen_sinflujo.py DDMM` — une las páginas del resumen.
- `gen_pagos_semanas.py AAAA-MM-DD HH:MM` — hoja de pagos (semana en curso y la siguiente).
- `gen_gastos_pdf.py` — PDF del análisis de gastos.

### `sii-dashboard\`
- `ingest.py` (`--resumenes --desde AAAA-MM --hasta AAAA-MM --sin-sheets`; detalle `--periodo AAAA-MM --empresa X --solo ventas`), `gsheets.py`, `config.json`, `sii.db`. Ver su `README.md` y `GUIA_CONEXION_SII.md`.

---

## 6. Reglas de negocio que no deben perderse
Están en `docs_claude\memoria\` y en `Documentacion_Final_Dashboard.md`. Las más importantes:
- Iniciar OneDrive antes de leer el libro de cobranza; el libro de Gloria es la fuente oficial de pendientes y factoring.
- Conciliar Gastos y Créditos con las cartolas: marcar "Pagado" solo lo que calza exacto; lo dudoso se pregunta.
- Cheques y cuotas siempre desde la planilla, nunca escritos a mano.
- Se envía un solo PDF (resumen + pagos); el flujo de caja solo cuando se pide.
- Transferencias a la familia Villarroel: sueldos de Brian, Brandon, Leonardo, Yerko y Eric van en remuneraciones; Brian paga los impuestos de GMD y Brandon los de Grafhika; Jorge = retiros. No se nombran en los PDF.
- Sueldos se verifican contra los archivos de RRHH, no contra la pestaña SUELDOS.
- Inversiones Santo Domingo, Santander, BCI y Banco Consorcio se actualizan solo cuando llega su cartola (Taildrop al VPS).
