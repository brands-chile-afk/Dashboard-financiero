# Documentación del Proyecto: Dashboard Financiero (Grafhika & GMD)

Documento único y actualizado con la arquitectura, configuración, módulos, historial de cambios y roadmap del Dashboard Financiero.

> Última actualización: 2026-06-17

---

## 1. Arquitectura y Stack Tecnológico

- **Frontend**: HTML5 + Vanilla CSS + React 18.3.1 (CDN + Babel standalone para compilación en caliente en el navegador). **Todo el código vive en un único archivo: `index.html`** — componentes React, lógica de datos, estilos CSS y credenciales Firebase están embebidos directamente.
- **Diseño y UI**: Interfaz "premium" estilo Glassmorphism, modo claro/oscuro, micro-animaciones, renderizado reactivo sin recargar.
- **Gráficos**: ApexCharts (CDN).
- **Parsing Excel cliente**: SheetJS/XLSX.js v0.18.5 (CDN) — usado en `UploadVentasPanel`, `UploadNominaPanel`, `UploadMovPanel`.
- **Backend / BaaS**: Firebase SDK v10.8.0 (librería **compat**). Servicios:
  - `Firebase Authentication` — login con Google OAuth.
  - `Cloud Firestore` — persistencia de datos compartidos y configuración de usuarios.
- **Servidor local**: Node.js (`server.js`) puerto `3000`. Sin caché (headers explícitos `no-cache`). Lanzar con `node server.js` o `npm start`. Si falla con `EADDRINUSE`, ya hay una instancia corriendo — es benigno.
- **Despliegue**: GitHub rama `main`. Repositorio: `brands-chile-afk/Dashboard-financiero`. (El remote local apunta a la URL en minúsculas y funciona por redirect de GitHub — hay un TODO pendiente para actualizarlo.)

---

## 2. Fuente de Datos: Google Sheets en vivo

La app consume en paralelo (fetch CSV publicado, asíncrono) las pestañas del archivo **"Base movimientos"** de Google Sheets. La URL base es:

```
https://docs.google.com/spreadsheets/d/e/2PACX-1vTj1EanSaF9L7EOt7uzJkaYM-4nSiJSe4cRG7Zp4oVai10WUghucUCUEhsHPcqnCFEAWyKLDD1AIyzB/pub
```

Se agrega `?gid=GID&output=csv` para cada pestaña:

| Módulo       | GID          | Notas                                          |
|--------------|--------------|------------------------------------------------|
| Movimientos  | (principal)  | Primera hoja, sin GID extra                    |
| Gastos       | 2058514573   |                                                |
| Créditos     | 690377335    |                                                |
| Finiquitos   | 1916149630   |                                                |
| Cobranza     | 602912984    | Puede ser sobreescrita por carga manual Excel  |
| Sueldos      | 998795265    | Contiene **dos tablas** (ver sección 5)         |
| Gastos Fijos | 1222067969   |                                                |

- Hay caché de arranque en `localStorage` para minimizar el tiempo de carga inicial.
- Los GIDs están definidos como constantes en `index.html` (`GID_SUELDOS`, etc.).

---

## 3. Seguridad, Roles y Firebase

### Autenticación y whitelist

- Login obligatorio con cuenta Google (OAuth).
- Tras el login consulta la colección `allowed_users` en Firestore usando el `email` como ID del documento. Si no existe o `activo: false`, se cierra sesión y se muestra `PinLock`.
- **Roles**: cada usuario tiene `rol` y `modulos` (arreglo de páginas permitidas). El Sidebar se renderiza dinámicamente ocultando módulos no asignados. Si se fuerza la navegación vía `localStorage`, un `useEffect` redirige a `home`.
- **Solicitud de acceso**: usuarios no autorizados pueden enviar solicitud (escribe en `/access_requests` + `/mail` para la extensión *Trigger Email*). Los admins ven badge rojo en vivo (`onSnapshot`) y aprueban con 1 click.

### Firebase config

