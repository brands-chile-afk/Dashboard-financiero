# 🚀 Documentación del Proyecto: Dashboard Financiero (Grafhika & GMD)

Documento único y actualizado con la arquitectura, configuración, módulos, historial de cambios y roadmap del Dashboard Financiero. Reemplaza a los documentos de contexto anteriores.

> Última actualización: 2026-06-16

---

## 1. Arquitectura y Stack Tecnológico
* **Frontend**: HTML5 + Vanilla CSS + React (cargado vía CDN con Babel para compilación en caliente en el navegador). **Todo el código de la app vive en un único archivo autocontenido: `index.html`** (React, componentes, lógica de datos y estilos embebidos / `index.css`).
* **Diseño y UI**: Interfaz "premium" estilo Glassmorphism, modo claro/oscuro, micro-animaciones y renderizado reactivo sin recargar.
* **Gráficos**: ApexCharts (vía CDN).
* **Backend / BaaS**: Firebase SDK v10.8.0 (librería **compat**). Servicios: `Firebase Authentication` (Google OAuth) + `Cloud Firestore`.
* **Servidor local**: Node.js (`server.js`) en el puerto `3000`. Se ejecuta con `node server.js` (o `npm start`).
* **Despliegue**: GitHub, rama `main`. Repositorio: `brands-chile-afk/Dashboard-financiero`.

---

## 2. Fuente de Datos: Google Sheets en vivo
La app consume en vivo (CSV publicado, asíncrono y en paralelo) las pestañas del archivo **"Base movimientos"** de Google Sheets. Cada pestaña se referencia por su `GID` en `index.html`:

| Módulo        | GID         |
|---------------|-------------|
| Movimientos   | (principal) |
| Gastos        | 2058514573  |
| Créditos      | 690377335   |
| Finiquitos    | 1916149630  |
| Cobranza      | 602912984   |
| Sueldos       | 998795265   |
| Gastos Fijos  | 1222067969  |

* Caché de arranque en `localStorage` para minimizar el tiempo de carga inicial.
* La hoja **SUELDOS** contiene **dos tablas** en paralelo (ver sección 4).

---

## 3. Seguridad y Roles (Whitelist)
* Ingreso solo con cuenta de Google (OAuth).
* Tras el login, el sistema consulta la colección `allowed_users` en Firestore usando el `email` como ID. Si el usuario no existe o tiene `activo: false`, se cierra sesión automáticamente y se muestra `PinLock`.
* **Roles y módulos dinámicos**: cada usuario tiene `rol` y `modulos` (arreglo de páginas permitidas). El Sidebar se renderiza dinámicamente ocultando módulos no permitidos. Si se fuerza la navegación vía LocalStorage, un `useEffect` redirige a `home`.
* **Solicitud de acceso**: usuarios no autorizados pueden enviar una solicitud (escribe en `/access_requests` + `/mail` para la extensión *Trigger Email*). Los administradores ven un badge rojo en vivo (`onSnapshot`) y aprueban con 1 click (inserta en `allowed_users` + registra auditoría).

### Configuración de Firebase (inyectada en `DEFAULT_FIREBASE_CONFIG` de `index.html`)
* **Proyecto ID**: `dashboard-93457`
* **Base de datos**: Cloud Firestore modo Nativo, instancia `(default)`.
* Nota: las API keys web de Firebase son públicas por diseño; la seguridad real está en las reglas de Firestore.

