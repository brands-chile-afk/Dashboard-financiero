/**
 * Módulo de Inicialización y Actualización de Gráficos (ApexCharts)
 */

// Paleta de colores corporativos premium para los gráficos
const CHART_COLORS = ['#2563eb', '#10b981', '#6366f1', '#d97706', '#7c3aed', '#ec4899', '#06b6d4'];

/**
 * Formatea valores numéricos como CLP abreviado (ej. $1.2M o $500K) para las etiquetas de los ejes.
 * @param {number} value - El monto numérico.
 * @returns {string} Texto formateado.
 */
function formatCLPShort(value) {
  const isNegative = value < 0;
  const absVal = Math.abs(value);
  let text = '';
  
  if (absVal >= 1000000) {
    text = `$${(absVal / 1000000).toFixed(1)}M`;
  } else if (absVal >= 1000) {
    text = `$${(absVal / 1000).toFixed(0)}K`;
  } else {
    text = `$${absVal}`;
  }
  
  return isNegative ? `-${text}` : text;
}

/**
 * Inicializa el gráfico histórico de fondos acumulados (Área suavizada).
 * @param {string} containerId - Selector del contenedor.
 * @param {Array<string>} dates - Array de fechas en orden cronológico.
 * @param {Array<number>} totals - Array de saldos totales correspondientes.
 * @returns {Object|null} Instancia del gráfico ApexCharts o null.
 */
export function initFundsHistory(containerId, dates, totals) {
  const element = document.getElementById(containerId);
  if (!element || typeof ApexCharts === 'undefined') return null;
  
  element.innerHTML = '';
  
  const options = {
    series: [{
      name: 'Fondos Totales',
      data: totals
    }],
    chart: {
      type: 'area',
      height: 320,
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: [CHART_COLORS[0]],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 95, 100]
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
      padding: { right: 20, left: 10 }
    },
    xaxis: {
      categories: dates,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#64748b', fontSize: '11px' }
      }
    },
    yaxis: {
      labels: {
        formatter: (val) => formatCLPShort(val),
        style: { colors: '#64748b', fontSize: '11px' }
      }
    },
    tooltip: {
      x: { format: 'dd/MM/yyyy' },
      y: {
        formatter: (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val)
      },
      theme: 'light',
      style: { fontSize: '12px' }
    }
  };
  
  const chart = new ApexCharts(element, options);
  chart.render();
  return chart;
}

/**
 * Inicializa el gráfico circular de distribución de saldos por bancos (Dona).
 * @param {string} containerId - Selector del contenedor.
 * @param {Array<string>} bankNames - Nombres de los bancos.
 * @param {Array<number>} balances - Saldos correspondientes.
 * @returns {Object|null} Instancia del gráfico ApexCharts o null.
 */
export function initBanksDonut(containerId, bankNames, balances) {
  const element = document.getElementById(containerId);
  if (!element || typeof ApexCharts === 'undefined') return null;
  
  element.innerHTML = '';
  
  const options = {
    series: balances,
    labels: bankNames,
    chart: {
      type: 'donut',
      height: 320,
      fontFamily: 'Inter, sans-serif'
    },
    colors: CHART_COLORS,
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: ['#ffffff'] },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '13px',
              fontWeight: 500,
              color: '#64748b',
              offsetY: -5
            },
            value: {
              show: true,
              fontSize: '18px',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700,
              color: '#0f172a',
              offsetY: 5,
              formatter: (val) => formatCLPShort(val)
            },
            total: {
              show: true,
              label: 'Total Caja',
              fontSize: '12px',
              fontWeight: 500,
              color: '#64748b',
              formatter: function (w) {
                const totalSum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return formatCLPShort(totalSum);
              }
            }
          }
        }
      }
    },
    legend: {
      position: 'bottom',
      fontSize: '12px',
      labels: { colors: '#475569' },
      markers: { radius: 12 }
    },
    tooltip: {
      y: {
        formatter: (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val)
      }
    }
  };
  
  const chart = new ApexCharts(element, options);
  chart.render();
  return chart;
}

/**
 * Inicializa el gráfico de proyección del flujo de caja (Línea con gradiente y zona de alerta).
 * @param {string} containerId - Selector del contenedor.
 * @param {Array<string>} months - Meses proyectados (ej. Jun 2026, Jul 2026).
 * @param {Array<number>} values - Saldos acumulados proyectados.
 * @returns {Object|null} Instancia de ApexCharts.
 */
export function initProjectionChart(containerId, months, values) {
  const element = document.getElementById(containerId);
  if (!element || typeof ApexCharts === 'undefined') return null;
  
  element.innerHTML = '';
  
  const options = {
    series: [{
      name: 'Caja Proyectada',
      data: values
    }],
    chart: {
      type: 'area',
      height: 380,
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: [CHART_COLORS[2]],
    stroke: {
      curve: 'smooth',
      width: 4
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 95, 100]
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
      padding: { right: 20, left: 10 }
    },
    markers: {
      size: 4,
      colors: [CHART_COLORS[2]],
      strokeColors: '#ffffff',
      strokeWidth: 2,
      hover: { size: 6 }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: months,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#64748b', fontSize: '11px' }
      }
    },
    yaxis: {
      labels: {
        formatter: (val) => formatCLPShort(val),
        style: { colors: '#64748b', fontSize: '11px' }
      }
    },
    // Añadimos una línea de referencia para $0 (Déficit de caja)
    annotations: {
      position: 'back',
      yaxis: [{
        y: 0,
        borderColor: '#dc2626',
        borderWidth: 2,
        strokeDashArray: 4,
        label: {
          borderColor: '#dc2626',
          style: {
            color: '#ffffff',
            background: '#dc2626',
            fontSize: '10px',
            fontWeight: 600,
            padding: { left: 6, right: 6, top: 4, bottom: 4 }
          },
          text: 'Línea de Alerta (Déficit)',
          position: 'left',
          offsetX: 10
        }
      }]
    },
    tooltip: {
      y: {
        formatter: (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val)
      },
      theme: 'light'
    }
  };
  
  const chart = new ApexCharts(element, options);
  chart.render();
  return chart;
}

/**
 * Actualiza los datos de un gráfico de forma fluida.
 * @param {Object} chart - Instancia del gráfico ApexCharts.
 * @param {Array<string>} categories - Nuevas categorías de eje X (opcional).
 * @param {Array<Object>} seriesData - Nuevos datos de series (ej. [{ name: '...', data: [...] }]).
 */
export function updateChart(chart, categories, seriesData) {
  if (!chart) return;
  
  const updateOpts = {
    series: seriesData
  };
  
  if (categories) {
    updateOpts.xaxis = {
      categories: categories
    };
  }
  
  chart.updateOptions(updateOpts, false, true, true);
}