- **Proyecto ID**: `dashboard-93457`
- **Base de datos**: Cloud Firestore modo Nativo, instancia `(default)`. ⚠️ El SDK compat v10.8.0 **no soporta nombres de BD personalizados** — debe ser `(default)`.
- Las API keys web de Firebase son públicas por diseño; la seguridad real está en las reglas de Firestore.

### Reglas de Firestore (completas — documentadas aquí para referencia)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /allowed_users/{email} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // ⚠️ PENDIENTE AGREGAR (ver sección 7):
    // match /shared_data/{docId} {
    //   allow read: if true;
    //   allow write: if request.auth != null;
    // }
  }
}
```

---

## 4. Módulos y Páginas

### Orden del menú lateral (actual):
`Resumen → Movimientos → Proyección → Ventas → Fondos → Créditos → Finiquitos → Simulador → Analista IA → Nube Cloud → Accesos y Roles`

> **Simulador** fue movido intencionalmente debajo de **Finiquitos** el 2026-06-16.

### Descripción de módulos:

- **Resumen (home)**: KPIs de caja, cobranza vencida, nómina del mes, anticipos, gastos fijos.
- **Movimientos (mov)**: Conciliación colaborativa. Ajustes provisionales de caja e iconos `💬` por transacción para cambiar estado — guardado en Firestore con responsable y comentario. Data slicing: 50–100 filas más relevantes.
- **Proyección/Egresos (gas)**: Nómina de sueldos + anticipos + gastos fijos. Dos tarjetas separadas: `NominaSectionCard` y `AnticiposSectionCard` (leídas desde la hoja SUELDOS de Google Sheets).
- **Ventas/Cobranza (ven)**: Facturas pendientes con filtros de estado, búsqueda global, resumen por ejecutivo, top clientes. Botón de **subida manual de Excel** (`UploadVentasPanel`) que sobreescribe los datos de Google Sheets y los persiste en Firestore.
- **Fondos (fon)**: Saldos bancarios por banco.
- **Créditos (cre)**: Créditos y préstamos activos desde Google Sheets.
- **Finiquitos (fin)**: Finiquitos pendientes y préstamos a trabajadores.
- **Simulador (sim)**: Gráfico de área con línea de déficit ($0). Switches para incluir/excluir: remuneraciones **(sueldos + anticipos)**, créditos, gastos fijos, finiquitos y gastos variables. Tabla con desglose transparente día a día o mes a mes.
- **Analista IA (ia)**: CFO virtual. Modo offline (NLP local) + modo online (Gemini 2.5 Flash con API Key). Runway usa `sueldosTotal + anticiposTotal + fijosTotal` en el denominador.
- **Nube Cloud (cloud)**: Panel de configuración de Firebase/Firestore.
- **Accesos y Roles (admin)**: Gestión de `allowed_users`, aprobación de solicitudes de acceso, audit log.

---

## 5. Hoja SUELDOS — Dos Tablas

La pestaña SUELDOS de Google Sheets tiene **dos tablas en paralelo** separadas por una columna vacía:

- **Tabla 1 – Sueldos** (columnas aprox. A–G): empresa, rut, nombre, monto, banco, tipo cuenta, n° cuenta.
- **Tabla 2 – Anticipos** (columnas aprox. I–O): mismas columnas.

### Cómo el dashboard las detecta (bloque SUELDOS en `loadLiveData`, ~línea 4665–4795 de `index.html`):

1. Parsea el CSV de la hoja SUELDOS.
2. Identifica el header de la Tabla 1 (fila con más coincidencias de keywords de sueldos).
3. Mapea columnas: empresa (`emp`), nombre (`nom`), monto (`mto`).
4. Detecta la **columna separadora vacía** (primera columna después del monto de Tabla 1 cuyo header es `''`).
5. Busca **a la derecha** de esa separadora las columnas empresa/nombre/monto de la Tabla 2.
6. Agrupa por empresa en `ANTICIPOS_DATA` (global).

### Variables globales de nómina:

```javascript
let NOMINA_DATA    = [];  // { empresa, personas, monto } — desde Excel nómina manual
let NOMINA_MES     = '';  // ej. 'Marzo 2026'
let ANTICIPOS_DATA = [];  // { empresa, personas, monto } — 2da tabla hoja SUELDOS
```

### Filtro anti-fila-TOTALES (crítico):

```javascript
// NOMINA_DATA: descarta filas donde AMBOS emp y nom estén vacíos
if(mto<=0 || (!emp&&!nom) || /^total/i.test(emp) || /^total/i.test(nom)) return;

