# Documentación del Proyecto: Dashboard Financiero (Grafhika & GMD)

Documento único y actualizado con la arquitectura, configuración, módulos, historial de cambios y roadmap del Dashboard Financiero.

> Última actualización: 2026-08-17

---

## 1. Arquitectura y Stack Tecnológico

- **Frontend**: HTML5 + Vanilla CSS + React 18.3.1 (CDN + Babel standalone para compilación en caliente en el navegador). **Todo el código vive en un único archivo: `index.html`** — componentes React, lógica de datos, estilos CSS y credenciales Firebase están embebidos directamente.
  - **React se carga en build de PRODUCCIÓN** (`react.production.min.js` / `react-dom.production.min.js`), no development. Todas las librerías se cargan con `defer` y **Babel es el último script** (al cargar, compila la app inline cuando React/Firebase/ApexCharts ya están listos). Ver sección 14 (Rendimiento).
- **Diseño y UI**: Interfaz "premium" estilo Glassmorphism, modo claro/oscuro, micro-animaciones, renderizado reactivo sin recargar.
- **Gráficos**: ApexCharts (CDN, **versión fija `@5.15.0`**).
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

| Módulo        | GID          | Notas                                          |
|---------------|--------------|------------------------------------------------|
| Movimientos   | (principal)  | Primera hoja, sin GID extra                    |
| Gastos        | 2058514573   |                                                |
| Créditos      | 690377335    |                                                |
| Finiquitos    | 1916149630   |                                                |
| Facturas      | 602912984    | Ex-"Cobranza" (renombrada por el usuario, mismo GID). Puede ser sobreescrita por carga manual Excel; el detalle de facturas del SII también hace merge acá (ver más abajo) |
| Sueldos       | 998795265    | Contiene **dos tablas** (ver sección 5)         |
| Gastos Fijos  | 1222067969   |                                                |
| compras       | 175442552    | **Nueva (2026-08)**. Detalle de compras del SII, publicado por `sii-dashboard` |
| cuadre iva    | 707671342    | **Nueva (2026-08)**. IVA débito/crédito/determinado por empresa y período, publicado por `sii-dashboard` |
| resumenes sii | 437226100    | **Nueva (2026-08)**. Resumen oficial por tipo de documento (`getResumen` del SII), publicado por `sii-dashboard` |

- Hay caché de arranque en `localStorage` para minimizar el tiempo de carga inicial.
- Los GIDs están definidos como constantes en `index.html` (`GID_SUELDOS`, `GID_RESUMENES_SII`, `GID_CUADRE_IVA`, etc.).

### Integración con el SII — proyecto hermano `sii-dashboard`

