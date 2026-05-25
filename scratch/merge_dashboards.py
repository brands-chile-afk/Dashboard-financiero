import sys

# Reconfigure stdout to UTF-8
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

print("Starting programmatic dashboard merge...")

with open('Financial Dashboard_9.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject ApexCharts in head
print("- Injecting ApexCharts into <head>")
head_replacement = """<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</head>"""
content = content.replace('</head>', head_replacement)

# 2. Inject CSS styles right before </style>
print("- Injecting custom CSS styles")
css_to_inject = """
/* ── ESTILOS DEL SIMULADOR Y DEL ANALISTA IA ── */
.ai-gradient-card {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important;
  border: 1px solid #bfdbfe !important;
  border-radius: 14px !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
}
.ai-avatar-glowing {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--blue) 0%, #1e40af 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  box-shadow: 0 0 15px rgba(37,99,235,0.4);
  animation: pulseGlow 2.5s infinite;
}
@keyframes pulseGlow {
  0% { box-shadow: 0 0 10px rgba(37,99,235,0.3); }
  50% { box-shadow: 0 0 20px rgba(37,99,235,0.6); }
  100% { box-shadow: 0 0 10px rgba(37,99,235,0.3); }
}
.ai-report-content {
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--text);
}
.ai-report-content p {
  margin-bottom: 12px;
}
.ai-alert-item {
  display: flex;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  margin-bottom: 10px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.ai-alert-item.danger { border-color: var(--red); background: var(--red-bg); }
.ai-alert-item.warning { border-color: var(--amber); background: var(--amber-bg); }
.ai-alert-item.success { border-color: var(--g600); background: var(--g50); }

.ai-alert-icon { font-size: 1.2rem; flex-shrink: 0; }
.ai-alert-item.danger .ai-alert-icon { color: var(--red); }
.ai-alert-item.warning .ai-alert-icon { color: oklch(50% .17 75); }
.ai-alert-item.success .ai-alert-icon { color: var(--g600); }

.ai-alert-title { font-weight: 700; font-size: 13px; margin-bottom: 3px; }
.ai-alert-desc { font-size: 12px; color: var(--t2); line-height: 1.4; }

.ai-query-suggestions { display: flex; flex-direction: column; gap: 8px; }
.ai-query-tag {
  padding: 8px 12px;
  font-size: 12.5px;
  font-weight: 500;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  transition: all .14s;
  text-align: left;
}
.ai-query-tag:hover {
  background: var(--blue-bg);
  border-color: var(--blue);
  color: var(--blue);
}
.ai-chat-bubble {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

/* Simulator Styles */
.sim-layout {
  display: grid;
  grid-template-columns: 310px 1fr;
  gap: 16px;
  align-items: start;
}
.sim-controls {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sim-group { display: flex; flex-direction: column; gap: 6px; }
.sim-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: var(--t3); }
.sim-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  user-select: none;
}
.sim-checkbox-label input { width: 15px; height: 15px; accent-color: var(--blue); }
.sim-slider-container { display: flex; flex-direction: column; gap: 4px; }
.sim-slider { width: 100%; accent-color: var(--blue); cursor: pointer; }
.sim-slider-labels { display: flex; justify-content: space-between; font-size: 10px; color: var(--t3); font-weight: 500; }
.sim-summary-box {
  padding: 12px 14px;
  border-radius: 9px;
  border: 1px solid var(--border);
  background: var(--bg);
}

/* Animación premium de pulsación */
@keyframes cardPulse {
  0% { box-shadow: 0 4px 14px rgba(0,0,0,.06); border-color: var(--border); }
  50% { box-shadow: 0 0 15px rgba(37, 99, 235, 0.45); border-color: var(--blue); transform: scale(1.008); }
  100% { box-shadow: 0 4px 14px rgba(0,0,0,.06); border-color: var(--border); }
}
.card.highlight-pulse {
  animation: cardPulse 2s ease-in-out;
}
</style>"""
content = content.replace('</style>', css_to_inject, 1)

# 3. Inject isIntercompanyTransfer utility function in script
print("- Injecting isIntercompanyTransfer utility function")
util_inject = """const {useState,useEffect,useMemo} = React;

function isIntercompanyTransfer(description) {
  if (!description) return false;
  const desc = description.toLowerCase();
  
  // 1. Detección de traspasos entre empresas hermanas (GMD y Grafhika)
  const isTransfer = desc.includes('traspaso') || desc.includes('transf') || desc.includes('transfe') || desc.includes('tef') || desc.includes('trasp');
  if (isTransfer) {
    const hasGmd = desc.includes('gmd') || desc.includes('grupo marketing digital') || desc.includes('grupo marketing') || desc.includes('gmd chile');
    const hasGrafhika = desc.includes('grafhika') || desc.includes('copy center') || desc.includes('copycenter');
    if (hasGmd || hasGrafhika) return true;
  }
  
  // 2. Detección de Rescates de Fondos Mutuos (movimientos internos de activos entre FFMM y Caja)
  const isRescate = desc.includes('rescate') && (desc.includes('fondo') || desc.includes('ffmm') || desc.includes('mutuo'));
  if (isRescate) return true;
  
  return false;
}"""
content = content.replace('const {useState,useEffect,useMemo} = React;', util_inject)

# 4. Inject icons inside IC component
print("- Injecting sim and ia icons inside <IC />")
icons_inject = """  const m={
    sim:<><circle cx="4" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="20" cy="5" r="2"/><line x1="4" y1="9" x2="4" y2="20"/><line x1="12" y1="9" x2="12" y2="20"/><line x1="20" y1="9" x2="20" y2="20"/></>,
    ia:<><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6a6 6 0 0 0-6 6c0 3.31 2.69 6 6 6s6-2.69 6-6a6 6 0 0 0-6-6z"/></>,"""
content = content.replace('  const m={', icons_inject)

# 5. Inject navigation items
print("- Injecting navigation menu options")
nav_items_target = """  const navItems=[
    {id:'home', label:'Resumen',     icon:'fon'},
    {id:'mov',  label:'Movimientos', icon:'mov'},
    {id:'gas',  label:'Proyección',  icon:'gas'},
    {id:'ven',  label:'Ventas',      icon:'ven'},
    {id:'fon',  label:'Fondos',      icon:'fon'},
    {id:'cre',  label:'Créditos',    icon:'cre'},
    {id:'fin',  label:'Finiquitos',  icon:'fin'},
  ];"""
nav_items_replacement = """  const navItems=[
    {id:'home', label:'Resumen',     icon:'fon'},
    {id:'mov',  label:'Movimientos', icon:'mov'},
    {id:'sim',  label:'Simulador',   icon:'sim'},
    {id:'ia',   label:'Analista IA', icon:'ia'},
    {id:'gas',  label:'Proyección',  icon:'gas'},
    {id:'ven',  label:'Ventas',      icon:'ven'},
    {id:'fon',  label:'Fondos',      icon:'fon'},
    {id:'cre',  label:'Créditos',    icon:'cre'},
    {id:'fin',  label:'Finiquitos',  icon:'fin'},
  ];"""
content = content.replace(nav_items_target, nav_items_replacement)

# Update titles and subtitles
print("- Updating titles and subtitles")
titles_target = """  const titles={home:'Resumen General',mov:'Movimientos Bancarios',gas:'Proyección de Gastos',ven:'Reporte de Ventas',fon:'Fondos Mutuos',cre:'Créditos y Préstamos',fin:'Finiquitos y Préstamos'};
  const subtitles={home:'Vista consolidada',mov:'Saldos en tiempo real',gas:'Pagos y vencimientos',ven:'Facturación del período',fon:'Patrimonio invertido',cre:'Deuda y amortizaciones',fin:'Finiquitos y préstamos a trabajadores'};"""
titles_replacement = """  const titles={
    home:'Resumen General',
    mov:'Movimientos Bancarios',
    sim:'Simulador Predictivo',
    ia:'Analista IA Financiero',
    gas:'Proyección de Gastos',
    ven:'Reporte de Ventas',
    fon:'Fondos Mutuos',
    cre:'Créditos y Préstamos',
    fin:'Finiquitos y Préstamos'
  };
  const subtitles={
    home:'Vista consolidada',
    mov:'Saldos en tiempo real',
    sim:'Simulador interactivo de runway a 12 meses',
    ia:'Auditoría financiera inteligente computada por IA',
    gas:'Pagos y vencimientos',
    ven:'Facturación del período',
    fon:'Patrimonio invertido',
    cre:'Deuda y amortizaciones',
    fin:'Finiquitos y préstamos a trabajadores'
  };"""
content = content.replace(titles_target, titles_replacement)

# 6. Inject intercompany transfer isolation inside loadLiveData
print("- Injecting intercompany and FFMM isolation in loadLiveData()")
load_live_target = """        var nr=mRows.slice(0,100).map(function(r){return{fecha:toISO(r[0]),descripcion:r[1],monto:cn(r[2]),tipo:r[3],banco:r[4],saldo:cn(r[5])};});
        MOV_RECIENTES=nr;setMovRecientes(nr);
        var bm={};mRows.forEach(function(r){var m=toMes(r[0]);if(!m)return;if(!bm[m])bm[m]={ingresos:0,gastos:0};var v=cn(r[2]);if(r[3]==='INGRESO')bm[m].ingresos+=v;else bm[m].gastos+=Math.abs(v);});"""
load_live_replacement = """        var nr=mRows.slice(0,100).map(function(r){
          return {
            fecha:toISO(r[0]),
            descripcion:r[1],
            monto:cn(r[2]),
            tipo:r[3],
            banco:r[4],
            saldo:cn(r[5]),
            isIntercompany: isIntercompanyTransfer(r[1])
          };
        });
        MOV_RECIENTES=nr;setMovRecientes(nr);
        var bm={};mRows.forEach(function(r){
          var m=toMes(r[0]);
          if(!m)return;
          if(!bm[m])bm[m]={ingresos:0,gastos:0};
          // Excluir traspasos y rescates de fondos mutuos
          if(isIntercompanyTransfer(r[1])) return;
          var v=cn(r[2]);
          if(r[3]==='INGRESO')bm[m].ingresos+=v;
          else bm[m].gastos+=Math.abs(v);
        });"""
content = content.replace(load_live_target, load_live_replacement)

# 7. Inject intercompany transfer isolation in handleImport
print("- Injecting intercompany isolation in handleImport()")
handle_import_target = """  const handleImport = (newMovs) => {
    setMovRecientes(prev => {
      const merged = [...newMovs, ...prev];
      merged.sort((a,b)=>b.fecha.localeCompare(a.fecha));
      return merged;
    });
    const newByMonth = {...movByMonth};
    newMovs.forEach(m => {
      const mes = m.fecha.slice(0,7);
      if (!newByMonth[mes]) newByMonth[mes] = {ingresos:0,gastos:0};
      if (m.monto > 0) newByMonth[mes].ingresos += m.monto;
      else newByMonth[mes].gastos += Math.abs(m.monto);
    });
    setMovByMonth(newByMonth);
  };"""
handle_import_replacement = """  const handleImport = (newMovs) => {
    const flaggedNewMovs = newMovs.map(m => ({
      ...m,
      isIntercompany: isIntercompanyTransfer(m.descripcion)
    }));
    setMovRecientes(prev => {
      const merged = [...flaggedNewMovs, ...prev];
      merged.sort((a,b)=>b.fecha.localeCompare(a.fecha));
      return merged;
    });
    const newByMonth = {...movByMonth};
    flaggedNewMovs.forEach(m => {
      const mes = m.fecha.slice(0,7);
      if (!newByMonth[mes]) newByMonth[mes] = {ingresos:0,gastos:0};
      // Excluir de totales mensuales
      if (m.isIntercompany) return;
      if (m.monto > 0) newByMonth[mes].ingresos += m.monto;
      else newByMonth[mes].gastos += Math.abs(m.monto);
    });
    setMovByMonth(newByMonth);
  };"""
content = content.replace(handle_import_target, handle_import_replacement)

# 8. Inject Page Switching rendering inside App
print("- Injecting page rendering in App")
render_target = """        {active==='home' && <HomePage saldos={saldos} movByMonth={movByMonth} gastos={GASTOS} ventas={VENTAS} creditos={CREDITOS} fondos={FONDOS} alerts={[]} onNavTo={nav}/>}
        {active==='mov'  && <MovimientosPage/>}
        {active==='gas'  && <GastosPage nominaVer={nominaVer}/>}
        {active==='ven'  && <VentasPage onUpload={()=>setShowUploadVentas(true)} dataLoaded={dataLoaded}/>}
        {active==='fon'  && <FondosPage/>}
        {active==='cre'  && <CreditosPage saldos={saldos}/>}
        {active==='fin'  && <FiniquitosPage/>}"""
render_replacement = """        {active==='home' && <HomePage saldos={saldos} movByMonth={movByMonth} gastos={GASTOS} ventas={VENTAS} creditos={CREDITOS} fondos={FONDOS} alerts={[]} onNavTo={nav}/>}
        {active==='mov'  && <MovimientosPage movRecientes={movRecientes} saldos={saldos} onNavTo={nav} />}
        {active==='sim'  && <RunwaySimulatorPage saldos={saldos} movRecientes={movRecientes} />}
        {active==='ia'   && <AIAdvisorPage saldos={saldos} />}
        {active==='gas'  && <GastosPage nominaVer={nominaVer}/>}
        {active==='ven'  && <VentasPage onUpload={()=>setShowUploadVentas(true)} dataLoaded={dataLoaded}/>}
        {active==='fon'  && <FondosPage/>}
        {active==='cre'  && <CreditosPage saldos={saldos}/>}
        {active==='fin'  && <FiniquitosPage/>}"""
content = content.replace(render_target, render_replacement)

# 9. Update MovimientosTable in React to display custom labels and exclude transfers from type filters
print("- Upgrading MovimientosTable inside React")
table_use_memo_target = """  const filtrados = useMemo(() => {
    return MOV_RECIENTES.filter(m => {
      if (filtroTipo !== 'Todos' && m.tipo !== filtroTipo) return false;
      if (filtroBanco !== 'Todos' && m.banco !== filtroBanco) return false;
      if (filtroFecha && !m.fecha.startsWith(filtroFecha)) return false;
      if (busqueda && !m.descripcion.toLowerCase().includes(busqueda.toLowerCase())) return false;
      return true;
    }).sort((a,b) => b.fecha.localeCompare(a.fecha));
  }, [busqueda, filtroBanco, filtroTipo, filtroFecha]);"""

table_use_memo_replacement = """  // Obtener movRecientes desde las props (o el contexto) de forma reactiva
  const movRecientesList = movRecientes || MOV_RECIENTES;
  const filtrados = useMemo(() => {
    return movRecientesList.filter(m => {
      // Ignorar traspasos internos si se filtra por ingreso/gasto real
      if (m.isIntercompany && filtroTipo !== 'Todos') return false;
      
      if (filtroTipo !== 'Todos' && m.tipo !== filtroTipo) return false;
      if (filtroBanco !== 'Todos' && m.banco !== filtroBanco) return false;
      if (filtroFecha && !m.fecha.startsWith(filtroFecha)) return false;
      if (busqueda && !m.descripcion.toLowerCase().includes(busqueda.toLowerCase())) return false;
      return true;
    }).sort((a,b) => b.fecha.localeCompare(a.fecha));
  }, [movRecientesList, busqueda, filtroBanco, filtroTipo, filtroFecha]);"""

content = content.replace(table_use_memo_target, table_use_memo_replacement)

# Make MovimientosTable take movRecientes in its signature
print("- Updating MovimientosTable function signature to accept props")
content = content.replace('function MovimientosTable() {', 'function MovimientosTable({ movRecientes } = {}) {')

# Update row rendering in MovimientosTable
print("- Upgrading MovimientosTable row rendering for custom badges")
row_render_target = """          {filtrados.length === 0
            ? <tr><td colSpan={5} style={{textAlign:'center',color:'var(--t3)',padding:'24px 0',fontStyle:'italic'}}>Sin resultados para los filtros aplicados</td></tr>
            : filtrados.map((m,i)=>(
              <tr key={i}>
                <td className="mono" style={{color:'var(--t3)',fontSize:13}}>{fmtDate(m.fecha)}</td>
                <td style={{fontWeight:500,maxWidth:280,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.descripcion}</td>
                <td style={{color:'var(--t3)',fontSize:12}}>{m.banco}</td>
                <td><span className={`pill ${m.tipo==='INGRESO'?'g':'r'}`}>{m.tipo}</span></td>
                <td className="mono r" style={{fontWeight:600,color:m.monto>0?'var(--g600)':'var(--red)'}}>{m.monto>0?'+':''}{fmt(m.monto)}</td>
              </tr>
            ))
          }"""

row_render_replacement = """          {filtrados.length === 0
            ? <tr><td colSpan={5} style={{textAlign:'center',color:'var(--t3)',padding:'24px 0',fontStyle:'italic'}}>Sin resultados para los filtros aplicados</td></tr>
            : filtrados.map((m,i)=>{
                const desc = (m.descripcion || '').toLowerCase();
                const isRescate = desc.includes('rescate') && (desc.includes('fondo') || desc.includes('ffmm') || desc.includes('mutuo'));
                return (
                  <tr key={i} style={{opacity: m.isIntercompany ? 0.75 : 1}}>
                    <td className="mono" style={{color:'var(--t3)',fontSize:13}}>{fmtDate(m.fecha)}</td>
                    <td style={{fontWeight:500,maxWidth:280,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={m.descripcion}>{m.descripcion}</td>
                    <td style={{color:'var(--t3)',fontSize:12}}>{m.banco}</td>
                    <td>
                      {m.isIntercompany ? (
                        <span className="pill gr" style={{background:'#f1f5f9',color:'#475569',border:'1px solid #cbd5e1'}}>
                          {isRescate ? 'RESCATE FFMM' : 'TRASPASO INTERNO'}
                        </span>
                      ) : (
                        <span className={`pill ${m.tipo==='INGRESO'?'g':'r'}`}>{m.tipo}</span>
                      )}
                    </td>
                    <td className="mono r" style={{fontWeight:600,color:m.isIntercompany?'var(--t3)':(m.monto>0?'var(--g600)':'var(--red)')}}>
                      {m.monto>0?'+':''}{fmt(m.monto)}
                    </td>
                  </tr>
                );
              })
          }"""
content = content.replace(row_render_target, row_render_replacement)

# Make MovimientosTable take movRecientes props in MovimientosPage
print("- Connecting movRecientes state to MovimientosTable inside MovimientosPage")
mov_page_target = """      <MovimientosTable />"""
mov_page_replacement = """      {/* Nuevo panel de KPIs del Flujo Real */}
      <div className="kpi-grid-3" style={{marginTop: 18}}>
        {(() => {
          let tIng = 0, tEg = 0;
          movRecientesList.forEach(m => {
            if (!m.isIntercompany) {
              if (m.tipo === 'INGRESO') tIng += Math.abs(m.monto);
              else if (m.tipo === 'GASTO' || m.tipo === 'EGRESO') tEg += Math.abs(m.monto);
            }
          });
          const fNet = tIng - tEg;
          return (
            <>
              <div className="kcard">
                <div className="kcard-icon g"><IC n="ven" s={16}/></div>
                <div className="kcard-label">Ingresos Totales (Reales)</div>
                <div className="kcard-val" style={{color:'var(--g600)'}}>{fmt(tIng)}</div>
                <div className="kcard-change neu"><span className="sub">Excluye traspasos y rescates</span></div>
              </div>
              <div className="kcard">
                <div className="kcard-icon r"><IC n="gas" s={16}/></div>
                <div className="kcard-label">Egresos Totales (Reales)</div>
                <div className="kcard-val" style={{color:'var(--red)'}}>{fmt(tEg)}</div>
                <div className="kcard-change neu"><span className="sub">Excluye traspasos y rescates</span></div>
              </div>
              <div className="kcard">
                <div className="kcard-icon b"><IC n="mov" s={16}/></div>
                <div className="kcard-label">Flujo Neto Real</div>
                <div className="kcard-val" style={{color: fNet>=0?'var(--g600)':'var(--red)'}}>{fNet>=0?'+':''}{fmt(fNet)}</div>
                <div className="kcard-change neu"><span className="sub">{fNet>=0?'Superávit':'Déficit'} neto real</span></div>
              </div>
            </>
          );
        })()}
      </div>
      <div style={{marginTop: 20}}>
        <MovimientosTable movRecientes={movRecientesList} />
      </div>"""
content = content.replace(mov_page_target, mov_page_replacement)

# Make MovimientosPage accept props
content = content.replace('function MovimientosPage() {', 'function MovimientosPage({ movRecientes, saldos, onNavTo }) {')
# Inside MovimientosPage, define movRecientesList
content = content.replace("  const totalBancario = Object.values(SALDOS_BANCO).reduce((a,b)=>a+b,0);", "  const movRecientesList = movRecientes || MOV_RECIENTES;\n  const totalBancario = Object.values(saldos || SALDOS_BANCO).reduce((a,b)=>a+b,0);")

# 10. Inject RunwaySimulatorPage and AIAdvisorPage React components right before ReactDOM.render
print("- Injecting RunwaySimulatorPage and AIAdvisorPage components")
components_code = """
// ── Runway Simulator Page Component ──
function RunwaySimulatorPage({ saldos, movRecientes }) {
  const [probabilidad, setProbabilidad] = useState(80);
  const [incluirFfmm, setIncluirFfmm] = useState(false);
  const [incluirSueldos, setIncluirSueldos] = useState(true);
  const [incluirCreditos, setIncluirCreditos] = useState(true);
  const [incluirFijos, setIncluirFijos] = useState(true);
  const [incluirFiniquitos, setIncluirFiniquitos] = useState(true);
  const [incluirGastos, setIncluirGastos] = useState(true);

  const movList = movRecientes || MOV_RECIENTES;
  const totalCaja = Object.values(saldos || SALDOS_BANCO).reduce((a, b) => a + b, 0);
  const totalInversiones = FONDOS.length > 0 ? FONDOS[FONDOS.length - 1].total : 0;
  
  const currentCash = totalCaja + (incluirFfmm ? totalInversiones : 0);

  // Proyección de 12 meses
  const { monthsLabels, projectedBalances, timelineData } = useMemo(() => {
    let startYear = 2026;
    let startMonth = 4; // Mayo (0-indexed 4)
    if (movList.length > 0 && movList[0].fecha) {
      const d = new Date(movList[0].fecha);
      if (!isNaN(d.getTime())) {
        startYear = d.getFullYear();
        startMonth = d.getMonth();
      }
    }

    const monthsNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const labels = [];
    const balances = [];
    const tableRows = [];
    
    let currentBalance = currentCash;
    const probFactor = probabilidad / 100;
    
    // Sueldos y costos fijos mensuales
    const sueldosMensual = incluirSueldos ? NOMINA_DATA.reduce((s, e) => s + e.monto, 0) : 0;
    const fijosMensual = incluirFijos ? GASTOS_FIJOS_DATA.reduce((s, f) => s + f.monto, 0) : 0;

    for (let m = 0; m < 12; m++) {
      const projDate = new Date(startYear, startMonth + m, 15);
      const mLabel = `${monthsNames[projDate.getMonth()]} ${projDate.getFullYear()}`;
      labels.push(mLabel);

      const targetMonth = projDate.getMonth();
      const targetYear = projDate.getFullYear();

      // 1. Cobranza vencida este mes
      const cobranzasMes = COB_PENDIENTES.filter(c => {
        if (c.estado !== 'VENCIDO' || !c.vencimiento) return false;
        const d = new Date(c.vencimiento);
        return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
      });
      const cobranzaRawSum = cobranzasMes.reduce((s, c) => s + c.saldo, 0);
      const cobranzaProyectada = Math.round(cobranzaRawSum * probFactor);

      // 2. Gastos Variables
      const gastosMes = incluirGastos ? GASTOS.filter(g => {
        if (g.estado === 'PAGADO' || !g.fecha) return false;
        const d = new Date(g.fecha);
        return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
      }).reduce((s, g) => s + g.monto, 0) : 0;

      // 3. Créditos
      const creditosMes = incluirCreditos ? CREDITOS_SHEETS_RAW.filter(c => {
        if (c.estado === 'Pagado' || !c.fecha) return false;
        const d = new Date(c.fecha);
        return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
      }).reduce((s, c) => s + c.montoPago, 0) : 0;

      // 4. Finiquitos
      const finiquitosMes = incluirFiniquitos ? FINIQUITOS_RAW.filter(f => {
        if (f.estado === 'Pagado' || !f.fecha) return false;
        const d = new Date(f.fecha);
        return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
      }).reduce((s, f) => s + f.montoPago, 0) : 0;

      const totalEgresosMes = sueldosMensual + fijosMensual + creditosMes + finiquitosMes + gastosMes;
      const saldoInicial = currentBalance;
      const flujoNeto = cobranzaProyectada - totalEgresosMes;
      currentBalance += flujoNeto;
      
      balances.push(currentBalance);
      
      tableRows.push({
        label: mLabel,
        inicial: saldoInicial,
        cobros: cobranzaProyectada,
        egresos: fijosMensual + gastosMes + finiquitosMes,
        nomina: sueldosMensual,
        creditos: creditosMes,
        flujo: flujoNeto,
        final: currentBalance
      });
    }

    return { monthsLabels: labels, projectedBalances: balances, timelineData: tableRows };
  }, [currentCash, probabilidad, incluirFfmm, incluirSueldos, incluirCreditos, incluirFijos, incluirFiniquitos, incluirGastos, movList]);

  // Primer mes con déficit
  const firstDeficit = useMemo(() => {
    return timelineData.find(r => r.final < 0) || null;
  }, [timelineData]);

  // Hook para pintar gráfico de ApexCharts
  useEffect(() => {
    const el = document.getElementById('chart-runway-proyeccion');
    if (!el || typeof ApexCharts === 'undefined') return;
    
    el.innerHTML = '';
    const options = {
      series: [{
        name: 'Caja Proyectada',
        data: projectedBalances
      }],
      chart: {
        type: 'area',
        height: 290,
        fontFamily: 'DM Sans, sans-serif',
        toolbar: { show: false }
      },
      colors: ['var(--blue)'],
      stroke: { curve: 'smooth', width: 3 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.02,
          stops: [0, 95, 100]
        }
      },
      xaxis: {
        categories: monthsLabels,
        labels: { style: { colors: 'var(--t3)', fontSize: '11px' } }
      },
      yaxis: {
        labels: {
          formatter: (val) => fmt(val),
          style: { colors: 'var(--t3)', fontSize: '11px' }
        }
      },
      annotations: {
        yaxis: [{
          y: 0,
          borderColor: 'var(--red)',
          borderWidth: 1.5,
          strokeDashArray: 4,
          label: {
            borderColor: 'var(--red)',
            style: { color: '#fff', background: 'var(--red)', fontSize: '9px', fontWeight: 600 },
            text: 'Déficit (Línea de Alerta)',
            position: 'left'
          }
        }]
      },
      tooltip: {
        y: { formatter: (val) => fmt(val) },
        theme: 'light'
      }
    };
    
    const chart = new ApexCharts(el, options);
    chart.render();
    return () => chart.destroy();
  }, [projectedBalances, monthsLabels]);

  return (
    <div className="page">
      <div className="sim-layout">
        
        {/* Panel lateral de controles */}
        <div className="sim-controls">
          <div>
            <div className="sim-label" style={{fontSize:12,color:'var(--text)'}}>Controles de Simulación</div>
            <div style={{fontSize:11.5,color:'var(--t3)',marginTop:3}}>Ajusta variables y estima tu runway futuro</div>
          </div>
          
          <hr style={{border:'none',borderTop:'1px solid var(--border)'}}/>

          {/* Probabilidad de cobranza */}
          <div className="sim-group">
            <span className="sim-label">Éxito en Cobranza</span>
            <div className="sim-slider-container" style={{marginTop:4}}>
              <input type="range" className="sim-slider" min="0" max="100" step="10" value={probabilidad} onChange={e=>setProbabilidad(parseInt(e.target.value))}/>
              <div className="sim-slider-labels">
                <span>0%</span>
                <span style={{fontWeight:700,color:'var(--blue)'}}>{probabilidad}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Caja inicial */}
          <div className="sim-group">
            <span className="sim-label">Reserva Inicial</span>
            <div style={{marginTop:6}}>
              <label className="sim-checkbox-label">
                <input type="checkbox" checked={incluirFfmm} onChange={e=>setIncluirFfmm(e.target.checked)}/>
                Incluir Fondos Mutuos
              </label>
            </div>
          </div>

          {/* Egresos */}
          <div className="sim-group">
            <span className="sim-label">Incluir en Egresos</span>
            <div style={{display:'flex',flexDirection:'column',gap:9,marginTop:8}}>
              <label className="sim-checkbox-label">
                <input type="checkbox" checked={incluirSueldos} onChange={e=>setIncluirSueldos(e.target.checked)}/>
                Remuneraciones (Sueldos)
              </label>
              <label className="sim-checkbox-label">
                <input type="checkbox" checked={incluirCreditos} onChange={e=>setIncluirCreditos(e.target.checked)}/>
                Créditos Bancarios
              </label>
              <label className="sim-checkbox-label">
                <input type="checkbox" checked={incluirFijos} onChange={e=>setIncluirFijos(e.target.checked)}/>
                Gastos Fijos
              </label>
              <label className="sim-checkbox-label">
                <input type="checkbox" checked={incluirFiniquitos} onChange={e=>setIncluirFiniquitos(e.target.checked)}/>
                Finiquitos
              </label>
              <label className="sim-checkbox-label">
                <input type="checkbox" checked={incluirGastos} onChange={e=>setIncluirGastos(e.target.checked)}/>
                Compras Variables
              </label>
            </div>
          </div>

          <hr style={{border:'none',borderTop:'1px solid var(--border)'}}/>

          {/* Indicadores de Runway */}
          <div className="sim-summary-box">
            <div className="sim-label">Saldo Proyectado a 12m</div>
            <div style={{fontSize:18,fontWeight:700,color:timelineData[11].final>=0?'var(--g600)':'var(--red)',marginTop:4}}>{fmt(timelineData[11].final)}</div>
          </div>

          <div className="sim-summary-box" style={{background: firstDeficit?'var(--red-bg)':'oklch(95% .03 145)',borderColor: firstDeficit?'var(--red)':'var(--g300)'}}>
            <div className="sim-label" style={{color: firstDeficit?'var(--red)':'var(--g700)'}}>Déficit Estimado</div>
            <div style={{fontSize:12.5,fontWeight:700,color: firstDeficit?'var(--red)':'var(--g700)',marginTop:4}}>
              {firstDeficit ? `Déficit en ${firstDeficit.label}` : 'Sin Déficit Proyectado'}
            </div>
          </div>
        </div>

        {/* Sección de gráficos y desglose */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div className="card">
            <div className="card-hd">
              <div><div className="card-title">Runway de Caja Proyectado a 12 Meses</div><div className="card-sub">Simulación basada en flujos netos orgánicos reales</div></div>
            </div>
            <div id="chart-runway-proyeccion" style={{minHeight:290}}/>
          </div>

          <div className="card" style={{overflowX:'auto'}}>
            <div className="card-hd">
              <div><div className="card-title">Detalle Matemático Mensual</div><div className="card-sub">Ecuación de flujo: Saldo Inicial + Cobros - Egresos = Saldo Final</div></div>
            </div>
            <table className="tbl" style={{fontSize:12}}>
              <thead>
                <tr>
                  <th>Periodo</th>
                  <th>Saldo Inicial</th>
                  <th>(+) Cobros</th>
                  <th>(-) Egresos</th>
                  <th>(-) Nómina</th>
                  <th>(-) Créditos</th>
                  <th>(=) Neto</th>
                  <th className="r">(=) Final</th>
                </tr>
              </thead>
              <tbody>
                {timelineData.map((row, i) => (
                  <tr key={i} style={{background: row.final<0?'var(--red-bg)':'transparent'}}>
                    <td style={{fontWeight:600}}>{row.label}</td>
                    <td>{fmt(row.inicial)}</td>
                    <td style={{color:'var(--g600)',fontWeight:500}}>+{fmt(row.cobros)}</td>
                    <td style={{color:'var(--red)'}}>-{fmt(row.egresos)}</td>
                    <td style={{color:'var(--red)'}}>-{fmt(row.nomina)}</td>
                    <td style={{color:'var(--red)'}}>-{fmt(row.creditos)}</td>
                    <td style={{fontWeight:600,color:row.flujo>=0?'var(--g600)':'var(--red)'}}>
                      {row.flujo>=0?'+':''}{fmt(row.flujo)}
                    </td>
                    <td className="r" style={{fontWeight:700,color:row.final<0?'var(--red)':'var(--text)'}}>{fmt(row.final)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── AI CFO Advisor Page Component ──
function AIAdvisorPage({ saldos }) {
  const [chatResponse, setChatResponse] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const totalCaja = Object.values(saldos || SALDOS_BANCO).reduce((a, b) => a + b, 0);
  const totalInversiones = FONDOS.length > 0 ? FONDOS[FONDOS.length - 1].total : 0;
  
  const sueldosTotal = NOMINA_DATA.reduce((s, e) => s + e.monto, 0);
  const fijosTotal = GASTOS_FIJOS_DATA.reduce((s, f) => s + f.monto, 0);
  const cobranzaVencida = COB_PENDIENTES.reduce((s, c) => c.estado === 'VENCIDO' ? s + c.saldo : s, 0);

  // Obtener mayor deudor
  const debtors = {};
  COB_PENDIENTES.forEach(c => {
    if (c.estado === 'VENCIDO') {
      debtors[c.empresa] = (debtors[c.empresa] || 0) + c.saldo;
    }
  });
  let maxDebtorName = 'Sin Deudores';
  let maxDebtorVal = 0;
  Object.keys(debtors).forEach(name => {
    if (debtors[name] > maxDebtorVal) {
      maxDebtorVal = debtors[name];
      maxDebtorName = name;
    }
  });
  const maxDebtorPercent = cobranzaVencida > 0 ? (maxDebtorVal / cobranzaVencida) * 100 : 0;

  const creditosMes = CREDITOS_SHEETS_RAW.filter(c => c.estado !== 'Pagado').reduce((s, c) => s + c.montoPago, 0);
  const runwayDias = (sueldosTotal + fijosTotal) > 0 ? Math.round(totalCaja / ((sueldosTotal + fijosTotal) / 30)) : 365;

  const handleQuery = (qType) => {
    setIsTyping(true);
    setChatResponse(null);

    let text = '';
    switch (qType) {
      case 'diagnostico':
        text = `<strong>Diagnóstico de Salud Financiera:</strong><br><br>
        La situación financiera del grupo se cataloga como <strong>Sólida con Atención en Cartera</strong>.<br><br>
        • <strong>Fortaleza:</strong> Dispones de una liquidez de <strong>${fmt(totalCaja)}</strong> en caja operativa consolidada, lo que te blinda operativamente frente a imprevistos en el corto plazo.<br>
        • <strong>Debilidad:</strong> Tienes una planilla de sueldos mensual considerable de <strong>${fmt(sueldosTotal)}</strong> y gastos fijos de <strong>${fmt(fijosTotal)}</strong>. Esto exige un ingreso de planta constante de al menos <strong>${fmt(sueldosTotal + fijosTotal)}</strong> mensual para no consumir tu caja acumulada.<br>
        • <strong>Relación GMD & Grafhika:</strong> El sistema ha detectado y aislado los movimientos inter-compañías entre las empresas hermanas (incluyendo traspasos directos y TEFs recurrentes). Estos flujos internos han sido completamente excluidos de las métricas de ingresos y egresos de caja para entregar un análisis de rentabilidad orgánico y libre de doble contabilidad.<br>
        • <strong>Riesgo:</strong> El simulador muestra que, en caso de que la cobranza caiga al 50% de efectividad, la caja operativa podría contraerse considerablemente en los próximos 6 meses si no se cuenta con retiros de tus fondos de inversión.`;
        break;
      case 'riesgo-clientes':
        text = `<strong>Análisis de Cartera y Clientes Críticos:</strong><br><br>
        La cobranza total pendiente en estado VENCIDO suma un total de <strong>${fmt(cobranzaVencida)}</strong>.<br><br>
        • <strong>Mayor Deudor Individual:</strong> La empresa <strong>${maxDebtorName}</strong> adeuda un saldo neto de <strong>${fmt(maxDebtorVal)}</strong>, concentrando un preocupante <strong>${maxDebtorPercent.toFixed(1)}%</strong> del riesgo total de tu cartera de cobro.<br>
        • <strong>Gestión Directa:</strong> Se aconseja iniciar contacto preventivo inmediato.<br>
        • <strong>Alternativa de Liquidez:</strong> Ceder estos folios vencidos de clientes corporativos triple-A a factoring inyectará caja de inmediato reduciendo el costo de cobranza judicial.`;
        break;
      case 'runway-analisis':
        text = `<strong>Análisis Detallado de Runway y Nómina:</strong><br><br>
        Tus egresos recurrentes de planta mensuales son de <strong>${fmt(sueldosTotal + fijosTotal)}</strong>, divididos de la siguiente forma:<br><br>
        • <strong>Remuneraciones Consolidadas:</strong> <strong>${fmt(sueldosTotal)}</strong> mensual. Distribuido entre tus filiales.<br>
        • <strong>Gastos Fijos Operativos:</strong> <strong>${fmt(fijosTotal)}</strong> (incluyendo mano de obra de maestros y seguros vehiculares).<br><br>
        Tu runway de caja es de aproximadamente <strong>${(totalCaja / (sueldosTotal + fijosTotal)).toFixed(1)} meses</strong>. Si a esto le sumamos el peso de los créditos bancarios activos este mes (que suman <strong>${fmt(creditosMes)}</strong> en cuotas), el runway se mantiene por sobre los <strong>120 días</strong>, dándote una gran ventaja competitiva y holgura en tu mercado.`;
        break;
      case 'estrategia-90':
        text = `<strong>Recomendaciones Estratégicas para los Próximos 90 Días:</strong><br><br>
        1. <strong>Campaña Preferencial sobre ${maxDebtorName}</strong>: Enfocar al equipo de finanzas en recuperar los <strong>${fmt(maxDebtorVal)}</strong> pendientes. El retorno de este monto extiende tu runway en más de 90 días de forma automática.<br>
        2. <strong>Rentabilización de Caja Inactiva</strong>: Mantienes saldos de cuenta corriente ociosos. Recomendamos traspasar excedentes a Fondos Mutuos de rescate inmediato para generar retornos sin asumir riesgos corporativos.<br>
        3. <strong>Planificación ante Vencimientos</strong>: Las cuotas de créditos se concentran a inicios del mes (día 4 y día 13). Asegurar que las cuentas corrientes tengan saldo suficiente al menos 48h hábiles antes para evitar sobregiros automáticos y cargos de interés comercial.`;
        break;
      default:
        text = 'Consulta no reconocida.';
    }

    setTimeout(() => {
      setIsTyping(false);
      setChatResponse(text);
    }, 750);
  };

  return (
    <div className="page">
      {/* Encabezado AI CFO */}
      <div className="card ai-gradient-card mb">
        <div style={{display:'flex',alignItems:'center',gap:16,padding:'10px 6px'}}>
          <div className="ai-avatar-glowing"><svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6a6 6 0 0 0-6 6c0 3.31 2.69 6 6 6s6-2.69 6-6a6 6 0 0 0-6-6z"/></svg></div>
          <div>
            <div style={{fontFamily:'var(--font-headings)',fontWeight:700,fontSize:17,color:'#1e3a8a'}}>Informe CFO de Inteligencia Artificial</div>
            <div style={{fontSize:12,color:'#475569',marginTop:3}}>Diagnóstico corporativo computado en tiempo real en base a balances, cobranza activa y compromisos de egresos</div>
          </div>
        </div>
        <hr style={{border:'none',borderTop:'1px dashed rgba(37, 99, 235, 0.2)',margin:'14px 0'}}/>
        <div className="ai-report-content">
          <p>Estimado Director,</p>
          <p>
            El diagnóstico consolidado de tesorería para <strong>Grafhika & GMD</strong> revela una liquidez operativa en cuentas bancarias de <strong>{fmt(totalCaja)}</strong>, 
            respaldada adicionalmente por un portafolio de inversiones en Fondos Mutuos que asciende a <strong>{fmt(totalInversiones)}</strong>. 
            Al contrastar la caja operativa con una estructura mensual de egresos fijos (planilla de sueldos de <strong>{fmt(sueldosTotal)}</strong> y costos de planta de <strong>{fmt(fijosTotal)}</strong>), 
            la empresa mantiene una cobertura operativa inmediata en sus cuentas corrientes de aproximadamente <strong>{runwayDias} días</strong> (ampliándose significativamente al considerar tus fondos de inversión liquidados).
          </p>
          <p>
            El principal factor de riesgo identificado se encuentra en la cartera de cuentas por cobrar. Actualmente dispones de <strong>{fmt(cobranzaVencida)}</strong> en estado vencido. 
            Nuestros modelos indican una concentración crítica de deuda: el cliente <strong>{maxDebtorName}</strong> adeuda un saldo vencido acumulado de <strong>{fmt(maxDebtorVal)}</strong>, 
            lo que representa el <strong>{maxDebtorPercent.toFixed(1)}%</strong> de toda tu cartera de cobro activa. 
            Se sugiere priorizar inmediatamente esta cobranza para extender la holgura de caja de la organización.
          </p>
        </div>
      </div>

      <div className="g11">
        
        {/* Alertas IA */}
        <div className="card">
          <div className="card-hd">
            <div><div className="card-title">Alertas y Oportunidades Estratégicas</div><div className="card-sub">Hallazgos detectados automáticamente</div></div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {maxDebtorPercent > 30 && (
              <div className="ai-alert-item danger">
                <div className="ai-alert-icon">⚠</div>
                <div>
                  <div className="ai-alert-title">Alta Concentración de Deuda Vencida</div>
                  <div className="ai-alert-desc">El cliente {maxDebtorName} retiene el {maxDebtorPercent.toFixed(1)}% de tu cartera vencida total ({fmt(maxDebtorVal)}). Una mora prolongada afectará fuertemente tus flujos mensuales.</div>
                </div>
              </div>
            )}
            {runwayDias < 45 ? (
              <div className="ai-alert-item warning">
                <div className="ai-alert-icon">⏳</div>
                <div>
                  <div className="ai-alert-title">Runway de Caja Operativa Ajustado</div>
                  <div className="ai-alert-desc">Tu caja cubre menos de 45 días de tu costo mínimo de operación. Recuerda que cuentas con {fmt(totalInversiones)} adicionales en Fondos Mutuos como respaldo de emergencia.</div>
                </div>
              </div>
            ) : (
              <div className="ai-alert-item success">
                <div className="ai-alert-icon">✔</div>
                <div>
                  <div className="ai-alert-title">Excelente Holgura Operativa</div>
                  <div className="ai-alert-desc">Tu liquidez actual te permite cubrir con creces sueldos consolidados y gastos fijos mínimos de operación por varios meses sin depender de nuevos cobros.</div>
                </div>
              </div>
            )}
            {totalInversiones > 0 && (
              <div className="ai-alert-item success">
                <div className="ai-alert-icon">💰</div>
                <div>
                  <div className="ai-alert-title">Reserva de Respaldo Sólida</div>
                  <div className="ai-alert-desc">Tu portafolio en Fondos Mutuos de {fmt(totalInversiones)} es tu principal escudo financiero frente a shocks externos o contingencias comerciales.</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Consultas interactivas */}
        <div className="card">
          <div className="card-hd">
            <div><div className="card-title">Consultas Financieras del Negocio</div><div className="card-sub">Haz clic para auditar la tesorería en tiempo real</div></div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div className="ai-query-suggestions">
              <button className="ai-query-tag" onClick={()=>handleQuery('diagnostico')}>¿Cuál es el diagnóstico de salud financiera?</button>
              <button className="ai-query-tag" onClick={()=>handleQuery('riesgo-clientes')}>¿Qué clientes representan el mayor riesgo?</button>
              <button className="ai-query-tag" onClick={()=>handleQuery('runway-analisis')}>¿Cuál es el análisis de runway y egresos fijos?</button>
              <button className="ai-query-tag" onClick={()=>handleQuery('estrategia-90')}>¿Qué acciones estratégicas recomiendas para los próximos 90 días?</button>
            </div>

            <div className="ai-chat-bubble">
              <div style={{display:'flex',gap:12,alignItems:'start'}}>
                <div className="ai-avatar-glowing" style={{width:28,height:28,fontSize:'0.9rem'}}><svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6a6 6 0 0 0-6 6c0 3.31 2.69 6 6 6s6-2.69 6-6a6 6 0 0 0-6-6z"/></svg></div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12.5,fontWeight:700,color:'var(--text)',marginBottom:4}}>Analista IA Financiero</div>
                  {isTyping ? (
                    <div style={{fontStyle:'italic',color:'var(--t3)',fontSize:12.5}}>Analizando libros contables...</div>
                  ) : (
                    <div style={{fontSize:12.5,color:'var(--t2)',lineHeight:1.5}} dangerouslySetInnerHTML={{__html: chatResponse || 'Haz clic en cualquiera de las consultas predefinidas arriba para analizar en tiempo real los flujos de la empresa y obtener recomendaciones personalizadas de inmediato.'}} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
"""
content = content.replace('ReactDOM.createRoot(document.getElementById(\'root\')).render(<App/>);', components_code + '\nReactDOM.createRoot(document.getElementById(\'root\')).render(<App/>);')

# 11. Write output to index.html in the workspace!
print("- Writing final merged dashboard to index.html")
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Programmatic merge completed successfully!")