// ANTICIPOS_DATA: exige nombre del beneficiario (la fila de TOTALES tiene monto pero no nombre)
if(!nom || mto<=0 || /^total/i.test(emp) || /^total/i.test(nom)) return;
```

> **Por qué**: La hoja SUELDOS tiene una fila TOTALES al final (monto presente, empresa y nombre vacíos). Sin este filtro, el total de nómina se duplicaba ($55M en vez de $27M) porque la fila fantasma se agrupaba como empresa adicional con key `''`.

### Cómo se consumen los anticipos:

- **`AnticiposSectionCard`** (~línea 1810): componente separado, renderizado en la página Proyección después de `NominaSectionCard`. Retorna `null` si `ANTICIPOS_DATA.length === 0`.
- **KPI "Anticipos del Mes"**: aparece en el grid de KPIs de Proyección (solo si hay anticipos).
- **Simulador**: checkbox "Remuneraciones (Sueldos + Anticipos)" controla ambos. Se pagan el día 30.
- **Analista IA**: runway usa `sueldosTotal + anticiposTotal + fijosTotal` en el denominador.

---

## 6. Carga Manual de Excel — Módulo Ventas/Cobranza

### Por qué existe

La cobranza en Google Sheets (GID 602912984) puede estar desactualizada. El usuario puede subir directamente el Excel mensual `LIBRO VENTA GMD - COBRANZA.xlsx` para reemplazar los datos en tiempo real sin pasar por Google Sheets.

### Componente: `UploadVentasPanel` (~línea 3376 de `index.html`)

**Bug corregido (2026-06-17)** — detección incorrecta de la fila de encabezados:

El archivo tiene esta estructura en las primeras filas:

| Fila | Contenido                                                                          |
|------|------------------------------------------------------------------------------------|
| 0    | Título ("seguimiento COBRANZA - ...")                                               |
| 1    | Labels de KPIs ("N° FACTURAS PENDIENTES", "TOTAL FACTURAS", "POR COBRAR", etc.)   |
| 2    | Valores KPI (54, 155199690, 153722295, ...)                                        |
| 3    | Label de sección                                                                   |
| **4**| **Encabezados reales** (CÓDIGO LEGAL, RAZÓN SOCIAL, FOLIO, F/EMISION, TOTAL FACTURADO, SALDO PENDIENTE, OBSERVACIONES, VENCIMIENTO, DÍAS VENCIDO, HOY, ESTADO, COMENTARIO COBRANZA, ABONOS, ORIGEN) |
| 5+   | Datos de facturas                                                                  |

**Algoritmo anterior (incorrecto):**
```javascript
let headerRowIdx = rawRows.findIndex(row =>
  row.filter(c => headerKeywords.test(String(c))).length >= 2
);
// → detectaba la fila 1 (labels de KPIs con "TOTAL FACTURAS") en vez de la fila 4 real
```

**Algoritmo corregido (best-score):**
```javascript
const headerKeywords = /folio|factura|empresa|cliente|nombre|rut|codigo legal|código legal|total|monto|saldo|estado|fecha|emision|emisión|venc|ejecut|vendedor|neto|importe|observ|origen/i;
let headerRowIdx = 0, bestScore = 0;
const scanLimit = Math.min(rawRows.length, 25);
for (let i = 0; i < scanLimit; i++) {
  const score = rawRows[i].filter(c => headerKeywords.test(String(c))).length;
  if (score > bestScore) { bestScore = score; headerRowIdx = i; }
}
if (bestScore < 2) headerRowIdx = 0;
```

También corregido: `find('rut')` → `find('rut','código legal','codigo legal')` para mapear correctamente la columna RUT/Código Legal del archivo real.

**Validado contra el archivo real**: 54 facturas, $155,199,690 total facturado, $153,722,295 saldo pendiente — coincide exactamente con los KPIs de la hoja.

### Persistencia en Firestore (`shared_data/cobranza`)

**Problema**: al recargar la página o acceder desde otra cuenta, los datos de la carga manual desaparecían (vivían solo en variables globales en memoria).

**Solución implementada**: guardar en Firestore colección `shared_data`, documento `cobranza`, compartido entre todos los usuarios autenticados.

**Al subir el Excel — `handleCobImport` (~línea 4857, ahora `async`):**

```javascript
const handleCobImport = async (res) => {
  COB_KPIS = res.kpis;
  COB_POR_MES = res.porMes;
  COB_POR_EJECUTIVO = res.porEj;
  COB_TOP_CLIENTES = res.topClientes;
  COB_PENDIENTES = res.pending;
  setCobVersion(v => v+1);
  try {
    const user = firebase.auth().currentUser;
    if (db && user) {
      await db.collection('shared_data').doc('cobranza').set({
        pending: res.pending, kpis: res.kpis, porMes: res.porMes,
        porEj: res.porEj, topClientes: res.topClientes,
        fileName: res.file || '', sheetName: res.sheetName || '',
        uploadedBy: user.email || '', uploadedAt: Date.now()
      });
      console.log('☁️ Cobranza guardada en la nube (shared_data/cobranza).');
    }
  } catch(e){ console.warn('Error al guardar cobranza en la nube:', e.message); }
};
```

**Al cargar la app — bloque en `loadLiveData` (~línea 4801, después del fetch de FINIQUITOS):**

```javascript
// ── COBRANZA MANUAL (override desde Firestore, compartido entre cuentas) ──
try {
  if(db){
    var cobDoc = await db.collection('shared_data').doc('cobranza').get();
    if(cobDoc.exists){
      var cd = cobDoc.data();
      if(cd && cd.pending && cd.pending.length){
        COB_PENDIENTES  = cd.pending;
        if(cd.kpis)        COB_KPIS           = cd.kpis;
        if(cd.porMes)      COB_POR_MES        = cd.porMes;
        if(cd.porEj)       COB_POR_EJECUTIVO  = cd.porEj;
        if(cd.topClientes) COB_TOP_CLIENTES   = cd.topClientes;
        setCobVersion(function(v){ return v+1; });
        console.log('✅ COBRANZA cargada desde carga manual (nube):', cd.pending.length, 'registros | Subido por:', cd.uploadedBy || '?');
      }
    }
  }
} catch(e){ console.warn('Cobranza manual (nube) no disponible:', e.message); }
```

> **La carga manual tiene prioridad sobre Google Sheets** — los datos de Firestore se leen después del fetch de Sheets y los sobreescriben si existen.

### ⚠️ Estado actual: BLOQUEADO por reglas de Firestore

El código está en su lugar, pero al probar aparece en consola:
```
[WARNING] Cobranza manual (nube) no disponible: Missing or insufficient permissions.
```

**Causa**: Firestore deniega por defecto colecciones sin regla explícita. La colección `shared_data` no tiene regla todavía. Ver sección 7.

---

## 7. Acción Pendiente Crítica — Regla Firestore para `shared_data`

### Pasos (los hace el usuario en Firebase Console — 30 segundos):

1. Ir a **Firebase Console** → proyecto `dashboard-93457`
2. **Firestore Database** → pestaña **Rules**
3. Dentro del bloque `match /databases/{database}/documents { ... }`, agregar:

```javascript
match /shared_data/{docId} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

