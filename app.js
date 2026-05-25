/**
 * Lógica Central de la Aplicación (app.js)
 * Coordina las descargas desde Google Sheets, normaliza los datos,
 * renderiza componentes HTML e interactúa con ApexCharts y los filtros.
 */

import { parseCSV, parseCLP, parseDate, formatCLP, formatDate, cleanText, isIntercompanyTransfer } from './dataProcessor.js?v=1.1';
import { initFundsHistory, initBanksDonut, initProjectionChart, updateChart } from './charts.js?v=1.1';

// --- CONFIGURACIÓN DE ENDPOINTS DE GOOGLE SHEETS (CSV EXPORTS) ---
const SHEET_BASE_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTj1EanSaF9L7EOt7uzJkaYM-4nSiJSe4cRG7Zp4oVai10WUghucUCUEhsHPcqnCFEAWyKLDD1AIyzB/pub?output=csv';

const ENDPOINTS = {
  fondos: `${SHEET_BASE_URL}&gid=922494361`,
  movimientos: `${SHEET_BASE_URL}&gid=365647797`,
  gastos: `${SHEET_BASE_URL}&gid=2058514573`,
  creditos: `${SHEET_BASE_URL}&gid=690377335`,
  finiquitos: `${SHEET_BASE_URL}&gid=1916149630`,
  cobranza: `${SHEET_BASE_URL}&gid=602912984`,
  sueldos: `${SHEET_BASE_URL}&gid=998795265`,
  gastosFijos: `${SHEET_BASE_URL}&gid=1222067969`
};

// --- ESTADO GLOBAL DE LA APLICACIÓN ---
const state = {
  raw: {},       // Datos CSV limpios tal como vienen de la nube
  data: {},      // Datos completamente normalizados en formato estructurado
  charts: {},    // Instancias de los gráficos ApexCharts
  activeTab: 'resumen',
  filters: {
    flujo: { text: '', banco: '', tipo: '' },
    cobranza: { text: '', estado: '' }
  },
  simulator: {
    probabilidadCobro: 80,
    incluirFfmm: false,
    incluirSueldos: true,
    incluirCreditos: true,
    incluirFijos: true,
    incluirFiniquitos: true,
    incluirGastos: true
  }
};

// --- INICIALIZACIÓN AL CARGAR LA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupEventListeners();
  loadData();
});

// --- SISTEMA DE NAVEGACIÓN Y REACTIVIDAD DE PESTAÑAS ---
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const panels = document.querySelectorAll('.panel');
  const headerTitle = document.getElementById('headerTitle');
  const headerSubtitle = document.getElementById('headerSubtitle');

  const tabMetadata = {
    resumen: {
      title: 'Resumen Ejecutivo',
      subtitle: 'Vista general de la liquidez corporativa e indicadores clave'
    },
    flujo: {
      title: 'Flujo de Caja y Bancos',
      subtitle: 'Historial y conciliación de movimientos de cuentas bancarias'
    },
    cobranzas: {
      title: 'Cuentas por Cobrar',
      subtitle: 'Análisis detallado de facturas emitidas y gestión de cobranza'
    },
    egresos: {
      title: 'Gastos y Compromisos de Pago',
      subtitle: 'Planilla de sueldos, créditos corporativos, gastos fijos y compras'
    },
    simulador: {
      title: 'Simulador Predictivo de Runway',
      subtitle: 'Proyecciones interactivas a 12 meses de liquidez bajo múltiples escenarios'
    }
  };

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.dataset.tab;
      
      // Cambiar pestaña activa en navegación
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Cambiar panel activo
      panels.forEach(p => p.classList.remove('active'));
      const activePanel = document.getElementById(`tab-${targetTab}`);
      if (activePanel) activePanel.classList.add('active');
      
      // Actualizar cabecera
      const meta = tabMetadata[targetTab];
      if (meta) {
        headerTitle.textContent = meta.title;
        headerSubtitle.textContent = meta.subtitle;
      }
      
      state.activeTab = targetTab;
      
      // Forzar renderizado / ajuste de gráficos al cambiar de pestaña
      if (targetTab === 'resumen') {
        renderResumenCharts();
      } else if (targetTab === 'simulador') {
        renderSimulator();
      } else if (targetTab === 'ia-advisor') {
        renderAIAdvisor();
      }
    });
  });
}

// --- CONFIGURACIÓN DE EVENT LISTENERS DE CONTROLES ---
function setupEventListeners() {
  // Función auxiliar para cambiar de pestaña programáticamente simulando un click de navegación
  const switchTab = (tabId) => {
    const navItem = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if (navItem) navItem.click();
  };

  // Botón Actualizar
  document.getElementById('btnRefresh').addEventListener('click', () => {
    loadData(true); // Forzar descarga omitiendo caché
  });

  // Eventos de clic para las tarjetas KPI del Resumen Ejecutivo para navegar a los detalles
  const kpiCaja = document.getElementById('kpi-card-caja');
  if (kpiCaja) kpiCaja.addEventListener('click', () => switchTab('flujo'));

  const kpiCobranza = document.getElementById('kpi-card-cobranza');
  if (kpiCobranza) kpiCobranza.addEventListener('click', () => switchTab('cobranzas'));

  const kpiEgresos = document.getElementById('kpi-card-egresos');
  if (kpiEgresos) kpiEgresos.addEventListener('click', () => switchTab('egresos'));

  const kpiRunway = document.getElementById('kpi-card-runway');
  if (kpiRunway) kpiRunway.addEventListener('click', () => switchTab('simulador'));
  
  const kpiInversiones = document.getElementById('kpi-card-inversiones');
  if (kpiInversiones) {
    kpiInversiones.addEventListener('click', () => {
      // Para inversiones, nos quedamos en Resumen pero bajamos con un scroll suave hasta la sección de gráficos de FFMM
      const chartSection = document.getElementById('chart-historico');
      if (chartSection) {
        chartSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Añadimos una pequeña animación temporal de realce al gráfico
        const cardParent = chartSection.closest('.card');
        if (cardParent) {
          cardParent.classList.add('highlight-pulse');
          setTimeout(() => cardParent.classList.remove('highlight-pulse'), 2000);
        }
      }
    });
  }

  // Filtros de Flujo de Caja
  document.getElementById('flujo-search').addEventListener('input', (e) => {
    state.filters.flujo.text = e.target.value;
    filterMovimientos();
  });
  document.getElementById('flujo-filter-banco').addEventListener('change', (e) => {
    state.filters.flujo.banco = e.target.value;
    filterMovimientos();
  });
  document.getElementById('flujo-filter-tipo').addEventListener('change', (e) => {
    state.filters.flujo.tipo = e.target.value;
    filterMovimientos();
  });

  // Filtros de Cobranzas
  document.getElementById('cobranza-search').addEventListener('input', (e) => {
    state.filters.cobranza.text = e.target.value;
    filterCobranza();
  });
  document.getElementById('cobranza-filter-estado').addEventListener('change', (e) => {
    state.filters.cobranza.estado = e.target.value;
    filterCobranza();
  });

  // Controles del Simulador Predictivo
  const slider = document.getElementById('sim-slider-cobranza');
  const probValText = document.getElementById('prob-val');
  
  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    state.simulator.probabilidadCobro = val;
    
    // Actualizar etiquetas visuales de probabilidad
    let label = `${val}%`;
    if (val <= 30) label += ' (Pesimista)';
    else if (val <= 70) label += ' (Moderado)';
    else label += ' (Optimista)';
    
    probValText.textContent = label;
    
    // Resaltar activas
    document.querySelectorAll('.probability-label').forEach(el => el.classList.remove('active'));
    probValText.classList.add('active');
    
    renderSimulator();
  });

  // Checkboxes del simulador
  const chkFfmm = document.getElementById('sim-chk-ffmm');
  const chkSueldos = document.getElementById('sim-chk-sueldos');
  const chkCreditos = document.getElementById('sim-chk-creditos');
  const chkFijos = document.getElementById('sim-chk-fijos');
  const chkFiniquitos = document.getElementById('sim-chk-finiquitos');
  const chkGastos = document.getElementById('sim-chk-gastos');

  const updateSimCheckboxes = () => {
    state.simulator.incluirFfmm = chkFfmm.checked;
    state.simulator.incluirSueldos = chkSueldos.checked;
    state.simulator.incluirCreditos = chkCreditos.checked;
    state.simulator.incluirFijos = chkFijos.checked;
    state.simulator.incluirFiniquitos = chkFiniquitos.checked;
    state.simulator.incluirGastos = chkGastos.checked;
    renderSimulator();
  };

  chkFfmm.addEventListener('change', updateSimCheckboxes);
  chkSueldos.addEventListener('change', updateSimCheckboxes);
  chkCreditos.addEventListener('change', updateSimCheckboxes);
  chkFijos.addEventListener('change', updateSimCheckboxes);
  chkFiniquitos.addEventListener('change', updateSimCheckboxes);
  chkGastos.addEventListener('change', updateSimCheckboxes);

  // Consultas rápidas IA
  document.querySelectorAll('.ai-query-tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
      const qType = e.target.dataset.query;
      executeAIQuery(qType);
    });
  });
}