Las tres pestañas nuevas (`compras`, `cuadre iva`, `resumenes sii`) **no las llena una persona**: las escribe
un proyecto Python separado, `C:\Users\brand\Desktop\Claude\sii-dashboard\` (fuera de este repo, fuera de
OneDrive — se movió el 2026-08-17 porque OneDrive sincronizando un SQLite abierto en modo WAL es riesgo de
corrupción). Usa el certificado digital de cada empresa para autenticarse contra el SII, baja el RCV (`getResumen`,
2 llamadas por empresa y mes) y publica acá con una cuenta de servicio de Google
(`google-sheets@chatbot-ia-467202.iam.gserviceaccount.com`).

Correr una actualización manual:
```bash
cd "C:\Users\brand\Desktop\Claude\sii-dashboard"
python ingest.py --resumenes --desde 2026-01
```

**Comportamiento importante para quien edite esto — `cuadre iva` y `resumenes sii` se REGENERAN COMPLETAS en
cada corrida, no hacen merge.** Publicar filtrando por `--empresa` sin querer puede borrar a las demás empresas
de esas dos pestañas (pasó una vez, el 2026-08-17; el script ahora se niega a hacerlo en silencio y avisa por
consola, pero conviene saberlo). La pestaña **`Facturas` sí hace merge** por (empresa, tipo, folio) y respeta
las columnas manuales (ESTADO, COMENTARIO COBRANZA, ABONOS) — pero al día de esta nota **solo tiene el detalle
de julio 2026 cargado**; el resto de los meses solo están en el agregado de `cuadre iva`/`resumenes sii`, no
documento por documento. Si se necesita el detalle completo actualizado, correr `ingest.py --desde 2026-01`
(sin `--resumenes`) desde `sii-dashboard`.

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
`Movimientos → Proyección → Ventas → Fondos → Créditos → Finiquitos → Cuadre IVA → Simulador → Nube Cloud → Accesos y Roles`

> **Movimientos** es la **página de inicio por defecto** (el módulo **Resumen/`home` fue eliminado** el 2026-06-19). **Simulador** fue movido debajo de **Finiquitos** el 2026-06-16. **Cuadre IVA** se agregó el 2026-08-17 entre Finiquitos y Simulador; **Analista IA** se eliminó ese mismo día.
>
> **Un módulo nuevo no aparece solo.** El Sidebar filtra por los `modulos` permitidos de cada usuario en Firestore (`allowed_users/{email}`) — un usuario creado antes de que existiera "Cuadre IVA" no lo va a ver hasta que un Administrador se lo habilite manualmente desde **Accesos y Roles** (el checkbox aparece solo porque `UsuariosPage` arma la grilla dinámicamente a partir de `navItems`, no hace falta tocar código para eso).

### Descripción de módulos:

- ~~**Resumen (home)**~~ — **ELIMINADO (2026-06-19).** El id `'home'` sigue apareciendo como rama muerta en un par de condicionales (`n.id==='home'`) inofensivas. El botón "Subir Nómina" que vivía aquí se movió a la barra de **Proyección**.
- **Movimientos (mov)** *(página de inicio)*: Conciliación colaborativa. Ajustes provisionales de caja e iconos `💬` por transacción para cambiar estado — guardado en Firestore con responsable y comentario. Data slicing: 50–100 filas más relevantes.
- **Proyección/Egresos (gas)**: Nómina de sueldos + anticipos + gastos fijos. Dos tarjetas separadas: `NominaSectionCard` y `AnticiposSectionCard` (leídas desde la hoja SUELDOS de Google Sheets).
- **Ventas/Cobranza (ven)**: Facturas pendientes con filtros de estado y búsqueda global. Botón de **subida manual de Excel** (`UploadVentasPanel`) que sobreescribe los datos de Google Sheets y los persiste en Firestore. Tiene **3 pestañas**: `Resumen`, `Top Clientes` y `Activos`. (Las pestañas **"Por Mes"** y **"Ejecutivos"** fueron eliminadas el 2026-06-18; el cálculo interno `COB_POR_MES` / `COB_POR_EJECUTIVO` se mantiene en el procesamiento de datos por si se reutiliza, pero no se muestra.)
- **Fondos (fon)**: Saldos bancarios por banco.
- **Créditos (cre)**: Créditos y préstamos activos desde Google Sheets.
- **Finiquitos (fin)**: Finiquitos pendientes y préstamos a trabajadores.
- **Simulador (sim)**: Gráfico de área con línea de déficit ($0). Switches para incluir/excluir: remuneraciones **(sueldos + anticipos)**, créditos, gastos fijos, finiquitos y gastos variables. Tabla con desglose transparente día a día o mes a mes.
  - **Plazo por defecto: 15 días (vista diaria)** (antes 12 meses).
  - **Fechas de pago en modo diario**: sueldos el **día 30** (fin de mes), anticipos el **día 15** (mitad de mes). En modo mensual ambos se agregan al mes correspondiente.
- **Cuadre IVA (iva)** *(nuevo, 2026-08-17)*: componente `CuadreIvaPage`. Datos desde `CUADRE_IVA_DATA` y `RESUMENES_SII_DATA` (poblados por los GID `cuadre iva`/`resumenes sii`, ver sección 2). Filtro por empresa (chips: Todas / Grafhika SpA / Grupo Marketing Digital) que afecta las tres vistas. Tres pestañas internas:
  - **IVA por Venta** *(pestaña por defecto — es la que más le importa al usuario)*: una tarjeta por empresa con el IVA débito generado por ventas, desglosado mes a mes con fila de total.
  - **Cuadre IVA**: tabla completa por empresa y período — ventas, compras, IVA débito/crédito/determinado, resultado (pill "A pagar"/"Remanente"), y un badge de alerta si hay documentos en estado Pendiente (no cuentan para el impuesto todavía).
  - **Resúmenes SII**: el mismo desglose por tipo de documento que muestra el portal del SII (`RESUMEN REGISTRO DE COMPRAS/VENTAS`), agrupado en tarjetas colapsables por empresa/período/operación.
  - **Bloque destacado arriba de todo — "IVA del mes en curso"**: solo aparece si el período vigente coincide con el mes calendario real. Muestra el IVA determinado del mes por empresa, el vencimiento estimado del F29 (día 20 del mes siguiente a la declaración, corrido a lunes si cae fin de semana — **estimado**, no reemplaza confirmar en sii.cl) y un aviso de que la cifra es provisoria mientras el mes no cierre.
- ~~**Analista IA (ia)**~~ — **ELIMINADO (2026-08-17)**, a pedido del usuario. Se quitó `AIAdvisorPage` completo (~800 líneas) junto con todo su estado: `apiKey`/`saveApiKey`, la lectura/escritura de `GEMINI_API_KEY` en `localStorage`, y su sincronización con Firestore (incluido el campo `geminiApiKey` que viajaba agregado a cada guardado de umbrales de alerta, sin relación funcional con esos umbrales). **Esto también resolvió el issue de seguridad pendiente**: la API key de Gemini que estaba hardcodeada como fallback público (`localStorage.getItem('GEMINI_API_KEY') || 'AIzaSy...'`) ya no existe en el código — no hace falta rotarla.
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

**Validado contra el archivo real**: 54 facturas, $155,199,690 total facturado, $153,722,295 saldo pendiente — coincide exactamente con los KPIs de la hoja. ✅ **Desplegado y funcionando en vivo** (commit `fe25b9a`).

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

// ── IVA (SII, vía sii-dashboard) ────────────────────────────────────────
let RESUMENES_SII_DATA = []; // { empresa, periodo, operacion, estado, cod, tipoDoc,
                              //   docs, exento, neto, ivaRecuperable, ivaUsoComun,
                              //   ivaNoRecuperable, total, factor }
let CUADRE_IVA_DATA = [];    // { empresa, periodo, docsVenta, ventasNetas, ventasExentas,
                              //   ivaDebito, ventasTotal, docsCompra, comprasNetas,
                              //   comprasExentas, ivaCredito, comprasTotal, ivaNoRecuperable,
                              //   otrosImpuestos, ivaDeterminado, resultado, ncVenta, ncCompra,
                              //   docsPendientes, ivaPendiente }
```