4. Clic en **Publicar / Publish**

**Resultado esperado:**
- Al subir Excel: consola muestra `☁️ Cobranza guardada en la nube (shared_data/cobranza).`
- Al recargar o acceder desde otra cuenta: consola muestra `✅ COBRANZA cargada desde carga manual (nube): 54 registros | Subido por: usuario@email.com`

---

## 8. Variables Globales Clave (estado en memoria)

Declaradas con `let` al inicio de `index.html` (~líneas 530–560):

```javascript
// ── Cobranza ──────────────────────────────────────────────────────────────
let COB_KPIS = {};           // { totalFacturado, totalSaldo, countDocs, countVencido, ... }
let COB_POR_MES = {};        // { 'YYYY-MM': { total, saldo, count, pagado } }
let COB_POR_EJECUTIVO = {};  // { nombre: { total, saldo, count } }
let COB_TOP_CLIENTES = [];   // Top 20 clientes por monto
let COB_PENDIENTES = [];     // Array de facturas — la más importante

// ── Sueldos y Nómina ─────────────────────────────────────────────────────
let SUELDOS_DATA = [];       // { nombre, monto, dia_pago } — desde Google Sheets
let NOMINA_DATA  = [];       // { empresa, personas, monto } — desde Excel nómina mensual
let NOMINA_MES   = '';       // ej. 'Marzo 2026'
let ANTICIPOS_DATA = [];     // { empresa, personas, monto } — 2da tabla hoja SUELDOS

// ── Gastos ───────────────────────────────────────────────────────────────
let GASTOS_FIJOS_DATA = [];  // { descripcion, monto, dia_pago, categoria }
```