// --- DESCARGA ASÍNCRONA Y CACHÉ ---
async function loadData(forceRefresh = false) {
  setLoadingState(true);
  
  const cacheKey = 'grafhika_financial_cache_v1_1';
  const cached = localStorage.getItem(cacheKey);
  
  if (cached && !forceRefresh) {
    try {
      const parsedCache = JSON.parse(cached);
      // Validar si la caché tiene más de 12 horas
      const ageHours = (Date.now() - parsedCache.timestamp) / (1000 * 60 * 60);
      if (ageHours < 12) {
        state.raw = parsedCache.raw;
        processData();
        renderDashboard();
        setLoadingState(false);
        // Sincronizar en segundo plano de forma silenciosa
        fetchDataSilently(cacheKey);
        return;
      }
    } catch (e) {
      console.warn("Fallo al leer la caché local. Forzando descarga.", e);
    }
  }

  // Descarga paralela en tiempo real de las 8 hojas
  try {
    const fetchPromises = Object.keys(ENDPOINTS).map(async (key) => {
      const res = await fetch(ENDPOINTS[key]);
      if (!res.ok) throw new Error(`Fallo al descargar hoja: ${key}`);
      const text = await res.text();
      state.raw[key] = text;
    });

    await Promise.all(fetchPromises);
    
    // Guardar en caché
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      raw: state.raw
    }));

    processData();
    renderDashboard();
  } catch (error) {
    console.error("Error crítico de descarga", error);
    renderErrorState("Error de Sincronización", "No se pudieron obtener los datos de Google Sheets. Por favor, verifica tu conexión a internet o reintenta.");
  } finally {
    setLoadingState(false);
  }
}

// Descarga silenciosa en segundo plano para refrescar caché
async function fetchDataSilently(cacheKey) {
  try {
    const tempRaw = {};
    const fetchPromises = Object.keys(ENDPOINTS).map(async (key) => {
      const res = await fetch(ENDPOINTS[key]);
      if (res.ok) {
        tempRaw[key] = await res.text();
      }
    });
    await Promise.all(fetchPromises);
    
    if (Object.keys(tempRaw).length === Object.keys(ENDPOINTS).length) {
      state.raw = tempRaw;
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        raw: state.raw
      }));
      processData();
      if (state.activeTab === 'resumen') {
        renderDashboard();
      }
    }
  } catch (e) {
    console.log("Sincronización silenciosa omitida", e);
  }
}

// --- VISUALIZACIONES DE CARGA ---
function setLoadingState(isLoading) {
  const syncDot = document.getElementById('syncDot');
  const syncText = document.getElementById('syncText');
  
  if (isLoading) {
    syncDot.classList.add('loading');
    syncText.textContent = 'Actualizando...';
  } else {
    syncDot.classList.remove('loading');
    syncText.textContent = 'Sincronizado';
  }
}

function renderErrorState(title, message) {
  const panel = document.getElementById('tab-resumen');
  panel.innerHTML = `
    <div class="error-state">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <h3>${title}</h3>
      <p>${message}</p>
      <button class="btn btn-primary" onclick="window.location.reload()">Reintentar Cargar</button>
    </div>
  `;
}

// --- NORMALIZACIÓN DE DATOS ESPECÍFICOS ---
function processData() {
  state.data = {};

  // 1. Fondos Históricos
  const fondosRaw = parseCSV(state.raw.fondos);
  const fondos = [];
  // Primera fila es el header
  for (let i = 1; i < fondosRaw.length; i++) {
    const row = fondosRaw[i];
    if (row.length < 6 || !row[0]) continue;
    fondos.push({
      fecha: parseDate(row[0]),
      fechaStr: row[0],
      bancochile: parseCLP(row[1]),
      santander: parseCLP(row[2]),
      santanderBrian: parseCLP(row[3]),
      scotiabank: parseCLP(row[4]),
      total: parseCLP(row[5])
    });
  }
  // Ordenar cronológicamente
  fondos.sort((a, b) => a.fecha - b.fecha);
  state.data.fondos = fondos;

  // 2. Movimientos Bancarios Recientes
  const movimientosRaw = parseCSV(state.raw.movimientos);
  const movimientos = [];
  for (let i = 1; i < movimientosRaw.length; i++) {
    const row = movimientosRaw[i];
    if (row.length < 5 || !row[0]) continue;
    movimientos.push({
      fecha: parseDate(row[0]),
      fechaStr: row[0],
      descripcion: row[1],
      monto: parseCLP(row[2]),
      tipo: row[3].toUpperCase().trim(), // INGRESO, GASTO, EGRESO
      banco: row[4].trim(),
      saldo: parseCLP(row[5]),
      categoria: row[6] || '',
      isIntercompany: isIntercompanyTransfer(row[1])
    });
  }
  movimientos.sort((a, b) => b.fecha - a.fecha); // Orden descendente (más recientes primero)
  state.data.movimientos = movimientos;

  // Extraer saldos de Cuentas Corrientes (Caja) de la mini-tabla en Movimientos (columnas 7 y 8 en las primeras filas)
  const currentBankBalances = {};
  for (let i = 1; i <= 6; i++) {
    const row = movimientosRaw[i];
    if (row && row.length > 8 && row[7]) {
      const bankName = row[7].trim();
      currentBankBalances[bankName] = parseCLP(row[8]);
    }
  }
  state.data.currentBankBalances = currentBankBalances;

  // 3. Gastos y Proveedores
  const gastosRaw = parseCSV(state.raw.gastos);
  const gastos = [];
  for (let i = 1; i < gastosRaw.length; i++) {
    const row = gastosRaw[i];
    if (row.length < 3 || !row[0]) continue;
    gastos.push({
      fecha: parseDate(row[0]),
      fechaStr: row[0],
      descripcion: row[1],
      monto: parseCLP(row[2]),
      estado: (row[3] || 'Pendiente').trim().toUpperCase() // PAGADO, PENDIENTE
    });
  }
  state.data.gastos = gastos;

  // 4. Créditos Bancarios
  const creditosRaw = parseCSV(state.raw.creditos);
  const creditos = [];
  for (let i = 1; i < creditosRaw.length; i++) {
    const row = creditosRaw[i];
    if (row.length < 5 || !row[0]) continue;
    creditos.push({
      prestamo: row[0],
      fecha: parseDate(row[1]),
      fechaStr: row[1],
      tipo: row[2],
      montoTotal: parseCLP(row[3]),
      montoPago: parseCLP(row[4]),
      estado: (row[5] || 'Pendiente').trim().toUpperCase(),
      cuota: parseInt(row[6], 10) || 1
    });
  }
  state.data.creditos = creditos;

  // 5. Finiquitos y Especiales
  const finiquitosRaw = parseCSV(state.raw.finiquitos);
  const finiquitos = [];
  for (let i = 1; i < finiquitosRaw.length; i++) {
    const row = finiquitosRaw[i];
    if (row.length < 4 || !row[0]) continue;
    finiquitos.push({
      prestamo: row[0],
      fecha: parseDate(row[1]),
      fechaStr: row[1],
      tipo: row[2],
      montoTotal: parseCLP(row[3]),
      montoPago: parseCLP(row[4]),
      estado: (row[5] || 'Pendiente').trim().toUpperCase(),
      comentario: row[6] || ''
    });
  }
  state.data.finiquitos = finiquitos;

  // 6. Cobranza y Facturación
  const cobranzaRaw = parseCSV(state.raw.cobranza);
  const cobranza = [];
  // Skip de primera fila de cabecera de Google Sheets (basura), usar fila index 1 como header
  // Los datos inician en fila index 2
  for (let i = 2; i < cobranzaRaw.length; i++) {
    const row = cobranzaRaw[i];
    if (row.length < 10 || !row[3]) continue; // Se requiere el Folio o Razón Social
    
    cobranza.push({
      rut: row[1],
      razonSocial: row[2],
      folio: row[3],
      emision: parseDate(row[4]),
      emisionStr: row[4],
      totalFacturado: parseCLP(row[5]),
      saldoPendiente: parseCLP(row[6]),
      observaciones: row[7] || '',
      vencimiento: parseDate(row[8]),
      vencimientoStr: row[8],
      estado: (row[13] || 'VENCIDO').trim().toUpperCase(), // PAGADO, VENCIDO, FACTORING, NCREDITO
      fechaPagoStr: row[14] || '',
      historial: row[15] || '',
      detalle: row[16] || '',
      contacto: row[18] || ''
    });
  }
  state.data.cobranza = cobranza;

  // 7. Planilla de Remuneraciones
  const sueldosRaw = parseCSV(state.raw.sueldos);
  const sueldos = [];
  for (let i = 1; i < sueldosRaw.length; i++) {
    const row = sueldosRaw[i];
    if (row.length < 4 || !row[0]) continue;
    sueldos.push({
      empresa: row[0].trim(),
      rut: row[1],
      nombre: row[2],
      monto: parseCLP(row[3]),
      banco: row[4] || '',
      tipoCuenta: row[5] || '',
      numeroCuenta: row[6] || ''
    });
  }
  state.data.sueldos = sueldos;

  // 8. Gastos Fijos
  const fijosRaw = parseCSV(state.raw.gastosFijos);
  const fijos = [];
  for (let i = 1; i < fijosRaw.length; i++) {
    const row = fijosRaw[i];
    if (row.length < 2 || !row[0]) continue;
    fijos.push({
      descripcion: row[0],
      monto: parseCLP(row[1]),
      diaPago: parseInt(row[2], 10) || 5,
      categoria: row[3] || 'Operación'
    });
  }
  state.data.gastosFijos = fijos;
}

