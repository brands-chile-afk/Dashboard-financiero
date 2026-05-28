import os

file_path = r"c:\Users\brand\Desktop\Claude\Dashboard financiero\index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target_start = "  const executeCustomQuery = (queryInput) => {"
if target_start not in content:
    print("ERROR: Target start not found!")
    exit(1)

start_idx = content.find(target_start)

# Let's search for the end block of executeCustomQuery
target_end = "    setTimeout(() => {\n      setIsTyping(false);\n      setChatResponse(text);\n    }, 600);\n  };"
end_idx = content.find(target_end, start_idx)

if end_idx == -1:
    # try with carriage returns \r\n
    target_end = "    setTimeout(() => {\r\n      setIsTyping(false);\r\n      setChatResponse(text);\r\n    }, 600);\r\n  };"
    end_idx = content.find(target_end, start_idx)

if end_idx == -1:
    print("ERROR: Target end block not found!")
    exit(1)

end_idx += len(target_end)

original_block = content[start_idx : end_idx]

replacement_block = """  const runOfflineQuery = (query, queryInput, errorMsg = "") => {
    let text = '';

    // Predefined shortcuts from tags
    if (query === 'diagnostico') {
      text = `<strong>Diagnóstico de Salud Financiera:</strong><br><br>
      La situación financiera del grupo se cataloga como <strong>Sólida con Atención en Cartera</strong>.<br><br>
      • <strong>Fortaleza:</strong> Dispones de una liquidez de <strong>\${fmt(totalCaja)}</strong> en caja operativa consolidada, lo que te blinda operativamente frente a imprevistos en el corto plazo.<br>
      • <strong>Debilidad:</strong> Tienes una planilla de sueldos mensual considerable de <strong>\${fmt(sueldosTotal)}</strong> y gastos fijos de <strong>\${fmt(fijosTotal)}</strong>. Esto exige un ingreso de planta constante de al menos <strong>\${fmt(sueldosTotal + fijosTotal)}</strong> mensual para no consumir tu caja acumulada.<br>
      • <strong>Relación GMD & Grafhika:</strong> El sistema ha detectado y aislado los movimientos inter-compañías entre las empresas hermanas (incluyendo traspasos directos y TEFs recurrentes). Estos flujos internos han sido completamente excluidos de las métricas de ingresos y egresos de caja para entregar un análisis de rentabilidad orgánico y libre de doble contabilidad.<br>
      • <strong>Riesgo:</strong> El simulador muestra que, en caso de que la cobranza caiga al 50% de efectividad, la caja operativa podría contraerse considerablemente en los próximos 6 meses si no se cuenta con retiros de tus fondos de inversión.`;
    } else if (query === 'riesgo-clientes') {
      text = `<strong>Análisis de Cartera y Clientes Críticos:</strong><br><br>
      La cobranza total pendiente en estado VENCIDO suma un total de <strong>\${fmt(cobranzaVencida)}</strong>.<br><br>
      • <strong>Mayor Deudor Individual:</strong> La empresa <strong>\${maxDebtorName}</strong> adeuda un saldo neto de <strong>\${fmt(maxDebtorVal)}</strong>, concentrando un preocupante <strong>\${maxDebtorPercent.toFixed(1)}%</strong> del riesgo total de tu cartera de cobro.<br>
      • <strong>Gestión Directa:</strong> Se aconseja iniciar contacto preventivo inmediato.<br>
      • <strong>Alternativa de Liquidez:</strong> Ceder estos folios vencidos de clientes corporativos triple-A a factoring inyectará caja de inmediato reduciendo el costo de cobranza judicial.`;
    } else if (query === 'runway-analisis') {
      text = `<strong>Análisis Detallado de Runway y Nómina:</strong><br><br>
      Tus egresos recurrentes de planta mensuales son de <strong>\${fmt(sueldosTotal + fijosTotal)}</strong>, divididos de la siguiente forma:<br><br>
      • <strong>Remuneraciones Consolidadas:</strong> <strong>\${fmt(sueldosTotal)}</strong> mensual. Distribuido entre tus filiales.<br>
      • <strong>Gastos Fijos Operativos:</strong> <strong>\${fmt(fijosTotal)}</strong> (incluyendo mano de obra de maestros y seguros vehiculares).<br><br>
      Tu runway de caja es de aproximadamente <strong>\${(totalCaja / (sueldosTotal + fijosTotal)).toFixed(1)} meses</strong>. Si a esto le sumamos el peso de los créditos bancarios activos este mes (que suman <strong>\${fmt(creditosMes)}</strong> en cuotas), el runway se mantiene por sobre los <strong>120 días</strong>, dándote una gran ventaja competitiva y holgura en tu mercado.`;
    } else if (query === 'estrategia-90') {
      text = `<strong>Recomendaciones Estratégicas para los Próximos 90 Días:</strong><br><br>
      1. <strong>Campaña Preferencial sobre \${maxDebtorName}</strong>: Enfocar al equipo de finanzas en recuperar los <strong>\${fmt(maxDebtorVal)}</strong> pendientes. El retorno de este monto extiende tu runway en más de 90 días de forma automática.<br>
      2. <strong>Rentabilización de Caja Inactiva</strong>: Mantienes saldos de cuenta corriente ociosos. Recomendamos traspasar excedentes a Fondos Mutuos de rescate inmediato para generar retornos sin asumir riesgos corporativos.<br>
      3. <strong>Planificación ante Vencimientos</strong>: Las cuotas de créditos se concentran a inicios del mes (día 4 y día 13). Asegurar que las cuentas corrientes tengan saldo suficiente al menos 48h hábiles antes para evitar sobregiros automáticos y cargos de interés comercial.`;
    } 
    // 1. BANK BALANCE / LIQUIDITY
    else if (
      query.includes("banco") ||
      query.includes("caja") ||
      query.includes("liquidez") ||
      query.includes("dinero") ||
      query.includes("plata") ||
      query.includes("efectivo") ||
      query.includes("cuenta corriente") ||
      query.includes("cuentas corrientes") ||
      query.includes("saldo")
    ) {
      const activeSaldos = saldos || SALDOS_BANCO;
      const totalBancos = Object.values(activeSaldos).reduce((a, b) => a + b, 0);
      const breakdown = Object.entries(activeSaldos)
        .map(([banco, monto]) => `• <strong>\${banco}</strong>: \${fmt(monto)}`)
        .join("<br>");

      text = `<strong>Resumen de Saldos Bancarios y Liquidez Inmediata:</strong><br><br>
      Dispones de un saldo de caja consolidado de <strong>\${fmt(totalBancos)}</strong> en tus cuentas corrientes.<br><br>
      <strong>Desglose por Entidad Bancaria:</strong><br>\${breakdown}<br><br>
      <em>Nota: Esta liquidez te entrega una base robusta para la cobertura de egresos. No incluye tus fondos de inversión en FFMM.</em>`;
    }
    // 2. NOMINA / SUELDOS
    else if (
      query.includes("sueldo") ||
      query.includes("sueldos") ||
      query.includes("nomina") ||
      query.includes("remuneracion") ||
      query.includes("remuneraciones") ||
      query.includes("planilla") ||
      query.includes("trabajador") ||
      query.includes("trabajadores") ||
      query.includes("empleado") ||
      query.includes("empleados")
    ) {
      const activeNomina = NOMINA_DATA && NOMINA_DATA.length ? NOMINA_DATA : [];
      const totalSueldos = activeNomina.reduce((s, e) => s + e.monto, 0);
      const totalPersonas = activeNomina.reduce((s, e) => s + (e.personas || 1), 0);

      let breakdown = "";
      if (activeNomina.length > 0) {
        breakdown = "<strong>Desglose por Empresa:</strong><br>" + activeNomina
          .map(e => `• <strong>\${e.empresa}</strong>: \${fmt(e.monto)} (\${e.personas || 1} personas)`)
          .join("<br>");
      } else {
        const fallbackNom = (typeof SUELDOS_DATA !== 'undefined' && SUELDOS_DATA.length) 
          ? SUELDOS_DATA.reduce((s, f) => s + f.monto, 0)
          : 0;
        if (fallbackNom > 0) {
          breakdown = `• Nómina estimada de planta (Google Sheets): <strong>\${fmt(fallbackNom)}</strong>`;
        } else {
          breakdown = "<em>No se registra nómina cargada en el sistema para este período.</em>";
        }
      }

      text = `<strong>Análisis de Nómina y Remuneraciones del Período:</strong><br><br>
      Este mes se registra un egreso acumulado de <strong>\${fmt(totalSueldos || sueldosTotal)}</strong> para el pago de remuneraciones, cubriendo a un total estimado de <strong>\${totalPersonas || 1}</strong> colaboradores.<br><br>
      \${breakdown}<br><br>
      <em>Recomendación: La nómina de sueldos constituye tu mayor compromiso de egreso fijo recurrente. Asegurar saldo suficiente el día 30 en cuentas operativas.</em>`;
    }
    // 3. COBRANZAS / CUENTAS POR COBRAR / RECEIVABLES
    else if (
      query.includes("cobrar") ||
      query.includes("cobranza") ||
      query.includes("factura") ||
      query.includes("facturas") ||
      query.includes("cliente") ||
      query.includes("clientes") ||
      query.includes("deuda") ||
      query.includes("deudas") ||
      query.includes("deudor") ||
      query.includes("deudores")
    ) {
      // Extract day count using regex
      let days = 30; // default to 30 days
      const matchDias = query.match(/(\\d+)\\s*dia/);
      const matchMeses = query.match(/(\\d+)\\s*mes/);
      if (matchDias) {
        days = parseInt(matchDias[1], 10);
      } else if (matchMeses) {
        days = parseInt(matchMeses[1], 10) * 30;
      } else if (query.includes("quince")) {
        days = 15;
      } else if (query.includes("una semana") || query.includes("1 semana") || query.includes("7 dias")) {
        days = 7;
      } else if (query.includes("mes") && !query.includes("meses")) {
        days = 30;
      }

      const refDate = getReferenceDate();
      const targetDate = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate() + days, 12, 0, 0);

      const vencidas = COB_PENDIENTES.filter(c => c.estado === 'VENCIDO');
      const sumVencidas = vencidas.reduce((s, c) => s + c.saldo, 0);

      const porVencer = COB_PENDIENTES.filter(c => {
        if (c.estado !== 'PENDIENTE' || !c.vencimiento) return false;
        const d = new Date(c.vencimiento + 'T12:00:00');
        return d >= refDate && d <= targetDate;
      });
      const sumPorVencer = porVencer.reduce((s, c) => s + c.saldo, 0);

      const debtors = {};
      porVencer.forEach(c => {
        debtors[c.empresa] = (debtors[c.empresa] || 0) + c.saldo;
      });
      const topDebtors = Object.entries(debtors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, val]) => `• <strong>\${name}</strong>: \${fmt(val)}`)
        .join("<br>");

      text = `<strong>Auditoría de Cuentas por Cobrar (Próximos \${days} días):</strong><br><br>
      El sistema proyecta el siguiente panorama de cobranza desde el día de corte (<strong>\${refDate.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>):<br><br>
      • <strong>Cobranza por vencer (próximos \${days} días)</strong>: <strong>\${fmt(sumPorVencer)}</strong> (\${porVencer.length} facturas activas).<br>
      • <strong>Cobranza ya VENCIDA (mora acumulada)</strong>: <strong>\${fmt(sumVencidas)}</strong> (\${vencidas.length} facturas vencidas).<br>
      • <strong>Cuentas por cobrar totales disponibles</strong>: <strong>\${fmt(sumVencidas + sumPorVencer)}</strong>.<br><br>
      \${topDebtors.length > 0 ? `<strong>Clientes clave con vencimientos en este período:</strong><br>\${topDebtors}<br><br>` : ''}
      <em>Estrategia: Un total de \${fmt(sumPorVencer)} está programado para entrar en caja de forma natural. Se aconseja un seguimiento preventivo 5 días antes de cada vencimiento crítico.</em>`;
    }
    // 4. FONDOS MUTUOS / INVERSIONES
    else if (
      query.includes("fondos") ||
      query.includes("ffmm") ||
      query.includes("inversion") ||
      query.includes("inversiones") ||
      query.includes("ahorro")
    ) {
      const activeFondos = FONDOS && FONDOS.length > 0 ? FONDOS[FONDOS.length - 1].total : 0;
      text = `<strong>Auditoría de Fondos de Inversión y Excedentes:</strong><br><br>
      Mantienes una cartera activa de Fondos Mutuos valorizada en <strong>\${fmt(activeFondos || totalInversiones)}</strong>.<br><br>
      • <strong>Rol del Portafolio:</strong> Estos fondos actúan como reserva líquida de contingencia y generan retornos diarios sobre tus excedentes.<br>
      • <strong>Facilidad de Rescate:</strong> Dado su carácter de rescate en 24/48 horas, se consideran caja de respaldo inmediata frente a caídas drásticas de facturación.<br><br>
      <em>Recomendación: En caso de requerir caja para cubrir finiquitos imprevistos o cuotas de créditos, realizar rescates parciales para no sobregirar las cuentas operativas.</em>`;
    }
    // 5. CREDITOS
    else if (
      query.includes("credito") ||
      query.includes("prestamo") ||
      query.includes("prestamos") ||
      query.includes("creditos") ||
      query.includes("cuota") ||
      query.includes("cuotas") ||
      query.includes("deuda bancaria")
    ) {
      const activeCreditos = CREDITOS_SHEETS_RAW.filter(c => c.estado !== 'Pagado');
      const totalCuotaMes = activeCreditos.reduce((s, c) => s + c.montoPago, 0);
      const outstandingSum = activeCreditos.reduce((s, c) => s + (c.saldoPendiente || c.montoTotal || 0), 0);

      let breakdown = "";
      if (activeCreditos.length > 0) {
        breakdown = "<strong>Créditos activos contratados:</strong><br>" + activeCreditos
          .map(c => `• <strong>\${c.banco}</strong>: Cuota de \${fmt(c.montoPago)} (Vence el día \${c.diaPago || 'N/A'})`)
          .join("<br>");
      } else {
        breakdown = "<em>No se registran créditos bancarios pendientes de pago para este período.</em>";
      }

      text = `<strong>Estado de Créditos Bancarios y Compromisos Financieros:</strong><br><br>
      Este mes debes cubrir un total de <strong>\${fmt(totalCuotaMes || creditosMes)}</strong> en cuotas de créditos bancarios activos.<br><br>
      \${breakdown}<br><br>
      • <strong>Saldo Pendiente Estimado de Deuda Bancaria</strong>: <strong>\${fmt(outstandingSum)}</strong>.<br><br>
      <em>Nota: Las cuotas de amortización representan un egreso de caja ineludible. Asegurar liquidez en las cuentas corrientes correspondientes en sus días de vencimiento.</em>`;
    }
    // 6. FINIQUITOS
    else if (
      query.includes("finiquito") ||
      query.includes("finiquitos") ||
      query.includes("despido") ||
      query.includes("indemnizacion")
    ) {
      const activeFiniquitos = FINIQUITOS_RAW.filter(f => f.estado !== 'Pagado');
      const sumFiniquitos = activeFiniquitos.reduce((s, f) => s + f.montoPago, 0);

      let breakdown = "";
      if (activeFiniquitos.length > 0) {
        breakdown = "<strong>Detalle de Finiquitos Pendientes:</strong><br>" + activeFiniquitos
          .map(f => `• <strong>\${f.trabajador || 'Trabajador'}</strong> (\${f.empresa || 'Empresa'}): \${fmt(f.montoPago)} - Vencimiento: \${f.fecha || 'N/A'}`)
          .join("<br>");
      } else {
        breakdown = "<em>No se registran finiquitos ni indemnizaciones pendientes de pago para este mes.</em>";
      }

      text = `<strong>Reporte de Finiquitos y Compromisos Laborales Extraordinarios:</strong><br><br>
      El total por pagar por concepto de finiquitos y salidas extraordinarias de personal este mes es de <strong>\${fmt(sumFiniquitos)}</strong>.<br><br>
      \${breakdown}<br><br>
      <em>Sugerencia: Estos egresos son de alta prioridad legal. Asegura los saldos o utiliza la línea de crédito si los flujos de cobranza se retrasan.</em>`;
    }
    // 7. TRASPASOS / PAGOS / TRANSFERENCIAS PERSONALIZADOS (e.g. Brandon Villarroel)
    else if (
      query.includes("transferi") || 
      query.includes("transfiri") || 
      query.includes("transferencia") || 
      query.includes("transferencias") || 
      query.includes("traspas") || 
      query.includes("traspaso") || 
      query.includes("traspasos") || 
      query.includes("pago") || 
      query.includes("pagos") || 
      query.includes("pagar") ||
      query.includes("pagamos")
    ) {
      let days = 60; // default to 60 days
      let hasExplicitTimeframe = false;
      const matchDias = query.match(/(\\d+)\\s*dia/);
      const matchMeses = query.match(/(\\d+)\\s*mes/);
      if (matchDias) {
        days = parseInt(matchDias[1], 10);
        hasExplicitTimeframe = true;
      } else if (matchMeses) {
        days = parseInt(matchMeses[1], 10) * 30;
        hasExplicitTimeframe = true;
      } else if (query.includes("quince")) {
        days = 15;
        hasExplicitTimeframe = true;
      } else if (query.includes("una semana") || query.includes("1 semana") || query.includes("7 dias")) {
        days = 7;
        hasExplicitTimeframe = true;
      } else if (query.includes("mes") && !query.includes("meses")) {
        days = 30;
        hasExplicitTimeframe = true;
      }

      const refDate = getReferenceDate();
      const startDateLimit = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate() - days, 12, 0, 0);

      const activeMovs = movRecientes || MOV_RECIENTES || [];
      const dateFilteredMovs = activeMovs.filter(m => {
        if (!m.fecha) return false;
        const d = new Date(m.fecha + 'T12:00:00');
        if (hasExplicitTimeframe) {
          return d >= startDateLimit && d <= refDate;
        }
        return true; // Search all if no timeframe is specified
      });

      const stopwords = ['cuanto', 'se', 'le', 'transfirio', 'transferio', 'transferir', 'transfiri', 'durante', 'los', 'ultimos', 'ultimo', 'mes', 'meses', 'dia', 'dias', 'quince', 'semana', 'semanas', 'este', 'esta', 'del', 'con', 'para', 'por', 'una', 'uno', 'unos', 'unas', 'que', 'quien', 'quienes', 'aqui', 'alla', 'hacer', 'hemos', 'tiene', 'tienen', 'habia', 'total', 'suma', 'pesos', 'clp', 'a', 'de', 'le', 'la', 'lo', 'las', 'los', 'un', 'el', 'en', 'y', 'o', 'u', 'e', 'al', 'del', 'pago', 'pagos', 'pagamos', 'pagar', 'traspaso', 'traspasos', 'transferencia', 'transferencias', 'movimiento', 'movimientos', 'gasto', 'gastos', 'egreso', 'egresos', 'ingreso', 'ingresos'];
      
      const words = query.split(/\\s+/).map(w => cleanText(w)).filter(w => w.length >= 3 && !stopwords.includes(w));

      let matchedMovs = [];
      if (words.length > 0) {
        matchedMovs = dateFilteredMovs.filter(m => {
          if (!m.descripcion) return false;
          const desc = cleanText(m.descripcion);
          return words.some(word => desc.includes(word));
        });
      }

      if (words.length > 0 && matchedMovs.length > 0) {
        const sumTransfers = matchedMovs.reduce((s, m) => s + Math.abs(m.monto), 0);
        const countTransfers = matchedMovs.length;

        const bankGroup = {};
        matchedMovs.forEach(m => {
          bankGroup[m.banco] = (bankGroup[m.banco] || 0) + Math.abs(m.monto);
        });
        const bankBreakdown = Object.entries(bankGroup)
          .map(([bank, val]) => `• <strong>\n\${bank}</strong>: \${fmt(val)}`)
          .join('<br>');

        const listDetails = matchedMovs.slice(0, 10)
          .map(m => `• <strong>\${m.fecha}</strong>: \${m.descripcion} - <strong>\${fmt(Math.abs(m.monto))}</strong> (\${m.banco})`)
          .join('<br>');

        text = `<strong>Auditoría de Transferencias y Pagos Realizados:</strong><br><br>
        Se han identificado <strong>\${countTransfers}</strong> movimientos que coinciden con los términos de búsqueda (<em>"\${words.join(', ')}"</em>)\${hasExplicitTimeframe ? ` en los últimos \${days} días` : ' en todo el historial disponible'}:<br><br>
        • <strong>Monto total transferido</strong>: <strong>\${fmt(sumTransfers)}</strong>.<br><br>
        <strong>Desglose por Entidad Bancaria:</strong><br>\${bankBreakdown}<br><br>
        <strong>Movimientos detectados (hasta 10):</strong><br>\${listDetails}<br><br>
        <em>Análisis: Estos egresos corresponden a transferencias bancarias directas y cobros registrados en tus cartolas.</em>`;
      } else {
        const searchedTerms = words.length > 0 ? words.join(', ') : 'términos vacíos';
        text = `<strong>Consulta de Transferencias / Pagos:</strong><br><br>
        No se encontraron transferencias o pagos que coincidan con los términos de tu búsqueda (<em>"\${searchedTerms}"</em>)\${hasExplicitTimeframe ? ` en los últimos \${days} días` : ' en el historial'}.<br><br>
        • <strong>Sugerencia</strong>: Asegúrate de escribir el nombre o razón social correcto (por ejemplo, <em>"Brandon Villarroel"</em>, <em>"Jaime"</em>, o <em>"Poliplas"</em>).`;
      }
    }
    // 7.5 CHEQUES Y PROYECCIONES
    else if (
      query.includes("cheque") ||
      query.includes("cheques") ||
      query.includes("proyeccion") ||
      query.includes("proyecciones") ||
      query.includes("proyectado") ||
      query.includes("proyectados")
    ) {
      const activeGastos = GASTOS || [];
      const pendientes = activeGastos.filter(g => g.estado === 'Pendiente');
      const pagados = activeGastos.filter(g => g.estado === 'Pagado');
      const totalPend = pendientes.reduce((s, g) => s + g.monto, 0);
      const totalPag = pagados.reduce((s, g) => s + g.monto, 0);

      const listPend = pendientes.slice(0, 8)
        .map(g => `• <strong>\${g.fecha}</strong>: \${g.descripcion} - <strong>\${fmt(g.monto)}</strong>`)
        .join('<br>');

      const listPag = pagados.slice(0, 8)
        .map(g => `• <strong>\${g.fecha}</strong>: \${g.descripcion} - <strong>\${fmt(g.monto)}</strong>`)
        .join('<br>');

      text = `<strong>Control y Proyección de Cheques (Gastos Proyectados):</strong><br><br>
      • <strong>Cheques/Egresos PENDIENTES</strong>: <strong>\${fmt(totalPend)}</strong> (\${pendientes.length} cheques por cobrar).<br>
      • <strong>Cheques/Egresos PAGADOS</strong>: <strong>\${fmt(totalPag)}</strong> (\${pagados.length} cheques cobrados).<br>
      • <strong>Total Cartera de Proyección</strong>: <strong>\${fmt(totalPend + totalPag)}</strong> (marzo – mayo 2026).<br><br>
      \${pendientes.length > 0 ? `<strong>Próximos Cheques por cobrar (hasta 8):</strong><br>\${listPend}<br><br>` : ''}
      \${pagados.length > 0 ? `<strong>Cheques ya Cobrados/Pagados (hasta 8):</strong><br>\${listPag}<br><br>` : ''}
      <em>Análisis de Proyección: La cartera de cheques representa los compromisos adquiridos con proveedores en base a la facturación proyectada.</em>`;
    }
    // 8. GASTOS FIJOS / GASTOS GENERALES
    else if (
      query.includes("gasto") ||
      query.includes("gastos") ||
      query.includes("egreso") ||
      query.includes("egresos") ||
      query.includes("salida") ||
      query.includes("costo") ||
      query.includes("costos")
    ) {
      const totalSueldos = NOMINA_DATA.reduce((s, e) => s + e.monto, 0);
      const variableGastos = GASTOS.filter(g => g.estado !== 'PAGADO').reduce((s, g) => s + g.monto, 0);

      text = `<strong>Análisis Consolidado de Egresos y Gastos Operativos:</strong><br><br>
      Tu estructura mensual estimada de salidas de caja asciende a un total de <strong>\${fmt(totalSueldos + fijosTotal + variableGastos)}</strong>, dividida de la siguiente manera:<br><br>
      • <strong>Remuneraciones (Sueldos)</strong>: <strong>\${fmt(totalSueldos)}</strong> (Planilla fija de trabajadores).<br>
      • <strong>Gastos Fijos Operativos</strong>: <strong>\${fmt(fijosTotal)}</strong> (Contratos de arriendo, seguros, y servicios recurrentes).<br>
      • <strong>Gastos Variables / Facturas de Proveedores por pagar</strong>: <strong>\${fmt(variableGastos)}</strong>.<br><br>
      <em>Estrategia: Para no erosionar tu saldo de caja, tus ingresos mensuales de cobranza orgánica deben superar los <strong>\${fmt(totalSueldos + fijosTotal)}</strong>.</em>`;
    }
    // 8. FALLBACK / GENERAL RECOMMENDATIONS
    else {
      text = `<strong>Hola, soy tu Analista Financiero IA.</strong><br><br>
      No he podido identificar una pregunta específica sobre sueldos, cuentas por cobrar, bancos o deudas. Sin embargo, puedo ayudarte con consultas en tiempo real sobre la contabilidad de <strong>Grafhika & GMD</strong>.<br><br>
      <strong>Ejemplos de preguntas que puedes hacerme:</strong><br>
      • <em>"¿Cuánto gastamos en sueldo este mes?"</em><br>
      • <em>"¿Cuánto tenemos por cobrar los próximos 15 días?"</em><br>
      • <em>"¿Cuáles son nuestros saldos en los bancos?"</em><br>
      • <em>"¿Cuánto tenemos invertido en Fondos Mutuos?"</em><br>
      • <em>"¿Cuáles son las deudas por créditos bancarios activos?"</em><br>
      • <em>"¿Qué finiquitos tenemos pendientes de pago?"</em><br><br>
      Prueba escribiendo alguna de ellas en la barra de consulta inferior.`;
    }

    if (errorMsg) {
      text = `<div style="padding: 10px 14px; background: oklch(96% .04 70); border: 1px solid oklch(86% .08 70); border-radius: 8px; font-size: 11.5px; margin-bottom: 14px; color: oklch(45% .15 70); font-family: 'DM Sans', sans-serif;">⚠️ <strong>Modo offline temporal:</strong> No se pudo conectar a Gemini Flash (\${errorMsg}). Respondiendo con el motor local offline.</div>\${text}`;
    }

    return text;
  };

  const executeCustomQuery = (queryInput) => {
    if (!queryInput.trim()) return;
    setIsTyping(true);
    setChatResponse(null);

    const query = cleanText(queryInput);

    // Call Gemini API if Key is present
    if (apiKey.trim()) {
      const systemPrompt = buildSystemPrompt();
      const context = buildContext();
      const prompt = `\${systemPrompt}\\n\\nCONTEXTO FINANCIERO:\\n\${context}\\n\\nPREGUNTA DEL USUARIO:\\n\${queryInput}`;

      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${apiKey.trim()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.15
          }
        })
      })
      .then(res => {
        if (!res.ok) throw new Error(`Error API (\${res.status})`);
        return res.json();
      })
      .then(data => {
        setIsTyping(false);
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          let cleanReply = reply.trim();
          if (cleanReply.startsWith("```html")) {
            cleanReply = cleanReply.slice(7);
          }
          if (cleanReply.endsWith("```")) {
            cleanReply = cleanReply.slice(0, -3);
          }
          setChatResponse(cleanReply);
        } else {
          throw new Error("Respuesta vacía o inválida");
        }
      })
      .catch(err => {
        console.error("Gemini Flash failed, running offline fallback:", err);
        const fallbackText = runOfflineQuery(query, queryInput, err.message);
        setIsTyping(false);
        setChatResponse(fallbackText);
      });

      return;
    }

    // Si no hay API Key, ejecutar offline directamente
    const text = runOfflineQuery(query, queryInput);
    setTimeout(() => {
      setIsTyping(false);
      setChatResponse(text);
    }, 600);
  };"""

content = content.replace(original_block, replacement_block)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: Refactored executeCustomQuery perfectly!")