> `apiKey`/`saveApiKey`/`GEMINI_API_KEY` (Gemini, para Analista IA) **ya no existen** —
> eliminados junto con el módulo el 2026-08-17. Si aparecen en un diff viejo o en un
> backup, es del código anterior a esa fecha.

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

> **Proyecto hermano** (fuera de esta carpeta): `C:\Users\brand\Desktop\Claude\sii-dashboard\` — descarga el RCV
> del SII y publica las pestañas `compras`, `cuadre iva` y `resumenes sii` que lee este dashboard. Ver sección 2.

---

## 10. Git y Despliegue

- **Repositorio**: `https://github.com/brands-chile-afk/Dashboard-financiero`
- **Remote local**: apunta a `dashboard-financiero` en minúsculas. Funciona por redirect de GitHub. Para actualizar: `git remote set-url origin https://github.com/brands-chile-afk/Dashboard-financiero.git` (pendiente, no urgente).
- **Rama activa**: `main`

### Commits recientes (los más nuevos arriba):

| Hash      | Mensaje                                                                       |
|-----------|-------------------------------------------------------------------------------|
| `7f92ec7` | feat: simulador abre por defecto en 15 días (antes 12 meses)                 |
| `4d16efb` | fix: anticipos se pagan el día 15, no junto a sueldos el día 30              |
| `1c25568` | feat: quitar módulo Resumen, inicio por defecto en Movimientos               |
| `2b96dd5` | perf: romper bucle infinito de Firebase y memoizar filtro de Ventas          |
| `73c3f4a` | feat: quitar pestañas 'Por Mes' y 'Ejecutivos' del módulo Ventas             |
| `5d5f8fc` | perf: carga más rápida — React producción, scripts con defer, ApexCharts fijado |
| `50babd8` | perf: simulador fluido — actualizar gráfico en vez de recrearlo              |
| `fe25b9a` | fix: detección correcta de encabezados al subir Excel de cobranza            |
| `142bff4` | Consolidar documentacion en un solo .md actualizado                          |
| `4d9e93a` | Agregar anticipos (2da tabla SUELDOS) y corregir total de nomina             |