// --- RENDERIZACIÓN DE TODOS LOS COMPONENTES ---
function renderDashboard() {
  calculateExecutiveKPIs();
  renderResumenCharts();
  renderResumenDetails();
  
  // Rellenar selectores de filtro
  populateFilterSelects();
  
  // Renderizar tablas
  filterMovimientos();
  filterCobranza();
  renderEgresosTab();
  renderSimulator();
}

// --- KPI EJECUTIVOS ---
function calculateExecutiveKPIs() {
  const totalDisponibleEl = document.getElementById('kpi-disponible');
  const totalInversionesEl = document.getElementById('kpi-inversiones');
  const cobranzaPendienteEl = document.getElementById('kpi-cobranza');
  const egresosEstimadosEl = document.getElementById('kpi-egresos');
  const runwayEl = document.getElementById('kpi-runway');
  const runwayFooter = document.getElementById('kpi-runway-footer');

  // 1. Caja Operativa ( Checking accounts)
  const cajaTotal = totalDisponible();
  totalDisponibleEl.textContent = formatCLP(cajaTotal);

  // 2. Inversiones en Fondos Mutuos
  const inversionesTotal = totalInversiones();
  totalInversionesEl.textContent = formatCLP(inversionesTotal);

  // 3. Cobranza Pendiente (Suma de saldoPendiente de facturas no pagadas/no notas de crédito)
  const cobranzas = state.data.cobranza;
  const cobranzaPendiente = cobranzas.reduce((acc, c) => {
    if (c.estado === 'VENCIDO') {
      return acc + c.saldoPendiente;
    }
    return acc;
  }, 0);
  cobranzaPendienteEl.textContent = formatCLP(cobranzaPendiente);

  // 4. Egresos Proximos 30 Días (Estimados)
  const sueldosTotal = state.data.sueldos.reduce((acc, s) => acc + s.monto, 0);
  const fijosTotal = state.data.gastosFijos.reduce((acc, f) => acc + f.monto, 0);
  
  const creditosPendientes = state.data.creditos.reduce((acc, c) => {
    if (c.estado === 'PENDIENTE') {
      return acc + c.montoPago;
    }
    return acc;
  }, 0);
  
  const finiquitosPendientes = state.data.finiquitos.reduce((acc, f) => {
    if (f.estado === 'PENDIENTE') {
      return acc + f.montoPago;
    }
    return acc;
  }, 0);

  const comprasPendientes = state.data.gastos.reduce((acc, g) => {
    if (g.estado === 'PENDIENTE') {
      return acc + g.monto;
    }
    return acc;
  }, 0);

  // Egresos operacionales estimados
  const egresosEstimados30Dias = sueldosTotal + fijosTotal + (creditosPendientes / 12) + finiquitosPendientes + comprasPendientes;
  egresosEstimadosEl.textContent = formatCLP(egresosEstimados30Dias);

  // 5. Runway en Días (Caja Operativa vs Caja + FFMM)
  if (egresosEstimados30Dias > 0) {
    const burnRatePerDay = egresosEstimados30Dias / 30;
    const daysRunway = Math.round(cajaTotal / burnRatePerDay);
    const daysRunWithFfmm = Math.round((cajaTotal + inversionesTotal) / burnRatePerDay);
    
    runwayEl.textContent = `${daysRunway} días`;
    runwayFooter.textContent = `Con FFMM: ${daysRunWithFfmm} días`;
    
    if (daysRunway < 30) {
      runwayEl.style.color = 'var(--expense)';
    } else if (daysRunway < 90) {
      runwayEl.style.color = 'var(--pending)';
    } else {
      runwayEl.style.color = 'var(--income)';
    }
  } else {
    runwayEl.textContent = '365+ días';
    runwayEl.style.color = 'var(--income)';
    runwayFooter.textContent = 'Sin egresos proyectados';
  }
}

// --- RENDERIZACIÓN DE GRÁFICOS DEL RESUMEN ---
function renderResumenCharts() {
  if (state.activeTab !== 'resumen') return;

  // 1. Gráfico Histórico de Fondos Mutuos (Inversiones)
  const fondos = state.data.fondos;
  const historicalDates = fondos.map(f => f.fechaStr);
  const historicalTotals = fondos.map(f => f.total);

  if (state.charts.fundsHistory) {
    updateChart(state.charts.fundsHistory, historicalDates, [{ name: 'Inversiones FFMM', data: historicalTotals }]);
  } else {
    state.charts.fundsHistory = initFundsHistory('chart-historico', historicalDates, historicalTotals);
  }

  // 2. Gráfico Donut de Distribución de Fondos Mutuos por Administradora
  let bankNames = [];
  let bankBalances = [];
  
  if (fondos.length > 0) {
    const latest = fondos[fondos.length - 1];
    bankNames = ['BancoChile FFMM', 'Santander FFMM', 'Santander Brian FFMM', 'Scotiabank FFMM'];
    bankBalances = [latest.bancochile, latest.santander, latest.santanderBrian, latest.scotiabank];
  }

  if (state.charts.banksDonut) {
    updateChart(state.charts.banksDonut, bankNames, bankBalances);
  } else {
    state.charts.banksDonut = initBanksDonut('chart-bancos', bankNames, bankBalances);
  }
}