```javascript
match /allowed_users/{email} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

---

## 4. Módulos y Páginas
Orden del menú lateral:
`Resumen → Movimientos → Proyección → Ventas → Fondos → Créditos → Finiquitos → Simulador → Analista IA → Nube Cloud → Accesos y Roles`

Destacados:
* **Data Slicing**: las tablas de Ventas/Gastos/Movimientos procesan miles de filas pero renderizan solo las 50–100 más relevantes (búsqueda global sigue activa) para evitar congelamiento de UI.
* **Proyección (Egresos)**: nómina de sueldos, **anticipos**, gastos fijos.
* **Simulador (Runway)**: gráfico de área con línea de alerta de déficit ($0). Switches para incluir/excluir: remuneraciones (sueldos + anticipos), créditos, gastos fijos, finiquitos y gastos variables. Tabla con desglose transparente (Gastos Fijos vs Cheques/Gastos Var.).
* **Analista IA (CFO)**: modo offline (NLP local) y modo online (Gemini 2.5 Flash con API Key).
* **Conciliación colaborativa**: ajustes provisionales de caja e iconos `💬` por transacción para cambiar estado de conciliación (guardado en Firestore con responsable y comentario).

### Hoja SUELDOS — dos tablas
La pestaña SUELDOS tiene dos tablas separadas por una columna vacía:
* **Tabla 1 – Sueldos** (columnas A–G): empresa, rut, nombre, monto, banco, tipo cuenta, n° cuenta.
* **Tabla 2 – Anticipos** (columnas I–O): mismas columnas.

El dashboard detecta automáticamente ambas tablas (busca la columna separadora vacía y, a su derecha, las columnas empresa/nombre/monto). Los **anticipos se muestran como categoría separada** (tarjeta + KPI "Anticipos del Mes") y **cuentan como egreso** en el runway y el simulador (se pagan el día 30 junto con los sueldos).

> **Importante (parsing)**: la fila de **TOTALES** de la hoja (monto sin nombre) se excluye explícitamente para no duplicar la nómina ni inflar los anticipos. El filtro descarta filas sin empresa ni nombre, o cuyo monto sea 0.

---

## 5. Historial de Cambios Relevantes
* **2026-06-16** — Soporte para la 2da tabla de SUELDOS (**anticipos**) como categoría separada (tarjeta + KPI), contabilizada como egreso en runway/simulador. Corrección del total de **nómina duplicado** (la fila de totales se contaba como una "empresa" fantasma). Reordenamiento del menú: **Simulador** movido debajo de **Finiquitos**.
* Conexión Firebase optimizada (plan Blaze) y resolución del bug "client is offline" (creación de la base de datos `(default)`; el SDK compat v8 no soporta nombres de BD personalizados).
* Data Slicing anti-freezing en tablas grandes.
* Flujo de solicitud de acceso + panel de aprobación de administrador.
* Analista IA Financiero (offline + Gemini).

---

## 6. Estructura de Archivos
* `index.html` — **App completa** (frontend React, componentes, lógica de datos, credenciales Firebase). Este es el archivo que se edita.
* `index.css` — Estilos premium (variables HSL, animaciones, modales).
* `server.js` — Servidor local Node.js (puerto 3000).
* `package.json` — Dependencias (incluye `firebase`).
* `Base movimientos.xlsx` — Copia local de respaldo (no se sube; está en `.gitignore`).
* `Documentacion_Final_Dashboard.md` — Este documento.
* ⚠️ `app.js`, `dataProcessor.js`, `charts.js` — **Legacy / sin uso.** Son de una versión modular anterior; `index.html` NO los carga. Conservados solo como referencia histórica; pueden eliminarse.

---

## 7. Roadmap (Fase 3 — pendiente)
1. **Módulo de Tareas Inteligente (To-Do)**: leer `GASTOS_FIJOS_DATA` y generar checklist/alertas según el día actual (ej. "Pagar Maestro" el día 5), marcable como completado (estado en Firestore).
2. **Plantillas de WhatsApp para Cobranza**: botón en Ventas para clientes con +15 días de vencimiento que abra WhatsApp Web con mensaje de cobro pre-armado.
3. **Termómetro de Metas de Facturación**: indicador en Resumen que compare facturación del mes vs una meta configurable.
4. **Ingreso Rápido de Egresos sin Excel**: formulario/botón flotante para registrar gastos directo a la nube.