> Todos los cambios listados están **commiteados, pusheados y desplegados en vivo** en GitHub Pages.

---

## 11. Historial de Cambios

### 2026-08-17 — Módulo Cuadre IVA + eliminación de Analista IA
- **Nuevo módulo "Cuadre IVA" (`iva`)**, entre Finiquitos y Simulador. Conectado al proyecto hermano
  `sii-dashboard`, que descarga los resúmenes oficiales del RCV del SII (`getResumen`) para Grafhika SpA y
  Grupo Marketing Digital y publica 3 pestañas nuevas en esta misma planilla (`compras`, `cuadre iva`,
  `resumenes sii` — ver sección 2). Componente `CuadreIvaPage`, tres vistas internas (IVA por Venta / Cuadre
  IVA / Resúmenes SII) más un bloque destacado de "IVA del mes en curso" con vencimiento estimado del F29.
  Ver sección 4 para el detalle completo.
- **Un usuario nuevo módulo no aparece solo**: hay que habilitarlo por cuenta en Accesos y Roles — la barra
  lateral se arma según los `modulos` permitidos en Firestore, y un usuario existente no lo tiene marcado por
  default. No es un bug, es el mismo mecanismo de siempre.
- **Módulo "Analista IA" (`ia`) eliminado** por pedido del usuario — `AIAdvisorPage` completo (~800 líneas)
  más todo su estado (`apiKey`, `saveApiKey`, sync de `GEMINI_API_KEY` con Firestore). Efecto colateral
  positivo: la API key de Gemini que estaba hardcodeada como fallback público ya no existe en el código.
- **Bug encontrado y corregido en `sii-dashboard`** (no en este `index.html`, pero afecta los datos que lee):
  publicar el cuadre filtrando por `--empresa` sobreescribía las pestañas `cuadre iva`/`resumenes sii`
  completas, borrando a las demás empresas (esas pestañas se regeneran enteras en cada corrida, no hacen
  merge). Corregido para que la publicación siempre incluya todas las empresas, sin importar qué se haya
  filtrado para mostrar en consola.
- Verificado en vivo contra `localhost:3000` (Babel compila sin errores, `AIAdvisorPage` ausente,
  `CuadreIvaPage` presente, datos con los conteos esperados) y los montos de Grafhika contrastados campo por
  campo contra capturas reales del portal del SII (compras y ventas de agosto) — coincidencia exacta.