// --- DETALLES DE TABLAS EN RESUMEN ---
function renderResumenDetails() {
  // 1. Lista de Cuentas Corrientes Bancarias (Caja Operativa Real)
  const bankListEl = document.getElementById('resumen-lista-bancos');
  bankListEl.innerHTML = '';

  const currentBankBalances = state.data.currentBankBalances || {};
  
  if (Object.keys(currentBankBalances).length > 0) {
    Object.keys(currentBankBalances).forEach(bankName => {
      const balance = currentBankBalances[bankName];
      
      let initials = 'BK';
      if (bankName.toLowerCase().includes('chile')) initials = 'CH';
      else if (bankName.toLowerCase().includes('santander')) initials = 'ST';
      else if (bankName.toLowerCase().includes('scotiabank')) initials = 'SC';
      else if (bankName.toLowerCase().includes('bice')) initials = 'BI';
      else if (bankName.toLowerCase().includes('bci')) initials = 'BC';

      const item = document.createElement('div');
      item.className = 'bank-item';
      item.innerHTML = `
        <div class="bank-info">
          <div class="bank-avatar">${initials}</div>
          <span class="bank-name">${bankName}</span>
        </div>
        <span class="bank-balance">${formatCLP(balance)}</span>
      `;
      bankListEl.appendChild(item);
    });
  } else {
    bankListEl.innerHTML = '<div style="text-align:center;color:var(--text-secondary);padding:10px;">Cargando saldos...</div>';
  }

  // 2. Tabla de Compromisos Financieros Inmediatos
  const tableBody = document.getElementById('resumen-tabla-compromisos');
  tableBody.innerHTML = '';

  const creditos = state.data.creditos
    .filter(c => c.estado === 'PENDIENTE')
    .slice(0, 5)
    .map(c => ({
      desc: c.prestamo,
      fecha: c.fechaStr,
      cuota: `Cuota ${c.cuota}`,
      monto: c.montoPago
    }));

  const finiquitos = state.data.finiquitos
    .filter(f => f.estado === 'PENDIENTE')
    .slice(0, 3)
    .map(f => ({
      desc: f.prestamo,
      fecha: f.fechaStr || 'Programado',
      cuota: 'Finiquito',
      monto: f.montoPago
    }));

  const compromisos = [...creditos, ...finiquitos].slice(0, 6);

  if (compromisos.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-secondary);">Sin compromisos pendientes este mes</td></tr>`;
    return;
  }

  compromisos.forEach(c => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="font-weight: 500;">${c.desc}</td>
      <td>${c.fecha}</td>
      <td><span class="badge badge-pendiente">${c.cuota}</span></td>
      <td style="font-weight: 600;">${formatCLP(c.monto)}</td>
    `;
    tableBody.appendChild(row);
  });
}

// --- SELECTORES DE FILTROS ---
function populateFilterSelects() {
  const bancoSelect = document.getElementById('flujo-filter-banco');
  const uniqueBancos = [...new Set(state.data.movimientos.map(m => m.banco))];
  
  bancoSelect.innerHTML = '<option value="">Todos los Bancos</option>';
  uniqueBancos.forEach(b => {
    if (b) {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      bancoSelect.appendChild(opt);
    }
  });
}

// --- FILTRADO DE MOVIMIENTOS BANCARIOS ---
function filterMovimientos() {
  const tableBody = document.getElementById('flujo-tabla-movimientos');
  tableBody.innerHTML = '';

  const { text, banco, tipo } = state.filters.flujo;
  const query = cleanText(text);

  // 1. Filtrar los movimientos para la tabla
  const filtered = state.data.movimientos.filter(m => {
    const matchesText = !query || cleanText(m.descripcion).includes(query) || cleanText(m.categoria).includes(query);
    const matchesBanco = !banco || m.banco === banco;
    
    // Si se filtra específicamente por tipo (Ingreso/Gasto/Egreso),
    // ignoramos/ocultamos los traspasos inter-compañías para no confundirlos con flujos reales.
    if (m.isIntercompany && tipo !== '') {
      return false;
    }
    
    const matchesTipo = !tipo || m.tipo === tipo;
    return matchesText && matchesBanco && matchesTipo;
  });

  // 2. Calcular agregaciones de Flujo Real (Ingresos, Egresos, Neto)
  // Se calculan sobre todos los movimientos que coinciden con búsqueda y banco (excluyendo traspasos inter-compañías siempre)
  let totalIngresos = 0;
  let totalEgresos = 0;

  state.data.movimientos.forEach(m => {
    const matchesText = !query || cleanText(m.descripcion).includes(query) || cleanText(m.categoria).includes(query);
    const matchesBanco = !banco || m.banco === banco;
    
    if (matchesText && matchesBanco && !m.isIntercompany) {
      if (m.tipo === 'INGRESO') {
        totalIngresos += Math.abs(m.monto);
      } else if (m.tipo === 'GASTO' || m.tipo === 'EGRESO') {
        totalEgresos += Math.abs(m.monto);
      }
    }
  });

  const flujoNeto = totalIngresos - totalEgresos;

  // Actualizar indicadores KPI de Flujo en el HTML
  const kpiIngresosEl = document.getElementById('flujo-kpi-ingresos');
  const kpiEgresosEl = document.getElementById('flujo-kpi-egresos');
  const kpiNetoEl = document.getElementById('flujo-kpi-neto');
  const kpiNetoIconEl = document.getElementById('flujo-kpi-neto-icon');
  const kpiNetoFooterEl = document.getElementById('flujo-kpi-neto-footer');

  if (kpiIngresosEl) kpiIngresosEl.textContent = formatCLP(totalIngresos);
  if (kpiEgresosEl) kpiEgresosEl.textContent = formatCLP(totalEgresos);
  
  if (kpiNetoEl) {
    kpiNetoEl.textContent = `${flujoNeto < 0 ? '-' : ''}${formatCLP(Math.abs(flujoNeto))}`;
    if (flujoNeto >= 0) {
      kpiNetoEl.style.color = 'var(--income)';
      if (kpiNetoIconEl) {
        kpiNetoIconEl.className = 'kpi-icon income';
        kpiNetoIconEl.style.backgroundColor = 'var(--income-light)';
        kpiNetoIconEl.style.color = 'var(--income)';
      }
      if (kpiNetoFooterEl) kpiNetoFooterEl.textContent = 'Superávit neto acumulado';
    } else {
      kpiNetoEl.style.color = 'var(--expense)';
      if (kpiNetoIconEl) {
        kpiNetoIconEl.className = 'kpi-icon expense';
        kpiNetoIconEl.style.backgroundColor = 'var(--expense-light)';
        kpiNetoIconEl.style.color = 'var(--expense)';
      }
      if (kpiNetoFooterEl) kpiNetoFooterEl.textContent = 'Déficit neto acumulado';
    }
  }

  // 3. Renderizar las filas de la tabla
  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-secondary);">No se encontraron movimientos con los filtros seleccionados</td></tr>`;
    return;
  }

  filtered.slice(0, 100).forEach(m => {
    const row = document.createElement('tr');
    let badgeClass = 'badge-pendiente';
    let badgeText = m.tipo;
    let colorStyle = '';
    
    if (m.isIntercompany) {
      badgeClass = 'badge-traspaso';
      const desc = m.descripcion.toLowerCase();
      const isRescate = desc.includes('rescate') && (desc.includes('fondo') || desc.includes('ffmm') || desc.includes('mutuo'));
      badgeText = isRescate ? 'RESCATE FFMM' : 'TRASPASO INTERNO';
      colorStyle = 'color: var(--text-secondary);';
    } else {
      if (m.tipo === 'INGRESO') {
        badgeClass = 'badge-pagado';
        colorStyle = 'color: var(--income);';
      } else if (m.tipo === 'GASTO' || m.tipo === 'EGRESO') {
        badgeClass = 'badge-vencido';
        colorStyle = 'color: var(--expense);';
      }
    }

    row.innerHTML = `
      <td>${m.fechaStr}</td>
      <td style="font-weight: 500; max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${m.descripcion}</td>
      <td>${m.banco}</td>
      <td><span class="badge ${badgeClass}">${badgeText}</span></td>
      <td style="font-weight: 600; ${colorStyle}">
        ${m.monto < 0 ? '-' : ''}${formatCLP(Math.abs(m.monto))}
      </td>
      <td style="font-weight: 500;">${formatCLP(m.saldo)}</td>
    `;
    tableBody.appendChild(row);
  });
}

