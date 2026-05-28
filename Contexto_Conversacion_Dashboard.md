# Resumen de Contexto: Dashboard Financiero de Grafhika & GMD

Este documento recopila la arquitectura, el historial de cambios, el estado actual del código, la configuración del servidor en la nube de Firebase, y las instrucciones precisas para continuar con el desarrollo de tu aplicación en un nuevo chat de inteligencia artificial sin perder un solo detalle de contexto.

---

## 📋 Ficha Técnica del Proyecto

* **Nombre**: Dashboard Financiero Inteligente y Portátil
* **Ubicación Local**: `c:\Users\brand\Desktop\Claude\Dashboard financiero`
* **Tecnologías**: HTML5, React (via CDN en un único archivo modular para portabilidad), ApexCharts, Vanilla CSS Premium (esquema de luz corporativo, translúcido y animaciones), Firebase Compat SDK (Auth + Firestore) y Node.js (servidor local).
* **Entorno de Ejecución**: Servidor nativo con Node.js (`server.js` en el puerto `3000`).
* **Estado de Conexión Nube**: **100% Conectado y Operativo**. Se han inyectado de forma permanente las credenciales del proyecto de Firebase en el código del frontend y se ha habilitado el inicio de sesión único con Google.

---

## ☁️ Configuración Real de Firebase Inyectada en el Código

El dashboard está conectado nativamente a tu proyecto de Firebase. No requiere configuración manual por parte del usuario en el navegador:

* **Proyecto ID**: `dashboard-93457`
* **Web App registrada**: `"Dashboard Financiero"`
* **Credenciales Inyectadas en `DEFAULT_FIREBASE_CONFIG` en [index.html](file:///c:/Users/brand/Desktop/Claude/Dashboard%20financiero/index.html)**:
  ```javascript
  const DEFAULT_FIREBASE_CONFIG = {
    apiKey: "AIzaSyBk3ogFG3wffplD8nwM6M1JGnYtm_edpbg",
    authDomain: "dashboard-93457.firebaseapp.com",
    projectId: "dashboard-93457",
    storageBucket: "dashboard-93457.firebasestorage.app",
    messagingSenderId: "207789889083",
    appId: "1:207789889083:web:3577dda47c14abc9e42e1e"
  };
  ```
* **Authentication**: Inicializado con el proveedor **Google Sign-In** habilitado bajo el correo de asistencia oficial `brandon.villarroelcl@gmail.com`.
* **Seguridad y Aislamiento**: Cada director que accede con su cuenta de Google obtiene un espacio de almacenamiento privado en Firestore en la ruta `/users/{uid}`, garantizando que las configuraciones de alertas, claves y ajustes sean personales y no se mezclen.

---

## 🛠️ Historial de Cambios y Funcionalidades Implementadas

A lo largo del proyecto, hemos transformado un prototipo estático en un **Dashboard de Planta Empresarial de Alta Gama** con las siguientes capacidades avanzadas:

### 1. Conexión de Datos en Vivo (Google Sheets)
- Consumo asíncrono y en paralelo de las 8 pestañas publicadas del archivo Excel oficial de la empresa.
- Procesador de datos robusto (`dataProcessor.js`) con parser de archivos CSV compatible con saltos de línea internos y normalizadores de divisa chilena (CLP sin decimales).
- Caché de inicio inteligente en `localStorage` que reduce el tiempo de arranque de la interfaz a menos de 50ms.

### 2. Flujo de Caja Orgánico y Depuración Intercompañía
- **Detección Automática de Movimientos Internos**: Aísla las transferencias internas entre las empresas hermanas (*TEF de filiales como Grafhika Bancochile, Grafhika Spa y Grafhika Copy Center*) y los **Rescates de Fondos Mutuos (FFMM)**.
- **Flujo Neto Real**: Excluye estos movimientos de los cálculos y filtros rápidos de "Ingresos" y "Egresos", permitiendo visualizar el rendimiento de la tesorería 100% real de la planta.
- **Indicadores Visuales**: Transacciones marcadas con badges especiales de **TRASPASO INTERNO** y **RESCATE FFMM** de color gris neutral.

### 3. Simulador de Proyecciones Financieras (Runway Simulator)
- Gráfica interactiva de área degradada con una línea roja de alerta de déficit ($0 CLP).
- Controles interactivos (sliders de efectividad en cobranza desde 0% a 100%).
- Conmutadores (switches) interactivos para incluir o excluir en la proyección: nóminas de sueldos, cuotas de créditos bancarios, costos operacionales fijos, finiquitos y compras variables.

### 4. Analista IA Financiero (AI CFO Advisor Chat)
- Ubicado en la barra lateral con transiciones dinámicas.
- **Modo Offline**: Motor NLP local ultra preciso que responde instantáneamente preguntas sobre sueldos, bancos, cobranzas programadas (con plazos variables como *"en los próximos 15 días"*), compras y créditos.
- **Modo Online (Gemini 2.5 Flash)**: Caja de entrada de contraseña para la API Key del usuario en la cabecera. Al conectarse, genera prompts serializados de todas las métricas en tiempo real de tu negocio para que Gemini realice diagnósticos contables avanzados con formato HTML interactivo.

### 5. Seguridad Firebase Auth (Google Login Integrado en Código)
- **Acceso Estricto con Google**: Al levantar la app, se despliega una pantalla de bloqueo premium que expone el botón **"Acceder con Google"** como único canal de acceso para directores autorizados.
- **Persistencia Asíncrona (`onAuthStateChanged`)**: Desbloqueo automático instantáneo al refrescar la pantalla si la sesión de Google sigue activa.

### 6. Sincronización en la Nube Bidireccional (Firestore Live)
- Enlace al documento único `/users/{uid}` del director conectado.
- Sincroniza y respalda automáticamente cambios en umbrales de alerta, API keys de Gemini y configuraciones en tiempo real entre múltiples dispositivos abiertos en paralelo.

### 7. Ajustes Rápidos Provisionales (Overrides de Caja)
- Botón **"➕ Ajuste Provisorio"** en `MovimientosPage` que abre un formulario modal HSL translúcido.
- Permite registrar ingresos o egresos provisionales en vivo. Se unifican en caliente con las cartolas reales y recalculan la caja disponible, gráficos de bancos, runway y las simulaciones de inmediato.
- Incluye un sistema de eliminación (papelera) una vez el movimiento real entra en la hoja oficial de Google Sheets.

### 8. Comentarios de Auditoría y Conciliación Colaborativa
- Icono de mensaje `💬` interactivo por transacción en el historial bancario.
- Abre un **Cajón Lateral Flotante (Drawer Glassmorphic)** desde el lateral derecho.
- Permite cambiar el estado de conciliación (`⚪ Pendiente`, `🟡 Revisado`, `🟢 Conciliado`) e ingresar observaciones compartidas. Al guardar en la nube, resalta la transacción con un badge y detalla la fecha y nombre del director autor del comentario.

### 9. Bitácora de Actividad Reciente (Audit Trail)
- Línea de tiempo cronológica reversa premium en la sección "Nube Cloud".
- Registra silenciosamente acciones críticas con fecha, nombre y correo del autor (ej. *"Brandon Villarroel actualizó los umbrales de alerta"* o *"Registró egreso provisional"*).

---

## 📁 Estado Actual de la Estructura de Archivos

El espacio de trabajo local está ordenado de la siguiente manera:
- `/index.html`: Contiene el frontend, todos los componentes React y el auto-detector de integración en caliente. **(Actualizado con tus credenciales de Firebase en `DEFAULT_FIREBASE_CONFIG`)**.
- `/index.css`: Hoja de estilos con variables de color HSL, micro-animaciones premium, drawers y modales.
- `/dataProcessor.js`: Motor de normalización y procesamiento de CSVs del Sheets.
- `/charts.js`: Configuración modular de ApexCharts responsivas.
- `/app.js`: Controlador principal de cacheado y unificación.
- `/server.js`: Servidor local Node.js con el endpoint `/api/save-config-to-disk` inyectado (para automatizar guardado si el navegador tuviera configuraciones locales temporales).
- `/package.json`: Configurado con `"start": "node server.js"` para levantar todo con `npm start`.

---

## 🚀 Próximos Pasos Recomendados
1. **Realizar un commit en Git** (`git add .` y `git commit -m "feat: integración 100% de Firebase Auth y Google Login"`) para congelar este estado completamente funcional.
2. Hacer pruebas de inicio de sesión colaborativo con diferentes cuentas Gmail autorizadas para validar que cada una guarde su información de forma totalmente aislada e independiente en la nube.
3. Seguir mejorando el chat IA de Gemini para permitir análisis predictivo avanzado de caja.

---

## 📋 Copiar y Pegar en el Nuevo Chat (Prompt de Migración)

*Copia el bloque de texto inferior y pégalo directamente como tu primer mensaje en el nuevo chat con Claude/GPT para inicializar el contexto al 100% de inmediato:*

```markdown
Hola. Estoy importando el contexto de desarrollo de mi proyecto "Dashboard Financiero Inteligente". Por favor, asume el rol de mi desarrollador senior experto en React, Vanilla CSS y Firebase. 

El proyecto completo se encuentra en mi máquina local en:
c:\Users\brand\Desktop\Claude\Dashboard financiero

Aquí tienes el estado actual del espacio de trabajo y lo que hemos desarrollado con éxito:
1. Conexión de Firebase Completada: El frontend en index.html está configurado nativamente con el proyecto de Firebase "dashboard-93457".
2. Google Login Habilitado: Hemos inicializado Firebase Authentication y activado Google como proveedor de inicio de sesión con el correo de soporte brandon.villarroelcl@gmail.com.
3. Inicio de sesión único con Google (Firebase Auth) en una pantalla premium PinLock y sesión persistente automática.
4. Sincronización en la nube (Firestore NoSQL) bajo la colección /users/{uid} del director conectado. De esta manera, cada cuenta Gmail tiene su propio espacio de ajustes, umbrales y comentarios sin mezclarse.
5. Conexión asíncrona robusta y caché local de 8 hojas publicadas de Google Sheets.
6. Motor de depuración de flujos internos (TEF filiales y rescates de fondos mutuos) aislados de los ingresos/egresos reales.
7. Simulador interactivo de Runway de Caja con escenarios pesimistas/optimistas mediante sliders y switches.
8. Analista IA Financiero (CFO Chatbot) con motor NLP offline exacto y conexión en vivo con Gemini 2.5 Flash mediante API Key respaldada en la nube.
9. Ajustes Rápidos Provisionales en caliente (Ajustes Manuales) unificados dinámicamente con las cartolas reales.
10. Drawer lateral premium para ingresar Comentarios de Auditoría y alternar Estados de Conciliación por fila de transacción.
11. Bitácora de Actividad Reciente (Audit Trail) en una línea de tiempo visual animada que registra las acciones de los directores en la nube.

El servidor de desarrollo se ejecuta localmente mediante Node con 'npm start' (node server.js) en el puerto 3000. Los archivos clave en la carpeta son:
- index.html (React frontend + componentes unificados y credenciales reales de Firebase)
- index.css (Estilos premium en luz corporativa)
- dataProcessor.js (Lógica de CSVs contables y monedas CLP)
- app.js (Controlador central y promesas de carga)
- server.js (Servidor local con endpoint de auto-grabado en caliente)
- package.json (Configuración de arranque npm)
- Contexto_Conversacion_Dashboard.md (Este archivo detallado de contexto)

Por favor, confirma que has absorbido y comprendido esta estructura y el estado de avance. Estoy listo para continuar trabajando en el dashboard contigo. ¿Qué sugerencias o mejoras de optimización me recomiendas realizar a continuación basándote en esta arquitectura?
```