---

## 9. Estructura de Archivos

```
Dashboard financiero/
├── index.html                        ← App completa (EDITAR SOLO ESTE)
├── index.css                         ← Estilos premium (variables HSL, animaciones, modales)
├── server.js                         ← Servidor local Node.js (puerto 3000, no-cache headers)
├── package.json                      ← Dependencias
├── Documentacion_Final_Dashboard.md  ← Este documento
├── Guia_Firebase_Dashboard.txt       ← Referencia detallada de Firebase/Firestore
│
├── app.js                            ← ⚠️ LEGACY — no se usa, no lo carga index.html
├── dataProcessor.js                  ← ⚠️ LEGACY — no se usa
└── charts.js                         ← ⚠️ LEGACY — no se usa
```

> `app.js`, `dataProcessor.js` y `charts.js` son de una versión modular anterior. Se pueden eliminar sin consecuencias.

---

## 10. Git y Despliegue

- **Repositorio**: `https://github.com/brands-chile-afk/Dashboard-financiero`
- **Remote local**: apunta a `dashboard-financiero` en minúsculas. Funciona por redirect de GitHub. Para actualizar: `git remote set-url origin https://github.com/brands-chile-afk/Dashboard-financiero.git` (pendiente, no urgente).
- **Rama activa**: `main`

### Commits recientes:

| Hash      | Mensaje                                                             |
|-----------|---------------------------------------------------------------------|
| `142bff4` | Consolidar documentacion en un solo .md actualizado                |
| `4d9e93a` | Agregar anticipos (2da tabla SUELDOS) y corregir total de nomina   |
| `d26bfa7` | docs: add roadmap phase 3 to context prompt                        |
| `34ce45e` | docs: update context markdown for new chat migration               |
| `fc80eab` | feat: show cheques/gastos explicitly in simulator table            |

> ⚠️ **Los cambios de la sesión 2026-06-17** (fix `UploadVentasPanel` + persistencia Firestore en `handleCobImport`/`loadLiveData`) **están en `index.html` local pero NO commiteados ni pusheados.** Hacer commit + push después de confirmar que la regla de Firestore funciona correctamente.

---

## 11. Historial de Cambios