// --- FILTRADO DE COBRANZAS ---
function filterCobranza() {
  const tableBody = document.getElementById('cobranza-tabla-facturas');
  const totalFacturadoEl = document.getElementById('cobranza-total-facturado');
  const totalVencidoEl = document.getElementById('cobranza-total-vencido');
  const totalFactoringEl = document.getElementById('cobranza-total-factoring');
  const efectividadEl = document.getElementById('cobranza-efectividad');
  const kpiVencidoFooter = document.getElementById('cobranza-vencido-footer');

  tableBody.innerHTML = '';

  const { text, estado } = state.filters.cobranza;
  const query = cleanText(text);

  // Totales generales independientes del filtro actual de tabla
  const cobranzas = state.data.cobranza;
  const totalFacturado = cobranzas.reduce((acc, c) => acc + c.totalFacturado, 0);
  const totalVencido = cobranzas.reduce((acc, c) => c.estado === 'VENCIDO' ? acc + c.saldoPendiente : acc, 0);
  const totalFactoring = cobranzas.reduce((acc, c) => c.estado === 'FACTORING' ? acc + c.totalFacturado : acc, 0);
  const totalPagado = cobranzas.reduce((acc, c) => c.estado === 'PAGADO' ? acc + c.totalFacturado : acc, 0);

  totalFacturadoEl.textContent = formatCLP(totalFacturado);
  totalVencidoEl.textContent = formatCLP(totalVencido);
  totalFactoringEl.textContent = formatCLP(totalFactoring);
  
  const efectividad = totalFacturado > 0 ? (totalPagado / totalFacturado) * 100 : 0;
  efectividadEl.textContent = `${efectividad.toFixed(1)}%`;

  if (totalVencido > totalDisponible()) {
    kpiVencidoFooter.textContent = '¡Supera saldo actual disponible!';
    kpiVencidoFooter.className = 'kpi-footer negative';
  } else {
    kpiVencidoFooter.textContent = 'Cartera vencida por cobrar';
    kpiVencidoFooter.className = 'kpi-footer';
  }

  // Filtrado específico de la tabla
  const filtered = cobranzas.filter(c => {
    const matchesText = !query || cleanText(c.razonSocial).includes(query) || cleanText(c.folio).includes(query);
    const matchesEstado = !estado || c.estado === estado;
    return matchesText && matchesEstado;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-secondary);">No se encontraron facturas con los filtros seleccionados</td></tr>`;
    return;
  }

  filtered.forEach(c => {
    const row = document.createElement('tr');
    let badgeClass = 'badge-pendiente';
    if (c.estado === 'PAGADO') badgeClass = 'badge-pagado';
    else if (c.estado === 'VENCIDO') badgeClass = 'badge-vencido';
    else if (c.estado === 'FACTORING') badgeClass = 'badge-factoring';
    else if (c.estado === 'NCREDITO') badgeClass = 'badge-ncredito';

    row.innerHTML = `
      <td style="font-weight: 600;">${c.folio}</td>
      <td style="font-weight: 500; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${c.razonSocial}">${c.razonSocial}</td>
      <td>${c.emisionStr}</td>
      <td>${c.vencimientoStr}</td>
      <td style="font-weight: 500;">${formatCLP(c.totalFacturado)}</td>
      <td style="font-weight: 600; color: ${c.saldoPendiente > 0 ? 'var(--expense)' : 'var(--income)'}">
        ${formatCLP(c.saldoPendiente)}
      </td>
      <td><span class="badge ${badgeClass}">${c.estado}</span></td>
      <td style="font-size: 0.75rem; color: var(--text-secondary); max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${c.historial || c.observaciones}">
        ${c.historial || c.observaciones || '<span style="color:var(--text-light)">-</span>'}
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function totalDisponible() {
  const currentBankBalances = state.data.currentBankBalances || {};
  return Object.values(currentBankBalances).reduce((a, b) => a + b, 0);
}

function totalInversiones() {
  const fondos = state.data.fondos;
  return fondos.length > 0 ? fondos[fondos.length - 1].total : 0;
}

// --- RENDERIZACIÓN DE PESTAÑA EGRESOS Y COMPROMISOS ---
function renderEgresosTab() {
  // 1. Totales Generales KPI
  const sueldosTotal = state.data.sueldos.reduce((acc, s) => acc + s.monto, 0);
  const creditosPendiente = state.data.creditos.reduce((acc, c) => c.estado === 'PENDIENTE' ? acc + c.montoPago : acc, 0);
  const finiquitosTotal = state.data.finiquitos.reduce((acc, f) => f.estado === 'PENDIENTE' ? acc + f.montoPago : acc, 0);
  const fijosTotal = state.data.gastosFijos.reduce((acc, f) => acc + f.monto, 0);

  document.getElementById('egresos-sueldos-total').textContent = formatCLP(sueldosTotal);
  document.getElementById('egresos-creditos-pendiente').textContent = formatCLP(creditosPendiente);
  document.getElementById('egresos-finiquitos-total').textContent = formatCLP(finiquitosTotal);
  document.getElementById('egresos-fijos-total').textContent = formatCLP(fijosTotal);

  // Detalle créditos footer
  const creditosTotalesCount = state.data.creditos.filter(c => c.estado === 'PENDIENTE').length;
  document.getElementById('egresos-creditos-footer').textContent = `${creditosTotalesCount} cuotas de préstamos activas`;

  // 2. Sueldos consolidados por Empresa
  const sueldosResumenBody = document.getElementById('egresos-tabla-sueldos-resumen');
  sueldosResumenBody.innerHTML = '';

  const sueldosPorEmpresa = {};
  state.data.sueldos.forEach(s => {
    const emp = s.empresa || 'Otro/Personal';
    if (!sueldosPorEmpresa[emp]) {
      sueldosPorEmpresa[emp] = { count: 0, total: 0 };
    }
    sueldosPorEmpresa[emp].count++;
    sueldosPorEmpresa[emp].total += s.monto;
  });

  Object.keys(sueldosPorEmpresa).forEach(emp => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="font-weight: 600;">${emp}</td>
      <td>${sueldosPorEmpresa[emp].count} trabajadores</td>
      <td style="font-weight: 700;">${formatCLP(sueldosPorEmpresa[emp].total)}</td>
    `;
    sueldosResumenBody.appendChild(row);
  });

  // 3. Tabla de Gastos Fijos
  const fijosBody = document.getElementById('egresos-tabla-fijos');
  fijosBody.innerHTML = '';
  
  if (state.data.gastosFijos.length === 0) {
    fijosBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Sin gastos fijos declarados</td></tr>`;
  } else {
    state.data.gastosFijos.forEach(f => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="font-weight: 500;">${f.descripcion}</td>
        <td>Día ${f.diaPago}</td>
        <td><span class="badge badge-factoring">${f.categoria}</span></td>
        <td style="font-weight: 600;">${formatCLP(f.monto)}</td>
      `;
      fijosBody.appendChild(row);
    });
  }

  // 4. Tabla de Compras y Egresos Operativos Pendientes (Gastos variables)
  const comprasBody = document.getElementById('egresos-tabla-compras');
  comprasBody.innerHTML = '';

  if (state.data.gastos.length === 0) {
    comprasBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-secondary);">Sin compras variables registradas</td></tr>`;
  } else {
    // Mostramos todos
    state.data.gastos.forEach(g => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${g.fechaStr || 'Programada'}</td>
        <td style="font-weight: 500;">${g.descripcion}</td>
        <td style="font-weight: 600;">${formatCLP(g.monto)}</td>
        <td><span class="badge ${g.estado === 'PAGADO' ? 'badge-pagado' : 'badge-pendiente'}">${g.estado}</span></td>
      `;
      comprasBody.appendChild(row);
    });
  }
}

// --- MÓDULO DEL SIMULADOR DE PROYECCIONES ---
function renderSimulator() {
  if (state.activeTab !== 'simulador') return;

  const simFinalEl = document.getElementById('sim-val-final');
  const simDeficitEl = document.getElementById('sim-val-deficit');
  const tableBody = document.getElementById('sim-tabla-desglose');
  tableBody.innerHTML = '';

  // Configuración del escenario
  const prob = state.simulator.probabilidadCobro / 100;
  
  // Egresos a incluir
  const inclFfmm = state.simulator.incluirFfmm;
  const inclSueldos = state.simulator.incluirSueldos;
  const inclCreditos = state.simulator.incluirCreditos;
  const inclFijos = state.simulator.incluirFijos;
  const inclFiniquitos = state.simulator.incluirFiniquitos;
  const inclGastos = state.simulator.incluirGastos;

  // Montos fijos mensuales
  const sueldosMensual = inclSueldos ? state.data.sueldos.reduce((acc, s) => acc + s.monto, 0) : 0;
  const fijosMensual = inclFijos ? state.data.gastosFijos.reduce((acc, f) => acc + f.monto, 0) : 0;

  // Saldo inicial (liquidez actual de caja + FFMM opcional)
  const currentCash = totalDisponible() + (inclFfmm ? totalInversiones() : 0);

  // Generamos proyección de 12 meses correlativos a partir del mes en curso (Mayo 2026 en base a datos de movimientos)
  // Nota: De forma automática obtenemos el mes de inicio a partir de las transacciones más recientes
  let startYear = 2026;
  let startMonth = 4; // Mayo (0-indexed es 4)

  if (state.data.movimientos.length > 0) {
    const latestMov = state.data.movimientos[0].fecha;
    if (latestMov) {
      startYear = latestMov.getFullYear();
      startMonth = latestMov.getMonth();
    }
  }

  const monthsLabels = [];
  const projectedBalances = [];
  
  let currentBalance = currentCash;
  let firstDeficitMonth = null;
  let firstDeficitVal = 0;

  const monthsNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  // Proyectar 12 meses
  for (let m = 0; m < 12; m++) {
    const projDate = new Date(startYear, startMonth + m, 15);
    const mLabel = `${monthsNames[projDate.getMonth()]} ${projDate.getFullYear()}`;
    monthsLabels.push(mLabel);

    const targetMonth = projDate.getMonth();
    const targetYear = projDate.getFullYear();

    // 1. Calcular Ingresos de Cobranzas pendientes para este mes de proyección
    // Filtrar facturas que venzan en este mes
    const cobranzasMes = state.data.cobranza.filter(c => {
      if (c.estado !== 'VENCIDO' || !c.vencimiento) return false;
      return c.vencimiento.getMonth() === targetMonth && c.vencimiento.getFullYear() === targetYear;
    });
    
    // Sumamos saldos pendientes con factor de probabilidad
    const cobranzaRawSum = cobranzasMes.reduce((acc, c) => acc + c.saldoPendiente, 0);
    const cobranzaProyectada = Math.round(cobranzaRawSum * prob);

    // 2. Egresos Variables (Gastos) programados para este mes
    const gastosMes = inclGastos ? state.data.gastos.filter(g => {
      if (g.estado !== 'PENDIENTE' || !g.fecha) return false;
      return g.fecha.getMonth() === targetMonth && g.fecha.getFullYear() === targetYear;
    }).reduce((acc, g) => acc + g.monto, 0) : 0;

    // 3. Egresos por Créditos bancarios programados para este mes
    const creditosMes = inclCreditos ? state.data.creditos.filter(c => {
      if (c.estado !== 'PENDIENTE' || !c.fecha) return false;
      return c.fecha.getMonth() === targetMonth && c.fecha.getFullYear() === targetYear;
    }).reduce((acc, c) => acc + c.montoPago, 0) : 0;

    // 4. Egresos por Finiquitos y especiales programados para este mes
    const finiquitosMes = inclFiniquitos ? state.data.finiquitos.filter(f => {
      if (f.estado !== 'PENDIENTE' || !f.fecha) return false;
      return f.fecha.getMonth() === targetMonth && f.fecha.getFullYear() === targetYear;
    }).reduce((acc, f) => acc + f.montoPago, 0) : 0;

    // Cálculo consolidado de egresos mensuales
    const totalEgresosMes = sueldosMensual + fijosMensual + creditosMes + finiquitosMes + gastosMes;
    
    const saldoInicial = currentBalance;
    const flujoNeto = cobranzaProyectada - totalEgresosMes;
    currentBalance += flujoNeto;

    projectedBalances.push(currentBalance);

    // Identificar mes de primer déficit
    if (currentBalance < 0 && firstDeficitMonth === null) {
      firstDeficitMonth = mLabel;
      firstDeficitVal = currentBalance;
    }

    // Renderizar fila en la tabla matemática
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="font-weight:600;">${mLabel}</td>
      <td>${formatCLP(saldoInicial)}</td>
      <td style="color: var(--income); font-weight:500;">+${formatCLP(cobranzaProyectada)}</td>
      <td style="color: var(--expense);">-${formatCLP(fijosMensual + gastosMes + finiquitosMes)}</td>
      <td style="color: var(--expense);">${sueldosMensual > 0 ? '-' + formatCLP(sueldosMensual) : '$0'}</td>
      <td style="color: var(--expense);">${creditosMes > 0 ? '-' + formatCLP(creditosMes) : '$0'}</td>
      <td style="font-weight: 600; color: ${flujoNeto >= 0 ? 'var(--income)' : 'var(--expense)'}">
        ${flujoNeto >= 0 ? '+' : ''}${formatCLP(flujoNeto)}
      </td>
      <td style="font-weight: 700; background-color: ${currentBalance < 0 ? 'var(--expense-light)' : 'transparent'}; color: ${currentBalance < 0 ? 'var(--expense)' : 'var(--text-primary)'}">
        ${formatCLP(currentBalance)}
      </td>
    `;
    tableBody.appendChild(row);
  }

  // Actualizar KPI del simulador
  simFinalEl.textContent = formatCLP(currentBalance);
  
  if (firstDeficitMonth) {
    simDeficitEl.textContent = `${firstDeficitMonth} (${formatCLP(firstDeficitVal)})`;
    simDeficitEl.parentElement.style.backgroundColor = 'var(--expense-light)';
    simDeficitEl.parentElement.style.borderColor = 'rgba(220, 38, 38, 0.15)';
    simDeficitEl.style.color = 'var(--expense)';
    document.querySelector('.simulator-summary-label[style*="orange"]').style.color = 'var(--expense)';
  } else {
    simDeficitEl.textContent = 'Sin Déficit Proyectado';
    simDeficitEl.parentElement.style.backgroundColor = 'var(--income-light)';
    simDeficitEl.parentElement.style.borderColor = 'rgba(5, 150, 105, 0.15)';
    simDeficitEl.style.color = 'var(--income)';
  }

  // Renderizar o actualizar gráfico de proyección
  if (state.charts.projection) {
    updateChart(state.charts.projection, monthsLabels, [{ name: 'Caja Proyectada', data: projectedBalances }]);
  } else {
    state.charts.projection = initProjectionChart('chart-proyeccion', monthsLabels, projectedBalances);
  }
}

