/**
 * Módulo de Procesamiento de Datos Financieros
 * Contiene funciones para parsear, formatear y normalizar
 * monedas chilenas (CLP), fechas en diversos formatos y archivos CSV.
 */

/**
 * Parsea un texto CSV respetando comillas dobles y comas internas.
 * @param {string} text - Contenido del CSV.
 * @returns {Array<Array<string>>} Matriz de filas y columnas.
 */
export function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentValue = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentValue += '"'; // Comilla escapada
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentValue.trim());
      currentValue = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++; // Saltar \n
      row.push(currentValue.trim());
      lines.push(row);
      row = [];
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // Agregar última celda/fila si quedó pendiente
  if (currentValue || row.length > 0) {
    row.push(currentValue.trim());
    lines.push(row);
  }
  
  return lines;
}

/**
 * Convierte un monto en formato chileno (ej. -400.000, $2.656.140, $ 15.000.000) a un número entero.
 * @param {string|number} value - Valor a parsear.
 * @returns {number} Número entero.
 */
export function parseCLP(value) {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return Math.round(value);
  
  // Limpiar espacios, símbolo de pesos y puntos de miles
  let cleanValue = value.replace(/[\s\$\']/g, '');
  
  // Manejo de número negativo con punto
  // Si viene como "-400.000" o "-1.014.501"
  // Debemos remover todos los puntos.
  // Pero cuidado si hay decimales con coma (ej. 350.234,50), en CLP es muy inusual pero lo manejamos:
  if (cleanValue.includes(',') && cleanValue.indexOf(',') > cleanValue.indexOf('.')) {
    // Si tiene coma después del punto, el punto es miles y la coma es decimal
    cleanValue = cleanValue.replace(/\./g, '').replace(/,/g, '.');
  } else {
    // Si no, simplemente quitamos todos los puntos
    cleanValue = cleanValue.replace(/\./g, '');
  }
  
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : Math.round(parsed);
}

/**
 * Parsea una fecha en diversos formatos a un objeto Date de JS.
 * Formatos soportados: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, YYYY-MM-DD HH:mm:ss
 * @param {string} dateStr - Cadena de fecha.
 * @returns {Date|null} Objeto Date o null si es inválido.
 */
export function parseDate(dateStr) {
  if (!dateStr) return null;
  
  const cleanStr = dateStr.trim();
  if (!cleanStr) return null;
  
  // Si tiene formato de fecha completa con hora o YYYY-MM-DD
  if (cleanStr.match(/^\d{4}-\d{2}-\d{2}/)) {
    const parts = cleanStr.split(' ')[0].split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  
  // Si tiene formato DD/MM/YYYY o DD-MM-YYYY
  const parts = cleanStr.split(/[\/\-]/);
  if (parts.length >= 3) {
    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10) - 1;
    let year = parseInt(parts[2], 10);
    
    // Si el año viene en formato de 2 dígitos
    if (year < 100) {
      year += 2000;
    }
    
    // Si por error el formato es YYYY/MM/DD
    if (parts[0].length === 4) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    }
    
    const d = new Date(year, month, day);
    return isNaN(d.getTime()) ? null : d;
  }
  
  return null;
}

/**
 * Formatea un número como pesos chilenos (ej. $1.250.000).
 * @param {number} num - Número a formatear.
 * @returns {string} Cadena formateada.
 */
export function formatCLP(num) {
  if (num === null || num === undefined || isNaN(num)) return '$0';
  
  const sign = num < 0 ? '-' : '';
  const absNum = Math.abs(Math.round(num));
  const formatted = absNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${sign}$${formatted}`;
}

/**
 * Formatea un objeto Date a formato estándar legible (DD/MM/YYYY).
 * @param {Date} date - Objeto Date.
 * @returns {string} Fecha formateada.
 */
export function formatDate(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Limpia y normaliza el texto para búsquedas (remueve acentos y pasa a minúsculas).
 * @param {string} text - Texto original.
 * @returns {string} Texto normalizado.
 */
export function cleanText(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Identifica si una descripción de movimiento corresponde a un traspaso
 * inter-compañía entre empresas hermanas (GMD y Grafhika).
 * @param {string} description - Descripción del movimiento.
 * @returns {boolean} True si es una transacción intercompañía.
 */
export function isIntercompanyTransfer(description) {
  if (!description) return false;
  const desc = description.toLowerCase();
  
  // 1. Detección de traspasos entre empresas hermanas (GMD y Grafhika)
  const isTransfer = desc.includes('traspaso') || desc.includes('transf') || desc.includes('transfe') || desc.includes('tef') || desc.includes('trasp');
  if (isTransfer) {
    const hasGmd = desc.includes('gmd') || desc.includes('grupo marketing digital') || desc.includes('grupo marketing');
    const hasGrafhika = desc.includes('grafhika') || desc.includes('copy center') || desc.includes('copycenter');
    if (hasGmd || hasGrafhika) return true;
  }
  
  // 2. Detección de Rescates de Fondos Mutuos (movimientos internos de activos entre FFMM y Caja)
  const isRescate = desc.includes('rescate') && (desc.includes('fondo') || desc.includes('ffmm') || desc.includes('mutuo'));
  if (isRescate) return true;
  
  return false;
}