### 2026-06-17 (⚠️ pendiente de commit)
- **Fix `UploadVentasPanel`** — corrección del algoritmo de detección de fila de headers en el Excel de cobranza. El algoritmo anterior (`findIndex` con umbral ≥ 2) confundía la fila de labels de KPIs (fila 1) con los encabezados reales (fila 4). Reemplazado por algoritmo "best-score" que escanea las primeras 25 filas y elige la que tiene más coincidencias de keywords. Validado: 54 facturas, $155,199,690 total, $153,722,295 saldo.
- **Persistencia de cobranza en Firestore (`shared_data/cobranza`)**: `handleCobImport` convertido a `async`, guarda en Firestore tras la carga. `loadLiveData` lee el documento al arrancar y sobreescribe datos de Sheets si existe. **BLOQUEADO** hasta agregar regla en Firebase Console (ver sección 7).

### 2026-06-16
- **Anticipos (2da tabla SUELDOS)**: soporte completo — parsing automático de la 2da tabla de la hoja SUELDOS, componente `AnticiposSectionCard`, KPI "Anticipos del Mes", incluido como egreso en Simulador y Analista IA. Checkbox del simulador renombrado a "Remuneraciones (Sueldos + Anticipos)".
- **Fix nómina duplicada**: la fila de TOTALES de la hoja SUELDOS se contaba como empresa fantasma, duplicando el total ($55M en vez de $27M). Corregido filtrando filas donde `!emp && !nom`.
- **Menú reordenado**: Simulador movido debajo de Finiquitos.
- **Documentación**: consolidada en un solo .md (eliminado `Contexto_Conversacion_Dashboard.md`).
- **Commits pusheados**: `4d9e93a` y `142bff4`.

### Anteriores
- Conexión Firebase optimizada (plan Blaze), resolución del bug "client is offline" (la BD debe ser `(default)`).
- Data Slicing anti-freezing en tablas grandes.
- Flujo de solicitud de acceso + panel de aprobación de administrador con badge rojo en vivo.
- Analista IA Financiero (modo offline NLP local + Gemini 2.5 Flash).
- Conciliación colaborativa con iconos `💬` por transacción (estado en Firestore).
- Simulador Predictivo con switches y gráfico de área con línea de déficit.

---

## 12. Issues Conocidos / Pendientes

| # | Prioridad | Estado | Descripción |
|---|-----------|--------|-------------|
| 1 | **CRÍTICO** | Bloqueado | Regla Firestore `shared_data` no existe → carga de cobranza no persiste entre recargas ni cuentas. Solución: agregar regla en Firebase Console (ver sección 7). |
| 2 | Alta | Pendiente | Cambios de `index.html` (fix Ventas + persistencia Firestore) **no están commiteados**. Hacer `git add index.html && git commit && git push` después de verificar la regla. |
| 3 | Baja | Pendiente | Remote URL del repo local en minúsculas funciona por redirect. Para normalizar: `git remote set-url origin https://github.com/brands-chile-afk/Dashboard-financiero.git`. |
| 4 | Media | Sin investigar | Usuario reportó: "cuando subo la cartola de BCI no está actualizando en el VPS". Requiere aclaración: ¿dónde se sube el archivo? ¿qué proceso lo consume? ¿hay mensaje de error visible? ¿hay acceso SSH al VPS? |
| 5 | Baja | Pre-existente | Error recurrente en consola: `La operación 'saveConfigToCloud users update' tardó demasiado` (timeout al guardar config de usuario). No crítico, no introducido recientemente. |

---

## 13. Roadmap (Fase 3 — pendiente)

1. **Módulo de Tareas Inteligente (To-Do)**: leer `GASTOS_FIJOS_DATA` y generar checklist/alertas según el día actual (ej. "Pagar Maestro" el día 5), marcable como completado (estado en Firestore).
2. **Plantillas de WhatsApp para Cobranza**: botón en Ventas para clientes con +15 días de vencimiento que abra WhatsApp Web con mensaje de cobro pre-armado.
3. **Termómetro de Metas de Facturación**: indicador en Resumen que compare facturación del mes vs una meta configurable.
4. **Ingreso Rápido de Egresos sin Excel**: formulario/botón flotante para registrar gastos directo a la nube (Firestore).