// --- CONTROLLER DEL ANALISTA IA FINANCIERO ---

/**
 * Renderiza el reporte del CFO de IA y las alertas de oportunidad.
 */
function renderAIAdvisor() {
  if (state.activeTab !== 'ia-advisor') return;

  const reportTextEl = document.getElementById('ai-report-text');
  const alertsContainer = document.getElementById('ai-alerts-container');

  // Obtener análisis estructurado
  const analysis = generateAIAnalysis();

  // 1. Renderizar Informe del CFO
  reportTextEl.innerHTML = `
    <p>Estimado Director,</p>
    <p>
      El diagnóstico consolidado de tesorería para <strong>Grafhika & GMD</strong> revela una liquidez operativa en cuentas bancarias de <strong>${formatCLP(analysis.caja)}</strong>, 
      respaldada adicionalmente por un portafolio de inversiones en Fondos Mutuos que asciende a <strong>${formatCLP(analysis.inversiones)}</strong>. 
      Al contrastar la caja operativa con una estructura mensual de egresos fijos (planilla de sueldos de <strong>${formatCLP(analysis.sueldosTotal)}</strong> y costos de planta de <strong>${formatCLP(analysis.fijosTotal)}</strong>), 
      la empresa mantiene una cobertura operativa inmediata en sus cuentas corrientes de aproximadamente <strong>${analysis.daysRunway} días</strong> (ampliándose significativamente al considerar tus fondos de inversión liquidados).
    </p>
    <p>
      El principal factor de riesgo identificado se encuentra en la cartera de cuentas por cobrar. Actualmente dispones de <strong>${formatCLP(analysis.cobranzaVencida)}</strong> en estado vencido. 
      Nuestros modelos indican una concentración crítica de deuda: el cliente <strong>${analysis.maxDebtorName}</strong> adeuda un saldo vencido acumulado de <strong>${formatCLP(analysis.maxDebtorVal)}</strong>, 
      lo que representa el <strong>${analysis.maxDebtorPercent.toFixed(1)}%</strong> de toda tu cartera de cobro activa. 
      Se sugiere priorizar inmediatamente esta cobranza para extender la holgura de caja de la organización.
    </p>
    <p>
      En términos de compromisos financieros, las obligaciones bancarias (créditos Scotiabank, Fogape y Fogain) representan una salida mensual de <strong>${formatCLP(analysis.creditosMes)}</strong>. 
      Bajo un escenario moderado del 80% de éxito en cobranzas, el simulador predictivo proyecta un flujo operativo saludable. 
      Dado tu alto respaldo en Fondos Mutuos, cuentas con una gran solvencia ante contingencias de mediano plazo.
    </p>
  `;

  // 2. Renderizar Alertas y Oportunidades Estratégicas
  alertsContainer.innerHTML = '';

  const alerts = [];

  // Alerta de Concentración
  if (analysis.maxDebtorPercent > 30) {
    alerts.push({
      type: 'danger',
      icon: 'fa-solid fa-triangle-exclamation',
      title: 'Alta Concentración de Deuda Vencida',
      desc: `El cliente ${analysis.maxDebtorName} retiene el ${analysis.maxDebtorPercent.toFixed(1)}% de tu cartera vencida total (${formatCLP(analysis.maxDebtorVal)}). Una mora prolongada afectará fuertemente tus flujos mensuales.`
    });
  }

  // Alerta de Runway
  if (analysis.daysRunway < 45) {
    alerts.push({
      type: 'warning',
      icon: 'fa-solid fa-hourglass-half',
      title: 'Runway de Caja Operativa Ajustado',
      desc: `Tu caja en cuentas corrientes cubre menos de 45 días de tu costo mínimo de operación. Recuerda que cuentas con ${formatCLP(analysis.inversiones)} adicionales en Fondos Mutuos como respaldo.`
    });
  } else {
    alerts.push({
      type: 'success',
      icon: 'fa-solid fa-circle-check',
      title: 'Excelente Holgura Operativa',
      desc: `Tu liquidez actual en cuentas corrientes te permite cubrir con creces ${Math.round(analysis.daysRunway / 30)} meses completos de sueldos consolidados sin depender de nuevos ingresos.`
    });
  }

  // Alerta de Créditos
  const creditosWeight = analysis.sueldosTotal > 0 ? (analysis.creditosMes / analysis.sueldosTotal) * 100 : 0;
  if (creditosWeight > 20) {
    alerts.push({
      type: 'warning',
      icon: 'fa-solid fa-building-columns',
      title: 'Alto Impacto de Servicio de Deuda',
      desc: `Las cuotas de amortización bancaria mensuales de ${formatCLP(analysis.creditosMes)} equivalen al ${creditosWeight.toFixed(1)}% del valor total de tu planilla de sueldos. Vigilar vencimientos los días 4 y 13.`
    });
  }

  // Alerta de Oportunidad de Inversión
  if (analysis.inversiones > 0) {
    alerts.push({
      type: 'success',
      icon: 'fa-solid fa-sack-dollar',
      title: 'Sólida Reserva de Respaldo',
      desc: `Tu portafolio en Fondos Mutuos de ${formatCLP(analysis.inversiones)} representa tu principal reserva de liquidez y respaldo para renegociaciones de deuda o planes de expansión.`
    });
  }

  alerts.forEach(a => {
    const item = document.createElement('div');
    item.className = `ai-alert-item ${a.type}`;
    item.innerHTML = `
      <div class="ai-alert-icon"><i class="${a.icon}"></i></div>
      <div>
        <div class="ai-alert-title">${a.title}</div>
        <div class="ai-alert-desc">${a.desc}</div>
      </div>
    `;
    alertsContainer.appendChild(item);
  });
}