### 2026-06-19 — Ajustes de módulos y Simulador
- **Módulo Resumen (`home`) eliminado.** Ya no aparece en el menú. **Movimientos** es la nueva página de inicio. Fallbacks/página por defecto cambiados de `'home'` a `'mov'`; si un usuario tenía `'home'` guardado en `localStorage`, se redirige a Movimientos. El botón **"Subir Nómina"** se movió de la barra de Resumen a la de **Proyección**. (commit `1c25568`)
- **Simulador — anticipos el día 15.** En modo diario, sueldos y anticipos caían ambos el día 30. Ahora: sueldos día 30, anticipos día 15 (fechas de pago reales). (commit `4d16efb`)
- **Simulador — plazo por defecto 15 días** (antes 12 meses). (commit `7f92ec7`)

### 2026-06-18 / 2026-06-19 — Rendimiento (gran sesión de optimización)
- **🔥 BUCLE INFINITO DE FIREBASE ROTO (la causa principal de la lentitud general).** El listener `onSnapshot` de `users/{uid}` hacía `setUmbrales` con un objeto nuevo, y un `useEffect[umbrales]` escribía a la nube en cada cambio → la escritura volvía a disparar el snapshot → **bucle infinito** que generaba 1000+ escrituras/timeouts y re-renders completos de la App por carga. Solución: los umbrales ahora se guardan **solo cuando el usuario los cambia explícitamente** (`handleSaveUmbrales`), no vía `useEffect`. Verificado: **1000+ errores → 0**. (Esto también resolvió el issue pre-existente del timeout `saveConfigToCloud`.)
- **React build de producción + `defer` + ApexCharts fijado a `@5.15.0`.** Antes se usaba React *development* (2-5× más lento) y los scripts bloqueaban el parseo. Resultado medido: **DOM interactivo 4974ms → 70ms; carga total 10.8s → 6.5s**. Babel reubicado como último script (necesario para que el `defer` no rompa la app).
- **Gráfico del Simulador: se crea una vez y se actualiza con `updateOptions(animate=false)`** en vez de destruirse/recrearse en cada cambio de control. Antes se pegaba al mover sliders/checkboxes.
- **`VentasPage.pendientesFiltrados` memoizado** (`useMemo`, deps `[busqueda, filtroEstado, hayBusqueda, COB_PENDIENTES]`). Antes filtraba+ordenaba en cada render/clic.
- **Módulo Ventas: eliminadas las pestañas "Por Mes" y "Ejecutivos"** (botones + contenido + variables `ejecutivos`/`maxEj` ya sin uso). Quedan: Resumen, Top Clientes, Activos.

### 2026-06-17
- **Fix `UploadVentasPanel`** — corrección del algoritmo de detección de fila de headers en el Excel de cobranza. El algoritmo anterior (`findIndex` con umbral ≥ 2) confundía la fila de labels de KPIs (fila 1) con los encabezados reales (fila 4). Reemplazado por algoritmo "best-score" que escanea las primeras 25 filas y elige la que tiene más coincidencias de keywords. Validado: 54 facturas, $155,199,690 total, $153,722,295 saldo. ✅ Desplegado.
- **Persistencia de cobranza en Firestore (`shared_data/cobranza`)**: `handleCobImport` convertido a `async`, guarda en Firestore tras la carga. `loadLiveData` lee el documento al arrancar y sobreescribe datos de Sheets si existe. Código desplegado pero **BLOQUEADO** hasta agregar regla en Firebase Console (ver sección 7).

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
| 2 | Media | Sin investigar | Usuario reportó: "cuando subo la cartola de BCI no está actualizando en el VPS". Requiere aclaración: ¿dónde se sube el archivo? ¿qué proceso lo consume? ¿hay mensaje de error visible? ¿hay acceso SSH al VPS? |
| 3 | Baja | Pendiente | Remote URL del repo local en minúsculas funciona por redirect. Para normalizar: `git remote set-url origin https://github.com/brands-chile-afk/Dashboard-financiero.git`. |
| 4 | Baja | Opcional | **Nivel 2 de rendimiento (pre-compilar Babel):** quitar Babel del navegador compilando el JSX una sola vez bajaría la carga de ~6.5s a ~2s. Contra: cada edición futura pasa por un paso de compilación (idealmente vía GitHub Action). Ver sección 14. |
| ~~5~~ | ~~Baja~~ | ✅ **RESUELTO** | ~~Timeout recurrente `saveConfigToCloud`~~ — era síntoma del bucle infinito de Firebase, resuelto el 2026-06-18 (commit `2b96dd5`). |
| 6 | Media | Pendiente | `Facturas`/`compras` (detalle documento por documento) solo tienen **julio 2026** cargado — el resto del año solo está en el agregado (`cuadre iva`/`resumenes sii`). Correr `ingest.py --desde 2026-01` (sin `--resumenes`) desde `sii-dashboard` cuando se necesite el detalle completo. |
| 7 | Baja | Sin investigar | Hay archivos sueltos sin trackear en el repo que **no vienen de este proyecto**: `SII/Envy.txt` (vacío), `add_admin.html`, `scratch_firebase_test.js`, `test_compat.js`, `test_sdk.js`, `test_write.html`. Preexistentes, no se tocaron ni se incluyeron en ningún commit — confirmar con el usuario si sirven para algo antes de borrarlos. |