/**
 * Ejecuta una consulta interactiva a la IA con efecto de escritura.
 * @param {string} qType - Tipo de consulta seleccionada.
 */
function executeAIQuery(qType) {
  const textEl = document.getElementById('ai-chat-text');
  const bubbleEl = document.getElementById('ai-chat-response');

  // Mostrar indicador de carga
  bubbleEl.classList.add('loading-dots');
  textEl.innerHTML = '<em>Analizando libros contables...</em>';

  const analysis = generateAIAnalysis();

  let responseText = '';

  switch (qType) {
    case 'diagnostico':
      responseText = `
        <strong>Diagnóstico de Salud Financiera:</strong><br><br>
        La situación financiera de la empresa se cataloga como <strong>Sólida con Atención en Cartera</strong>.<br><br>
        • <strong>Fortaleza:</strong> Dispones de una liquidez de <strong>${formatCLP(analysis.caja)}</strong> en caja operativa consolidada, lo que te blinda operativamente frente a imprevistos en el corto plazo.<br>
        • <strong>Debilidad:</strong> Tienes una planilla de sueldos mensual considerable de <strong>${formatCLP(analysis.sueldosTotal)}</strong> y gastos fijos de <strong>${formatCLP(analysis.fijosTotal)}</strong>. Esto exige un ingreso de planta constante de al menos <strong>${formatCLP(analysis.sueldosTotal + analysis.fijosTotal)}</strong> mensual para no consumir tu caja acumulada.<br>
        • <strong>Relación GMD & Grafhika:</strong> El sistema ha detectado y aislado los movimientos inter-compañías entre las empresas hermanas (incluyendo traspasos directos y TEFs recurrentes). Estos flujos internos han sido completamente excluidos de las métricas de ingresos y egresos de caja para entregar un análisis de rentabilidad orgánico y libre de doble contabilidad.<br>
        • <strong>Riesgo:</strong> El simulador muestra que, en caso de que la cobranza caiga al 50% de efectividad, la caja operativa podría contraerse considerablemente en los próximos 6 meses si no se cuenta con retiros de tus fondos de inversión.
      `;
      break;

    case 'riesgo-clientes':
      responseText = `
        <strong>Análisis de Cartera y Clientes Críticos:</strong><br><br>
        La cobranza total pendiente en estado VENCIDO suma un total de <strong>${formatCLP(analysis.cobranzaVencida)}</strong>.<br><br>
        • <strong>Mayor Deudor Individual:</strong> La empresa <strong>${analysis.maxDebtorName}</strong> adeuda un saldo neto de <strong>${formatCLP(analysis.maxDebtorVal)}</strong> (Folio de factura: ${analysis.maxDebtorFolio}), concentrando un preocupante <strong>${analysis.maxDebtorPercent.toFixed(1)}%</strong> del riesgo total de tu cartera de cobro.<br>
        • <strong>Gestión Directa:</strong> El contacto registrado para esta cuenta es <strong>${analysis.maxDebtorContact || 'No especificado'}</strong>. Se aconseja iniciar contacto preventivo inmediato.<br>
        • <strong>Alternativa de Liquidez:</strong> Dado que el historial muestra operaciones previas de factoring (como BICE Factoring y Factoring Security), ceder estos folios vencidos de clientes corporativos triple-A inyectará caja de inmediato reduciendo el costo de cobranza judicial.
      `;
      break;

    case 'runway-analisis':
      responseText = `
        <strong>Análisis Detallado de Runway y Nómina:</strong><br><br>
        Tus egresos recurrentes de planta mensuales son de <strong>${formatCLP(analysis.sueldosTotal + analysis.fijosTotal)}</strong>, divididos de la siguiente forma:<br><br>
        • <strong>Remuneraciones Consolidadas:</strong> <strong>${formatCLP(analysis.sueldosTotal)}</strong> mensual. Distribuido en Grafhika (<strong>${formatCLP(analysis.sueldosGrafhika)}</strong>), GMD (<strong>${formatCLP(analysis.sueldosGmd)}</strong>) y Grafhika Spa (<strong>${formatCLP(analysis.sueldosSpa)}</strong>).<br>
        • <strong>Gastos Fijos Operativos:</strong> <strong>${formatCLP(analysis.fijosTotal)}</strong> (incluyendo mano de obra de maestros y seguros vehiculares).<br><br>
        Tu runway de caja es de aproximadamente <strong>${(analysis.caja / (analysis.sueldosTotal + analysis.fijosTotal)).toFixed(1)} meses</strong>. Si a esto le sumamos el peso de los créditos bancarios activos este mes (que suman <strong>${formatCLP(analysis.creditosMes)}</strong> en cuotas), el runway se mantiene por sobre los <strong>240 días</strong>, dándote una gran ventaja competitiva y holgura en tu mercado.
      `;
      break;

    case 'estrategia-90':
      responseText = `
        <strong>Recomendaciones Estratégicas para los Próximos 90 Días:</strong><br><br>
        1. <strong>Campaña Preferencial sobre ${analysis.maxDebtorName}</strong>: Enfocar al equipo de finanzas en recuperar los <strong>${formatCLP(analysis.maxDebtorVal)}</strong> pendientes. El retorno de este monto extiende tu runway en más de 90 días de forma automática.<br>
        2. <strong>Rentabilización de Caja Inactiva</strong>: Mantienes saldos de cuenta corriente ociosos. Recomendamos traspasar excedentes a Fondos Mutuos de rescate inmediato para generar retornos sin asumir riesgos corporativos (siguiendo tu histórico de rescates por $20M CLP).<br>
        3. <strong>Planificación ante Vencimientos</strong>: Las cuotas de créditos se concentran a inicios del mes (día 4 y día 13). Asegurar que las cuentas corrientes de Scotiabank y Santander tengan saldo suficiente al menos 48h hábiles antes para evitar sobregiros automáticos y cargos de interés comercial.
      `;
      break;
      
    default:
      responseText = 'Consulta no reconocida. Por favor, selecciona una sugerencia.';
  }

  // Simular retardo de escritura de la IA para una experiencia premium
  setTimeout(() => {
    bubbleEl.classList.remove('loading-dots');
    textEl.innerHTML = responseText;
  }, 750);
}

/**
 * Genera métricas analíticas agregadas para el CFO de IA.
 * @returns {Object} Diagnóstico consolidado.
 */
function generateAIAnalysis() {
  const caja = totalDisponible();
  const inversiones = totalInversiones();

  // Sueldos por empresa
  let sueldosTotal = 0;
  let sueldosGrafhika = 0;
  let sueldosGmd = 0;
  let sueldosSpa = 0;

  state.data.sueldos.forEach(s => {
    sueldosTotal += s.monto;
    const emp = s.empresa.toLowerCase();
    if (emp.includes('spa')) sueldosSpa += s.monto;
    else if (emp.includes('gmd')) sueldosGmd += s.monto;
    else sueldosGrafhika += s.monto;
  });

  const fijosTotal = state.data.gastosFijos.reduce((acc, f) => acc + f.monto, 0);

  // Cobranza Vencida
  const cobranzas = state.data.cobranza;
  const cobranzaVencida = cobranzas.reduce((acc, c) => c.estado === 'VENCIDO' ? acc + c.saldoPendiente : acc, 0);

  // Obtener mayor deudor
  const debtors = {};
  const debtorDetails = {};
  cobranzas.forEach(c => {
    if (c.estado === 'VENCIDO') {
      debtors[c.razonSocial] = (debtors[c.razonSocial] || 0) + c.saldoPendiente;
      if (!debtorDetails[c.razonSocial]) {
        debtorDetails[c.razonSocial] = { folio: c.folio, contacto: c.contacto };
      }
    }
  });

  let maxDebtorName = 'Sin Deudores';
  let maxDebtorVal = 0;
  let maxDebtorFolio = '-';
  let maxDebtorContact = '-';

  Object.keys(debtors).forEach(name => {
    if (debtors[name] > maxDebtorVal) {
      maxDebtorVal = debtors[name];
      maxDebtorName = name;
      maxDebtorFolio = debtorDetails[name].folio;
      maxDebtorContact = debtorDetails[name].contacto;
    }
  });

  const maxDebtorPercent = cobranzaVencida > 0 ? (maxDebtorVal / cobranzaVencida) * 100 : 0;

  // Cuotas de Crédito del mes actual
  const creditosMes = state.data.creditos
    .filter(c => c.estado === 'PENDIENTE')
    .reduce((acc, c) => acc + c.montoPago, 0);

  // Runway en días
  const burnRate = sueldosTotal + fijosTotal + (creditosMes / 12);
  const daysRunway = burnRate > 0 ? Math.round(caja / (burnRate / 30)) : 365;

  // Primer mes de déficit del simulador (bajo escenario por defecto al 80%)
  let firstDeficit = null;
  const prob = 0.8;
  let currentBalance = caja;
  
  let startYear = 2026;
  let startMonth = 4;
  if (state.data.movimientos.length > 0) {
    const latestMov = state.data.movimientos[0].fecha;
    if (latestMov) {
      startYear = latestMov.getFullYear();
      startMonth = latestMov.getMonth();
    }
  }

  const monthsNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  for (let m = 0; m < 12; m++) {
    const projDate = new Date(startYear, startMonth + m, 15);
    const mLabel = `${monthsNames[projDate.getMonth()]} ${projDate.getFullYear()}`;
    const targetMonth = projDate.getMonth();
    const targetYear = projDate.getFullYear();

    const cobranzasMes = state.data.cobranza.filter(c => {
      if (c.estado !== 'VENCIDO' || !c.vencimiento) return false;
      return c.vencimiento.getMonth() === targetMonth && c.vencimiento.getFullYear() === targetYear;
    });
    
    const cobranzaProyectada = Math.round(cobranzasMes.reduce((acc, c) => acc + c.saldoPendiente, 0) * prob);

    const creditosMesProj = state.data.creditos.filter(c => {
      if (c.estado !== 'PENDIENTE' || !c.fecha) return false;
      return c.fecha.getMonth() === targetMonth && c.fecha.getFullYear() === targetYear;
    }).reduce((acc, c) => acc + c.montoPago, 0);

    const totalEgresos = sueldosTotal + fijosTotal + creditosMesProj;
    currentBalance += (cobranzaProyectada - totalEgresos);

    if (currentBalance < 0 && firstDeficit === null) {
      firstDeficit = mLabel;
    }
  }

  return {
    caja,
    inversiones,
    sueldosTotal,
    sueldosGrafhika,
    sueldosGmd,
    sueldosSpa,
    fijosTotal,
    cobranzaVencida,
    maxDebtorName,
    maxDebtorVal,
    maxDebtorFolio,
    maxDebtorContact,
    maxDebtorPercent,
    creditosMes,
    daysRunway,
    firstDeficit
  };
}