---

## 13. Roadmap (Fase 3 — pendiente)

1. **Módulo de Tareas Inteligente (To-Do)**: leer `GASTOS_FIJOS_DATA` y generar checklist/alertas según el día actual (ej. "Pagar Maestro" el día 5), marcable como completado (estado en Firestore).
2. **Plantillas de WhatsApp para Cobranza**: botón en Ventas para clientes con +15 días de vencimiento que abra WhatsApp Web con mensaje de cobro pre-armado.
3. **Termómetro de Metas de Facturación**: indicador en Resumen que compare facturación del mes vs una meta configurable.
4. **Ingreso Rápido de Egresos sin Excel**: formulario/botón flotante para registrar gastos directo a la nube (Firestore).

---

## 14. Rendimiento (notas y aprendizajes)

### Estado actual (medido en local, 2026-06-19)
- **DOM interactivo: ~70 ms** (antes 4974 ms).
- **Carga total: ~6.5 s** (antes 10.8 s). El grueso restante son los ~4.6 s de **Babel compilando en el navegador** en cada carga.
- Interacción (clics, cambio de módulo): fluida tras romper el bucle infinito de Firebase.

### Reglas/aprendizajes para no volver a romper el rendimiento
1. **NO usar `react.development.js`** en producción — siempre `*.production.min.js`.
2. **Babel siempre el último `<script defer>`**: al cargar, compila la app inline; si carga antes que React/Firebase/ApexCharts, la app crashea.
3. **Cuidado con `useEffect` que escriben a Firestore vigilando estado que también actualiza un `onSnapshot`** → bucle infinito. Patrón seguro: guardar a la nube **solo en handlers explícitos del usuario**, no en `useEffect[estado]`.
4. **Gráficos ApexCharts**: crear una vez (en `ref`) y actualizar con `updateOptions(opts, false, false)`. Nunca `new ApexCharts()` + `render()` + `destroy()` en cada cambio.
5. **Memoizar** filtros/ordenamientos pesados con `useMemo` (incluir en deps las variables globales reasignadas como `COB_PENDIENTES`).
6. **Listas grandes**: renderizar solo 50–100 filas (`.slice`), nunca miles de `<tr>`.

### Nivel 2 pendiente (opcional, el salto grande de carga)
Pre-compilar el JSX una sola vez (quitar Babel del navegador) bajaría la carga de ~6.5 s a **~2 s**. Implica un paso de compilación antes de publicar — idealmente una **GitHub Action** que compile en cada push para no cambiar el flujo de edición. Ver issue #4.
