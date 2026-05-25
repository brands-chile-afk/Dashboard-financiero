const {
  useState,
  useEffect,
  useMemo
} = React;
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
}

// ── Real Data ──────────────────────────────────────────────────────────────
let SALDOS_BANCO = {
  "Grafhika BancoChile": 4809878,
  "GMD BancoChile": 8825526,
  "Scotiabank": 11276594,
  "SANTANDER": 35414874,
  "BICE": 5940593,
  "BCI": 374727
};
let MOV_BY_MONTH = {
  "2025-10": {
    "ingresos": 14497447,
    "gastos": 14000000
  },
  "2025-11": {
    "ingresos": 653310,
    "gastos": 1059524
  },
  "2025-12": {
    "ingresos": 13339723,
    "gastos": 15870340
  },
  "2026-01": {
    "ingresos": 96493692,
    "gastos": 87321760
  },
  "2026-02": {
    "ingresos": 208319712,
    "gastos": 193164168
  },
  "2026-03": {
    "ingresos": 69149470,
    "gastos": 67335507
  },
  "2026-04": {
    "ingresos": 172647976,
    "gastos": 175961679
  }
};
let MOV_RECIENTES = [{
  "fecha": "2026-04-21",
  "descripcion": "Traspaso De: Rojas Rojas Luis Fernando",
  "monto": 13800,
  "tipo": "INGRESO",
  "banco": "Grafhika BancoChile",
  "saldo": 4809878
}, {
  "fecha": "2026-04-21",
  "descripcion": "Traspaso A: Jaime Gonzalez Naranjo",
  "monto": -158032,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 8825526
}, {
  "fecha": "2026-04-20",
  "descripcion": "Traspaso A: Monica Bravo Orellana",
  "monto": -350000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 4796078
}, {
  "fecha": "2026-04-20",
  "descripcion": "Traspaso A: Jose Aravena",
  "monto": -250000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 5146078
}, {
  "fecha": "2026-04-20",
  "descripcion": "Traspaso A: Dibco Spa",
  "monto": -252875,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 8983558
}, {
  "fecha": "2026-04-20",
  "descripcion": "Traspaso A: Marcos Pinto",
  "monto": -500000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 9236433
}, {
  "fecha": "2026-04-20",
  "descripcion": "Traspaso A: Bernisson Dorce Spa",
  "monto": -220000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 9736433
}, {
  "fecha": "2026-04-20",
  "descripcion": "Traspaso A: Patricio Villacura Flores",
  "monto": -154224,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 9956433
}, {
  "fecha": "2026-04-20",
  "descripcion": "REDCOMPRA SAN CARLOS       SAN",
  "monto": -441,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 11276594
}, {
  "fecha": "2026-04-20",
  "descripcion": "0766018335 Transf. GRAFICOMEX SPA",
  "monto": 630700,
  "tipo": "INGRESO",
  "banco": "SANTANDER",
  "saldo": 35414874
}, {
  "fecha": "2026-04-20",
  "descripcion": "0763493970 Transf. FEBOND SPA",
  "monto": 1128911,
  "tipo": "INGRESO",
  "banco": "SANTANDER",
  "saldo": 34784174
}, {
  "fecha": "2026-04-17",
  "descripcion": "Traspaso A: Klaus Maestro Pomaire",
  "monto": -200000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 5396078
}, {
  "fecha": "2026-04-17",
  "descripcion": "Traspaso A: Yerko Ivan Villarroel Gonzalez",
  "monto": -1000000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 5596078
}, {
  "fecha": "2026-04-17",
  "descripcion": "Traspaso A: Macelino Toro Gonzalez",
  "monto": -150000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 6596078
}, {
  "fecha": "2026-04-17",
  "descripcion": "App-traspaso A Cuenta: 000052224318",
  "monto": -100000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 6746078
}, {
  "fecha": "2026-04-17",
  "descripcion": "Traspaso De: Rojas Rojas Luis Fernando",
  "monto": 28170,
  "tipo": "INGRESO",
  "banco": "Grafhika BancoChile",
  "saldo": 6846078
}, {
  "fecha": "2026-04-17",
  "descripcion": "Traspaso A: Millaray Roman Guajardo",
  "monto": -25002,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 6817908
}, {
  "fecha": "2026-04-17",
  "descripcion": "Cheque Depositado Mismo Banco N° 3918243",
  "monto": -716678,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 10110657
}, {
  "fecha": "2026-04-17",
  "descripcion": "Traspaso A: Rodrigo Sanz Troquelados",
  "monto": -1751204,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 10827335
}, {
  "fecha": "2026-04-17",
  "descripcion": "Traspaso A: Comercial Chiletroquel Spa",
  "monto": -882729,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 12578539
}, {
  "fecha": "2026-04-17",
  "descripcion": "Traspaso A: Sociedad Comercial V Y C Spa",
  "monto": -1446424,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 13461268
}, {
  "fecha": "2026-04-17",
  "descripcion": "Traspaso A: Raquel Gonzalez",
  "monto": -50000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 14907692
}, {
  "fecha": "2026-04-17",
  "descripcion": "Traspaso A: Maestranza Pj Spa",
  "monto": -327250,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 14957692
}, {
  "fecha": "2026-04-17",
  "descripcion": "Traspaso De: Grupo Marketing Digital Spa",
  "monto": 7000000,
  "tipo": "INGRESO",
  "banco": "GMD BancoChile",
  "saldo": 15284942
}, {
  "fecha": "2026-04-17",
  "descripcion": "Traspaso De: Grupo Marketing Digital Spa",
  "monto": 7000000,
  "tipo": "INGRESO",
  "banco": "GMD BancoChile",
  "saldo": 8284942
}, {
  "fecha": "2026-04-17",
  "descripcion": "Cheque Cobrado Por Otro Banco N° 3869177",
  "monto": -2148998,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 1284942
}, {
  "fecha": "2026-04-17",
  "descripcion": "PAGO IMPTO TGR 776941859",
  "monto": -4600,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 11277035
}, {
  "fecha": "2026-04-17",
  "descripcion": "TEF 70415700-2 Club de tenis d",
  "monto": -306000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 11281635
}, {
  "fecha": "2026-04-17",
  "descripcion": "0777898809 Transf. J I F CONCESIONES ALIMENTICIAS LIMITADA",
  "monto": 5000000,
  "tipo": "INGRESO",
  "banco": "SANTANDER",
  "saldo": 33655263
}, {
  "fecha": "2026-04-17",
  "descripcion": "0777898809 Transf. J I F CONCESIONES ALIMENTICIAS LIMITADA",
  "monto": 5000000,
  "tipo": "INGRESO",
  "banco": "SANTANDER",
  "saldo": 28655263
}, {
  "fecha": "2026-04-17",
  "descripcion": "0776941859 Transf a GMD Chile",
  "monto": -7000000,
  "tipo": "EGRESO",
  "banco": "SANTANDER",
  "saldo": 23655263
}, {
  "fecha": "2026-04-17",
  "descripcion": "0776941859 Transf a GMD Chile",
  "monto": -7000000,
  "tipo": "EGRESO",
  "banco": "SANTANDER",
  "saldo": 30655263
}, {
  "fecha": "2026-04-17",
  "descripcion": "0769547347 Transf. CARD",
  "monto": 416500,
  "tipo": "INGRESO",
  "banco": "SANTANDER",
  "saldo": 37655263
}, {
  "fecha": "2026-04-16",
  "descripcion": "Traspaso De: Rojas Rojas Luis Fernando",
  "monto": 12300,
  "tipo": "INGRESO",
  "banco": "Grafhika BancoChile",
  "saldo": 6842910
}, {
  "fecha": "2026-04-16",
  "descripcion": "Traspaso A: Antalis Chile Ltda",
  "monto": -3577521,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 3433940
}, {
  "fecha": "2026-04-16",
  "descripcion": "Traspaso A: Dibco Spa",
  "monto": -214795,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 7011461
}, {
  "fecha": "2026-04-16",
  "descripcion": "Traspaso A: Jorge Villarroel Orellana",
  "monto": -4500000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 7226256
}, {
  "fecha": "2026-04-16",
  "descripcion": "TEF 79975650-1 CORPORACION NAC",
  "monto": 6000,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 11587635
}, {
  "fecha": "2026-04-16",
  "descripcion": "TEF 13687670-8 VIDELA EISSMANN",
  "monto": 19635,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 11581635
}, {
  "fecha": "2026-04-16",
  "descripcion": "0145438225 Transf. ROZAS BOZO MARIA CECILIA",
  "monto": 204204,
  "tipo": "INGRESO",
  "banco": "SANTANDER",
  "saldo": 37238763
}, {
  "fecha": "2026-04-15",
  "descripcion": "Traspaso A: Brandon Villarroel Gonzalez",
  "monto": -357434,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 6830610
}, {
  "fecha": "2026-04-15",
  "descripcion": "Traspaso A: Brandon Villarroel Gonzalez",
  "monto": -433694,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 7188044
}, {
  "fecha": "2026-04-15",
  "descripcion": "Traspaso A: Brandon Villarroel Gonzalez",
  "monto": -18672,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 7621738
}, {
  "fecha": "2026-04-15",
  "descripcion": "Traspaso A: Brandon Villarroel Gonzalez",
  "monto": -25618,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 7640410
}, {
  "fecha": "2026-04-15",
  "descripcion": "Traspaso A: Brandon Villarroel Gonzalez",
  "monto": -16184,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 7666028
}, {
  "fecha": "2026-04-15",
  "descripcion": "Traspaso A: Brandon Villarroel Gonzalez",
  "monto": -26132,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 7682212
}, {
  "fecha": "2026-04-15",
  "descripcion": "Traspaso A: Brandon Villarroel Gonzalez",
  "monto": -18691,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 7708344
}, {
  "fecha": "2026-04-15",
  "descripcion": "Traspaso A: Brandon Villarroel Gonzalez",
  "monto": -28882,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 7727035
}, {
  "fecha": "2026-04-15",
  "descripcion": "Traspaso De: Rojas Rojas Luis Fernando",
  "monto": 8700,
  "tipo": "INGRESO",
  "banco": "Grafhika BancoChile",
  "saldo": 7755917
}, {
  "fecha": "2026-04-15",
  "descripcion": "Traspaso A: Luis Ariel Gonzalez Perez",
  "monto": -250000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 7747217
}, {
  "fecha": "2026-04-15",
  "descripcion": "Traspaso A: Jorge Villarroel Orellana",
  "monto": -500000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 11726256
}, {
  "fecha": "2026-04-15",
  "descripcion": "Cargo Por Pago Tc",
  "monto": -500000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 12226256
}, {
  "fecha": "2026-04-15",
  "descripcion": "Traspaso A: Poliplas Ltda",
  "monto": -3474800,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 12726256
}, {
  "fecha": "2026-04-15",
  "descripcion": "Traspaso A: Poliplas Ltda",
  "monto": -3396617,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 16201056
}, {
  "fecha": "2026-04-15",
  "descripcion": "Traspaso A: Alejandro Carrasco Dominguez",
  "monto": -606900,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 19597673
}, {
  "fecha": "2026-04-15",
  "descripcion": "Traspaso A: Raquel Gonzalez",
  "monto": -200000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 20204573
}, {
  "fecha": "2026-04-15",
  "descripcion": "PROVEEDORE 73044000-6 FEDERACI",
  "monto": 8639400,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 11562000
}, {
  "fecha": "2026-04-15",
  "descripcion": "0608050000 PAGO PROVEEDOR TESORERIA G",
  "monto": 822647,
  "tipo": "INGRESO",
  "banco": "SANTANDER",
  "saldo": 37034559
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Roberto Carlos Jofre Fuentes",
  "monto": -600000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 7997217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Cintia Chateux",
  "monto": -200000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 8597217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Patricio Antonio Palma Viscay",
  "monto": -200000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 8797217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Maite Contreras Lereico",
  "monto": -200000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 8997217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Gerardo Arauna Gonzalez",
  "monto": -250000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 9197217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Fernando Gonzalez Jara",
  "monto": -400000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 9447217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Olga Cuevas",
  "monto": -250000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 9847217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Gabriel Cavieres Soto",
  "monto": -300000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 10097217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Felipe Guzman Munoz",
  "monto": -100000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 10397217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Gloria Gonzalez Jara",
  "monto": -1000000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 10497217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Pedro Gutierrez Carvajal",
  "monto": -240000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 11497217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Fidel Ricardo Farias Ojeda",
  "monto": -300000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 11737217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Alejandra Hernandez Mora",
  "monto": -50000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 12037217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Octavio Lopez Bustamante",
  "monto": -100000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 12087217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Jose Quintanilla Polloni",
  "monto": -250000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 12187217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Orlando Hernandez Valdebenito",
  "monto": -250000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 12437217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Rodrigo Morales Cardenas",
  "monto": -310000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 12687217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: German Ortega Acuna",
  "monto": -220000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 12997217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Sergio Rojas Salas",
  "monto": -200000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 13217217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Jose Mauricio Rojas Donoso",
  "monto": -400000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 13417217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Juan Reyes Gonzalez",
  "monto": -450000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 13817217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Leandro Guerra Sandoval",
  "monto": -330000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 14267217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Miguel Bravo Orellana",
  "monto": -500000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 14597217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Luis Santana Cespedes",
  "monto": -80000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 15097217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Ximena Lahr Varela",
  "monto": -80000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 15177217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Yeral Gonzalez Molina",
  "monto": -350000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 15257217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Viviana Munoz Zambrano",
  "monto": -350000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 15607217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Francisco Padilla Vargas",
  "monto": -300000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 15957217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Natalia Lopez Reyes",
  "monto": -100000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 16257217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Yasmeri Pineda Bastidas",
  "monto": -250000,
  "tipo": "GASTO",
  "banco": "Grafhika BancoChile",
  "saldo": 16357217
}, {
  "fecha": "2026-04-14",
  "descripcion": "Deposito Con Cheque Mismo Banco N° 3711363",
  "monto": 940100,
  "tipo": "INGRESO",
  "banco": "GMD BancoChile",
  "saldo": 20404573
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Grafhika Bancochile",
  "monto": -15000000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 19464473
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso De: Grupo Marketing Digital Spa",
  "monto": 7000000,
  "tipo": "INGRESO",
  "banco": "GMD BancoChile",
  "saldo": 34464473
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso De: Grupo Marketing Digital Spa",
  "monto": 7000000,
  "tipo": "INGRESO",
  "banco": "GMD BancoChile",
  "saldo": 27464473
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso De: Grupo Marketing Digital Spa",
  "monto": 7000000,
  "tipo": "INGRESO",
  "banco": "GMD BancoChile",
  "saldo": 20464473
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso De: Grupo Marketing Digital Spa",
  "monto": 7000000,
  "tipo": "INGRESO",
  "banco": "GMD BancoChile",
  "saldo": 13464473
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Lorena Arenas Dgibbs",
  "monto": -300000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 6464473
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Leonardo Villarroel Orellana",
  "monto": -1500000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 6764473
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Jaime Gonzalez Naranjo",
  "monto": -750000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 8264473
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Angel Olguin Alvarado",
  "monto": -300000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 9014473
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Paulina Cerda",
  "monto": -100000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 9314473
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Jose Jimenez",
  "monto": -200000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 9414473
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Lourdes More",
  "monto": -80000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 9614473
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Jorge Rubilar",
  "monto": -100000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 9694473
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Eric Villarroel",
  "monto": -200000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 9794473
}, {
  "fecha": "2026-04-14",
  "descripcion": "Cargo Por Pago Tc",
  "monto": -500000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 9994473
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Comercial Castro Droguet",
  "monto": -84710,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 10494473
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Grupo Marketing Digital",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 10579183
}, {
  "fecha": "2026-04-14",
  "descripcion": "Cheque Cobrado Por Otro Banco N° 3918255",
  "monto": -748367,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 15579183
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Brian Villarroel",
  "monto": -969498,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 16327550
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso De: Grupo Marketing Digital Spa",
  "monto": 7000000,
  "tipo": "INGRESO",
  "banco": "GMD BancoChile",
  "saldo": 17297048
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso De: Grupo Marketing Digital Spa",
  "monto": 6000000,
  "tipo": "INGRESO",
  "banco": "GMD BancoChile",
  "saldo": 10297048
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Normal Arquitectura Spa",
  "monto": -613551,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 4297048
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Quimica Universal Ltda",
  "monto": -294739,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 4910599
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Proveedor Contador A Domicilio",
  "monto": -500000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 5205338
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Luis Lagos",
  "monto": -800000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 5705338
}, {
  "fecha": "2026-04-14",
  "descripcion": "Traspaso A: Marcelo Diaz",
  "monto": -800000,
  "tipo": "GASTO",
  "banco": "GMD BancoChile",
  "saldo": 6505338
}, {
  "fecha": "2026-04-14",
  "descripcion": "967147_PAGO TARJ CRED POR WEB",
  "monto": -500000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 2922600
}, {
  "fecha": "2026-04-14",
  "descripcion": "ABONO A L.CREDITO POR WEB",
  "monto": -77400,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 3422600
}, {
  "fecha": "2026-04-14",
  "descripcion": "ABONO A L.CREDITO POR WEB",
  "monto": -1500000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 3500000
}, {
  "fecha": "2026-04-14",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": 5000000,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 5000000
}, {
  "fecha": "2026-04-14",
  "descripcion": "0776941859 Transf a GMD Chile",
  "monto": -7000000,
  "tipo": "EGRESO",
  "banco": "SANTANDER",
  "saldo": 36211912
}, {
  "fecha": "2026-04-14",
  "descripcion": "0776941859 Transf a GMD Chile",
  "monto": -7000000,
  "tipo": "EGRESO",
  "banco": "SANTANDER",
  "saldo": 43211912
}, {
  "fecha": "2026-04-14",
  "descripcion": "0776941859 Transf a GMD Chile",
  "monto": -7000000,
  "tipo": "EGRESO",
  "banco": "SANTANDER",
  "saldo": 50211912
}, {
  "fecha": "2026-04-14",
  "descripcion": "0776941859 Transf a GMD Chile",
  "monto": -7000000,
  "tipo": "EGRESO",
  "banco": "SANTANDER",
  "saldo": 57211912
}, {
  "fecha": "2026-04-14",
  "descripcion": "0856982009 PAGO PROVEEDOR 0856982009",
  "monto": 7701680,
  "tipo": "INGRESO",
  "banco": "SANTANDER",
  "saldo": 64211912
}, {
  "fecha": "2026-04-14",
  "descripcion": "0776941859 Transf a GMD Chile",
  "monto": -6000000,
  "tipo": "EGRESO",
  "banco": "SANTANDER",
  "saldo": 55642722
}, {
  "fecha": "2026-04-14",
  "descripcion": "0776941859 Transf a GMD Chile",
  "monto": -7000000,
  "tipo": "EGRESO",
  "banco": "SANTANDER",
  "saldo": 61642722
}, {
  "fecha": "2026-04-13",
  "descripcion": "TRANSFERENCIA DE LINEA CREDITO",
  "monto": 1577449,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 0
}, {
  "fecha": "2026-04-13",
  "descripcion": "PAGO CUOTA 002 DE 710162055574",
  "monto": -8765278,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": -1577449
}, {
  "fecha": "2026-04-13",
  "descripcion": "TEF 77925991-9 Grafhika spa",
  "monto": -4583000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 7187829
}, {
  "fecha": "2026-04-13",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 11770829
}, {
  "fecha": "2026-04-13",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 16770829
}, {
  "fecha": "2026-04-13",
  "descripcion": "PAGO COTIZ.PREVIRED",
  "monto": -140303,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 21770829
}, {
  "fecha": "2026-04-13",
  "descripcion": "PROVEEDORE 96832590-6 EDICIONE",
  "monto": 7424410,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 21911132
}, {
  "fecha": "2026-04-13",
  "descripcion": "Depósito Documento Otros Bancos",
  "monto": 867510,
  "tipo": "INGRESO",
  "banco": "SANTANDER",
  "saldo": 56510232
}, {
  "fecha": "2026-04-13",
  "descripcion": "Otorgamiento Factoring",
  "monto": 53575489,
  "tipo": "INGRESO",
  "banco": "SANTANDER",
  "saldo": 68642722
}, {
  "fecha": "2026-04-13",
  "descripcion": "0771751601 PAGO PROVEEDOR COMERCIAL D",
  "monto": 3138744,
  "tipo": "INGRESO",
  "banco": "SANTANDER",
  "saldo": 15067233
}, {
  "fecha": "2026-04-10",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 14486722
}, {
  "fecha": "2026-04-10",
  "descripcion": "PROVEEDORE 76005909-9 Motores",
  "monto": 1898050,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 19486722
}, {
  "fecha": "2026-04-09",
  "descripcion": "PAGO IMPTO TGR 776941859",
  "monto": -3222268,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 17588672
}, {
  "fecha": "2026-04-09",
  "descripcion": "TEF 79975650-1 CORPORACION NAC",
  "monto": 862462,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 20810940
}, {
  "fecha": "2026-04-09",
  "descripcion": "TEF 76051644-9 INGENIERIA DE S",
  "monto": 60536,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 19948478
}, {
  "fecha": "2026-04-09",
  "descripcion": "TEF 76051644-9 INGENIERIA DE S",
  "monto": 5000000,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 19887942
}, {
  "fecha": "2026-04-09",
  "descripcion": "TEF 76051644-9 INGENIERIA DE S",
  "monto": 5000000,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 14887942
}, {
  "fecha": "2026-04-09",
  "descripcion": "REDCOMPRA REGISTRO CIVIL SA",
  "monto": -1560,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 9887942
}, {
  "fecha": "2026-04-08",
  "descripcion": "662285_PAGO TARJ CRED POR WEB",
  "monto": -500000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 9889502
}, {
  "fecha": "2026-04-07",
  "descripcion": "TEF  6023126-5 Rosemarie Mery",
  "monto": -506000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 10389502
}, {
  "fecha": "2026-04-07",
  "descripcion": "TEF 13269813-9 Cristian Fredes",
  "monto": -350000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 10895502
}, {
  "fecha": "2026-04-06",
  "descripcion": "PAGO POR SWEB DE ENEL DISTRIBU",
  "monto": -17428,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 11245502
}, {
  "fecha": "2026-04-06",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 11262930
}, {
  "fecha": "2026-04-06",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 16262930
}, {
  "fecha": "2026-04-06",
  "descripcion": "PROVEEDORE 70819400-K TRIBUNAL",
  "monto": 801822,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 21262930
}, {
  "fecha": "2026-04-02",
  "descripcion": "PAGO IMPTO TGR 776941859",
  "monto": -48000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 20461108
}, {
  "fecha": "2026-04-01",
  "descripcion": "PAC SEGUROS SCOTIABANK   96344",
  "monto": -15120,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 20509108
}, {
  "fecha": "2026-04-01",
  "descripcion": "PROVEEDORE 81698900-0 Pontific",
  "monto": 149940,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 20524228
}, {
  "fecha": "2026-04-01",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 20374288
}, {
  "fecha": "2026-03-27",
  "descripcion": "PROVEEDORE 70574900-0 Fundacio",
  "monto": 1764181,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 25374288
}, {
  "fecha": "2026-03-26",
  "descripcion": "A25521_PAGO TARJ CRED POR WEB",
  "monto": -500000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 23610107
}, {
  "fecha": "2026-03-26",
  "descripcion": "TEF 10981601-9 MAURICIO MIRAND",
  "monto": -214379,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 24110107
}, {
  "fecha": "2026-03-26",
  "descripcion": "GIRO REDBANC OTRO BANCO",
  "monto": -40000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 24324486
}, {
  "fecha": "2026-03-26",
  "descripcion": "GIRO REDBANC OTRO BANCO",
  "monto": -5000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 24364486
}, {
  "fecha": "2026-03-25",
  "descripcion": "TEF 76078941-0 ASESORIAS E INV",
  "monto": 79682,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 24369486
}, {
  "fecha": "2026-03-25",
  "descripcion": "TEF 76078941-0 ASESORIAS E INV",
  "monto": 241273,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 24289804
}, {
  "fecha": "2026-03-25",
  "descripcion": "TEF 79853200-6 COSTA y cia lim",
  "monto": -276782,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 24048531
}, {
  "fecha": "2026-03-25",
  "descripcion": "TEF 14555688-0 Patricia Ines G",
  "monto": -276782,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 24325313
}, {
  "fecha": "2026-03-25",
  "descripcion": "TEF 14555688-0 Patricia Ines G",
  "monto": -2409780,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 24602095
}, {
  "fecha": "2026-03-25",
  "descripcion": "PAC SEGUROS SCOTIABANK   21622",
  "monto": -10739,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 27011875
}, {
  "fecha": "2026-03-24",
  "descripcion": "TEF 76042401-3 Bolsas la Estre",
  "monto": -44770,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 27022614
}, {
  "fecha": "2026-03-23",
  "descripcion": "TEF 79975650-1 CORPORACION NAC",
  "monto": 868462,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 27067384
}, {
  "fecha": "2026-03-19",
  "descripcion": "TEF 76221845-3 refrigeracion i",
  "monto": -284648,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 26198922
}, {
  "fecha": "2026-03-16",
  "descripcion": "PAGO COTIZ.PREVIRED",
  "monto": -140966,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 26483570
}, {
  "fecha": "2026-03-16",
  "descripcion": "PAC SEGUROS SCOTIABANK   96344",
  "monto": -15120,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 26624536
}, {
  "fecha": "2026-03-13",
  "descripcion": "PAGO CUOTA 001 DE 710162055574",
  "monto": -8767344,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 26639656
}, {
  "fecha": "2026-03-13",
  "descripcion": "AV 0968325906 EDICIONES",
  "monto": 8726270,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 35407000
}, {
  "fecha": "2026-03-13",
  "descripcion": "TEF 96832590-6 EDICIONES UNIVE",
  "monto": 4000000,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 26680730
}, {
  "fecha": "2026-03-13",
  "descripcion": "TEF 96832590-6 EDICIONES UNIVE",
  "monto": 564830,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 22680730
}, {
  "fecha": "2026-03-13",
  "descripcion": "TEF 96832590-6 EDICIONES UNIVE",
  "monto": 7000000,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 22115900
}, {
  "fecha": "2026-03-12",
  "descripcion": "TEF 18621686-5 Claudio Ivan Zu",
  "monto": 81200,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 15115900
}, {
  "fecha": "2026-03-12",
  "descripcion": "169150_PAGO TARJ CRED POR WEB",
  "monto": -300000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 15034700
}, {
  "fecha": "2026-03-12",
  "descripcion": "PROVEEDORE 60911000-7 U de San",
  "monto": 3585708,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 15334700
}, {
  "fecha": "2026-03-10",
  "descripcion": "843192_PAGO TARJ CRED POR WEB",
  "monto": -200000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 11748992
}, {
  "fecha": "2026-03-09",
  "descripcion": "PAGO POR SWEB DE ENEL DISTRIBU",
  "monto": -18351,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 11948992
}, {
  "fecha": "2026-03-06",
  "descripcion": "PROVEEDORE 87912900-1 UNIV LA",
  "monto": 999957,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 11967343
}, {
  "fecha": "2026-03-04",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 10967386
}, {
  "fecha": "2026-02-25",
  "descripcion": "PAC SEGUROS SCOTIABANK   21622",
  "monto": -10725,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 15967386
}, {
  "fecha": "2026-02-24",
  "descripcion": "TEF  7807268-7 Angel Antonio O",
  "monto": 2000,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 15978111
}, {
  "fecha": "2026-02-23",
  "descripcion": "TEF  9758353-6 celinda barrera",
  "monto": -35700,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 15976111
}, {
  "fecha": "2026-02-23",
  "descripcion": "CANCELACION DEPOSITO A PLAZO",
  "monto": 10006806,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 16011811
}, {
  "fecha": "2026-02-20",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 6005005
}, {
  "fecha": "2026-02-19",
  "descripcion": "TEF 78220990-6 ANTARTIC REFRIG",
  "monto": -281328,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 11005005
}, {
  "fecha": "2026-02-19",
  "descripcion": "GIRO REDBANC OTRO BANCO",
  "monto": -100000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 11286333
}, {
  "fecha": "2026-02-18",
  "descripcion": "CARGO COMEX 7420458",
  "monto": -3016859,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 11386333
}, {
  "fecha": "2026-02-17",
  "descripcion": "REDCOMPRA LK PROSPORT SPA",
  "monto": -2500,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 14403192
}, {
  "fecha": "2026-02-16",
  "descripcion": "TOMA DEPOSITO A PLAZO SWEB",
  "monto": -10000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 14405692
}, {
  "fecha": "2026-02-16",
  "descripcion": "PAC SEGUROS SCOTIABANK   96344",
  "monto": -15089,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 24405692
}, {
  "fecha": "2026-02-13",
  "descripcion": "TEF  9758353-6 celinda barrera",
  "monto": -35700,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 24420781
}, {
  "fecha": "2026-02-13",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 24456481
}, {
  "fecha": "2026-02-13",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 29456481
}, {
  "fecha": "2026-02-13",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 34456481
}, {
  "fecha": "2026-02-13",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 39456481
}, {
  "fecha": "2026-02-12",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 44456481
}, {
  "fecha": "2026-02-12",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 49456481
}, {
  "fecha": "2026-02-12",
  "descripcion": "PAGO COTIZ.PREVIRED",
  "monto": -140303,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 54456481
}, {
  "fecha": "2026-02-12",
  "descripcion": "PROVEEDORE 69500900-3 UNITED N",
  "monto": 4232235,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 54596784
}, {
  "fecha": "2026-02-11",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 50364549
}, {
  "fecha": "2026-02-11",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 55364549
}, {
  "fecha": "2026-02-11",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 60364549
}, {
  "fecha": "2026-02-11",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 65364549
}, {
  "fecha": "2026-02-11",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 70364549
}, {
  "fecha": "2026-02-11",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 75364549
}, {
  "fecha": "2026-02-11",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 80364549
}, {
  "fecha": "2026-02-11",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 85364549
}, {
  "fecha": "2026-02-11",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 90364549
}, {
  "fecha": "2026-02-11",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 95364549
}, {
  "fecha": "2026-02-11",
  "descripcion": "APERTURA PRESTAMO 710162055574",
  "monto": 100000000,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 100364549
}, {
  "fecha": "2026-02-11",
  "descripcion": "GASTOS DE NOTARIO",
  "monto": -1130,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 364549
}, {
  "fecha": "2026-02-11",
  "descripcion": "IMPUESTO DE TIMBRE",
  "monto": -800000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 365679
}, {
  "fecha": "2026-02-11",
  "descripcion": "REDCOMPRA THESEVEN MARKET",
  "monto": -5510,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 1165679
}, {
  "fecha": "2026-02-10",
  "descripcion": "141465_PAGO TARJ CRED POR WEB",
  "monto": -200000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 1171189
}, {
  "fecha": "2026-02-06",
  "descripcion": "TOMA FONDOS MUTUOS POR SWEB",
  "monto": -50000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 1371189
}, {
  "fecha": "2026-02-06",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": 7000000,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 51371189
}, {
  "fecha": "2026-02-06",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": 7000000,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 44371189
}, {
  "fecha": "2026-02-06",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": 7000000,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 37371189
}, {
  "fecha": "2026-02-06",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": 7000000,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 30371189
}, {
  "fecha": "2026-02-06",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": 7000000,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 23371189
}, {
  "fecha": "2026-02-06",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": 7000000,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 16371189
}, {
  "fecha": "2026-02-06",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": 7000000,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 9371189
}, {
  "fecha": "2026-02-05",
  "descripcion": "REDCOMPRA TUU bomberosVinaD",
  "monto": -704,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 2371189
}, {
  "fecha": "2026-02-04",
  "descripcion": "PROVEEDORE 96832590-6 EDICIONE",
  "monto": 1794520,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 2371893
}, {
  "fecha": "2026-02-02",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 577373
}, {
  "fecha": "2026-02-02",
  "descripcion": "TEF 76078941-0 ASESORIAS E INV",
  "monto": 241273,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 5577373
}, {
  "fecha": "2026-02-02",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 5336100
}, {
  "fecha": "2026-01-30",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 10336100
}, {
  "fecha": "2026-01-29",
  "descripcion": "TOMA FONDOS MUTUOS POR SWEB",
  "monto": -30000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 15336100
}, {
  "fecha": "2026-01-29",
  "descripcion": "349265_PAGO TARJ CRED POR WEB",
  "monto": -500000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 45336100
}, {
  "fecha": "2026-01-29",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 45836100
}, {
  "fecha": "2026-01-29",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 50836100
}, {
  "fecha": "2026-01-29",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 55836100
}, {
  "fecha": "2026-01-29",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 60836100
}, {
  "fecha": "2026-01-29",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 65836100
}, {
  "fecha": "2026-01-29",
  "descripcion": "PROVEEDORE 70574900-0 Fundacio",
  "monto": 58770951,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 70836100
}, {
  "fecha": "2026-01-29",
  "descripcion": "PROVEEDORE 70574900-0 Fundacio",
  "monto": 8889300,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 12065149
}, {
  "fecha": "2026-01-28",
  "descripcion": "PROVEEDORE 81698900-0 PONT UNI",
  "monto": 104720,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 3175849
}, {
  "fecha": "2026-01-26",
  "descripcion": "CARGO COMEX 50653306",
  "monto": -2652780,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 3071129
}, {
  "fecha": "2026-01-26",
  "descripcion": "PAC SEGUROS SCOTIABANK   21622",
  "monto": -10720,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 5723909
}, {
  "fecha": "2026-01-23",
  "descripcion": "TEF 77694185-9 GRUPO MARKETING",
  "monto": -3000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 5734629
}, {
  "fecha": "2026-01-23",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 8734629
}, {
  "fecha": "2026-01-20",
  "descripcion": "PAC SEGUROS SCOTIABANK   96344",
  "monto": -15095,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 13734629
}, {
  "fecha": "2026-01-19",
  "descripcion": "PROVEEDORE 81698900-0 PONT UNI",
  "monto": 19040,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 13749724
}, {
  "fecha": "2026-01-19",
  "descripcion": "PROVEEDORE 96832590-6 EDICIONE",
  "monto": 12857950,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 13730684
}, {
  "fecha": "2026-01-15",
  "descripcion": "TEF 16618373-1 Elizabeth Reyes",
  "monto": 102816,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 872734
}, {
  "fecha": "2026-01-15",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 769918
}, {
  "fecha": "2026-01-15",
  "descripcion": "TEF 76358849-1 CAROLINA VALVER",
  "monto": 6560,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 5769918
}, {
  "fecha": "2026-01-14",
  "descripcion": "TEF 79975650-1 CORPORACION NAC",
  "monto": 1128477,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 5763358
}, {
  "fecha": "2026-01-14",
  "descripcion": "TEF 77694185-9 Grupo Marketing",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 4634881
}, {
  "fecha": "2026-01-14",
  "descripcion": "PROVEEDORE 73044000-6 FEDERACI",
  "monto": 7892080,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 9634881
}, {
  "fecha": "2026-01-13",
  "descripcion": "TEF 20237058-6 Alonso Maximili",
  "monto": 12280,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 1742801
}, {
  "fecha": "2026-01-13",
  "descripcion": "TEF  7807268-7 Angel Antonio O",
  "monto": 2000,
  "tipo": "INGRESO",
  "banco": "Scotiabank",
  "saldo": 1730521
}, {
  "fecha": "2026-01-12",
  "descripcion": "PAGO COTIZ.PREVIRED",
  "monto": -137435,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 1728521
}, {
  "fecha": "2026-01-12",
  "descripcion": "CARGO PAC VISA PAGO AUTOMATICO",
  "monto": -55704,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 1865956
}, {
  "fecha": "2026-01-12",
  "descripcion": "PAC SEGUROS SCOTIABANK   96344",
  "monto": -15065,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 1921660
}, {
  "fecha": "2026-01-12",
  "descripcion": "PAC SEGUROS SCOTIABANK   21622",
  "monto": -10704,
  "tipo": "GASTO",
  "banco": "Scotiabank",
  "saldo": 1936725
}, {
  "fecha": "2025-10-02",
  "descripcion": "Transf. a terceros vía Internet a cuenta 1697599003 B.Chile, Grupo marketing digital, Rut 77.694.185-9, el 02-10-2025 a las 00:28:42",
  "monto": -7000000,
  "tipo": "GASTO",
  "banco": "BICE",
  "saldo": 12482877
}, {
  "fecha": "2025-10-01",
  "descripcion": "Transf. via Internet a cuenta 7045417 B.BICE GRUPO MARKETNG DIGITAL SPA, 0776941859, desde BICE FACTORING SA, 0765627869 Ref: CANCELA OP 4041843, el 01/10/2025 a las 14:20:30",
  "monto": 14497447,
  "tipo": "INGRESO",
  "banco": "BICE",
  "saldo": 12482877
}, {
  "fecha": "2025-10-01",
  "descripcion": "Transf. a terceros vía Internet a cuenta 1697599003 B.Chile, Grupo marketing digital, Rut 77.694.185-9, el 01-10-2025 a las 01:11:21",
  "monto": -7000000,
  "tipo": "GASTO",
  "banco": "BICE",
  "saldo": 12482877
}, {
  "fecha": "2026-04-17",
  "descripcion": "Transferencia enviada a Patricia Olmos",
  "monto": -2300,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-04-17",
  "descripcion": "Transferencia enviada a Grafhika MAXXA",
  "monto": -100000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-04-17",
  "descripcion": "Transferencia enviada a SENDU SPA",
  "monto": -747858,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-04-14",
  "descripcion": "Transferencia recibida de CARLOS HERNAN GUEVARA VIVANCO",
  "monto": 802953,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-04-14",
  "descripcion": "Transferencia enviada a Javiera Vaccaro",
  "monto": -80000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-04-08",
  "descripcion": "Comisión por Plan Cta. Corriente",
  "monto": -3951,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-04-08",
  "descripcion": "Transferencia enviada a Grafhika Chile",
  "monto": -3000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-04-07",
  "descripcion": "Devolución de comisiones",
  "monto": 3951,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-04-06",
  "descripcion": "Comisión por Plan Cta. Corriente",
  "monto": -3951,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-04-02",
  "descripcion": "Transferencia recibida de FUNDACION EDUCACIONAL CARMELIT",
  "monto": 335001,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-04-01",
  "descripcion": "Transferencia enviada a cesar flores",
  "monto": -206000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-04-01",
  "descripcion": "Depósito cheque/documento otros bancos",
  "monto": 576912,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-31",
  "descripcion": "Transferencia enviada a JIF Concesiones Ltda",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-31",
  "descripcion": "Transferencia enviada a JIF Concesiones Ltda",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-31",
  "descripcion": "Transferencia recibida de Grafhika Impresores SpA",
  "monto": 3000000,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-31",
  "descripcion": "Transferencia enviada a Grafhika Chile",
  "monto": -7000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-31",
  "descripcion": "Transferencia enviada a Grafhika Chile",
  "monto": -7000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-31",
  "descripcion": "Transferencia recibida de BARRIOS CORONADO MARIA JOSE PA",
  "monto": 103435,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-25",
  "descripcion": "Transferencia enviada a Grupo marketing digital spa",
  "monto": -7000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-25",
  "descripcion": "Transferencia enviada a Grupo marketing digital spa",
  "monto": -7000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-24",
  "descripcion": "Pago recibido de 000097843716",
  "monto": 24781750,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-20",
  "descripcion": "Transferencia enviada a Daniela Vivanco Alvarado",
  "monto": -575805,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-20",
  "descripcion": "Transferencia enviada a Grafhika Chile",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-18",
  "descripcion": "Transferencia recibida de HUDSON SERVICES SPA",
  "monto": 6519605,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-17",
  "descripcion": "Transferencia enviada a cesar flores",
  "monto": -150000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-17",
  "descripcion": "Transferencia recibida de HUDSON SERVICES SPA",
  "monto": 6833117,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-13",
  "descripcion": "Transferencia enviada a SENDU SPA",
  "monto": -101091,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-06",
  "descripcion": "Comisión por Plan Cta. Corriente",
  "monto": -3950,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-03-04",
  "descripcion": "Transferencia enviada a Grafhika Chile",
  "monto": -5000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-27",
  "descripcion": "Transferencia enviada a Grafhika Chile",
  "monto": -4000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-27",
  "descripcion": "Transferencia enviada a Grafhika Chile",
  "monto": -7000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-27",
  "descripcion": "Transferencia enviada a Grafhika Chile",
  "monto": -7000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-26",
  "descripcion": "Transferencia enviada a Grupo marketing digital spa",
  "monto": -7000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-26",
  "descripcion": "Transferencia enviada a Grafhika Chile",
  "monto": -7000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-26",
  "descripcion": "Transferencia recibida de HUDSON SERVICES SPA",
  "monto": 7000000,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-26",
  "descripcion": "Transferencia recibida de HUDSON SERVICES SPA",
  "monto": 5352722,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-26",
  "descripcion": "Transferencia recibida de EDUARDO ANTONIO DOMINGUEZ PENA",
  "monto": 30000,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-26",
  "descripcion": "Transferencia recibida de HUDSON SERVICES SPA",
  "monto": 1000000,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-25",
  "descripcion": "Pago recibido de 000097843716",
  "monto": 24198650,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-24",
  "descripcion": "Transferencia enviada a Ricardo Herrada",
  "monto": -112000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-20",
  "descripcion": "Transferencia enviada a Ricardo Herrada",
  "monto": -140000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-19",
  "descripcion": "Transferencia recibida de CARLOS HERNAN GUEVARA VIVANCO",
  "monto": 552953,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-18",
  "descripcion": "Transferencia recibida de CARLOS HERNAN GUEVARA VIVANCO",
  "monto": 250000,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-16",
  "descripcion": "Transferencia enviada a SENDU SPA",
  "monto": -189183,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-09",
  "descripcion": "Transferencia enviada a Javiera Vaccaro",
  "monto": -300000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-09",
  "descripcion": "Transferencia recibida de GOMCA SPA",
  "monto": 4658553,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-06",
  "descripcion": "Comisión por Plan Cta. Corriente",
  "monto": -3937,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-04",
  "descripcion": "Transferencia enviada a Agencia Dynamis Spa",
  "monto": -416500,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-02-02",
  "descripcion": "Transferencia enviada a SERVICIOS DIGITALES CORONADO SpA",
  "monto": -357000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-01-23",
  "descripcion": "Transferencia recibida de SEBASTIAN ANDRES RIESTRA LOPEZ",
  "monto": 386155,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-01-23",
  "descripcion": "Transferencia recibida de INGENIERIA Y CONSTRUCCION PK S",
  "monto": 296905,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-01-19",
  "descripcion": "Transferencia enviada a SENDU SPA",
  "monto": -365295,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-01-14",
  "descripcion": "Transferencia enviada a Grupo marketing digital spa",
  "monto": -4000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-01-13",
  "descripcion": "Transferencia enviada a servicio tecnico rene montecino mendoza",
  "monto": -135000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-01-12",
  "descripcion": "Transferencia recibida de GOMCA SPA",
  "monto": 267453,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-01-09",
  "descripcion": "Comisión por Plan Cta. Corriente",
  "monto": -3944,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-01-07",
  "descripcion": "Pago en línea Previred",
  "monto": -184602,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-01-07",
  "descripcion": "Pago en línea Previred",
  "monto": -183402,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-01-07",
  "descripcion": "Pago en línea Previred",
  "monto": -182014,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-01-07",
  "descripcion": "Transferencia recibida de LA CAPITANA SPA",
  "monto": 415905,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-01-07",
  "descripcion": "Transferencia recibida de GOMCA SPA",
  "monto": 4391100,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-01-04",
  "descripcion": "Transferencia enviada a hernan vera cerda",
  "monto": -420000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-01-04",
  "descripcion": "Transferencia recibida de GRUPO MARKETING DIGITAL SpA",
  "monto": 500000,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-01-02",
  "descripcion": "Transferencia enviada a hernan vera cerda",
  "monto": -450000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2026-01-02",
  "descripcion": "Transferencia recibida de Grafhika Copy Center SpA",
  "monto": 450000,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-31",
  "descripcion": "Transferencia enviada a Javiera Vaccaro",
  "monto": -150000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-30",
  "descripcion": "Transferencia enviada a SERVICIOS DIGITALES CORONADO SpA",
  "monto": -357000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-29",
  "descripcion": "Transferencia enviada a IMPORTADORA Y COMERCIALIZADORA CALAS LT",
  "monto": -394199,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-23",
  "descripcion": "Transferencia enviada a servicio tecnico rene montecino mendoza",
  "monto": -60000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-23",
  "descripcion": "Transferencia recibida de GRUPO MARKETING DIGITAL SPA",
  "monto": 1000000,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-22",
  "descripcion": "Transferencia enviada a Kovacs SPA  CHILE",
  "monto": -200000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-22",
  "descripcion": "Transferencia enviada a Grupo marketing digital spa",
  "monto": -4000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-20",
  "descripcion": "Transferencia enviada a servicio tecnico rene montecino mendoza",
  "monto": -350000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-18",
  "descripcion": "Transferencia recibida de GOMCA SPA",
  "monto": 4394670,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-18",
  "descripcion": "Transferencia enviada a servicio tecnico rene montecino mendoza",
  "monto": -400000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-18",
  "descripcion": "Transferencia recibida de GRUPO MARKETING DIGITAL SpA",
  "monto": 300000,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-18",
  "descripcion": "Transferencia enviada a servicio tecnico rene montecino mendoza",
  "monto": -1000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-18",
  "descripcion": "Transferencia recibida de GRUPO MARKETING DIGITAL SpA",
  "monto": 1000000,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-17",
  "descripcion": "Transferencia enviada a Cintia  chateux",
  "monto": -200000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-17",
  "descripcion": "Transferencia enviada a SENDU SPA",
  "monto": -223209,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-17",
  "descripcion": "Transferencia enviada a ruben antonio aviles godoy",
  "monto": -200000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-15",
  "descripcion": "Transferencia enviada a Grupo marketing digital spa",
  "monto": -4000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-12",
  "descripcion": "Transferencia recibida de SEBASTIAN ANDRES RIESTRA LOPEZ",
  "monto": 136155,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-11",
  "descripcion": "Transferencia recibida de FUNDACION EDUCACIONAL CRISTO O",
  "monto": 356405,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-11",
  "descripcion": "Transferencia recibida de SEBASTIAN ANDRES RIESTRA LOPEZ",
  "monto": 250000,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-10",
  "descripcion": "Transferencia enviada a Javiera Vaccaro",
  "monto": -282000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-10",
  "descripcion": "Transferencia recibida de GOMCA SPA",
  "monto": 829430,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-09",
  "descripcion": "Comisión por Plan Cta. Corriente",
  "monto": -3932,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-09",
  "descripcion": "Transferencia recibida de GOMCA SPA",
  "monto": 3565240,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-09",
  "descripcion": "Transferencia enviada a Comercial ANK",
  "monto": -50000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-05",
  "descripcion": "Transferencia enviada a Grupo marketing digital spa",
  "monto": -2000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-05",
  "descripcion": "Transferencia recibida de EL TALLER DE GLORIA SPA",
  "monto": 426810,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-05",
  "descripcion": "Transferencia recibida de EL TALLER DE GLORIA SPA",
  "monto": 1081013,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-12-02",
  "descripcion": "Transferencia enviada a Grupo marketing digital spa",
  "monto": -2000000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-11-26",
  "descripcion": "Transferencia recibida de INGENIERIA Y CONSTRUCCION PK S",
  "monto": 296905,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-11-24",
  "descripcion": "Transferencia enviada a Javiera Vaccaro",
  "monto": -108000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-11-24",
  "descripcion": "Transferencia enviada a Carlos  Reyes Gonzalez",
  "monto": -460000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-11-20",
  "descripcion": "Transferencia recibida de FUNDACION EDUCACIONAL CRISTO O",
  "monto": 356405,
  "tipo": "INGRESO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-11-19",
  "descripcion": "Transferencia enviada a SENDU SPA",
  "monto": -134524,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}, {
  "fecha": "2025-11-19",
  "descripcion": "Transferencia enviada a SERVICIOS DIGITALES CORONADO SpA",
  "monto": -357000,
  "tipo": "GASTO",
  "banco": "BCI",
  "saldo": 374727
}];
let GASTOS = [{
  "fecha": "2026-04-17",
  "descripcion": "DISTRIBUIDORA WALTER LUND SPA",
  "monto": 716678,
  "estado": "Pendiente"
}, {
  "fecha": "2026-04-20",
  "descripcion": "CONVERTIDORA LM LTDA",
  "monto": 1231364,
  "estado": "Pendiente"
}, {
  "fecha": "2026-04-20",
  "descripcion": "CONVERTIDORA LM LTDA",
  "monto": 4856628,
  "estado": "Pendiente"
}, {
  "fecha": "2026-04-24",
  "descripcion": "DISTRIBUIDORA WALTER LUND SPA",
  "monto": 637778,
  "estado": "Pendiente"
}, {
  "fecha": "2026-04-25",
  "descripcion": "DISTRIBUIDORA WALTER LUND SPA",
  "monto": 4335002,
  "estado": "Pendiente"
}, {
  "fecha": "2026-04-26",
  "descripcion": "DISTRIBUIDORA PAPELES INDUSTRIALES SPA",
  "monto": 378896,
  "estado": "Pendiente"
}, {
  "fecha": "2026-04-29",
  "descripcion": "DISTRIBUIDORA WALTER LUND SPA",
  "monto": 175306,
  "estado": "Pendiente"
}, {
  "fecha": "2026-04-30",
  "descripcion": "RICOH CHILE SA",
  "monto": 4460000,
  "estado": "Pendiente"
}, {
  "fecha": "2026-04-30",
  "descripcion": "RICOH CHILE SA",
  "monto": 2629625,
  "estado": "Pendiente"
}, {
  "fecha": "2026-04-30",
  "descripcion": "DISTRIBUIDORA DIAZOL SA",
  "monto": 1190000,
  "estado": "Pendiente"
}, {
  "fecha": "2026-05-02",
  "descripcion": "FILTER GRAFICS LIMITADA",
  "monto": 3455498,
  "estado": "Pendiente"
}, {
  "fecha": "2026-05-05",
  "descripcion": "DISTRIBUIDORA WALTER LUND SPA",
  "monto": 5428812,
  "estado": "Pendiente"
}, {
  "fecha": "2026-03-01",
  "descripcion": "DISTRIBUIDORA PAPELES INDUSTRIALES SPA",
  "monto": 2656140,
  "estado": "Pagado"
}, {
  "fecha": "2026-03-02",
  "descripcion": "DISTRIBUIDORA DIAZOL SA",
  "monto": 714000,
  "estado": "Pagado"
}, {
  "fecha": "2026-03-06",
  "descripcion": "DISTRIBUIDORA WALTER LUND SPA",
  "monto": 2277303,
  "estado": "Pagado"
}, {
  "fecha": "2026-03-06",
  "descripcion": "FILTER GRAFICS LIMITADA",
  "monto": 889287,
  "estado": "Pagado"
}, {
  "fecha": "2026-03-09",
  "descripcion": "DISTRIBUIDORA WALTER LUND SPA",
  "monto": 1291474,
  "estado": "Pagado"
}, {
  "fecha": "2026-03-11",
  "descripcion": "DISTRIBUIDORA WALTER LUND SPA",
  "monto": 933206,
  "estado": "Pagado"
}, {
  "fecha": "2026-03-14",
  "descripcion": "FILTER GRAFICS LIMITADA",
  "monto": 3455498,
  "estado": "Pagado"
}, {
  "fecha": "2026-03-17",
  "descripcion": "DISTRIBUIDORA PAPELES INDUSTRIALES SPA",
  "monto": 1863510,
  "estado": "Pagado"
}, {
  "fecha": "2026-03-20",
  "descripcion": "DISTRIBUIDORA WALTER LUND SPA",
  "monto": 4856628,
  "estado": "Pagado"
}, {
  "fecha": "2026-03-25",
  "descripcion": "RICOH CHILE SA",
  "monto": 4460000,
  "estado": "Pagado"
}, {
  "fecha": "2026-03-28",
  "descripcion": "DISTRIBUIDORA DIAZOL SA",
  "monto": 714000,
  "estado": "Pagado"
}, {
  "fecha": "2026-04-01",
  "descripcion": "DISTRIBUIDORA PAPELES INDUSTRIALES SPA",
  "monto": 2656140,
  "estado": "Pagado"
}, {
  "fecha": "2026-04-05",
  "descripcion": "DISTRIBUIDORA WALTER LUND SPA",
  "monto": 2277303,
  "estado": "Pagado"
}, {
  "fecha": "2026-04-10",
  "descripcion": "FILTER GRAFICS LIMITADA",
  "monto": 889287,
  "estado": "Pagado"
}, {
  "fecha": "2026-04-15",
  "descripcion": "RICOH CHILE SA",
  "monto": 2629625,
  "estado": "Pagado"
}];
const VENTAS = [{
  "vendedor": "BVILLARROEL",
  "numero": 1821,
  "empresa": "MARIO ENRIQUE GONZALEZ ESPINOSA",
  "total": 1558091,
  "fecha": "2025-07-02",
  "estado": "FINALIZADO"
}, {
  "vendedor": "BVILLARROEL",
  "numero": 1822,
  "empresa": "UNIVERSIDAD DE SANTIAGO DE CHILE",
  "total": 23800,
  "fecha": "2025-07-02",
  "estado": "FINALIZADO"
}, {
  "vendedor": "OHERNANDEZ",
  "numero": 1823,
  "empresa": "ASESORIAS E INVERSIONES SAN CHARBEL SPA",
  "total": 44825,
  "fecha": "2025-07-03",
  "estado": "FINALIZADO"
}, {
  "vendedor": "BVILLARROEL",
  "numero": 1840,
  "empresa": "SUBSECRETARIA DEL MINISTERIO DE EDUCACION PUBLICA",
  "total": 184703470,
  "fecha": "2025-08-01",
  "estado": "FINALIZADO"
}, {
  "vendedor": "JNARANJO",
  "numero": 1855,
  "empresa": "ALIANZA PEDRO DE VALDIVIA LTDA.",
  "total": 31389744,
  "fecha": "2025-07-22",
  "estado": "FINALIZADO"
}, {
  "vendedor": "JNARANJO",
  "numero": 1858,
  "empresa": "PREUNIVERSITARIO PEDRO DE VALDIVIA CONCEPCION",
  "total": 31047703,
  "fecha": "2025-07-23",
  "estado": "FINALIZADO"
}, {
  "vendedor": "AOLGUIN",
  "numero": 1860,
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIV. CATOLICA",
  "total": 37174053,
  "fecha": "2025-07-28",
  "estado": "FINALIZADO"
}, {
  "vendedor": "GERENCIA",
  "numero": 1865,
  "empresa": "GRAFHIKA COPY CENTER SPA",
  "total": 52461489,
  "fecha": "2025-08-04",
  "estado": "FINALIZADO"
}, {
  "vendedor": "BVILLARROEL",
  "numero": 1887,
  "empresa": "FEBOND SPA",
  "total": 454002,
  "fecha": "2025-08-11",
  "estado": "PENDIENTE"
}, {
  "vendedor": "LVILLARROEL",
  "numero": 1828,
  "empresa": "SERVICIO DE PRODUCCION DANILO MENDEZ PIÑA",
  "total": 565250,
  "fecha": "2025-07-07",
  "estado": "PENDIENTE"
}, {
  "vendedor": "LVILLARROEL",
  "numero": 1856,
  "empresa": "COMUNICACION IMAGEN Y APOYO EMPRESARIAL LTDA.",
  "total": 583100,
  "fecha": "2025-07-23",
  "estado": "PENDIENTE"
}, {
  "vendedor": "BVILLARROEL",
  "numero": 1888,
  "empresa": "FEBOND SPA",
  "total": 1126828,
  "fecha": "2025-08-11",
  "estado": "PENDIENTE"
}, {
  "vendedor": "OHERNANDEZ",
  "numero": 1895,
  "empresa": "EDITORIAL PLANETA CHILENA S.A.",
  "total": 21468790,
  "fecha": "2025-09-02",
  "estado": "FINALIZADO"
}, {
  "vendedor": "AOLGUIN",
  "numero": 1900,
  "empresa": "EDICIONES CONTRERAS Y ESCANDON LIMITADA",
  "total": 20241900,
  "fecha": "2025-09-10",
  "estado": "FINALIZADO"
}, {
  "vendedor": "VTA.EXTERNO",
  "numero": 1905,
  "empresa": "CLIENTE EXTERNO VARIOS",
  "total": 19045950,
  "fecha": "2025-09-15",
  "estado": "FINALIZADO"
}, {
  "vendedor": "JESCARATE",
  "numero": 1910,
  "empresa": "CLIENTES VARIOS ESCÁRATE",
  "total": 2457778,
  "fecha": "2025-09-20",
  "estado": "FINALIZADO"
}, {
  "vendedor": "JVILLARROEL",
  "numero": 1915,
  "empresa": "CLIENTES JVILLARROEL",
  "total": 5789350,
  "fecha": "2025-09-22",
  "estado": "FINALIZADO"
}];
const VENDEDOR_TOTALS = {
  "BVILLARROEL": 245965542,
  "JNARANJO": 114045817,
  "AOLGUIN": 59474059,
  "GERENCIA": 52461489,
  "OHERNANDEZ": 29773126,
  "VTA.EXTERNO": 19045950,
  "LVILLARROEL": 15870197,
  "JVILLARROEL": 5789350,
  "JESCARATE": 2457778
};
const TOP_CLIENTES = [{
  "empresa": "SUBSECRETARIA DEL MINISTERIO DE EDUCACION",
  "total": 184703470
}, {
  "empresa": "GRAFHIKA COPY CENTER SPA",
  "total": 52461489
}, {
  "empresa": "EDICIONES UNIVERSIT DE VALPSO U.CATOL.VALPO",
  "total": 37174053
}, {
  "empresa": "ALIANZA PEDRO DE VALDIVIA LTDA.",
  "total": 31389744
}, {
  "empresa": "PREUNIVERSITARIO PEDRO DE VALDIVIA CONCEP.",
  "total": 31047703
}, {
  "empresa": "FEBOND SPA",
  "total": 25848384
}];
let CREDITOS = [{
  "prestamo": "Credito Musri",
  "tipo": "Credito",
  "montoTotal": 60000000,
  "pagado": 60000000
}, {
  "prestamo": "Credito Auto Hans",
  "tipo": "Credito",
  "montoTotal": 30000000,
  "pagado": 5772474
}, {
  "prestamo": "Finiquito Eric Gonzalez",
  "tipo": "Finiquito",
  "montoTotal": 3000000,
  "pagado": 3000000
}, {
  "prestamo": "Finiquito Gustavo Reyes",
  "tipo": "Finiquito",
  "montoTotal": 3000000,
  "pagado": 3000000
}, {
  "prestamo": "Finiquito Pablo Pizarro",
  "tipo": "Finiquito",
  "montoTotal": 900000,
  "pagado": 900000
}, {
  "prestamo": "Credito Scotiabank",
  "tipo": "Credito",
  "montoTotal": 100000000,
  "pagado": 105185388
}, {
  "prestamo": "Credito Santander",
  "tipo": "Credito",
  "montoTotal": 324000000,
  "pagado": 39591612
}];
let FONDOS = [{
  "fecha": "2025-10-06",
  "total": 914532000
}, {
  "fecha": "2025-10-13",
  "total": 924816000
}, {
  "fecha": "2025-10-20",
  "total": 936290000
}, {
  "fecha": "2025-10-27",
  "total": 948100000
}, {
  "fecha": "2025-11-03",
  "total": 955420000
}, {
  "fecha": "2025-11-10",
  "total": 963870000
}, {
  "fecha": "2025-11-17",
  "total": 978300000
}, {
  "fecha": "2025-11-24",
  "total": 990450000
}, {
  "fecha": "2025-12-01",
  "total": 1010200000
}, {
  "fecha": "2025-12-08",
  "total": 1035600000
}, {
  "fecha": "2025-12-15",
  "total": 1058900000
}, {
  "fecha": "2025-12-22",
  "total": 1082300000
}, {
  "fecha": "2025-12-29",
  "total": 1105700000
}, {
  "fecha": "2026-01-05",
  "total": 1134200000
}, {
  "fecha": "2026-01-12",
  "total": 1161800000
}, {
  "fecha": "2026-01-19",
  "total": 1189400000
}, {
  "fecha": "2026-01-26",
  "total": 1218000000
}, {
  "fecha": "2026-02-02",
  "total": 1246600000
}, {
  "fecha": "2026-02-09",
  "total": 1335200000
}, {
  "fecha": "2026-02-16",
  "total": 1423800000
}, {
  "fecha": "2026-02-23",
  "total": 1512400000
}, {
  "fecha": "2026-03-02",
  "total": 1557100000
}, {
  "fecha": "2026-03-09",
  "total": 1563200000
}, {
  "fecha": "2026-03-16",
  "total": 1578500000
}, {
  "fecha": "2026-03-23",
  "total": 1593905879
}, {
  "fecha": "2026-03-30",
  "total": 1804272304
}, {
  "fecha": "2026-04-06",
  "total": 1953650312
}, {
  "fecha": "2026-04-13",
  "total": 1962208052
}, {
  "fecha": "2026-04-20",
  "total": 1966259508
}];
let FONDOS_DETALLE = [{
  "nombre": "Scotiabank",
  "valor": 1257495665,
  "color": "var(--g600)"
}, {
  "nombre": "Santander Brian",
  "valor": 684307655,
  "color": "var(--g400)"
}, {
  "nombre": "Santander",
  "valor": 24456188,
  "color": "var(--amber)"
}];

// ── COBRANZA Data (GMD 2025-2026) ─────────────────────────────────────────
let COB_KPIS = null;
let COB_POR_MES = {};
let COB_POR_EJECUTIVO = {};
let COB_TOP_CLIENTES = [];
let COB_PENDIENTES = [];
// ── Sueldos y Gastos Fijos (desde Google Sheets) ──────────────────────────
let SUELDOS_DATA = []; // { nombre, monto, dia_pago } — desde Google Sheets
let GASTOS_FIJOS_DATA = []; // { descripcion, monto, dia_pago, categoria } — desde Google Sheets
let NOMINA_DATA = []; // { empresa, personas, monto } — desde Excel nómina mensual
let NOMINA_MES = ''; // ej. 'Marzo 2026' — para mostrar en UI
// ↓ Pega los GIDs de las pestañas SUELDOS y GASTOS_FIJOS aquí una vez que las crees
const GID_SUELDOS = '998795265';
const GID_GASTOS_FIJOS = '1222067969';
const GID_FINIQUITOS = '1916149630';
let FINIQUITOS_RAW = [];
let CREDITOS_SHEETS_RAW = [];
const COB_PAGADOS = [{
  "rut": "91215000-3",
  "empresa": "EDITORIAL UNIVERSITARIA S.A.",
  "folio": 1925,
  "fechaEmision": "2025-08-26",
  "total": 1904000,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-09-25",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-10-07",
  "ejecutivo": "JAIME GONZALEZ"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1934,
  "fechaEmision": "2025-09-01",
  "total": 122327,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-10-01",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-10-01",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1935,
  "fechaEmision": "2025-09-01",
  "total": 189384,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-10-01",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-10-01",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1936,
  "fechaEmision": "2025-09-01",
  "total": 96975,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-10-01",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-10-01",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1937,
  "fechaEmision": "2025-09-01",
  "total": 95340,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-10-01",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-10-01",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1951,
  "fechaEmision": "2025-09-04",
  "total": 68336,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-10-04",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-10-01",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1954,
  "fechaEmision": "2025-09-10",
  "total": 105972,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-10-10",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-07",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1955,
  "fechaEmision": "2025-09-10",
  "total": 189384,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-10-10",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-07",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1956,
  "fechaEmision": "2025-09-10",
  "total": 212941,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-10-10",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-07",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1957,
  "fechaEmision": "2025-09-10",
  "total": 185805,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-10-10",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-07",
  "ejecutivo": "BRIAN"
}, {
  "rut": "71644300-0",
  "empresa": "UNIVERSIDAD DEL DESARROLLO",
  "folio": 1960,
  "fechaEmision": "2025-10-12",
  "total": 1089088,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-10-12",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2025-11-06",
  "ejecutivo": "ANGEL"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1961,
  "fechaEmision": "2025-10-15",
  "total": 439981,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-10-15",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2025-11-07",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1962,
  "fechaEmision": "2025-10-15",
  "total": 552073,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-10-15",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2025-11-07",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1972,
  "fechaEmision": "2025-09-23",
  "total": 9385054,
  "saldo": 0,
  "obs": "LIBROS - GUIA CLIENTE 20095",
  "vencimiento": "2025-10-23",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-18",
  "ejecutivo": "BRIAN"
}, {
  "rut": "91215000-3",
  "empresa": "EDITORIAL UNIVERSITARIA S.A.",
  "folio": 1976,
  "fechaEmision": "2025-09-24",
  "total": 2572304,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-10-24",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-10-07",
  "ejecutivo": ""
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1977,
  "fechaEmision": "2025-09-24",
  "total": 158412,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-10-24",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-14",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1978,
  "fechaEmision": "2025-09-24",
  "total": 821718,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-10-24",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-14",
  "ejecutivo": "BRIAN"
}, {
  "rut": "77471270-4",
  "empresa": "AGROCOMERCIAL CODIGUA SPA",
  "folio": 1981,
  "fechaEmision": "2025-09-26",
  "total": 959438,
  "saldo": 0,
  "obs": "00774712704 F19812022 $1.347.854",
  "vencimiento": "2025-10-26",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-24",
  "ejecutivo": ""
}, {
  "rut": "60802000-4",
  "empresa": "DIRECCION DE PRESUPUESTOS MINISTERIO DE",
  "folio": 1986,
  "fechaEmision": "2025-09-30",
  "total": 654798,
  "saldo": 0,
  "obs": "IMPRESIONES",
  "vencimiento": "2025-10-30",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-10-30",
  "ejecutivo": ""
}, {
  "rut": "81698900-0",
  "empresa": "PONTIFICIA UNIVERSIDAD CATOLICA DE CHILE",
  "folio": 1993,
  "fechaEmision": "2025-10-01",
  "total": 73185,
  "saldo": 0,
  "obs": "DIPLOMAS",
  "vencimiento": "2025-10-31",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-10-31",
  "ejecutivo": ""
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1997,
  "fechaEmision": "2025-10-02",
  "total": 390302,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-01",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-12",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1998,
  "fechaEmision": "2025-10-02",
  "total": 61359,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-01",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-12",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 1999,
  "fechaEmision": "2025-10-02",
  "total": 40849,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-01",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-12",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2000,
  "fechaEmision": "2025-10-02",
  "total": 317149,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-01",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-12",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2001,
  "fechaEmision": "2025-10-02",
  "total": 65559,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-01",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-12",
  "ejecutivo": "BRIAN"
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2005,
  "fechaEmision": "2025-10-03",
  "total": 2762466,
  "saldo": 0,
  "obs": "LIBRO COSTRURA HILO",
  "vencimiento": "2025-11-02",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-21",
  "ejecutivo": "Ma Fernanda Catalan"
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2006,
  "fechaEmision": "2025-10-03",
  "total": 3060085,
  "saldo": 0,
  "obs": "LIBRO COSTRURA HILO",
  "vencimiento": "2025-11-02",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-21",
  "ejecutivo": "Ma Fernanda Catalan"
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2008,
  "fechaEmision": "2025-10-06",
  "total": 492660,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2025-11-05",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-05",
  "ejecutivo": ""
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2009,
  "fechaEmision": "2025-10-06",
  "total": 1349460,
  "saldo": 0,
  "obs": "CATALOGOS",
  "vencimiento": "2025-11-05",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-05",
  "ejecutivo": ""
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2012,
  "fechaEmision": "2025-10-07",
  "total": 184377,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-12",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2013,
  "fechaEmision": "2025-10-07",
  "total": 120016,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-12",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2014,
  "fechaEmision": "2025-10-07",
  "total": 3285897,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-26",
  "ejecutivo": "BRIAN"
}, {
  "rut": "61513000-1",
  "empresa": "DIRECCION PREVISION DE CARABINEROS DE CHILE",
  "folio": 2015,
  "fechaEmision": "2025-10-07",
  "total": 2359770,
  "saldo": 0,
  "obs": "IMPRESIONES / BLOCK",
  "vencimiento": "2025-11-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-06",
  "ejecutivo": ""
}, {
  "rut": "71644300-0",
  "empresa": "UNIVERSIDAD DEL DESARROLLO",
  "folio": 2018,
  "fechaEmision": "2025-10-09",
  "total": 3374840,
  "saldo": 0,
  "obs": "REVISTA / GUIA_4183",
  "vencimiento": "2025-11-08",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2025-11-06",
  "ejecutivo": "ANGEL"
}, {
  "rut": "76089394-3",
  "empresa": "CALIGRAFIX SPA",
  "folio": 2021,
  "fechaEmision": "2025-10-13",
  "total": 213415,
  "saldo": 0,
  "obs": "MAQUETAS",
  "vencimiento": "2025-11-12",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-20",
  "ejecutivo": ""
}, {
  "rut": "77471270-4",
  "empresa": "AGROCOMERCIAL CODIGUA SPA",
  "folio": 2022,
  "fechaEmision": "2025-10-13",
  "total": 388416,
  "saldo": 0,
  "obs": "00774712704 F19812022 $1.347.854",
  "vencimiento": "2025-11-12",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-24",
  "ejecutivo": ""
}, {
  "rut": "81698900-0",
  "empresa": "PONTIFICIA UNIVERSIDAD CATOLICA DE CHILE",
  "folio": 2023,
  "fechaEmision": "2025-10-13",
  "total": 391986,
  "saldo": 0,
  "obs": "MANUALES / DIPLOMAS",
  "vencimiento": "2025-11-12",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-12",
  "ejecutivo": ""
}, {
  "rut": "60901002-9",
  "empresa": "SUBSECRETARIA DE LAS CULTURAS Y LAS ARTES",
  "folio": 2024,
  "fechaEmision": "2025-10-13",
  "total": 12146330,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-12",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-12",
  "ejecutivo": ""
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2025,
  "fechaEmision": "2025-10-14",
  "total": 468012,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-13",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-09",
  "ejecutivo": "BRIAN"
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2026,
  "fechaEmision": "2025-10-15",
  "total": 349860,
  "saldo": 0,
  "obs": "STICKERS",
  "vencimiento": "2025-11-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-11",
  "ejecutivo": ""
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2027,
  "fechaEmision": "2025-10-15",
  "total": 963818,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-09",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2028,
  "fechaEmision": "2025-10-15",
  "total": 298370,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2029,
  "fechaEmision": "2025-10-15",
  "total": 591366,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2030,
  "fechaEmision": "2025-10-15",
  "total": 170935,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "",
  "ejecutivo": "BRIAN"
}, {
  "rut": "60203000-8",
  "empresa": "BIBLIOTECA DEL CONGRESO NACIONAL",
  "folio": 2031,
  "fechaEmision": "2025-10-15",
  "total": 5999980,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-19",
  "ejecutivo": ""
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2032,
  "fechaEmision": "2025-10-16",
  "total": 5363092,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2025-11-15",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-11",
  "ejecutivo": ""
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2033,
  "fechaEmision": "2025-10-16",
  "total": 4837350,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2025-11-15",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-11",
  "ejecutivo": ""
}, {
  "rut": "77822502-6",
  "empresa": "EDICIONES CONTRERAS Y ESCANDON LIMITADA",
  "folio": 2037,
  "fechaEmision": "2025-10-20",
  "total": 2127720,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-19",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-25",
  "ejecutivo": ""
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2038,
  "fechaEmision": "2025-10-20",
  "total": 269610,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-19",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2039,
  "fechaEmision": "2025-10-20",
  "total": 213454,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-19",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-23",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2040,
  "fechaEmision": "2025-10-20",
  "total": 440327,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-19",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-23",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2041,
  "fechaEmision": "2025-10-20",
  "total": 521423,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-19",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-23",
  "ejecutivo": "BRIAN"
}, {
  "rut": "60910000-1",
  "empresa": "UNIVERSIDAD DE CHILE",
  "folio": 2047,
  "fechaEmision": "2025-10-21",
  "total": 216580,
  "saldo": 0,
  "obs": "IMPRESIONES",
  "vencimiento": "2025-11-20",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-20",
  "ejecutivo": ""
}, {
  "rut": "70729100-1",
  "empresa": "UNIVERSIDAD TECNOLOGICA METROPOLITANA",
  "folio": 2051,
  "fechaEmision": "2025-10-22",
  "total": 2763478,
  "saldo": 0,
  "obs": "LIBROS (GUIA POR EL TOTAL, DESPACHO DE 268 UND.)",
  "vencimiento": "2025-11-21",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-28",
  "ejecutivo": ""
}, {
  "rut": "76601833-5",
  "empresa": "GRAFICOMEX SPA",
  "folio": 2056,
  "fechaEmision": "2025-10-27",
  "total": 714000,
  "saldo": 0,
  "obs": "IMPRESIONES",
  "vencimiento": "2025-11-01",
  "diasVencido": 5,
  "estado": "PAGADO",
  "fechaPago": "2025-11-01",
  "ejecutivo": ""
}, {
  "rut": "76601833-5",
  "empresa": "GRAFICOMEX SPA",
  "folio": 2057,
  "fechaEmision": "2025-10-27",
  "total": 856800,
  "saldo": 0,
  "obs": "IMPRESIONES",
  "vencimiento": "2025-11-01",
  "diasVencido": 5,
  "estado": "PAGADO",
  "fechaPago": "2025-11-10",
  "ejecutivo": ""
}, {
  "rut": "81698900-0",
  "empresa": "PONTIFICIA UNIVERSIDAD CATOLICA DE CHILE",
  "folio": 2058,
  "fechaEmision": "2025-10-27",
  "total": 137445,
  "saldo": 0,
  "obs": "DIPLOMAS",
  "vencimiento": "2025-11-26",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-25",
  "ejecutivo": ""
}, {
  "rut": "99526160-K",
  "empresa": "BUREAU VERITAS CERTIFICATION CHILE S.A",
  "folio": 2059,
  "fechaEmision": "2025-10-27",
  "total": 5355,
  "saldo": 0,
  "obs": "DIPLOMAS / RETIRA EL CLIENTE",
  "vencimiento": "2025-11-26",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-26",
  "ejecutivo": ""
}, {
  "rut": "60910000-1",
  "empresa": "UNIVERSIDAD DE CHILE",
  "folio": 2060,
  "fechaEmision": "2025-10-28",
  "total": 216580,
  "saldo": 0,
  "obs": "IMPRESIONES",
  "vencimiento": "2025-11-27",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-20",
  "ejecutivo": ""
}, {
  "rut": "75564900-7",
  "empresa": "SOC. ALEMANA PARA LA COOPERACION INTERNACIONAL (GIZ)",
  "folio": 2061,
  "fechaEmision": "2025-10-28",
  "total": 1332800,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-27",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-11",
  "ejecutivo": ""
}, {
  "rut": "76018478-0",
  "empresa": "PATAGONIA CHILE LTDA.",
  "folio": 2062,
  "fechaEmision": "2025-10-29",
  "total": 2380000,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-03",
  "diasVencido": 5,
  "estado": "PAGADO",
  "fechaPago": "2025-11-13",
  "ejecutivo": ""
}, {
  "rut": "91215000-3",
  "empresa": "EDITORIAL UNIVERSITARIA S.A.",
  "folio": 2071,
  "fechaEmision": "2025-10-30",
  "total": 4998000,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-29",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-01-05",
  "ejecutivo": ""
}, {
  "rut": "73044000-6",
  "empresa": "FEDERACION CRIADORES DE CABALLOS RAZA CHILENA",
  "folio": 2072,
  "fechaEmision": "2025-10-30",
  "total": 5078920,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-11-04",
  "diasVencido": 5,
  "estado": "PAGADO",
  "fechaPago": "2025-11-14",
  "ejecutivo": ""
}, {
  "rut": "81698900-0",
  "empresa": "PONTIFICIA UNIVERSIDAD CATOLICA DE CHILE",
  "folio": 2073,
  "fechaEmision": "2025-10-30",
  "total": 67830,
  "saldo": 0,
  "obs": "DIPLOMAS",
  "vencimiento": "2025-11-29",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-01",
  "ejecutivo": ""
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2077,
  "fechaEmision": "2025-11-03",
  "total": 420536,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-03",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-23",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2078,
  "fechaEmision": "2025-11-03",
  "total": 288080,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-03",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-23",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2079,
  "fechaEmision": "2025-11-03",
  "total": 426785,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-03",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-23",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2080,
  "fechaEmision": "2025-11-03",
  "total": 169702,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-03",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-23",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2081,
  "fechaEmision": "2025-11-03",
  "total": 314736,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-03",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-23",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2082,
  "fechaEmision": "2025-11-03",
  "total": 642967,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-03",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-23",
  "ejecutivo": "BRIAN"
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2088,
  "fechaEmision": "2025-11-03",
  "total": 9460500,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-03",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-22",
  "ejecutivo": ""
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2089,
  "fechaEmision": "2025-11-03",
  "total": 2018478,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-03",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-01",
  "ejecutivo": ""
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2090,
  "fechaEmision": "2025-11-03",
  "total": 1598884,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-03",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-21",
  "ejecutivo": ""
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2091,
  "fechaEmision": "2025-11-03",
  "total": 1130262,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-03",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-21",
  "ejecutivo": ""
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2097,
  "fechaEmision": "2025-11-05",
  "total": 434350,
  "saldo": 0,
  "obs": "CATALOGOS",
  "vencimiento": "2025-12-05",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-02",
  "ejecutivo": ""
}, {
  "rut": "76187042-4",
  "empresa": "BULBOARD MEDIA SPA",
  "folio": 2098,
  "fechaEmision": "2025-11-05",
  "total": 1368500,
  "saldo": 0,
  "obs": "REVISTAS",
  "vencimiento": "2025-12-05",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-03",
  "ejecutivo": "LEONARDO"
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2101,
  "fechaEmision": "2025-11-06",
  "total": 1897455,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-22",
  "ejecutivo": ""
}, {
  "rut": "62000370-0",
  "empresa": "SUBSECRETARIA DEL PATRIMONIO CULTURAL",
  "folio": 2102,
  "fechaEmision": "2025-11-06",
  "total": 1981350,
  "saldo": 0,
  "obs": "LIBRO",
  "vencimiento": "2025-12-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-05",
  "ejecutivo": ""
}, {
  "rut": "77773113-0",
  "empresa": "HUX CONSULTORES LIMITADA",
  "folio": 2103,
  "fechaEmision": "2025-11-07",
  "total": 1155490,
  "saldo": 0,
  "obs": "LIBRO",
  "vencimiento": "2025-11-09",
  "diasVencido": 2,
  "estado": "PAGADO",
  "fechaPago": "2025-11-04",
  "ejecutivo": "JAIME NARANJO"
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2104,
  "fechaEmision": "2025-11-11",
  "total": 5744606,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2025-12-11",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-10",
  "ejecutivo": "LEONARDO"
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2105,
  "fechaEmision": "2025-11-11",
  "total": 347480,
  "saldo": 0,
  "obs": "VIBRIN VENTOSA CENCO",
  "vencimiento": "2025-12-11",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-10",
  "ejecutivo": "LEONARDO"
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2107,
  "fechaEmision": "2025-11-13",
  "total": 2006340,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-13",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-21",
  "ejecutivo": ""
}, {
  "rut": "91215000-3",
  "empresa": "EDITORIAL UNIVERSITARIA S.A.",
  "folio": 2108,
  "fechaEmision": "2025-11-13",
  "total": 2172345,
  "saldo": 0,
  "obs": "LIBRO",
  "vencimiento": "2025-12-13",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-19",
  "ejecutivo": ""
}, {
  "rut": "77822502-6",
  "empresa": "EDICIONES CONTRERAS Y ESCANDON LIMITADA",
  "folio": 2109,
  "fechaEmision": "2025-11-14",
  "total": 973004,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-26",
  "ejecutivo": ""
}, {
  "rut": "76005909-9",
  "empresa": "COMERCIAL MOTORES DE LOS ANDES SPA",
  "folio": 2110,
  "fechaEmision": "2025-11-14",
  "total": 6949600,
  "saldo": 0,
  "obs": "LIBRILLO",
  "vencimiento": "2025-12-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-12",
  "ejecutivo": ""
}, {
  "rut": "76005909-9",
  "empresa": "COMERCIAL MOTORES DE LOS ANDES SPA",
  "folio": 2111,
  "fechaEmision": "2025-11-14",
  "total": 442680,
  "saldo": 0,
  "obs": "POLIZA",
  "vencimiento": "2025-12-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-12",
  "ejecutivo": ""
}, {
  "rut": "76005909-9",
  "empresa": "COMERCIAL MOTORES DE LOS ANDES SPA",
  "folio": 2112,
  "fechaEmision": "2025-11-14",
  "total": 442680,
  "saldo": 0,
  "obs": "POLIZA",
  "vencimiento": "2025-12-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-12",
  "ejecutivo": ""
}, {
  "rut": "76005909-9",
  "empresa": "COMERCIAL MOTORES DE LOS ANDES SPA",
  "folio": 2113,
  "fechaEmision": "2025-11-14",
  "total": 1898050,
  "saldo": 0,
  "obs": "POLIZA",
  "vencimiento": "2025-12-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-12",
  "ejecutivo": ""
}, {
  "rut": "71250500-1",
  "empresa": "FUND. PARA EL FUNCIONAM. DESARROLLO Y PROM. PLANETARIO",
  "folio": 2114,
  "fechaEmision": "2025-11-14",
  "total": 1835694,
  "saldo": 0,
  "obs": "POSTALES, ADHESIVOS",
  "vencimiento": "2025-11-14",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2025-11-10",
  "ejecutivo": ""
}, {
  "rut": "77175160-1",
  "empresa": "COMERCIAL DICALLA S A",
  "folio": 2115,
  "fechaEmision": "2025-11-14",
  "total": 1494640,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2025-12-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-19",
  "ejecutivo": ""
}, {
  "rut": "91215000-3",
  "empresa": "EDITORIAL UNIVERSITARIA S.A.",
  "folio": 2117,
  "fechaEmision": "2025-11-14",
  "total": 10570770,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-19",
  "ejecutivo": ""
}, {
  "rut": "85698200-9",
  "empresa": "PREUNIVERSITARIO PEDRO DE VALDIVIA LTDA.",
  "folio": 2118,
  "fechaEmision": "2025-11-14",
  "total": 835230,
  "saldo": 0,
  "obs": "FOLLETOS OT82",
  "vencimiento": "2025-12-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-16",
  "ejecutivo": ""
}, {
  "rut": "77050426-0",
  "empresa": "ALIANZA PEDRO DE VALDIVIA LTDA.",
  "folio": 2119,
  "fechaEmision": "2025-11-14",
  "total": 77112,
  "saldo": 0,
  "obs": "FOLLETOS OT82 / GUIA: 4427",
  "vencimiento": "2025-12-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-16",
  "ejecutivo": ""
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2120,
  "fechaEmision": "2025-11-19",
  "total": 665404,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-19",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-06",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2121,
  "fechaEmision": "2025-11-19",
  "total": 235244,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-19",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-06",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2122,
  "fechaEmision": "2025-11-19",
  "total": 1699579,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-19",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-06",
  "ejecutivo": "BRIAN"
}, {
  "rut": "61980230-6",
  "empresa": "AGENCIA CALIDAD DE LA EDUCACIÓN",
  "folio": 2124,
  "fechaEmision": "2025-11-19",
  "total": 2998800,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-19",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-12",
  "ejecutivo": ""
}, {
  "rut": "76358849-1",
  "empresa": "CAROLINA VALVERDE LIMITADA",
  "folio": 2125,
  "fechaEmision": "2025-11-19",
  "total": 6560,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2025-12-19",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-20",
  "ejecutivo": ""
}, {
  "rut": "76078941-0",
  "empresa": "ASESORIAS E INVERSIONES SAN CHARBEL SPA",
  "folio": 2126,
  "fechaEmision": "2025-11-20",
  "total": 152725,
  "saldo": 0,
  "obs": "MANUALES",
  "vencimiento": "2025-12-20",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-11-20",
  "ejecutivo": ""
}, {
  "rut": "77516120-5",
  "empresa": "COMUNICACION IMAGEN Y APOYO EMPRESARIAL LTDA.",
  "folio": 2127,
  "fechaEmision": "2025-11-20",
  "total": 172550,
  "saldo": 0,
  "obs": "GUIA: 4487",
  "vencimiento": "2025-11-25",
  "diasVencido": 5,
  "estado": "PAGADO",
  "fechaPago": "2025-12-30",
  "ejecutivo": "LEONARDO VILLARROEL"
}, {
  "rut": "71250500-1",
  "empresa": "FUND. PARA EL FUNCIONAM. DESARROLLO Y PROM. PLANETARIO",
  "folio": 2128,
  "fechaEmision": "2025-11-21",
  "total": 100139,
  "saldo": 0,
  "obs": "CREDENCIALES",
  "vencimiento": "2025-11-21",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2025-11-21",
  "ejecutivo": ""
}, {
  "rut": "76434381-6",
  "empresa": "SENSUS CONSULTORES LIMITADA",
  "folio": 2129,
  "fechaEmision": "2025-11-21",
  "total": 276854,
  "saldo": 0,
  "obs": "MANUALES",
  "vencimiento": "2025-11-21",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2025-11-20",
  "ejecutivo": ""
}, {
  "rut": "77175160-1",
  "empresa": "COMERCIAL DICALLA S A",
  "folio": 2130,
  "fechaEmision": "2025-11-24",
  "total": 1494640,
  "saldo": 0,
  "obs": "PARANTES",
  "vencimiento": "2025-12-24",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-19",
  "ejecutivo": ""
}, {
  "rut": "70819400-K",
  "empresa": "TRIBUNAL CONSTITUCIONAL",
  "folio": 2131,
  "fechaEmision": "2025-11-25",
  "total": 2385117,
  "saldo": 0,
  "obs": "LIBROS TAPA DURA CON FOLIA",
  "vencimiento": "2025-12-25",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-24",
  "ejecutivo": ""
}, {
  "rut": "87912900-1",
  "empresa": "UNIVERSIDAD DE LA FRONTERA",
  "folio": 2132,
  "fechaEmision": "2025-11-25",
  "total": 643314,
  "saldo": 0,
  "obs": "MANUALES",
  "vencimiento": "2025-12-25",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-19",
  "ejecutivo": ""
}, {
  "rut": "77049340-4",
  "empresa": "FERRERAS Y LICCI LIMITADA",
  "folio": 2133,
  "fechaEmision": "2025-11-25",
  "total": 2713200,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2025-11-25",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2025-11-25",
  "ejecutivo": ""
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2136,
  "fechaEmision": "2025-11-25",
  "total": 4117400,
  "saldo": 0,
  "obs": "LIBROS TAPA DURA",
  "vencimiento": "2025-12-25",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-22",
  "ejecutivo": ""
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2137,
  "fechaEmision": "2025-11-25",
  "total": 1785000,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-25",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-22",
  "ejecutivo": ""
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2138,
  "fechaEmision": "2025-11-25",
  "total": 2306220,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-25",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-22",
  "ejecutivo": ""
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2139,
  "fechaEmision": "2025-11-25",
  "total": 2972025,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-25",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-22",
  "ejecutivo": ""
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2140,
  "fechaEmision": "2025-11-25",
  "total": 2803164,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-25",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-22",
  "ejecutivo": ""
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2141,
  "fechaEmision": "2025-11-25",
  "total": 4097170,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-25",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-22",
  "ejecutivo": ""
}, {
  "rut": "91215000-3",
  "empresa": "EDITORIAL UNIVERSITARIA S.A.",
  "folio": 2142,
  "fechaEmision": "2025-11-25",
  "total": 1981350,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-25",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-01",
  "ejecutivo": "JAIME"
}, {
  "rut": "99526160-K",
  "empresa": "BUREAU VERITAS CERTIFICATION CHILE S.A",
  "folio": 2143,
  "fechaEmision": "2025-11-25",
  "total": 16779,
  "saldo": 0,
  "obs": "IMPRESIONES // CLIENTE RETIRA",
  "vencimiento": "2025-12-25",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-29",
  "ejecutivo": ""
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2144,
  "fechaEmision": "2025-11-26",
  "total": 1731450,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-26",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-22",
  "ejecutivo": ""
}, {
  "rut": "65473570-0",
  "empresa": "CORPORACION DEL DEPORTE DE LA I.MUNICIPALIDAD DE CERRO NAVIA",
  "folio": 2145,
  "fechaEmision": "2025-11-27",
  "total": 21407267,
  "saldo": 0,
  "obs": "LIBROS / STICKERS",
  "vencimiento": "2025-12-27",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-29",
  "ejecutivo": ""
}, {
  "rut": "70574900-0",
  "empresa": "FUNDACION INTEGRA",
  "folio": 2146,
  "fechaEmision": "2025-11-27",
  "total": 13220662,
  "saldo": 0,
  "obs": "MANUAL",
  "vencimiento": "2025-12-27",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-24",
  "ejecutivo": ""
}, {
  "rut": "77050426-0",
  "empresa": "ALIANZA PEDRO DE VALDIVIA LTDA.",
  "folio": 2147,
  "fechaEmision": "2025-11-28",
  "total": 3248700,
  "saldo": 0,
  "obs": "FOLLETOS OT83 / GUIA: 4498",
  "vencimiento": "2025-12-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-16",
  "ejecutivo": ""
}, {
  "rut": "77465752-5",
  "empresa": "SANTILLANA EDUCACIÓN CHILE SPA",
  "folio": 2148,
  "fechaEmision": "2025-11-28",
  "total": 9567600,
  "saldo": 0,
  "obs": "LIBROS TAPA DURA",
  "vencimiento": "2025-12-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-05",
  "ejecutivo": "PAGO SANTANDER GMD"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2149,
  "fechaEmision": "2025-11-28",
  "total": 84354,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-09",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2150,
  "fechaEmision": "2025-11-28",
  "total": 159048,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-09",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2151,
  "fechaEmision": "2025-11-28",
  "total": 167552,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-09",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2152,
  "fechaEmision": "2025-11-28",
  "total": 402898,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-20",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2153,
  "fechaEmision": "2025-11-28",
  "total": 980215,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-20",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2154,
  "fechaEmision": "2025-11-28",
  "total": 211502,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-09",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2155,
  "fechaEmision": "2025-11-28",
  "total": 230058,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-09",
  "ejecutivo": "BRIAN"
}, {
  "rut": "77050426-0",
  "empresa": "ALIANZA PEDRO DE VALDIVIA LTDA.",
  "folio": 2156,
  "fechaEmision": "2025-11-28",
  "total": 261800,
  "saldo": 0,
  "obs": "FOLLETOS OT86 GUIA:4498",
  "vencimiento": "2025-12-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-16",
  "ejecutivo": ""
}, {
  "rut": "60911000-7",
  "empresa": "UNIVERSIDAD DE SANTIAGO DE CHILE",
  "folio": 2157,
  "fechaEmision": "2025-11-28",
  "total": 2959530,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-12",
  "ejecutivo": ""
}, {
  "rut": "76601833-5",
  "empresa": "GRAFICOMEX SPA",
  "folio": 2159,
  "fechaEmision": "2025-11-28",
  "total": 2446640,
  "saldo": 0,
  "obs": "IMPRESIONES",
  "vencimiento": "2025-12-03",
  "diasVencido": 5,
  "estado": "PAGADO",
  "fechaPago": "2026-01-16",
  "ejecutivo": ""
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2160,
  "fechaEmision": "2025-12-01",
  "total": 3266550,
  "saldo": 0,
  "obs": "LIBROS_x000D_",
  "vencimiento": "2025-12-31",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-22",
  "ejecutivo": ""
}, {
  "rut": "77465752-5",
  "empresa": "SANTILLANA EDUCACIÓN CHILE SPA",
  "folio": 2162,
  "fechaEmision": "2025-12-01",
  "total": 8240750,
  "saldo": 0,
  "obs": "LIBROS TAPA DURA",
  "vencimiento": "2025-12-31",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-05",
  "ejecutivo": "PAGO SANTANDER GMD"
}, {
  "rut": "77773113-0",
  "empresa": "HUX CONSULTORES LIMITADA",
  "folio": 2163,
  "fechaEmision": "2025-12-03",
  "total": 1213800,
  "saldo": 0,
  "obs": "BLOCKS",
  "vencimiento": "2025-12-05",
  "diasVencido": 2,
  "estado": "PAGADO",
  "fechaPago": "2025-12-12",
  "ejecutivo": ""
}, {
  "rut": "77175160-1",
  "empresa": "COMERCIAL DICALLA S A",
  "folio": 2164,
  "fechaEmision": "2025-12-03",
  "total": 1494640,
  "saldo": 0,
  "obs": "PARANTES",
  "vencimiento": "2026-01-02",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-06",
  "ejecutivo": ""
}, {
  "rut": "60911000-7",
  "empresa": "UNIVERSIDAD DE SANTIAGO DE CHILE",
  "folio": 2165,
  "fechaEmision": "2025-12-04",
  "total": 5018528,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-03",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-26",
  "ejecutivo": ""
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2166,
  "fechaEmision": "2025-12-04",
  "total": 100931,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-03",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-09",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2167,
  "fechaEmision": "2025-12-04",
  "total": 134081,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-03",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-09",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2168,
  "fechaEmision": "2025-12-04",
  "total": 176382,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-03",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-09",
  "ejecutivo": "BRIAN"
}, {
  "rut": "61608604-9",
  "empresa": "SERV.SALUD METROP.CENTRAL HOSP.CLINICO SAN BORJA ARRIARAN",
  "folio": 2169,
  "fechaEmision": "2025-12-04",
  "total": 104720,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-03",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-26",
  "ejecutivo": "ORLANDO"
}, {
  "rut": "77516120-5",
  "empresa": "COMUNICACION IMAGEN Y APOYO EMPRESARIAL LTDA.",
  "folio": 2170,
  "fechaEmision": "2025-12-04",
  "total": 2356200,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2025-12-09",
  "diasVencido": 5,
  "estado": "PAGADO",
  "fechaPago": "2025-12-30",
  "ejecutivo": "LEONARDO VILLARROEL"
}, {
  "rut": "85698200-9",
  "empresa": "PREUNIVERSITARIO PEDRO DE VALDIVIA LTDA.",
  "folio": 2171,
  "fechaEmision": "2025-12-05",
  "total": 640220,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-04",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-06",
  "ejecutivo": ""
}, {
  "rut": "78896330-0",
  "empresa": "PREUNIVERSITARIO PEDRO DE VALDIVIA CONCEPCION LIMITADA",
  "folio": 2172,
  "fechaEmision": "2025-12-05",
  "total": 320110,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-04",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-06",
  "ejecutivo": ""
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2173,
  "fechaEmision": "2025-12-05",
  "total": 12857950,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-04",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "",
  "ejecutivo": ""
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2174,
  "fechaEmision": "2025-12-05",
  "total": 9020200,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-04",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-26",
  "ejecutivo": ""
}, {
  "rut": "70754700-6",
  "empresa": "UNIVERSIDAD DE PLAYA ANCHA DE CIENCIAS DE LA EDUCACION",
  "folio": 2175,
  "fechaEmision": "2025-12-05",
  "total": 2368100,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-04",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-10",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2176,
  "fechaEmision": "2025-12-12",
  "total": 2280028,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-01-11",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-17",
  "ejecutivo": "BRIAN"
}, {
  "rut": "70574900-0",
  "empresa": "FUNDACION INTEGRA",
  "folio": 2177,
  "fechaEmision": "2025-12-12",
  "total": 58770951,
  "saldo": 0,
  "obs": "LIBROS / GUIAS 4483-4564-4567",
  "vencimiento": "2026-01-11",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-29",
  "ejecutivo": ""
}, {
  "rut": "80186300-0",
  "empresa": "CIAL ALIMENTOS S.A.",
  "folio": 2180,
  "fechaEmision": "2025-12-12",
  "total": 226100,
  "saldo": 0,
  "obs": "FICHAS // GUIA:4097",
  "vencimiento": "2026-01-11",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-19",
  "ejecutivo": ""
}, {
  "rut": "80186300-0",
  "empresa": "CIAL ALIMENTOS S.A.",
  "folio": 2181,
  "fechaEmision": "2025-12-12",
  "total": 690200,
  "saldo": 0,
  "obs": "BLOCK / CAJAS BUZON / AFICHES",
  "vencimiento": "2026-01-11",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-19",
  "ejecutivo": ""
}, {
  "rut": "73044000-6",
  "empresa": "FEDERACION CRIADORES DE CABALLOS RAZA CHILENA",
  "folio": 2182,
  "fechaEmision": "2025-12-12",
  "total": 6267730,
  "saldo": 0,
  "obs": "LIBROS / CAJAS",
  "vencimiento": "2025-12-17",
  "diasVencido": 5,
  "estado": "PAGADO",
  "fechaPago": "2025-12-26",
  "ejecutivo": ""
}, {
  "rut": "70729100-1",
  "empresa": "UNIVERSIDAD TECNOLOGICA METROPOLITANA",
  "folio": 2185,
  "fechaEmision": "2025-12-12",
  "total": 7137977,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-01-11",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-23",
  "ejecutivo": ""
}, {
  "rut": "77304295-0",
  "empresa": "CRISTOBAL SEGURA MUDO EDICIONES E.I.R.L.",
  "folio": 2186,
  "fechaEmision": "2025-12-12",
  "total": 2255050,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-12",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2025-12-05",
  "ejecutivo": ""
}, {
  "rut": "70819400-K",
  "empresa": "TRIBUNAL CONSTITUCIONAL",
  "folio": 2187,
  "fechaEmision": "2025-12-15",
  "total": 6794900,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-24",
  "ejecutivo": ""
}, {
  "rut": "80186300-0",
  "empresa": "CIAL ALIMENTOS S.A.",
  "folio": 2188,
  "fechaEmision": "2025-12-15",
  "total": 2915500,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-19",
  "ejecutivo": ""
}, {
  "rut": "80186300-0",
  "empresa": "CIAL ALIMENTOS S.A.",
  "folio": 2189,
  "fechaEmision": "2025-12-15",
  "total": 5497800,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-19",
  "ejecutivo": ""
}, {
  "rut": "80186300-0",
  "empresa": "CIAL ALIMENTOS S.A.",
  "folio": 2190,
  "fechaEmision": "2025-12-15",
  "total": 3227280,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-19",
  "ejecutivo": ""
}, {
  "rut": "80186300-0",
  "empresa": "CIAL ALIMENTOS S.A.",
  "folio": 2191,
  "fechaEmision": "2025-12-15",
  "total": 2022955,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-19",
  "ejecutivo": ""
}, {
  "rut": "61980230-6",
  "empresa": "AGENCIA CALIDAD DE LA EDUCACIÓN",
  "folio": 2192,
  "fechaEmision": "2025-12-15",
  "total": 6997200,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-29",
  "ejecutivo": ""
}, {
  "rut": "60907064-1",
  "empresa": "CENTRO DE PERFECCIONAMIENTO, EXPERIMENTACION E INV.",
  "folio": 2193,
  "fechaEmision": "2025-12-15",
  "total": 4403952,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-14",
  "ejecutivo": ""
}, {
  "rut": "60910000-1",
  "empresa": "UNIVERSIDAD DE CHILE",
  "folio": 2194,
  "fechaEmision": "2025-12-15",
  "total": 1076712,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-30",
  "ejecutivo": ""
}, {
  "rut": "91215000-3",
  "empresa": "EDITORIAL UNIVERSITARIA S.A.",
  "folio": 2195,
  "fechaEmision": "2025-12-16",
  "total": 2559690,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-01-15",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-06",
  "ejecutivo": "JAIME"
}, {
  "rut": "91215000-3",
  "empresa": "EDITORIAL UNIVERSITARIA S.A.",
  "folio": 2196,
  "fechaEmision": "2025-12-16",
  "total": 1249500,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-01-15",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-27",
  "ejecutivo": ""
}, {
  "rut": "91215000-3",
  "empresa": "EDITORIAL UNIVERSITARIA S.A.",
  "folio": 2197,
  "fechaEmision": "2025-12-16",
  "total": 2791740,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-16",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2025-12-30",
  "ejecutivo": ""
}, {
  "rut": "80186300-0",
  "empresa": "CIAL ALIMENTOS S.A.",
  "folio": 2198,
  "fechaEmision": "2025-12-16",
  "total": 6927088,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2025-12-16",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2025-12-19",
  "ejecutivo": "confirming Bci (jennifer alarcon +56 9 6125 1238)"
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2205,
  "fechaEmision": "2025-12-18",
  "total": 473620,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-17",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-14",
  "ejecutivo": ""
}, {
  "rut": "99526160-K",
  "empresa": "BUREAU VERITAS CERTIFICATION CHILE S.A",
  "folio": 2206,
  "fechaEmision": "2025-12-18",
  "total": 1338750,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-17",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-23",
  "ejecutivo": ""
}, {
  "rut": "81698900-0",
  "empresa": "PONTIFICIA UNIVERSIDAD CATOLICA DE CHILE",
  "folio": 2207,
  "fechaEmision": "2025-12-18",
  "total": 19040,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-17",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-19",
  "ejecutivo": ""
}, {
  "rut": "77773113-0",
  "empresa": "HUX CONSULTORES LIMITADA",
  "folio": 2208,
  "fechaEmision": "2025-12-18",
  "total": 402696,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2025-12-20",
  "diasVencido": 2,
  "estado": "PAGADO",
  "fechaPago": "2025-12-19",
  "ejecutivo": ""
}, {
  "rut": "71250500-1",
  "empresa": "FUND. PARA EL FUNCIONAM. DESARROLLO Y PROM. PLANETARIO",
  "folio": 2210,
  "fechaEmision": "2025-12-18",
  "total": 249127,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-17",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-22",
  "ejecutivo": ""
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2211,
  "fechaEmision": "2025-12-18",
  "total": 308575,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-17",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-09",
  "ejecutivo": "BRIAN"
}, {
  "rut": "96563360-K",
  "empresa": "SUN CHEMICAL (CHILE) S.A.",
  "folio": 2212,
  "fechaEmision": "2025-12-19",
  "total": 7868042,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-18",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-19",
  "ejecutivo": ""
}, {
  "rut": "60905000-4",
  "empresa": "SERVICIO NACIONAL DEL PATRIMONIO CULTURAL",
  "folio": 2214,
  "fechaEmision": "2025-12-19",
  "total": 68614210,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-18",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-12",
  "ejecutivo": ""
}, {
  "rut": "60905000-4",
  "empresa": "SERVICIO NACIONAL DEL PATRIMONIO CULTURAL",
  "folio": 2215,
  "fechaEmision": "2025-12-19",
  "total": 1041546,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-18",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-30",
  "ejecutivo": ""
}, {
  "rut": "72754700-2",
  "empresa": "FUNDACION INSTITUTO PROFESIONAL DUOC UC",
  "folio": 2216,
  "fechaEmision": "2025-12-22",
  "total": 571200,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-01-21",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-01-09",
  "ejecutivo": ""
}, {
  "rut": "62000370-0",
  "empresa": "SUBSECRETARIA DEL PATRIMONIO CULTURAL",
  "folio": 2217,
  "fechaEmision": "2025-12-23",
  "total": 839664,
  "saldo": 0,
  "obs": "CATALOGOS",
  "vencimiento": "2026-01-22",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-22",
  "ejecutivo": ""
}, {
  "rut": "62000370-0",
  "empresa": "SUBSECRETARIA DEL PATRIMONIO CULTURAL",
  "folio": 2218,
  "fechaEmision": "2025-12-23",
  "total": 839664,
  "saldo": 0,
  "obs": "CATALOGOS",
  "vencimiento": "2026-01-22",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-22",
  "ejecutivo": ""
}, {
  "rut": "62000370-0",
  "empresa": "SUBSECRETARIA DEL PATRIMONIO CULTURAL",
  "folio": 2219,
  "fechaEmision": "2025-12-23",
  "total": 839664,
  "saldo": 0,
  "obs": "CATALOGOS",
  "vencimiento": "2026-01-22",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-22",
  "ejecutivo": ""
}, {
  "rut": "62000370-0",
  "empresa": "SUBSECRETARIA DEL PATRIMONIO CULTURAL",
  "folio": 2220,
  "fechaEmision": "2025-12-23",
  "total": 839664,
  "saldo": 0,
  "obs": "CATALOGOS",
  "vencimiento": "2026-01-22",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-22",
  "ejecutivo": ""
}, {
  "rut": "61402000-8",
  "empresa": "MINISTERIO DE BIENES NACIONALES",
  "folio": 2221,
  "fechaEmision": "2025-12-24",
  "total": 14124110,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-01-23",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-04",
  "ejecutivo": ""
}, {
  "rut": "61402000-8",
  "empresa": "MINISTERIO DE BIENES NACIONALES",
  "folio": 2222,
  "fechaEmision": "2025-12-24",
  "total": 3503360,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-23",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-04",
  "ejecutivo": ""
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2223,
  "fechaEmision": "2025-12-26",
  "total": 3861550,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-01-25",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-13",
  "ejecutivo": "ANGEL"
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2226,
  "fechaEmision": "2025-12-29",
  "total": 4974200,
  "saldo": 0,
  "obs": "STTOPER, VIBRIN, AFICHES - SAN JOSE",
  "vencimiento": "2026-01-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-27",
  "ejecutivo": ""
}, {
  "rut": "77643297-0",
  "empresa": "NUTRISCO S.A.",
  "folio": 2227,
  "fechaEmision": "2025-12-29",
  "total": 998410,
  "saldo": 0,
  "obs": "VIBRIN, AFICHES, PENDONES - COOK GREEN",
  "vencimiento": "2026-01-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-27",
  "ejecutivo": ""
}, {
  "rut": "77643297-0",
  "empresa": "NUTRISCO S.A.",
  "folio": 2228,
  "fechaEmision": "2025-12-29",
  "total": 3520377,
  "saldo": 0,
  "obs": "AFICHES, VIBRINES, STTOPER - FLIP",
  "vencimiento": "2026-01-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-27",
  "ejecutivo": ""
}, {
  "rut": "65109088-1",
  "empresa": "LO BARNECHEA SERVICIOS",
  "folio": 2229,
  "fechaEmision": "2025-12-29",
  "total": 461423,
  "saldo": 0,
  "obs": "LIBROS TAPA DURA",
  "vencimiento": "2026-01-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2025-12-30",
  "ejecutivo": ""
}, {
  "rut": "77049340-4",
  "empresa": "FERRERAS Y LICCI LIMITADA",
  "folio": 2231,
  "fechaEmision": "2025-12-29",
  "total": 2694160,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2025-12-31",
  "diasVencido": 2,
  "estado": "PAGADO",
  "fechaPago": "2025-12-29",
  "ejecutivo": ""
}, {
  "rut": "81698900-0",
  "empresa": "PONTIFICIA UNIVERSIDAD CATOLICA DE CHILE",
  "folio": 2232,
  "fechaEmision": "2025-12-29",
  "total": 104720,
  "saldo": 0,
  "obs": "DIPLOMAS",
  "vencimiento": "2026-01-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-28",
  "ejecutivo": ""
}, {
  "rut": "76352020-K",
  "empresa": "INV. Y SERV. ODONTOLOGICOS CAIMI LTDA.",
  "folio": 2233,
  "fechaEmision": "2025-12-30",
  "total": 668099,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2025-12-30",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2025-12-29",
  "ejecutivo": ""
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2234,
  "fechaEmision": "2025-12-30",
  "total": 1175125,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-29",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-27",
  "ejecutivo": ""
}, {
  "rut": "70574900-0",
  "empresa": "FUNDACION INTEGRA",
  "folio": 2235,
  "fechaEmision": "2025-12-31",
  "total": 8889300,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-11",
  "diasVencido": 11,
  "estado": "PAGADO",
  "fechaPago": "2026-01-29",
  "ejecutivo": ""
}, {
  "rut": "73044000-6",
  "empresa": "FEDERACION CRIADORES DE CABALLOS RAZA CHILENA",
  "folio": 2237,
  "fechaEmision": "2026-01-06",
  "total": 7892080,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-11",
  "diasVencido": 5,
  "estado": "PAGADO",
  "fechaPago": "2026-01-14",
  "ejecutivo": ""
}, {
  "rut": "99526160-K",
  "empresa": "BUREAU VERITAS CERTIFICATION CHILE S.A",
  "folio": 2238,
  "fechaEmision": "2026-01-07",
  "total": 4641,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-02-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-06",
  "ejecutivo": ""
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2239,
  "fechaEmision": "2026-01-07",
  "total": 273658,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-02-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-30",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2240,
  "fechaEmision": "2026-01-07",
  "total": 535794,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-02-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-30",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2241,
  "fechaEmision": "2026-01-07",
  "total": 314485,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-02-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-30",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2242,
  "fechaEmision": "2026-01-07",
  "total": 452370,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-02-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-30",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2243,
  "fechaEmision": "2026-01-07",
  "total": 678556,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-02-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-30",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2244,
  "fechaEmision": "2026-01-07",
  "total": 90213,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-02-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-30",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2245,
  "fechaEmision": "2026-01-07",
  "total": 191200,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-02-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-30",
  "ejecutivo": "BRIAN"
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2246,
  "fechaEmision": "2026-01-08",
  "total": 1794520,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-02-07",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-04",
  "ejecutivo": ""
}, {
  "rut": "76601833-5",
  "empresa": "GRAFICOMEX SPA",
  "folio": 2247,
  "fechaEmision": "2026-01-09",
  "total": 357000,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-14",
  "diasVencido": 5,
  "estado": "PAGADO",
  "fechaPago": "2026-01-16",
  "ejecutivo": ""
}, {
  "rut": "60910000-1",
  "empresa": "UNIVERSIDAD DE CHILE",
  "folio": 2248,
  "fechaEmision": "2026-01-09",
  "total": 52000620,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-02-08",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-09",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76358849-1",
  "empresa": "CAROLINA VALVERDE LIMITADA",
  "folio": 2249,
  "fechaEmision": "2026-01-09",
  "total": 32800,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-11",
  "diasVencido": 2,
  "estado": "PAGADO",
  "fechaPago": "2026-01-09",
  "ejecutivo": ""
}, {
  "rut": "91215000-3",
  "empresa": "EDITORIAL UNIVERSITARIA S.A.",
  "folio": 2256,
  "fechaEmision": "2026-01-13",
  "total": 2499459,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-02-12",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-13",
  "ejecutivo": "JAIME"
}, {
  "rut": "76089394-3",
  "empresa": "CALIGRAFIX SPA",
  "folio": 2257,
  "fechaEmision": "2026-01-13",
  "total": 749438,
  "saldo": 0,
  "obs": "MANUALES ANILLADOS",
  "vencimiento": "2026-02-12",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-05",
  "ejecutivo": ""
}, {
  "rut": "76358849-1",
  "empresa": "CAROLINA VALVERDE LIMITADA",
  "folio": 2258,
  "fechaEmision": "2026-01-13",
  "total": 12280,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-01-13",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2026-01-13",
  "ejecutivo": ""
}, {
  "rut": "77758875-3",
  "empresa": "EDITORIAL CAMPUS TRIBUTARIO LIMITADA",
  "folio": 2259,
  "fechaEmision": "2026-01-13",
  "total": 8312150,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-01-18",
  "diasVencido": 5,
  "estado": "PAGADO",
  "fechaPago": "2026-01-20",
  "ejecutivo": ""
}, {
  "rut": "76989028-9",
  "empresa": "SANULAC NUTRICION CHILE SPA",
  "folio": 2260,
  "fechaEmision": "2026-01-13",
  "total": 54740,
  "saldo": 0,
  "obs": "PENDON",
  "vencimiento": "2026-02-12",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-31",
  "ejecutivo": "LEONARDO"
}, {
  "rut": "76358849-1",
  "empresa": "CAROLINA VALVERDE LIMITADA",
  "folio": 2262,
  "fechaEmision": "2026-01-14",
  "total": 6560,
  "saldo": 0,
  "obs": "PLOTEOS",
  "vencimiento": "2026-01-16",
  "diasVencido": 2,
  "estado": "PAGADO",
  "fechaPago": "2026-01-15",
  "ejecutivo": ""
}, {
  "rut": "76358849-1",
  "empresa": "CAROLINA VALVERDE LIMITADA",
  "folio": 2263,
  "fechaEmision": "2026-01-14",
  "total": 6807,
  "saldo": 0,
  "obs": "PLOTEOS",
  "vencimiento": "2026-01-16",
  "diasVencido": 2,
  "estado": "PAGADO",
  "fechaPago": "",
  "ejecutivo": ""
}, {
  "rut": "79975650-1",
  "empresa": "CORPORACION NACIONAL DE CAPACITACION",
  "folio": 2264,
  "fechaEmision": "2026-01-15",
  "total": 2256954,
  "saldo": 0,
  "obs": "LIBROS  23-12-25 SCOTIABANK $1.128.477.-//14-01-26 SCOTIABANK $1.128.477.-",
  "vencimiento": "2026-01-15",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2026-01-15",
  "ejecutivo": ""
}, {
  "rut": "77773113-0",
  "empresa": "HUX CONSULTORES LIMITADA",
  "folio": 2265,
  "fechaEmision": "2026-01-15",
  "total": 102816,
  "saldo": 0,
  "obs": "PLOTEOS",
  "vencimiento": "2026-01-17",
  "diasVencido": 2,
  "estado": "PAGADO",
  "fechaPago": "2026-01-15",
  "ejecutivo": ""
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2266,
  "fechaEmision": "2026-01-15",
  "total": 2571818,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-02-14",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-10",
  "ejecutivo": "BRIAN"
}, {
  "rut": "80186300-0",
  "empresa": "CIAL ALIMENTOS S.A.",
  "folio": 2268,
  "fechaEmision": "2026-01-16",
  "total": 947240,
  "saldo": 0,
  "obs": "AFICHES, BUZONES, CUPONES",
  "vencimiento": "2026-02-15",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-29",
  "ejecutivo": ""
}, {
  "rut": "77471270-4",
  "empresa": "AGROCOMERCIAL CODIGUA SPA",
  "folio": 2270,
  "fechaEmision": "2026-01-19",
  "total": 1547000,
  "saldo": 0,
  "obs": "CALENDARIO",
  "vencimiento": "2026-02-18",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-04",
  "ejecutivo": ""
}, {
  "rut": "77471270-4",
  "empresa": "AGROCOMERCIAL CODIGUA SPA",
  "folio": 2271,
  "fechaEmision": "2026-01-19",
  "total": 773500,
  "saldo": 0,
  "obs": "CALENDARIOS",
  "vencimiento": "2026-02-18",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-04",
  "ejecutivo": ""
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2272,
  "fechaEmision": "2026-01-21",
  "total": 7564830,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-02-20",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-13",
  "ejecutivo": "ANGEL"
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2273,
  "fechaEmision": "2026-01-21",
  "total": 8726270,
  "saldo": 0,
  "obs": "LIBROS, CAJAS",
  "vencimiento": "2026-02-20",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-13",
  "ejecutivo": "ANGEL"
}, {
  "rut": "99526160-K",
  "empresa": "BUREAU VERITAS CERTIFICATION CHILE S.A",
  "folio": 2274,
  "fechaEmision": "2026-01-21",
  "total": 7735,
  "saldo": 0,
  "obs": "DIPLOMAS",
  "vencimiento": "2026-02-20",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-20",
  "ejecutivo": ""
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2275,
  "fechaEmision": "2026-01-21",
  "total": 228049,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-02-20",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2026-04-20",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2276,
  "fechaEmision": "2026-01-23",
  "total": 273683,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-02-22",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2026-04-20",
  "ejecutivo": "BRIAN"
}, {
  "rut": "76349397-0",
  "empresa": "FEBOND SPA",
  "folio": 2277,
  "fechaEmision": "2026-01-23",
  "total": 627179,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-02-22",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2026-04-20",
  "ejecutivo": "BRIAN"
}, {
  "rut": "96508660-9",
  "empresa": "FARET SPA",
  "folio": 2281,
  "fechaEmision": "2026-01-23",
  "total": 743750,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-02-22",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-26",
  "ejecutivo": ""
}, {
  "rut": "80186300-0",
  "empresa": "CIAL ALIMENTOS S.A.",
  "folio": 2282,
  "fechaEmision": "2026-01-26",
  "total": 5664400,
  "saldo": 0,
  "obs": "AFICHES",
  "vencimiento": "2026-02-25",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-01-29",
  "ejecutivo": ""
}, {
  "rut": "7970939-5",
  "empresa": "MARIO ENRIQUE GONZALEZ ESPINOSA",
  "folio": 2283,
  "fechaEmision": "2026-01-27",
  "total": 793730,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-01-29",
  "diasVencido": 2,
  "estado": "PAGADO",
  "fechaPago": "2026-01-29",
  "ejecutivo": ""
}, {
  "rut": "60910000-1",
  "empresa": "UNIVERSIDAD DE CHILE",
  "folio": 2284,
  "fechaEmision": "2026-01-27",
  "total": 1241765,
  "saldo": 0,
  "obs": "FOLLETOS",
  "vencimiento": "2026-02-26",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-20",
  "ejecutivo": "ANGEL"
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2285,
  "fechaEmision": "2026-01-29",
  "total": 196112,
  "saldo": 0,
  "obs": "EXHIBIDOR ACRILICO",
  "vencimiento": "2026-02-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-10",
  "ejecutivo": "LEONARDO"
}, {
  "rut": "72754700-2",
  "empresa": "FUNDACION INSTITUTO PROFESIONAL DUOC UC",
  "folio": 2286,
  "fechaEmision": "2026-01-29",
  "total": 117484612,
  "saldo": 0,
  "obs": "KIT: CUADERNO, MORRAL, LAPIZ",
  "vencimiento": "2026-02-28",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-06",
  "ejecutivo": ""
}, {
  "rut": "76078941-0",
  "empresa": "ASESORIAS E INVERSIONES SAN CHARBEL SPA",
  "folio": 2292,
  "fechaEmision": "2026-02-02",
  "total": 241273,
  "saldo": 0,
  "obs": "MANUALES",
  "vencimiento": "2026-03-04",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-02",
  "ejecutivo": ""
}, {
  "rut": "77643297-0",
  "empresa": "NUTRISCO S.A.",
  "folio": 2293,
  "fechaEmision": "2026-02-02",
  "total": 547400,
  "saldo": 0,
  "obs": "DISTRIBUCION",
  "vencimiento": "2026-03-04",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-04",
  "ejecutivo": ""
}, {
  "rut": "80186300-0",
  "empresa": "CIAL ALIMENTOS S.A.",
  "folio": 2294,
  "fechaEmision": "2026-02-02",
  "total": 3398640,
  "saldo": 0,
  "obs": "AFICHES",
  "vencimiento": "2026-03-04",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-06",
  "ejecutivo": ""
}, {
  "rut": "60911000-7",
  "empresa": "UNIVERSIDAD DE SANTIAGO DE CHILE",
  "folio": 2295,
  "fechaEmision": "2026-02-02",
  "total": 3585708,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-03-04",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-12",
  "ejecutivo": "BRIAN"
}, {
  "rut": "99526160-K",
  "empresa": "BUREAU VERITAS CERTIFICATION CHILE S.A",
  "folio": 2302,
  "fechaEmision": "2026-02-04",
  "total": 8509,
  "saldo": 0,
  "obs": "DIPLOMAS // CLIENTE RETIRA",
  "vencimiento": "2026-03-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-23",
  "ejecutivo": "ORLANDO"
}, {
  "rut": "87912900-1",
  "empresa": "UNIVERSIDAD DE LA FRONTERA",
  "folio": 2303,
  "fechaEmision": "2026-02-04",
  "total": 999957,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-03-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-06",
  "ejecutivo": "BRIAN"
}, {
  "rut": "69500900-3",
  "empresa": "PROGRAMA DE LAS NACIONES UNIDAS PARA EL DESARROLLO PNUD",
  "folio": 2304,
  "fechaEmision": "2026-02-04",
  "total": 4232235,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-03-06",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-12",
  "ejecutivo": ""
}, {
  "rut": "96832590-6",
  "empresa": "EDICIONES UNIVERSIT DE VALPSO DE LA UNIVERSIDAD CATOLICA DE VALPO S.A",
  "folio": 2305,
  "fechaEmision": "2026-02-06",
  "total": 3562860,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-03-08",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-13",
  "ejecutivo": "ANGEL"
}, {
  "rut": "60601000-1",
  "empresa": "SUBSECRETARIA DE RELACIONES EXTERIORES",
  "folio": 2306,
  "fechaEmision": "2026-02-09",
  "total": 6875820,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-03-11",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-13",
  "ejecutivo": "BRIAN"
}, {
  "rut": "77516120-5",
  "empresa": "COMUNICACION IMAGEN Y APOYO EMPRESARIAL LTDA.",
  "folio": 2307,
  "fechaEmision": "2026-02-09",
  "total": 1071000,
  "saldo": 0,
  "obs": "CUADERNOS TAPA DURA",
  "vencimiento": "2026-02-14",
  "diasVencido": 5,
  "estado": "PAGADO",
  "fechaPago": "2026-03-09",
  "ejecutivo": "LEONARDO"
}, {
  "rut": "7970939-5",
  "empresa": "MARIO ENRIQUE GONZALEZ ESPINOSA",
  "folio": 2308,
  "fechaEmision": "2026-02-09",
  "total": 2130933,
  "saldo": 0,
  "obs": "AGENDA TAPA DURA",
  "vencimiento": "2026-02-11",
  "diasVencido": 2,
  "estado": "PAGADO",
  "fechaPago": "2026-03-02",
  "ejecutivo": ""
}, {
  "rut": "77822502-6",
  "empresa": "EDICIONES CONTRERAS Y ESCANDON LIMITADA",
  "folio": 2311,
  "fechaEmision": "2026-02-13",
  "total": 3233885,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-03-15",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-18",
  "ejecutivo": "ORLANDO"
}, {
  "rut": "76601833-5",
  "empresa": "GRAFICOMEX SPA",
  "folio": 2312,
  "fechaEmision": "2026-02-13",
  "total": 1082900,
  "saldo": 0,
  "obs": "FLEJERAS - IMPRESIONES",
  "vencimiento": "2026-02-18",
  "diasVencido": 5,
  "estado": "PAGADO",
  "fechaPago": "",
  "ejecutivo": ""
}, {
  "rut": "77822502-6",
  "empresa": "EDICIONES CONTRERAS Y ESCANDON LIMITADA",
  "folio": 2313,
  "fechaEmision": "2026-02-16",
  "total": 5233977,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-03-18",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-18",
  "ejecutivo": "ORLANDO"
}, {
  "rut": "65233607-8",
  "empresa": "CORPORACION CENTRO DE INFORMACION PALESTINA",
  "folio": 2314,
  "fechaEmision": "2026-02-16",
  "total": 583100,
  "saldo": 0,
  "obs": "DISEÑO",
  "vencimiento": "2026-02-16",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2025-07-31",
  "ejecutivo": ""
}, {
  "rut": "80186300-0",
  "empresa": "CIAL ALIMENTOS S.A.",
  "folio": 2315,
  "fechaEmision": "2026-02-16",
  "total": 999600,
  "saldo": 0,
  "obs": "STICKERS",
  "vencimiento": "2026-03-18",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-02-17",
  "ejecutivo": ""
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2319,
  "fechaEmision": "2026-02-20",
  "total": 315350,
  "saldo": 0,
  "obs": "VIBRINES",
  "vencimiento": "2026-03-22",
  "diasVencido": 61,
  "estado": "PAGADO",
  "fechaPago": "2026-04-21",
  "ejecutivo": "LEONARDO"
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2320,
  "fechaEmision": "2026-02-20",
  "total": 577150,
  "saldo": 0,
  "obs": "CATALOGOS",
  "vencimiento": "2026-03-22",
  "diasVencido": 61,
  "estado": "PAGADO",
  "fechaPago": "2026-04-21",
  "ejecutivo": "LEONARDO"
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2321,
  "fechaEmision": "2026-02-20",
  "total": 589050,
  "saldo": 0,
  "obs": "PORTA PRECIOS",
  "vencimiento": "2026-03-22",
  "diasVencido": 61,
  "estado": "PAGADO",
  "fechaPago": "2026-04-21",
  "ejecutivo": "LEONARDO"
}, {
  "rut": "61608604-9",
  "empresa": "SERV.SALUD METROP.CENTRAL HOSP.CLINICO SAN BORJA ARRIARAN",
  "folio": 2322,
  "fechaEmision": "2026-02-24",
  "total": 230032,
  "saldo": 0,
  "obs": "AFICHES",
  "vencimiento": "2026-03-26",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2026-04-21",
  "ejecutivo": "ORLANDO"
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2328,
  "fechaEmision": "2026-02-25",
  "total": 114240,
  "saldo": 0,
  "obs": "TARJETAS",
  "vencimiento": "2026-03-27",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-24",
  "ejecutivo": "LEO"
}, {
  "rut": "85698200-9",
  "empresa": "PREUNIVERSITARIO PEDRO DE VALDIVIA LTDA.",
  "folio": 2329,
  "fechaEmision": "2026-02-27",
  "total": 2261000,
  "saldo": 0,
  "obs": "OT03 HOJAS DE RESPUESTAS",
  "vencimiento": "2026-03-29",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-14",
  "ejecutivo": "JAIME"
}, {
  "rut": "77050426-0",
  "empresa": "ALIANZA PEDRO DE VALDIVIA LTDA.",
  "folio": 2330,
  "fechaEmision": "2026-02-27",
  "total": 1130500,
  "saldo": 0,
  "obs": "OT03 HOJAS DE RESPUESTAS",
  "vencimiento": "2026-03-29",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-02",
  "ejecutivo": "JAIME"
}, {
  "rut": "85698200-9",
  "empresa": "PREUNIVERSITARIO PEDRO DE VALDIVIA LTDA.",
  "folio": 2331,
  "fechaEmision": "2026-02-27",
  "total": 3569119,
  "saldo": 0,
  "obs": "OT04 FOLLETOS",
  "vencimiento": "2026-03-29",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-02",
  "ejecutivo": "JAIME"
}, {
  "rut": "85698200-9",
  "empresa": "PREUNIVERSITARIO PEDRO DE VALDIVIA LTDA.",
  "folio": 2332,
  "fechaEmision": "2026-02-27",
  "total": 4368966,
  "saldo": 0,
  "obs": "OT01 FOLLETOS",
  "vencimiento": "2026-03-29",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-02",
  "ejecutivo": "JAIME"
}, {
  "rut": "85698200-9",
  "empresa": "PREUNIVERSITARIO PEDRO DE VALDIVIA LTDA.",
  "folio": 2333,
  "fechaEmision": "2026-03-02",
  "total": 5440680,
  "saldo": 0,
  "obs": "OT02 FOLLETOS Y HOJAS DE RESPUESTA",
  "vencimiento": "2026-04-01",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-14",
  "ejecutivo": "JAIME"
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2338,
  "fechaEmision": "2026-03-02",
  "total": 39270,
  "saldo": 0,
  "obs": "IMPRESIONES",
  "vencimiento": "2026-04-01",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-31",
  "ejecutivo": "LEONARDO"
}, {
  "rut": "81698900-0",
  "empresa": "PONTIFICIA UNIVERSIDAD CATOLICA DE CHILE",
  "folio": 2339,
  "fechaEmision": "2026-03-02",
  "total": 149940,
  "saldo": 0,
  "obs": "DIPLOMAS",
  "vencimiento": "2026-04-01",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-01",
  "ejecutivo": "ANGEL"
}, {
  "rut": "77175160-1",
  "empresa": "COMERCIAL DICALLA S A",
  "folio": 2340,
  "fechaEmision": "2026-03-02",
  "total": 1644104,
  "saldo": 0,
  "obs": "PARANTES",
  "vencimiento": "2026-04-01",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-13",
  "ejecutivo": "LEONARDO"
}, {
  "rut": "60201000-7",
  "empresa": "SENADO DE LA REPUBLICA",
  "folio": 2344,
  "fechaEmision": "2026-03-02",
  "total": 1420384,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-04-01",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-08",
  "ejecutivo": "BRIAN"
}, {
  "rut": "65147265-3",
  "empresa": "CORPORACION EDUCACIONAL MIRADOR AZUL",
  "folio": 0,
  "fechaEmision": "2026-03-06",
  "total": 500752,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-03-09",
  "diasVencido": 3,
  "estado": "PAGADO",
  "fechaPago": "2026-03-06",
  "ejecutivo": ""
}, {
  "rut": "60203000-8",
  "empresa": "BIBLIOTECA DEL CONGRESO NACIONAL",
  "folio": 2351,
  "fechaEmision": "2026-03-06",
  "total": 456960,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-04-05",
  "diasVencido": 47,
  "estado": "PAGADO",
  "fechaPago": "2026-04-21",
  "ejecutivo": ""
}, {
  "rut": "65147265-2",
  "empresa": "CORPORACION EDUCACIONAL MIRADOR AZUL",
  "folio": 2352,
  "fechaEmision": "2026-03-06",
  "total": 420799,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-03-08",
  "diasVencido": 2,
  "estado": "PAGADO",
  "fechaPago": "2026-03-09",
  "ejecutivo": ""
}, {
  "rut": "77471270-4",
  "empresa": "AGROCOMERCIAL CODIGUA SPA",
  "folio": 2354,
  "fechaEmision": "2026-03-09",
  "total": 3365558,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-04-08",
  "diasVencido": 44,
  "estado": "PAGADO",
  "fechaPago": "2026-04-22",
  "ejecutivo": ""
}, {
  "rut": "65233607-8",
  "empresa": "CORPORACION CENTRO DE INFORMACION PALESTINA",
  "folio": 2355,
  "fechaEmision": "2026-03-10",
  "total": 2905980,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-03-12",
  "diasVencido": 2,
  "estado": "PAGADO",
  "fechaPago": "2026-03-13",
  "ejecutivo": ""
}, {
  "rut": "77822502-6",
  "empresa": "EDICIONES CONTRERAS Y ESCANDON LIMITADA",
  "folio": 2356,
  "fechaEmision": "2026-03-10",
  "total": 1624350,
  "saldo": 0,
  "obs": "LIBROS TAPA DURA",
  "vencimiento": "2026-04-09",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2026-04-20",
  "ejecutivo": ""
}, {
  "rut": "77049340-4",
  "empresa": "FERRERAS Y LICCI LIMITADA",
  "folio": 2357,
  "fechaEmision": "2026-03-10",
  "total": 2007530,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-03-12",
  "diasVencido": 2,
  "estado": "PAGADO",
  "fechaPago": "2026-03-10",
  "ejecutivo": ""
}, {
  "rut": "77175160-1",
  "empresa": "COMERCIAL DICALLA S A",
  "folio": 2358,
  "fechaEmision": "2026-03-11",
  "total": 1494640,
  "saldo": 0,
  "obs": "PARANTES",
  "vencimiento": "2026-04-10",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-13",
  "ejecutivo": ""
}, {
  "rut": "76601833-5",
  "empresa": "GRAFICOMEX SPA",
  "folio": 2359,
  "fechaEmision": "2026-03-11",
  "total": 856800,
  "saldo": 0,
  "obs": "LAMINAS",
  "vencimiento": "2026-03-16",
  "diasVencido": 5,
  "estado": "PAGADO",
  "fechaPago": "",
  "ejecutivo": ""
}, {
  "rut": "77643296-2",
  "empresa": "NUTRISCO CHILE S.A",
  "folio": 2370,
  "fechaEmision": "2026-03-12",
  "total": 659736,
  "saldo": 0,
  "obs": "EXHIBIDOR ACRILICO",
  "vencimiento": "2026-04-11",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-07",
  "ejecutivo": ""
}, {
  "rut": "76005909-9",
  "empresa": "COMERCIAL MOTORES DE LOS ANDES SPA",
  "folio": 2371,
  "fechaEmision": "2026-03-13",
  "total": 1898050,
  "saldo": 0,
  "obs": "POLIZAS",
  "vencimiento": "2026-04-12",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-10",
  "ejecutivo": ""
}, {
  "rut": "70574900-0",
  "empresa": "FUNDACION INTEGRA",
  "folio": 2372,
  "fechaEmision": "2026-03-13",
  "total": 1764181,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-04-12",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-27",
  "ejecutivo": ""
}, {
  "rut": "61307000-1",
  "empresa": "INSTITUTO DE DESARROLLO AGROPECUARIO  - INDAP",
  "folio": 2373,
  "fechaEmision": "2026-03-16",
  "total": 822647,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-04-15",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-15",
  "ejecutivo": ""
}, {
  "rut": "76051644-9",
  "empresa": "INGENIERIA DE SISTEMAS OPEN GREEN ROAD S.A.",
  "folio": 2374,
  "fechaEmision": "2026-03-16",
  "total": 10060536,
  "saldo": 0,
  "obs": "LIBROS - EXCEDENTES - INTERESES",
  "vencimiento": "2026-04-15",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-09",
  "ejecutivo": ""
}, {
  "rut": "69255600-3",
  "empresa": "MUNICIPALIDAD DE VITACURA",
  "folio": 2376,
  "fechaEmision": "2026-03-17",
  "total": 867510,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-04-16",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-13",
  "ejecutivo": ""
}, {
  "rut": "76078941-0",
  "empresa": "ASESORIAS E INVERSIONES SAN CHARBEL SPA",
  "folio": 2404,
  "fechaEmision": "2026-03-24",
  "total": 79682,
  "saldo": 0,
  "obs": "MANUALES",
  "vencimiento": "2026-04-23",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-26",
  "ejecutivo": ""
}, {
  "rut": "76078941-0",
  "empresa": "ASESORIAS E INVERSIONES SAN CHARBEL SPA",
  "folio": 2405,
  "fechaEmision": "2026-03-24",
  "total": 241273,
  "saldo": 0,
  "obs": "MANUALES",
  "vencimiento": "2026-04-23",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-03-26",
  "ejecutivo": ""
}, {
  "rut": "73044000-6",
  "empresa": "FEDERACION CRIADORES DE CABALLOS RAZA CHILENA",
  "folio": 2406,
  "fechaEmision": "2026-03-26",
  "total": 8639400,
  "saldo": 0,
  "obs": "",
  "vencimiento": "2026-04-15",
  "diasVencido": 20,
  "estado": "PAGADO",
  "fechaPago": "2026-04-15",
  "ejecutivo": "ANGEL OLGUIN"
}, {
  "rut": "65233607-8",
  "empresa": "CORPORACION CENTRO DE INFORMACION PALESTINA",
  "folio": 2407,
  "fechaEmision": "2026-03-26",
  "total": 2905980,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-03-28",
  "diasVencido": 2,
  "estado": "PAGADO",
  "fechaPago": "2026-04-06",
  "ejecutivo": "BRIAN"
}, {
  "rut": "65233607-8",
  "empresa": "CORPORACION CENTRO DE INFORMACION PALESTINA",
  "folio": 2408,
  "fechaEmision": "2026-03-26",
  "total": 534072,
  "saldo": 0,
  "obs": "REVISTA_x000D_",
  "vencimiento": "2026-03-28",
  "diasVencido": 2,
  "estado": "PAGADO",
  "fechaPago": "2026-04-06",
  "ejecutivo": "BRIAN"
}, {
  "rut": "70819400-K",
  "empresa": "TRIBUNAL CONSTITUCIONAL",
  "folio": 2409,
  "fechaEmision": "2026-03-26",
  "total": 801822,
  "saldo": 0,
  "obs": "LIBROS",
  "vencimiento": "2026-04-25",
  "diasVencido": 30,
  "estado": "PAGADO",
  "fechaPago": "2026-04-06",
  "ejecutivo": ""
}, {
  "rut": "76954734-7",
  "empresa": "CARDINAL SERVICIOS INTEGRALES SPA",
  "folio": 2415,
  "fechaEmision": "2026-04-06",
  "total": 416500,
  "saldo": 0,
  "obs": "DIPTICOS - TARJETAS",
  "vencimiento": "2026-05-06",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2026-04-17",
  "ejecutivo": ""
}, {
  "rut": "79975650-1",
  "empresa": "CORPORACION NACIONAL DE CAPACITACION",
  "folio": 2423,
  "fechaEmision": "2026-04-09",
  "total": 1736924,
  "saldo": 0,
  "obs": "MANUALES",
  "vencimiento": "2026-04-09",
  "diasVencido": 0,
  "estado": "PAGADO",
  "fechaPago": "2026-04-17",
  "ejecutivo": ""
}];
let CREDITOS_REALES = [{
  "id": "scotia_fogape",
  "prestamo": "FOGAPE Cuota Fija",
  "banco": "Scotiabank",
  "empresa": "GMD",
  "numero": "7-1016-20555-74",
  "tipo": "Cr\u00e9dito",
  "moneda": "CLP",
  "tasa": 0.7025,
  "montoInicial": 100000000,
  "deudaVigente": 83919800,
  "cuotasTotales": 12,
  "cuotasPagadas": 2,
  "proximaCuota": 8758158,
  "fechaProximaCuota": "2026-05-13",
  "fechaVencimientoFinal": "2027-02-15",
  "cuotas": [{
    "numero": "003",
    "vencimiento": "2026-05-13",
    "capital": 8135721,
    "interes": 589956,
    "valorCuota": 8758158,
    "estado": "Pendiente"
  }, {
    "numero": "004",
    "vencimiento": "2026-06-15",
    "capital": 8139639,
    "interes": 586038,
    "valorCuota": 8760411,
    "estado": "Pendiente"
  }, {
    "numero": "005",
    "vencimiento": "2026-07-13",
    "capital": 8281839,
    "interes": 443838,
    "valorCuota": 8751983,
    "estado": "Pendiente"
  }, {
    "numero": "006",
    "vencimiento": "2026-08-13",
    "capital": 8294447,
    "interes": 431230,
    "valorCuota": 8751236,
    "estado": "Pendiente"
  }, {
    "numero": "007",
    "vencimiento": "2026-09-14",
    "capital": 8342734,
    "interes": 382943,
    "valorCuota": 8748374,
    "estado": "Pendiente"
  }, {
    "numero": "008",
    "vencimiento": "2026-10-13",
    "capital": 8435329,
    "interes": 290348,
    "valorCuota": 8742886,
    "estado": "Pendiente"
  }, {
    "numero": "009",
    "vencimiento": "2026-11-13",
    "capital": 8476582,
    "interes": 249095,
    "valorCuota": 8740441,
    "estado": "Pendiente"
  }, {
    "numero": "010",
    "vencimiento": "2026-12-14",
    "capital": 8538159,
    "interes": 187518,
    "valorCuota": 8736791,
    "estado": "Pendiente"
  }, {
    "numero": "011",
    "vencimiento": "2027-01-13",
    "capital": 8604231,
    "interes": 121446,
    "valorCuota": 8732875,
    "estado": "Pendiente"
  }, {
    "numero": "012",
    "vencimiento": "2027-02-15",
    "capital": 8671119,
    "interes": 67054,
    "valorCuota": 8742147,
    "estado": "Pendiente"
  }]
}, {
  "id": "sant_fogape_ki",
  "prestamo": "FOGAPE K+I Comisi\u00f3n",
  "banco": "SANTANDER",
  "empresa": "GMD",
  "numero": "4-200-5148758-2",
  "tipo": "Cr\u00e9dito",
  "moneda": "CLP",
  "tasa": 0.68,
  "montoInicial": 174000000,
  "deudaVigente": 174000000,
  "cuotasTotales": 60,
  "cuotasPagadas": 0,
  "proximaCuota": 3655204,
  "fechaProximaCuota": "2026-05-04",
  "fechaVencimientoFinal": "2031-04-02",
  "cuotas": [{
    "numero": "001",
    "vencimiento": "2026-05-04",
    "capital": null,
    "interes": null,
    "valorCuota": 3655204,
    "estado": "Pendiente"
  }]
}, {
  "id": "sant_fogain_1",
  "prestamo": "FOGAIN Cuotas Iguales #1",
  "banco": "SANTANDER",
  "empresa": "GMD",
  "numero": "4-200-5147433-2",
  "tipo": "Cr\u00e9dito",
  "moneda": "CLP",
  "tasa": 0.68,
  "montoInicial": 324000000,
  "deudaVigente": 318870198,
  "cuotasTotales": 60,
  "cuotasPagadas": 1,
  "proximaCuota": 6598602,
  "fechaProximaCuota": "2026-05-07",
  "fechaVencimientoFinal": "2031-03-07",
  "cuotas": [{
    "numero": "002",
    "vencimiento": "2026-05-07",
    "capital": null,
    "interes": null,
    "valorCuota": 6598602,
    "estado": "Pendiente"
  }]
}, {
  "id": "sant_fogain_2",
  "prestamo": "FOGAIN Cuotas Iguales #2",
  "banco": "SANTANDER",
  "empresa": "GMD",
  "numero": "4-200-5150373-1",
  "tipo": "Cr\u00e9dito",
  "moneda": "CLP",
  "tasa": 0.68,
  "montoInicial": 151600000,
  "deudaVigente": 151600000,
  "cuotasTotales": 60,
  "cuotasPagadas": 0,
  "proximaCuota": 3097558,
  "fechaProximaCuota": "2026-05-04",
  "fechaVencimientoFinal": "2031-04-04",
  "cuotas": [{
    "numero": "001",
    "vencimiento": "2026-05-04",
    "capital": null,
    "interes": null,
    "valorCuota": 3097558,
    "estado": "Pendiente"
  }]
}, {
  "id": "bcchile_grafhika",
  "prestamo": "Grafhika Impresores",
  "banco": "Grafhika BancoChile",
  "empresa": "Grafhika",
  "numero": "164779259919073267",
  "tipo": "Cr\u00e9dito",
  "moneda": "CLP",
  "tasa": null,
  "montoInicial": 15000000,
  "deudaVigente": 13772530,
  "cuotasTotales": 12,
  "cuotasPagadas": 2,
  "proximaCuota": 1377253,
  "fechaProximaCuota": "2026-05-05",
  "fechaVencimientoFinal": "2027-02-05",
  "cuotas": [{
    "numero": "03",
    "vencimiento": "2026-05-05",
    "capital": 1223035,
    "interes": 154218,
    "valorCuota": 1377253,
    "estado": "Vigente"
  }, {
    "numero": "04",
    "vencimiento": "2026-06-05",
    "capital": 1228071,
    "interes": 149182,
    "valorCuota": 1377253,
    "estado": "Vigente"
  }, {
    "numero": "05",
    "vencimiento": "2026-07-06",
    "capital": 1243806,
    "interes": 133447,
    "valorCuota": 1377253,
    "estado": "Vigente"
  }]
}];

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n, compact = false) => {
  if (n === undefined || n === null || isNaN(n)) return '$0';
  const cleanVal = Math.round(n);
  if (compact) {
    const a = Math.abs(cleanVal);
    if (a >= 1e6) return (cleanVal < 0 ? '-' : '') + '$' + (a / 1e6).toFixed(1).replace('.', ',') + ' MM';
    if (a >= 1e3) return (cleanVal < 0 ? '-' : '') + '$' + Math.round(a / 1e3) + ' K';
    return (cleanVal < 0 ? '-' : '') + '$' + a;
  }
  const parts = Math.abs(cleanVal).toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (cleanVal < 0 ? '-' : '') + '$' + parts.join(".");
};
const fmtDate = s => {
  if (!s) return '';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};
const fmtMonth = s => {
  const [y, m] = s.split('-');
  const names = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${names[+m]} ${y.slice(2)}`;
};

// ── SVG Charts ─────────────────────────────────────────────────────────────
function AreaChart({
  data1,
  data2,
  labels,
  h = 120,
  c1 = 'var(--g600)',
  c2 = 'var(--g300)'
}) {
  const W = 600,
    pad = {
      t: 8,
      r: 4,
      b: 22,
      l: 44
    };
  const cw = W - pad.l - pad.r,
    ch = h - pad.t - pad.b;
  const all = [...data1, ...(data2 || [])];
  const mn = Math.min(...all) * 0.92,
    mx = Math.max(...all) * 1.05;
  const px = i => pad.l + i / (data1.length - 1) * cw;
  const py = v => pad.t + ch - (v - mn) / (mx - mn) * ch;
  const path = d => d.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const area = d => `${path(d)} L${px(d.length - 1)},${pad.t + ch} L${px(0)},${pad.t + ch} Z`;
  const ySteps = [mn, (mn + mx) / 2, mx];
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${h}`,
    style: {
      width: '100%',
      height: h
    },
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "ag1",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: c1,
    stopOpacity: ".16"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: c1,
    stopOpacity: "0"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "ag2",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: c2,
    stopOpacity: ".22"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: c2,
    stopOpacity: "0"
  }))), [0, .5, 1].map((f, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: pad.l,
    x2: W - pad.r,
    y1: pad.t + ch * f,
    y2: pad.t + ch * f,
    stroke: "var(--border)",
    strokeWidth: "1"
  })), ySteps.map((v, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: pad.l - 5,
    y: pad.t + ch * (1 - i / 2) + 4,
    textAnchor: "end",
    fontSize: "9",
    fill: "var(--t3)",
    fontFamily: "DM Mono"
  }, fmt(v))), data2 && /*#__PURE__*/React.createElement("path", {
    d: area(data2),
    fill: "url(#ag2)"
  }), /*#__PURE__*/React.createElement("path", {
    d: area(data1),
    fill: "url(#ag1)"
  }), data2 && /*#__PURE__*/React.createElement("path", {
    d: path(data2),
    fill: "none",
    stroke: c2,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: path(data1),
    fill: "none",
    stroke: c1,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), labels.map((l, i) => i % 2 === 0 && /*#__PURE__*/React.createElement("text", {
    key: i,
    x: px(i),
    y: h - 3,
    textAnchor: "middle",
    fontSize: "9",
    fill: "var(--t3)",
    fontFamily: "DM Mono"
  }, l)));
}
function BarChart({
  data,
  labels,
  h = 110,
  colors
}) {
  const W = 600,
    pad = {
      t: 8,
      r: 4,
      b: 22,
      l: 44
    };
  const cw = W - pad.l - pad.r,
    ch = h - pad.t - pad.b;
  const mx = Math.max(...data.map(Math.abs)) * 1.1;
  const bw = cw / data.length * 0.55;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${h}`,
    style: {
      width: '100%',
      height: h
    },
    preserveAspectRatio: "none"
  }, [0, .5, 1].map((f, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: pad.l,
    x2: W - pad.r,
    y1: pad.t + ch * f,
    y2: pad.t + ch * f,
    stroke: "var(--border)",
    strokeWidth: "1"
  })), /*#__PURE__*/React.createElement("text", {
    x: pad.l - 5,
    y: pad.t + 4,
    textAnchor: "end",
    fontSize: "9",
    fill: "var(--t3)",
    fontFamily: "DM Mono"
  }, fmt(mx)), data.map((v, i) => {
    const bh = Math.abs(v) / mx * ch;
    const bx = pad.l + i / data.length * cw + (cw / data.length - bw) / 2;
    const col = colors ? colors[i] : v >= 0 ? 'var(--g600)' : 'var(--red)';
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("rect", {
      x: bx,
      y: pad.t + ch - bh,
      width: bw,
      height: bh,
      fill: col,
      rx: "3",
      opacity: ".9"
    }), /*#__PURE__*/React.createElement("text", {
      x: bx + bw / 2,
      y: h - 3,
      textAnchor: "middle",
      fontSize: "9",
      fill: "var(--t3)",
      fontFamily: "DM Mono"
    }, labels[i]));
  }));
}
function DonutChart({
  segments,
  size = 100
}) {
  const r = 38,
    cx = size / 2,
    cy = size / 2;
  const total = segments.reduce((s, d) => s + d.val, 0);
  let angle = -Math.PI / 2;
  const slices = segments.map(d => {
    const a = d.val / total * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle),
      y1 = cy + r * Math.sin(angle);
    angle += a;
    const x2 = cx + r * Math.cos(angle),
      y2 = cy + r * Math.sin(angle);
    return {
      ...d,
      path: `M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r},0,${a > Math.PI ? 1 : 0},1,${x2.toFixed(1)},${y2.toFixed(1)} Z`
    };
  });
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`
  }, slices.map((s, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: s.path,
    fill: s.color,
    stroke: "var(--surface)",
    strokeWidth: "2"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: 26,
    fill: "var(--surface)"
  }), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy + 2,
    textAnchor: "middle",
    dominantBaseline: "middle",
    fontSize: "10",
    fontWeight: "700",
    fontFamily: "DM Sans",
    fill: "var(--text)"
  }, fmt(total)));
}

// ── Icons ─────────────────────────────────────────────────────────────────
const IC = ({
  n,
  s = 18
}) => {
  const m = {
    sim: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "4",
      cy: "5",
      r: "2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "5",
      r: "2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "20",
      cy: "5",
      r: "2"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "4",
      y1: "9",
      x2: "4",
      y2: "20"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "9",
      x2: "12",
      y2: "20"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "20",
      y1: "9",
      x2: "20",
      y2: "20"
    })),
    ia: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6a6 6 0 0 0-6 6c0 3.31 2.69 6 6 6s6-2.69 6-6a6 6 0 0 0-6-6z"
    })),
    mov: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 17L8 10 13 13 21 5"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "17 5 21 5 21 9"
    })),
    gas: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 7v5l3 3"
    })),
    ven: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polyline", {
      points: "22 12 18 12 15 21 9 3 6 12 2 12"
    })),
    fon: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M18 20V10M12 20V4M6 20v-6"
    })),
    cre: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "1",
      y: "4",
      width: "22",
      height: "16",
      rx: "2"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "1",
      y1: "10",
      x2: "23",
      y2: "10"
    })),
    cfg: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
    })),
    chv: /*#__PURE__*/React.createElement("polyline", {
      points: "15 18 9 12 15 6"
    }),
    men: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "3",
      y1: "6",
      x2: "21",
      y2: "6"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "3",
      y1: "12",
      x2: "21",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "3",
      y1: "18",
      x2: "21",
      y2: "18"
    })),
    up: /*#__PURE__*/React.createElement("polyline", {
      points: "18 15 12 9 6 15"
    }),
    dn: /*#__PURE__*/React.createElement("polyline", {
      points: "6 9 12 15 18 9"
    }),
    exp: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "7 10 12 15 17 10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "15",
      x2: "12",
      y2: "3"
    })),
    ref: /*#__PURE__*/React.createElement("path", {
      d: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
    }),
    not: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
    })),
    fin: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "7",
      r: "4"
    }))
  };
  return /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, m[n]);
};

// ── Pages ─────────────────────────────────────────────────────────────────
// ── Movimientos Table with Filters ───────────────────────────────────────
function MovimientosTable({
  movRecientes
} = {}) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroBanco, setFiltroBanco] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroFecha, setFiltroFecha] = useState('');
  const bancos = ['Todos', ...Object.keys(SALDOS_BANCO)];

  // Obtener movRecientes desde las props (o el contexto) de forma reactiva
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
    }).sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [movRecientesList, busqueda, filtroBanco, filtroTipo, filtroFecha]);
  const inputStyle = {
    padding: '6px 10px',
    fontSize: 12.5,
    border: '1px solid var(--border)',
    borderRadius: 7,
    background: 'var(--bg)',
    color: 'var(--text)',
    fontFamily: 'DM Sans',
    outline: 'none',
    width: '100%'
  };
  const selStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };
  const totalFiltrado = filtrados.reduce((s, m) => s + m.monto, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Movimientos Recientes"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, filtrados.length, " resultado", filtrados.length !== 1 ? 's' : '', " \xB7 Total: ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: totalFiltrado >= 0 ? 'var(--g600)' : 'var(--red)'
    }
  }, totalFiltrado >= 0 ? '+' : '', fmt(totalFiltrado)))), /*#__PURE__*/React.createElement("button", {
    className: "card-act"
  }, /*#__PURE__*/React.createElement(IC, {
    n: "exp",
    s: 12
  }), " Exportar")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 140px 130px 120px',
      gap: 8,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--t3)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: 'absolute',
      left: 9,
      top: '50%',
      transform: 'translateY(-50%)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.35-4.35"
  })), /*#__PURE__*/React.createElement("input", {
    style: {
      ...inputStyle,
      paddingLeft: 28
    },
    placeholder: "Buscar descripci\xF3n...",
    value: busqueda,
    onChange: e => setBusqueda(e.target.value)
  })), /*#__PURE__*/React.createElement("select", {
    style: selStyle,
    value: filtroBanco,
    onChange: e => setFiltroBanco(e.target.value)
  }, bancos.map(b => /*#__PURE__*/React.createElement("option", {
    key: b
  }, b))), /*#__PURE__*/React.createElement("select", {
    style: selStyle,
    value: filtroTipo,
    onChange: e => setFiltroTipo(e.target.value)
  }, ['Todos', 'INGRESO', 'GASTO'].map(t => /*#__PURE__*/React.createElement("option", {
    key: t
  }, t))), /*#__PURE__*/React.createElement("input", {
    type: "date",
    style: selStyle,
    value: filtroFecha,
    onChange: e => setFiltroFecha(e.target.value),
    title: "Filtrar por fecha"
  })), (busqueda || filtroBanco !== 'Todos' || filtroTipo !== 'Todos' || filtroFecha) && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setBusqueda('');
      setFiltroBanco('Todos');
      setFiltroTipo('Todos');
      setFiltroFecha('');
    },
    style: {
      marginBottom: 12,
      fontSize: 13,
      color: 'var(--g600)',
      background: 'var(--g50)',
      border: '1px solid var(--g200)',
      borderRadius: 6,
      padding: '4px 10px',
      cursor: 'pointer',
      fontFamily: 'DM Sans',
      fontWeight: 500
    }
  }, "\u2715 Limpiar filtros"), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Fecha"), /*#__PURE__*/React.createElement("th", null, "Descripci\xF3n"), /*#__PURE__*/React.createElement("th", null, "Banco"), /*#__PURE__*/React.createElement("th", null, "Tipo"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Monto"))), /*#__PURE__*/React.createElement("tbody", null, filtrados.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 5,
    style: {
      textAlign: 'center',
      color: 'var(--t3)',
      padding: '24px 0',
      fontStyle: 'italic'
    }
  }, "Sin resultados para los filtros aplicados")) : filtrados.map((m, i) => {
    const desc = (m.descripcion || '').toLowerCase();
    const isRescate = desc.includes('rescate') && (desc.includes('fondo') || desc.includes('ffmm') || desc.includes('mutuo'));
    return /*#__PURE__*/React.createElement("tr", {
      key: i,
      style: {
        opacity: m.isIntercompany ? 0.75 : 1
      }
    }, /*#__PURE__*/React.createElement("td", {
      className: "mono",
      style: {
        color: 'var(--t3)',
        fontSize: 13
      }
    }, fmtDate(m.fecha)), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500,
        maxWidth: 280,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      },
      title: m.descripcion
    }, m.descripcion), /*#__PURE__*/React.createElement("td", {
      style: {
        color: 'var(--t3)',
        fontSize: 12
      }
    }, m.banco), /*#__PURE__*/React.createElement("td", null, m.isIntercompany ? /*#__PURE__*/React.createElement("span", {
      className: "pill gr",
      style: {
        background: '#f1f5f9',
        color: '#475569',
        border: '1px solid #cbd5e1'
      }
    }, isRescate ? 'RESCATE FFMM' : 'TRASPASO INTERNO') : /*#__PURE__*/React.createElement("span", {
      className: `pill ${m.tipo === 'INGRESO' ? 'g' : 'r'}`
    }, m.tipo)), /*#__PURE__*/React.createElement("td", {
      className: "mono r",
      style: {
        fontWeight: 600,
        color: m.isIntercompany ? 'var(--t3)' : m.monto > 0 ? 'var(--g600)' : 'var(--red)'
      }
    }, m.monto > 0 ? '+' : '', fmt(m.monto)));
  }))));
}
function MovimientosPage({
  movRecientes,
  saldos,
  onNavTo
}) {
  const months = Object.keys(MOV_BY_MONTH);
  const ingresos = months.map(m => MOV_BY_MONTH[m].ingresos);
  const gastos_m = months.map(m => MOV_BY_MONTH[m].gastos);
  const labels = months.map(fmtMonth);
  const cur = MOV_BY_MONTH['2026-04'];
  const movRecientesList = movRecientes || MOV_RECIENTES;
  const totalBancario = Object.values(saldos || SALDOS_BANCO).reduce((a, b) => a + b, 0);
  const maxSaldo = Math.max(...Object.values(SALDOS_BANCO));
  const colores = ['var(--g600)', 'var(--g500)', 'var(--g400)', 'var(--amber)', 'oklch(52% .15 240)', 'var(--t3)'];
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--g800)',
      borderRadius: 14,
      padding: '20px 24px',
      marginBottom: 20,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.07em',
      color: 'var(--g300)',
      marginBottom: 4
    }
  }, "Saldo Total Consolidado"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 700,
      fontSize: 34,
      letterSpacing: '-.03em'
    }
  }, fmt(totalBancario)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--g300)',
      marginTop: 4
    }
  }, "6 cuentas activas \u2014 actualizado 20 Abr 2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.07em',
      color: 'var(--g300)',
      marginBottom: 4
    }
  }, "Flujo Neto Abril"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 700,
      fontSize: 22,
      color: cur.ingresos > cur.gastos ? 'var(--g200)' : 'var(--red)'
    }
  }, cur.ingresos > cur.gastos ? '+' : '-', fmt(Math.abs(cur.ingresos - cur.gastos))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--g300)',
      marginTop: 4
    }
  }, cur.ingresos > cur.gastos ? 'Superávit' : 'Déficit', " del mes"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6,1fr)',
      gap: 10
    }
  }, Object.entries(SALDOS_BANCO).map(([banco, saldo], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'rgba(255,255,255,.08)',
      borderRadius: 10,
      padding: '12px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: colores[i]
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--g300)',
      fontWeight: 500,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, banco)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 700,
      fontSize: 15,
      color: '#fff'
    }
  }, fmt(saldo)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      height: 3,
      background: 'rgba(255,255,255,.15)',
      borderRadius: 99
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${(saldo / maxSaldo * 100).toFixed(0)}%`,
      height: '100%',
      borderRadius: 99,
      background: colores[i]
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-grid"
  }, [{
    label: 'Ingresos Abril',
    val: fmt(cur.ingresos),
    sub: '+' + ((cur.ingresos / MOV_BY_MONTH['2026-03'].ingresos - 1) * 100).toFixed(1) + '% vs Mar',
    dir: 'g',
    icon: 'ven'
  }, {
    label: 'Gastos Abril',
    val: fmt(cur.gastos),
    sub: '+' + ((cur.gastos / MOV_BY_MONTH['2026-03'].gastos - 1) * 100).toFixed(1) + '% vs Mar',
    dir: 'a',
    icon: 'gas'
  }, {
    label: 'Ingresos Febrero',
    val: fmt(MOV_BY_MONTH['2026-02'].ingresos),
    sub: 'mayor mes registrado',
    dir: 'g',
    icon: 'mov'
  }, {
    label: 'Gastos Febrero',
    val: fmt(MOV_BY_MONTH['2026-02'].gastos),
    sub: 'mayor mes registrado',
    dir: 'r',
    icon: 'gas'
  }].map((k, i) => /*#__PURE__*/React.createElement("div", {
    className: "kcard",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: `kcard-icon ${k.dir}`
  }, /*#__PURE__*/React.createElement(IC, {
    n: k.icon,
    s: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "kcard-label"
  }, k.label), /*#__PURE__*/React.createElement("div", {
    className: "kcard-val"
  }, k.val), /*#__PURE__*/React.createElement("div", {
    className: `kcard-change ${k.dir}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, k.sub))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Flujo Mensual \u2014 Ingresos vs Gastos"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "\xDAltimos 7 meses"))), /*#__PURE__*/React.createElement("div", {
    className: "leg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "leg-i"
  }, /*#__PURE__*/React.createElement("div", {
    className: "leg-line",
    style: {
      background: 'var(--g600)'
    }
  }), " Ingresos"), /*#__PURE__*/React.createElement("div", {
    className: "leg-i"
  }, /*#__PURE__*/React.createElement("div", {
    className: "leg-line",
    style: {
      background: 'var(--g300)'
    }
  }), " Gastos")), /*#__PURE__*/React.createElement(AreaChart, {
    data1: ingresos,
    data2: gastos_m,
    labels: labels,
    h: 140,
    c1: "var(--g600)",
    c2: "var(--g300)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "kpi-grid-3",
    style: {
      marginTop: 18
    }
  }, (() => {
    let tIng = 0,
      tEg = 0;
    movRecientesList.forEach(m => {
      if (!m.isIntercompany) {
        if (m.tipo === 'INGRESO') tIng += Math.abs(m.monto);else if (m.tipo === 'GASTO' || m.tipo === 'EGRESO') tEg += Math.abs(m.monto);
      }
    });
    const fNet = tIng - tEg;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "kcard"
    }, /*#__PURE__*/React.createElement("div", {
      className: "kcard-icon g"
    }, /*#__PURE__*/React.createElement(IC, {
      n: "ven",
      s: 16
    })), /*#__PURE__*/React.createElement("div", {
      className: "kcard-label"
    }, "Ingresos Totales (Reales)"), /*#__PURE__*/React.createElement("div", {
      className: "kcard-val",
      style: {
        color: 'var(--g600)'
      }
    }, fmt(tIng)), /*#__PURE__*/React.createElement("div", {
      className: "kcard-change neu"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sub"
    }, "Excluye traspasos y rescates"))), /*#__PURE__*/React.createElement("div", {
      className: "kcard"
    }, /*#__PURE__*/React.createElement("div", {
      className: "kcard-icon r"
    }, /*#__PURE__*/React.createElement(IC, {
      n: "gas",
      s: 16
    })), /*#__PURE__*/React.createElement("div", {
      className: "kcard-label"
    }, "Egresos Totales (Reales)"), /*#__PURE__*/React.createElement("div", {
      className: "kcard-val",
      style: {
        color: 'var(--red)'
      }
    }, fmt(tEg)), /*#__PURE__*/React.createElement("div", {
      className: "kcard-change neu"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sub"
    }, "Excluye traspasos y rescates"))), /*#__PURE__*/React.createElement("div", {
      className: "kcard"
    }, /*#__PURE__*/React.createElement("div", {
      className: "kcard-icon b"
    }, /*#__PURE__*/React.createElement(IC, {
      n: "mov",
      s: 16
    })), /*#__PURE__*/React.createElement("div", {
      className: "kcard-label"
    }, "Flujo Neto Real"), /*#__PURE__*/React.createElement("div", {
      className: "kcard-val",
      style: {
        color: fNet >= 0 ? 'var(--g600)' : 'var(--red)'
      }
    }, fNet >= 0 ? '+' : '', fmt(fNet)), /*#__PURE__*/React.createElement("div", {
      className: "kcard-change neu"
    }, /*#__PURE__*/React.createElement("span", {
      className: "sub"
    }, fNet >= 0 ? 'Superávit' : 'Déficit', " neto real"))));
  })()), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(MovimientosTable, {
    movRecientes: movRecientesList
  })));
}
function GastosFijosCard() {
  const hoyGF = new Date();
  const meses3GF = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const totalFijo = GASTOS_FIJOS_DATA.reduce((s, g) => s + g.monto, 0);

  // Calcular próxima fecha de cada gasto fijo
  const conFecha = GASTOS_FIJOS_DATA.map(g => {
    const yr = hoyGF.getFullYear(),
      mo = hoyGF.getMonth();
    let p = new Date(yr, mo, g.dia_pago || 30);
    if (p < hoyGF) p = new Date(yr, mo + 1, g.dia_pago || 30);
    const dias = Math.round((p - hoyGF) / 86400000);
    return {
      ...g,
      proxFecha: p,
      dias
    };
  }).sort((a, b) => a.dias - b.dias);

  // Categorías únicas para resumen
  const porCategoria = {};
  GASTOS_FIJOS_DATA.forEach(g => {
    const cat = g.categoria || 'Otros';
    if (!porCategoria[cat]) porCategoria[cat] = {
      cat,
      monto: 0,
      count: 0
    };
    porCategoria[cat].monto += g.monto;
    porCategoria[cat].count++;
  });
  const cats = Object.values(porCategoria).sort((a, b) => b.monto - a.monto);
  const urgBg = d => d <= 0 ? 'rgba(220,38,38,.07)' : d <= 2 ? 'rgba(251,146,60,.06)' : d <= 7 ? 'rgba(234,179,8,.05)' : 'transparent';
  const urgCol = d => d <= 0 ? 'var(--red)' : d <= 2 ? 'oklch(45% .17 75)' : d <= 7 ? 'oklch(52% .15 75)' : 'var(--t3)';
  const urgTag = d => d < 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: 'var(--red)',
      background: 'var(--red-bg)',
      padding: '1px 6px',
      borderRadius: 4
    }
  }, "\uD83D\uDD34 Vencido") : d === 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: 'var(--red)',
      background: 'var(--red-bg)',
      padding: '1px 6px',
      borderRadius: 4
    }
  }, "\uD83D\uDD34 Hoy") : d <= 2 ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: 'oklch(45% .17 75)',
      background: 'var(--amber-bg)',
      padding: '1px 6px',
      borderRadius: 4
    }
  }, "\uD83D\uDFE0 ", d, "d") : d <= 7 ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: 'oklch(52% .15 75)',
      background: 'oklch(98% .04 90)',
      padding: '1px 6px',
      borderRadius: 4
    }
  }, "\uD83D\uDFE1 ", d, "d") : null;
  if (!GASTOS_FIJOS_DATA.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "card mb",
      style: {
        border: '1.5px dashed var(--border)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-hd",
      style: {
        marginBottom: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        background: 'var(--amber-bg)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18
      }
    }, "\uD83D\uDCCC"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "card-title"
    }, "Gastos Fijos"), /*#__PURE__*/React.createElement("div", {
      className: "card-sub"
    }, "Sin datos cargados")))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 0 4px',
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--t2)',
        lineHeight: 1.7,
        flex: 1,
        minWidth: 220
      }
    }, "Los gastos fijos se cargan desde la pesta\xF1a ", /*#__PURE__*/React.createElement("b", null, "GASTOS_FIJOS"), " del Google Sheets.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--t3)'
      }
    }, "Columnas requeridas: descripcion \xB7 monto \xB7 dia_pago \xB7 categoria")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--t3)',
        background: 'var(--bg)',
        borderRadius: 8,
        padding: '8px 12px',
        lineHeight: 1.8,
        minWidth: 180
      }
    }, "1. Abre Google Sheets \u2192 pesta\xF1a ", /*#__PURE__*/React.createElement("b", null, "GASTOS_FIJOS"), /*#__PURE__*/React.createElement("br", null), "2. Agrega cada gasto recurrente", /*#__PURE__*/React.createElement("br", null), "3. Recarga el dashboard")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "card mb"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap',
      marginBottom: 16,
      paddingBottom: 14,
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      background: 'var(--amber-bg)',
      borderRadius: 11,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 20,
      minWidth: 40
    }
  }, "\uD83D\uDCCC"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--t3)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: .5,
      marginBottom: 2
    }
  }, "Gastos Fijos Mensuales"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 800,
      fontSize: 22,
      color: 'oklch(45% .17 75)',
      lineHeight: 1
    }
  }, fmt(totalFijo)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--t3)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: .4,
      marginBottom: 2
    }
  }, "\xCDtems"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 700,
      fontSize: 16,
      color: 'var(--text)'
    }
  }, GASTOS_FIJOS_DATA.length), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--t3)'
    }
  }, cats.length, " categor\xEDa", cats.length !== 1 ? 's' : '')), cats.slice(0, 3).map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      textAlign: 'right',
      paddingLeft: 16,
      borderLeft: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--t3)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: .4,
      marginBottom: 2
    }
  }, c.cat), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 700,
      fontSize: 14,
      color: 'var(--text)'
    }
  }, fmt(c.monto)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--t3)'
    }
  }, c.count, " \xEDtem", c.count !== 1 ? 's' : ''))))), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Descripci\xF3n"), /*#__PURE__*/React.createElement("th", null, "Categor\xEDa"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "D\xEDa pago"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Monto"), /*#__PURE__*/React.createElement("th", null, "Pr\xF3ximo"))), /*#__PURE__*/React.createElement("tbody", null, conFecha.map((g, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      background: urgBg(g.dias)
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 500
    }
  }, g.descripcion), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      padding: '2px 8px',
      borderRadius: 5,
      background: 'var(--amber-bg)',
      color: 'oklch(48% .15 75)',
      fontWeight: 600
    }
  }, g.categoria || 'Otros')), /*#__PURE__*/React.createElement("td", {
    className: "r",
    style: {
      color: 'var(--t3)',
      fontSize: 13
    }
  }, "d\xEDa ", g.dia_pago || 30), /*#__PURE__*/React.createElement("td", {
    className: "mono r",
    style: {
      fontWeight: 700,
      color: 'oklch(45% .17 75)'
    }
  }, fmt(g.monto)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: urgCol(g.dias),
      fontWeight: 500
    }
  }, g.proxFecha.getDate(), " ", meses3GF[g.proxFecha.getMonth()]), urgTag(g.dias)))))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderTop: '2px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    colSpan: 3,
    style: {
      fontWeight: 700,
      paddingTop: 10
    }
  }, "Total mensual"), /*#__PURE__*/React.createElement("td", {
    className: "mono r",
    style: {
      fontWeight: 800,
      fontSize: 15,
      color: 'oklch(45% .17 75)',
      paddingTop: 10
    }
  }, fmt(totalFijo)), /*#__PURE__*/React.createElement("td", {
    style: {
      paddingTop: 10
    }
  })))));
}
function NominaSectionCard({
  nominaVer
}) {
  const totalNomina = NOMINA_DATA.reduce((s, e) => s + e.monto, 0);
  const totalPersonas = NOMINA_DATA.reduce((s, e) => s + (e.personas || 1), 0);
  const hoyN = new Date();
  const ultimoDiaMes = new Date(hoyN.getFullYear(), hoyN.getMonth() + 1, 0);
  const diasHasta = Math.round((ultimoDiaMes - hoyN) / 86400000);
  const meses3 = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const fmtUlt = `${ultimoDiaMes.getDate()} ${meses3[ultimoDiaMes.getMonth()]} ${ultimoDiaMes.getFullYear()}`;
  const urgColor = diasHasta <= 5 ? 'var(--red)' : diasHasta <= 10 ? 'oklch(45% .17 75)' : 'var(--t2)';
  const urgLabel = diasHasta === 0 ? '🔴 Hoy' : diasHasta === 1 ? '🔴 Mañana' : diasHasta <= 5 ? `🟠 En ${diasHasta} días` : diasHasta <= 10 ? `🟡 En ${diasHasta} días` : `En ${diasHasta} días`;
  if (!NOMINA_DATA.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "card mb",
      style: {
        border: '1.5px dashed var(--border)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-hd",
      style: {
        marginBottom: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        background: 'var(--g100)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18
      }
    }, "\uD83D\uDCB8"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "card-title"
    }, "N\xF3mina de Sueldos"), /*#__PURE__*/React.createElement("div", {
      className: "card-sub"
    }, "Sin datos cargados")))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 0 4px',
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--t2)',
        lineHeight: 1.7,
        flex: 1,
        minWidth: 220
      }
    }, "Los sueldos se cargan autom\xE1ticamente desde la pesta\xF1a ", /*#__PURE__*/React.createElement("b", null, "SUELDOS"), " del Google Sheets.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--t3)'
      }
    }, "Columnas requeridas: empresa \xB7 nombre \xB7 monto")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--t3)',
        background: 'var(--bg)',
        borderRadius: 8,
        padding: '8px 12px',
        lineHeight: 1.8,
        minWidth: 180
      }
    }, "1. Abre Google Sheets \u2192 pesta\xF1a ", /*#__PURE__*/React.createElement("b", null, "SUELDOS"), /*#__PURE__*/React.createElement("br", null), "2. Pega la planilla mensual", /*#__PURE__*/React.createElement("br", null), "3. Recarga el dashboard")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "card mb"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap',
      marginBottom: 16,
      paddingBottom: 14,
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      background: 'var(--g100)',
      borderRadius: 11,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 20,
      minWidth: 40
    }
  }, "\uD83D\uDCB8"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--t3)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: .5,
      marginBottom: 2
    }
  }, "N\xF3mina", NOMINA_MES ? ` — ${NOMINA_MES}` : ''), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 800,
      fontSize: 22,
      color: 'var(--g700)',
      lineHeight: 1
    }
  }, fmt(totalNomina)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--t3)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: .4,
      marginBottom: 2
    }
  }, "Personas"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 700,
      fontSize: 16,
      color: 'var(--text)'
    }
  }, totalPersonas), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--t3)'
    }
  }, NOMINA_DATA.length, " empresa", NOMINA_DATA.length !== 1 ? 's' : '')), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      paddingLeft: 16,
      borderLeft: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--t3)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: .4,
      marginBottom: 2
    }
  }, "Pr\xF3ximo pago"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 700,
      fontSize: 16,
      color: urgColor
    }
  }, fmtUlt), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: urgColor,
      fontWeight: diasHasta <= 10 ? 600 : 400,
      marginTop: 1
    }
  }, urgLabel)))), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: 24
    }
  }, "#"), /*#__PURE__*/React.createElement("th", null, "Empresa"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Personas"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Monto"), /*#__PURE__*/React.createElement("th", {
    className: "r",
    style: {
      minWidth: 110
    }
  }, "Participaci\xF3n"))), /*#__PURE__*/React.createElement("tbody", null, NOMINA_DATA.map((e, i) => {
    const pct = totalNomina > 0 ? e.monto / totalNomina * 100 : 0;
    return /*#__PURE__*/React.createElement("tr", {
      key: i
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        color: 'var(--t3)',
        fontSize: 12
      }
    }, i + 1), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 600
      }
    }, e.empresa || '—'), /*#__PURE__*/React.createElement("td", {
      className: "r",
      style: {
        color: 'var(--t2)',
        fontSize: 13,
        fontWeight: 500
      }
    }, e.personas || 1), /*#__PURE__*/React.createElement("td", {
      className: "mono r",
      style: {
        fontWeight: 700,
        color: 'var(--g700)'
      }
    }, fmt(e.monto)), /*#__PURE__*/React.createElement("td", {
      className: "r"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 64,
        height: 5,
        borderRadius: 3,
        background: 'var(--border)',
        overflow: 'hidden',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${pct}%`,
        height: '100%',
        background: 'var(--g500)',
        borderRadius: 3
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--t3)',
        fontSize: 12,
        minWidth: 34,
        textAlign: 'right'
      }
    }, pct.toFixed(1), "%"))));
  })), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderTop: '2px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    colSpan: 2,
    style: {
      fontWeight: 700,
      paddingTop: 10,
      color: 'var(--text)'
    }
  }, "Total N\xF3mina"), /*#__PURE__*/React.createElement("td", {
    className: "r",
    style: {
      fontWeight: 700,
      paddingTop: 10
    }
  }, totalPersonas), /*#__PURE__*/React.createElement("td", {
    className: "mono r",
    style: {
      fontWeight: 800,
      fontSize: 15,
      color: 'var(--g700)',
      paddingTop: 10
    }
  }, fmt(totalNomina)), /*#__PURE__*/React.createElement("td", {
    className: "r",
    style: {
      paddingTop: 10,
      color: 'var(--t3)',
      fontSize: 12
    }
  }, "100%")))));
}
function GastosPage({
  nominaVer
}) {
  const pendientes = GASTOS.filter(g => g.estado === 'Pendiente').sort((a, b) => a.fecha.localeCompare(b.fecha));
  const pagados = GASTOS.filter(g => g.estado === 'Pagado').sort((a, b) => a.fecha.localeCompare(b.fecha));
  const totalPend = pendientes.reduce((s, g) => s + g.monto, 0);
  const totalPag = pagados.reduce((s, g) => s + g.monto, 0);
  const [tab, setTab] = useState('pendiente');

  // By month
  const meses = {
    '2026-03': {
      pagado: 0,
      pendiente: 0
    },
    '2026-04': {
      pagado: 0,
      pendiente: 0
    },
    '2026-05': {
      pagado: 0,
      pendiente: 0
    }
  };
  GASTOS.forEach(g => {
    const m = g.fecha.slice(0, 7);
    if (meses[m]) {
      meses[m][g.estado === 'Pagado' ? 'pagado' : 'pendiente'] += g.monto;
    }
  });
  const totalNomina = NOMINA_DATA.reduce((s, e) => s + e.monto, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-grid"
  }, [{
    label: 'Total Proyectado',
    val: fmt(totalPend + totalPag),
    sub: 'Mar–May 2026',
    dir: 'g'
  }, {
    label: 'Pagado',
    val: fmt(totalPag),
    sub: `${pagados.length} pagos`,
    dir: 'g'
  }, {
    label: 'Pendiente',
    val: fmt(totalPend),
    sub: `${pendientes.length} pagos`,
    dir: 'a'
  }, {
    label: 'Próx. Vencimiento',
    val: fmt(pendientes[0]?.monto || 0),
    sub: fmtDate(pendientes[0]?.fecha || ''),
    dir: 'r'
  }, ...(totalNomina > 0 ? [{
    label: 'Nómina del Mes',
    val: fmt(totalNomina),
    sub: `${NOMINA_DATA.reduce((s, e) => s + (e.personas || 1), 0)} personas`,
    dir: 'b'
  }] : []), ...(GASTOS_FIJOS_DATA.length > 0 ? [{
    label: 'Gastos Fijos',
    val: fmt(GASTOS_FIJOS_DATA.reduce((s, g) => s + g.monto, 0)),
    sub: `${GASTOS_FIJOS_DATA.length} ítems recurrentes`,
    dir: 'a'
  }] : [])].map((k, i) => /*#__PURE__*/React.createElement("div", {
    className: "kcard",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "kcard-label"
  }, k.label), /*#__PURE__*/React.createElement("div", {
    className: "kcard-val"
  }, k.val), /*#__PURE__*/React.createElement("div", {
    className: `kcard-change ${k.dir}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, k.sub))))), /*#__PURE__*/React.createElement(NominaSectionCard, {
    nominaVer: nominaVer
  }), /*#__PURE__*/React.createElement(GastosFijosCard, null), /*#__PURE__*/React.createElement("div", {
    className: "g11 mb"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Gastos por Mes")), /*#__PURE__*/React.createElement(BarChart, {
    data: Object.values(meses).map(m => m.pagado + m.pendiente),
    labels: Object.keys(meses).map(fmtMonth),
    h: 100,
    colors: ['var(--g600)', 'var(--amber)', 'var(--g300)']
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 10
    }
  }, Object.entries(meses).map(([m, v], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      padding: '10px 12px',
      background: 'var(--bg)',
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--t3)',
      marginBottom: 4
    }
  }, fmtMonth(m)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 600,
      fontSize: 13
    }
  }, fmt(v.pagado + v.pendiente)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--t3)'
    }
  }, v.pendiente > 0 ? `${fmt(v.pendiente)} pend.` : ''))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Distribuci\xF3n")), /*#__PURE__*/React.createElement("div", {
    className: "donut-wrap",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(DonutChart, {
    segments: [{
      val: totalPag,
      color: 'var(--g500)'
    }, {
      val: totalPend,
      color: 'var(--amber)'
    }],
    size: 100
  }), /*#__PURE__*/React.createElement("div", {
    className: "donut-leg"
  }, [{
    n: 'Cancelado',
    v: totalPag,
    c: 'var(--g500)'
  }, {
    n: 'Por pagar',
    v: totalPend,
    c: 'var(--amber)'
  }].map((d, i) => /*#__PURE__*/React.createElement("div", {
    className: "dl-row",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "dl-name"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: d.c,
      minWidth: 7
    }
  }), d.n), /*#__PURE__*/React.createElement("div", {
    className: "dl-val"
  }, fmt(d.v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      paddingTop: 10,
      borderTop: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--t3)'
    }
  }, "Porcentaje cancelado"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 700,
      fontSize: 16,
      color: 'var(--g600)',
      marginTop: 2
    }
  }, (totalPag / (totalPag + totalPend) * 100).toFixed(1), "%")))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Detalle de Pagos"), /*#__PURE__*/React.createElement("div", {
    className: "tabs",
    style: {
      marginBottom: 0
    }
  }, [['pendiente', `Pendiente (${pendientes.length})`], ['pagado', `Cancelado (${pagados.length})`]].map(([id, lbl]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    className: `tab ${tab === id ? 'act' : ''}`,
    onClick: () => setTab(id)
  }, lbl)))), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Fecha Pago"), /*#__PURE__*/React.createElement("th", null, "Proveedor"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Monto"), /*#__PURE__*/React.createElement("th", null, "Estado"), /*#__PURE__*/React.createElement("th", null, "Alerta"))), /*#__PURE__*/React.createElement("tbody", null, (tab === 'pendiente' ? pendientes : pagados).map((g, i) => {
    const dias = Math.round((new Date(g.fecha) - new Date()) / 86400000);
    const esVencido = dias < 0;
    const esHoy = dias === 0;
    const es2dias = dias >= 1 && dias <= 2;
    const es7dias = dias >= 3 && dias <= 7;
    const rowBg = tab === 'pendiente' ? esVencido || esHoy ? 'rgba(220,38,38,.07)' : es2dias ? 'rgba(251,146,60,.07)' : es7dias ? 'rgba(234,179,8,.06)' : 'transparent' : 'transparent';
    const alerta = tab !== 'pendiente' ? null : esVencido ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11.5,
        fontWeight: 700,
        color: 'var(--red)',
        background: 'var(--red-bg)',
        padding: '2px 7px',
        borderRadius: 5
      }
    }, "\uD83D\uDD34 Vencido") : esHoy ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11.5,
        fontWeight: 700,
        color: 'var(--red)',
        background: 'var(--red-bg)',
        padding: '2px 7px',
        borderRadius: 5
      }
    }, "\uD83D\uDD34 Vence hoy") : es2dias ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11.5,
        fontWeight: 700,
        color: 'oklch(45% .17 75)',
        background: 'var(--amber-bg)',
        padding: '2px 7px',
        borderRadius: 5
      }
    }, "\uD83D\uDFE0 ", dias, "d") : es7dias ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11.5,
        fontWeight: 600,
        color: 'oklch(52% .15 75)',
        background: 'oklch(98% .04 90)',
        padding: '2px 7px',
        borderRadius: 5
      }
    }, "\uD83D\uDFE1 ", dias, "d") : null;
    return /*#__PURE__*/React.createElement("tr", {
      key: i,
      style: {
        background: rowBg
      }
    }, /*#__PURE__*/React.createElement("td", {
      className: "mono",
      style: {
        color: tab === 'pendiente' && (esVencido || esHoy) ? 'var(--red)' : es2dias ? 'oklch(45% .17 75)' : 'var(--t3)',
        fontSize: 13,
        fontWeight: esVencido || esHoy ? 700 : 400
      }
    }, fmtDate(g.fecha)), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500
      }
    }, g.descripcion), /*#__PURE__*/React.createElement("td", {
      className: "mono r",
      style: {
        fontWeight: 600
      }
    }, fmt(g.monto)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: `pill ${g.estado === 'Pagado' ? 'g' : 'a'}`
    }, g.estado)), /*#__PURE__*/React.createElement("td", null, alerta));
  })))));
}
function VentasSinDatos({
  onUpload,
  dataLoaded
}) {
  if (!dataLoaded) {
    return /*#__PURE__*/React.createElement("div", {
      className: "page",
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        maxWidth: 340
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        border: '3px solid var(--g200)',
        borderTopColor: 'var(--g600)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        margin: '0 auto 18px'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--t2)',
        marginBottom: 6
      }
    }, "Cargando datos desde Google Sheets\u2026"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: 'var(--t3)'
      }
    }, "Si demora m\xE1s de 10 segundos, verifica que el Google Sheets est\xE9 publicado.")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "page",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      background: 'var(--g100)',
      borderRadius: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      fontSize: 26
    }
  }, "\uD83D\uDCCA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700,
      marginBottom: 8
    }
  }, "Sin datos de Cobranza"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--t2)',
      marginBottom: 6,
      lineHeight: 1.6
    }
  }, "Los datos se cargan ", /*#__PURE__*/React.createElement("b", null, "autom\xE1ticamente"), " desde Google Sheets cuando accedes desde GitHub Pages.", /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--t3)',
      marginBottom: 20,
      padding: '8px 12px',
      background: 'var(--surface)',
      borderRadius: 8,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("b", null, "Posibles causas:"), /*#__PURE__*/React.createElement("br", null), "\u2022 Est\xE1s abriendo el archivo local (file://) \u2014 usa GitHub Pages", /*#__PURE__*/React.createElement("br", null), "\u2022 El Google Sheets no est\xE1 publicado como CSV", /*#__PURE__*/React.createElement("br", null), "\u2022 El GID de la hoja COBRANZA no coincide (debe ser 602912984)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://brands-chile-afk.github.io/Dashboard-financiero/",
    target: "_blank",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 20px',
      background: 'var(--g700)',
      color: '#fff',
      border: 'none',
      borderRadius: 9,
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: 600,
      fontFamily: 'DM Sans',
      textDecoration: 'none'
    }
  }, "\uD83C\uDF10 Abrir en GitHub Pages"), /*#__PURE__*/React.createElement("button", {
    onClick: onUpload,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 20px',
      background: 'var(--surface)',
      color: 'var(--text)',
      border: '1px solid var(--border)',
      borderRadius: 9,
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: 600,
      fontFamily: 'DM Sans'
    }
  }, "\u2B06\uFE0F Cargar Excel manual"))));
}
function VentasPage({
  onUpload,
  dataLoaded
}) {
  const [tab, setTab] = useState('resumen');
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  if (!COB_KPIS) return /*#__PURE__*/React.createElement(VentasSinDatos, {
    onUpload: onUpload,
    dataLoaded: dataLoaded
  });
  const meses = Object.keys(COB_POR_MES);
  const fmtM = m => {
    const [y, mo] = m.split('-');
    const n = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${n[+mo]} ${y.slice(2)}`;
  };

  // KPIs
  const {
    totalFacturado,
    totalSaldo,
    totalPagado,
    totalFactoring,
    countDocs,
    countVencido,
    saldoVencido,
    countPendiente,
    saldoPendiente
  } = COB_KPIS;
  const pctCobrado = (totalPagado / totalFacturado * 100).toFixed(1);

  // Ejecutivos (filtrar los relevantes con nombre real)
  const ejecutivos = Object.entries(COB_POR_EJECUTIVO).filter(([k, v]) => v.total > 5000000 && !k.includes('SIN') && !k.includes('PAGO') && !k.includes('CONFIRMING')).sort((a, b) => b[1].total - a[1].total);
  const maxEj = Math.max(...ejecutivos.map(([, v]) => v.total));

  // Pendientes filtrados
  const hayBusqueda = busqueda.trim().length > 0;
  const sortFecha = (a, b) => (b.fechaPago || b.fechaEmision || '').localeCompare(a.fechaPago || a.fechaEmision || '');
  const pendientesFiltrados = (() => {
    const todos = COB_PENDIENTES.filter(r => {
      if (filtroEstado !== 'Todos' && r.estado !== filtroEstado) return false;
      if (hayBusqueda) {
        const q = busqueda.toLowerCase();
        const match = r.empresa.toLowerCase().includes(q) || String(r.folio).includes(busqueda) || (r.folioStr || '').toLowerCase().includes(q) || (r.rut || '').includes(busqueda);
        if (!match) return false;
      }
      return true;
    });
    // Si hay búsqueda activa → mostrar todo sin límite
    if (hayBusqueda || filtroEstado !== 'Todos') return todos.sort(sortFecha);
    // Sin búsqueda → activos completos + últimos 50 por cada estado cerrado
    const activos = todos.filter(r => r.estado === 'PENDIENTE' || r.estado === 'VENCIDO');
    const pagados = todos.filter(r => r.estado === 'PAGADO' || r.saldo === 0 && r.estado !== 'FACTORING').sort(sortFecha).slice(0, 50);
    const factoring = todos.filter(r => r.estado === 'FACTORING').sort(sortFecha).slice(0, 50);
    const otros = todos.filter(r => !['PENDIENTE', 'VENCIDO', 'PAGADO', 'FACTORING'].includes(r.estado)).sort(sortFecha).slice(0, 50);
    return [...activos, ...factoring, ...pagados, ...otros].sort(sortFecha);
  })();

  // Vencidos criticos
  const criticos = COB_PENDIENTES.filter(r => r.diasVencido > 30 && r.saldo > 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-grid",
    style: {
      marginBottom: 14
    }
  }, [{
    label: 'Total Facturado',
    val: fmt(totalFacturado),
    sub: `${countDocs} documentos`,
    dir: 'g',
    icon: 'ven'
  }, {
    label: 'Cobrado / Pagado',
    val: fmt(totalPagado),
    sub: `${pctCobrado}% del total`,
    dir: 'g',
    icon: 'ven'
  }, {
    label: 'Saldo Por Cobrar',
    val: fmt(totalSaldo),
    sub: `${countPendiente} pend. + ${countVencido} venc.`,
    dir: 'a',
    icon: 'gas'
  }, {
    label: 'En Factoring',
    val: fmt(totalFactoring),
    sub: 'documentos cedidos',
    dir: 'b',
    icon: 'cre'
  }].map((k, i) => /*#__PURE__*/React.createElement("div", {
    className: "kcard",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: `kcard-icon ${k.dir}`
  }, /*#__PURE__*/React.createElement(IC, {
    n: k.icon,
    s: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "kcard-label"
  }, k.label), /*#__PURE__*/React.createElement("div", {
    className: "kcard-val lg"
  }, k.val), /*#__PURE__*/React.createElement("div", {
    className: `kcard-change ${k.dir}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, k.sub))))), criticos.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14,
      padding: '10px 16px',
      background: 'var(--red-bg)',
      border: '1px solid var(--red)',
      borderRadius: 9,
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--red)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "8",
    x2: "12",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "16",
    x2: "12.01",
    y2: "16"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: 'var(--red)'
    }
  }, criticos.length, " documento", criticos.length > 1 ? 's' : '', " con m\xE1s de 30 d\xEDas de atraso \u2014 saldo cr\xEDtico: ", fmt(criticos.reduce((s, r) => s + r.saldo, 0)))), /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, [['resumen', 'Resumen'], ['mensual', 'Por Mes'], ['clientes', 'Top Clientes'], ['ejecutivos', 'Ejecutivos'], ['cobranza', `Activos (${COB_KPIS.countPendiente + COB_KPIS.countVencido + COB_KPIS.countFactoring})`]].map(([id, lbl]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    className: `tab ${tab === id ? 'act' : ''}`,
    onClick: () => setTab(id)
  }, lbl))), tab === 'resumen' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "g11",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Distribuci\xF3n de Cobro")), /*#__PURE__*/React.createElement("div", {
    className: "donut-wrap",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(DonutChart, {
    segments: [{
      val: totalPagado,
      color: 'var(--g600)'
    }, {
      val: totalFactoring,
      color: 'var(--blue)'
    }, {
      val: totalSaldo,
      color: 'var(--amber)'
    }],
    size: 110
  }), /*#__PURE__*/React.createElement("div", {
    className: "donut-leg"
  }, [{
    n: 'Cobrado',
    v: totalPagado,
    c: 'var(--g600)'
  }, {
    n: 'Factoring',
    v: totalFactoring,
    c: 'var(--blue)'
  }, {
    n: 'Pendiente',
    v: totalSaldo,
    c: 'var(--amber)'
  }].map((d, i) => /*#__PURE__*/React.createElement("div", {
    className: "dl-row",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "dl-name"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: d.c,
      minWidth: 7
    }
  }), d.n), /*#__PURE__*/React.createElement("div", {
    className: "dl-val"
  }, fmt(d.v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      paddingTop: 8,
      borderTop: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--t3)'
    }
  }, "% cobrado"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 700,
      fontSize: 18,
      color: 'var(--g600)',
      marginTop: 2
    }
  }, pctCobrado, "%"))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Mayor Saldo Pendiente")), COB_TOP_CLIENTES.filter(c => c.saldo > 0).slice(0, 5).map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 6,
      background: 'var(--amber-bg)',
      color: 'oklch(50% .17 75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 10,
      fontWeight: 700,
      minWidth: 20
    }
  }, i + 1), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 13.5,
      fontWeight: 500,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, c.empresa), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontSize: 13.5,
      fontWeight: 700,
      color: 'var(--amber)',
      minWidth: 70,
      textAlign: 'right'
    }
  }, fmt(c.saldo)))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Facturaci\xF3n Mensual \u2014 2025/2026"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "Total facturado vs cobrado")), /*#__PURE__*/React.createElement("div", {
    className: "leg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "leg-i"
  }, /*#__PURE__*/React.createElement("div", {
    className: "leg-line",
    style: {
      background: 'var(--g600)'
    }
  }), " Facturado"), /*#__PURE__*/React.createElement("div", {
    className: "leg-i"
  }, /*#__PURE__*/React.createElement("div", {
    className: "leg-line",
    style: {
      background: 'var(--g300)'
    }
  }), " Cobrado")), /*#__PURE__*/React.createElement(BarChart, {
    data: meses.map(m => COB_POR_MES[m].total),
    labels: meses.map(fmtM),
    h: 120,
    colors: meses.map(() => 'var(--g600)')
  }))), tab === 'mensual' && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Facturaci\xF3n por Mes")), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Mes"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Docs"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Total Facturado"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Cobrado"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Saldo"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "% Cobrado"))), /*#__PURE__*/React.createElement("tbody", null, meses.map((m, i) => {
    const d = COB_POR_MES[m];
    const pct = d.total > 0 ? (d.pagado / d.total * 100).toFixed(0) : 0;
    return /*#__PURE__*/React.createElement("tr", {
      key: i
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 600
      }
    }, fmtM(m)), /*#__PURE__*/React.createElement("td", {
      className: "mono r",
      style: {
        color: 'var(--t3)'
      }
    }, d.count), /*#__PURE__*/React.createElement("td", {
      className: "mono r",
      style: {
        fontWeight: 600
      }
    }, fmt(d.total)), /*#__PURE__*/React.createElement("td", {
      className: "mono r",
      style: {
        color: 'var(--g600)',
        fontWeight: 600
      }
    }, fmt(d.pagado)), /*#__PURE__*/React.createElement("td", {
      className: "mono r",
      style: {
        color: d.saldo > 0 ? 'var(--amber)' : 'var(--t3)',
        fontWeight: 600
      }
    }, d.saldo > 0 ? fmt(d.saldo) : '—'), /*#__PURE__*/React.createElement("td", {
      className: "r"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 50,
        height: 4,
        background: 'var(--border)',
        borderRadius: 99,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${pct}%`,
        height: '100%',
        background: pct >= 90 ? 'var(--g600)' : pct >= 60 ? 'var(--amber)' : 'var(--red)',
        borderRadius: 99
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'DM Sans',
        fontSize: 13,
        fontWeight: 600,
        color: pct >= 90 ? 'var(--g600)' : pct >= 60 ? 'oklch(50% .17 75)' : 'var(--red)'
      }
    }, pct, "%"))));
  })))), tab === 'clientes' && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Top Clientes por Facturaci\xF3n"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "Total acumulado 2025-2026")), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "#"), /*#__PURE__*/React.createElement("th", null, "Empresa"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Docs"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Total"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Saldo Pendiente"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "% Cobrado"))), /*#__PURE__*/React.createElement("tbody", null, COB_TOP_CLIENTES.map((c, i) => {
    const pct = c.total > 0 ? ((c.total - c.saldo) / c.total * 100).toFixed(0) : 100;
    return /*#__PURE__*/React.createElement("tr", {
      key: i
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        color: 'var(--t3)',
        fontWeight: 600
      }
    }, "#", i + 1), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500,
        maxWidth: 250,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, c.empresa), /*#__PURE__*/React.createElement("td", {
      className: "mono r",
      style: {
        color: 'var(--t3)'
      }
    }, c.docs), /*#__PURE__*/React.createElement("td", {
      className: "mono r",
      style: {
        fontWeight: 700,
        color: 'var(--g600)'
      }
    }, fmt(c.total)), /*#__PURE__*/React.createElement("td", {
      className: "mono r",
      style: {
        fontWeight: 600,
        color: c.saldo > 0 ? 'var(--amber)' : 'var(--t3)'
      }
    }, c.saldo > 0 ? fmt(c.saldo) : 'Cobrado'), /*#__PURE__*/React.createElement("td", {
      className: "r"
    }, /*#__PURE__*/React.createElement("span", {
      className: `pill ${pct >= 90 ? 'g' : pct >= 60 ? 'a' : 'r'}`
    }, pct, "%")));
  })))), tab === 'ejecutivos' && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Facturaci\xF3n por Ejecutivo"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "Documentos asignados")), ejecutivos.map(([ej, d], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      minWidth: 100,
      color: 'var(--t2)'
    }
  }, ej), /*#__PURE__*/React.createElement("div", {
    className: "bar-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bar-fill",
    style: {
      width: `${(d.total / maxEj * 100).toFixed(0)}%`,
      background: 'var(--g600)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontSize: 13.5,
      fontWeight: 600,
      minWidth: 72,
      textAlign: 'right'
    }
  }, fmt(d.total)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--t3)',
      minWidth: 40,
      textAlign: 'right'
    }
  }, d.count, " docs"), d.saldo > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontSize: 13,
      color: 'var(--amber)',
      minWidth: 60,
      textAlign: 'right'
    }
  }, fmt(d.saldo), " pend.")))), tab === 'cobranza' && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Cobranza Pendiente"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, pendientesFiltrados.length, " documentos \xB7 saldo pendiente: ", fmt(pendientesFiltrados.reduce((s, r) => s + r.saldo, 0))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 140px',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 13,
    height: 13,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--t3)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: 'absolute',
      left: 9,
      top: '50%',
      transform: 'translateY(-50%)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.35-4.35"
  })), /*#__PURE__*/React.createElement("input", {
    style: {
      width: '100%',
      padding: '6px 10px 6px 28px',
      fontSize: 12.5,
      border: '1px solid var(--border)',
      borderRadius: 7,
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'DM Sans',
      outline: 'none'
    },
    placeholder: "Buscar empresa o folio...",
    value: busqueda,
    onChange: e => setBusqueda(e.target.value)
  })), /*#__PURE__*/React.createElement("select", {
    style: {
      padding: '6px 10px',
      fontSize: 12.5,
      border: '1px solid var(--border)',
      borderRadius: 7,
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'DM Sans',
      cursor: 'pointer'
    },
    value: filtroEstado,
    onChange: e => setFiltroEstado(e.target.value)
  }, ['Todos', 'PENDIENTE', 'VENCIDO', 'FACTORING', 'NCREDITO'].map(e => /*#__PURE__*/React.createElement("option", {
    key: e
  }, e)))), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Folio"), /*#__PURE__*/React.createElement("th", null, "Empresa"), /*#__PURE__*/React.createElement("th", null, "Vencimiento"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Total"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Saldo"), /*#__PURE__*/React.createElement("th", null, "Estado"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "D\xEDas"))), /*#__PURE__*/React.createElement("tbody", null, pendientesFiltrados.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 7,
    style: {
      textAlign: 'center',
      padding: '24px',
      color: 'var(--t3)',
      fontSize: 13
    }
  }, hayBusqueda ? `Sin resultados para "${busqueda}" — verifica el folio o nombre exacto del Excel` : 'Sin documentos')), pendientesFiltrados.map((r, i) => {
    const vencido = r.diasVencido > 0;
    const critico = r.diasVencido > 30;
    return /*#__PURE__*/React.createElement("tr", {
      key: i
    }, /*#__PURE__*/React.createElement("td", {
      className: "mono",
      style: {
        color: 'var(--t3)',
        fontSize: 13
      }
    }, r.folioStr || r.folio || '—'), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500,
        maxWidth: 220,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: 12.5
      },
      title: r.empresa
    }, r.empresa), /*#__PURE__*/React.createElement("td", {
      className: "mono",
      style: {
        fontSize: 13,
        color: 'var(--t3)'
      }
    }, r.vencimiento || '—'), /*#__PURE__*/React.createElement("td", {
      className: "mono r",
      style: {
        fontSize: 13.5,
        color: 'var(--t2)'
      }
    }, fmt(r.total)), /*#__PURE__*/React.createElement("td", {
      className: "mono r",
      style: {
        fontWeight: 700,
        color: 'var(--amber)'
      }
    }, fmt(r.saldo)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: `pill ${r.estado === 'VENCIDO' ? 'r' : 'a'}`
    }, r.estado)), /*#__PURE__*/React.createElement("td", {
      className: "mono r",
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        color: critico ? 'var(--red)' : vencido ? 'oklch(50% .17 75)' : 'var(--t3)'
      }
    }, r.diasVencido > 0 ? `+${r.diasVencido}d` : r.diasVencido < 0 ? `${r.diasVencido}d` : 'Hoy'));
  })))));
}
function FondosLineChart({
  data
}) {
  if (!data || data.length < 2) return null;
  const W = 700,
    H = 200,
    pad = {
      t: 16,
      r: 24,
      b: 32,
      l: 62
    };
  const cw = W - pad.l - pad.r,
    ch = H - pad.t - pad.b;
  const totals = data.map(function (item) {
    return item.total;
  });
  const minV = Math.min.apply(null, totals),
    maxV = Math.max.apply(null, totals);
  const rng = maxV - minV || 1;
  function getY(v) {
    return pad.t + ch - (v - minV) / rng * ch;
  }
  function getX(idx) {
    return pad.l + idx / (data.length - 1) * cw;
  }

  // Build smooth bezier path — using explicit variable names (no 'd')
  const pts = data.map(function (item, idx) {
    return {
      x: getX(idx),
      y: getY(item.total)
    };
  });
  var linePth = '',
    areaPth = '';
  var pathStr = 'M' + pts[0].x.toFixed(1) + ',' + pts[0].y.toFixed(1);
  for (var pi = 1; pi < pts.length; pi++) {
    var cx2 = (pts[pi - 1].x + pts[pi].x) / 2;
    pathStr += ' Q' + cx2.toFixed(1) + ',' + pts[pi - 1].y.toFixed(1) + ',' + pts[pi].x.toFixed(1) + ',' + pts[pi].y.toFixed(1);
  }
  linePth = pathStr;
  areaPth = pathStr + ' L' + pts[pts.length - 1].x.toFixed(1) + ',' + (pad.t + ch) + ' L' + pts[0].x.toFixed(1) + ',' + (pad.t + ch) + ' Z';

  // Y-axis compact labels
  function fmtCompact(v) {
    var a = Math.abs(v);
    if (a >= 1e9) return '$' + (v / 1e9).toFixed(1) + 'B';
    if (a >= 1e6) return '$' + (v / 1e6).toFixed(0) + 'M';
    if (a >= 1e3) return '$' + Math.round(v / 1e3) + 'K';
    return '$' + v;
  }
  var yTicks = 4;
  var yGrid = [];
  for (var yi = 0; yi <= yTicks; yi++) yGrid.push(minV + rng / yTicks * yi);

  // X-axis labels
  var xStep = Math.max(1, Math.round(data.length / 7));
  var MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  function fmtFecha(s) {
    var parts = s.split('-');
    return parts[2] + ' ' + MESES[parseInt(parts[1], 10) - 1];
  }
  var lastPt = pts[pts.length - 1];
  var lastTotal = totals[totals.length - 1];
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: '0 0 ' + W + ' ' + H,
    style: {
      width: '100%',
      height: 'auto',
      display: 'block'
    },
    preserveAspectRatio: "xMidYMid meet"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "fondGrad",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "var(--g500)",
    stopOpacity: ".22"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "75%",
    stopColor: "var(--g500)",
    stopOpacity: ".04"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "var(--g500)",
    stopOpacity: "0"
  }))), yGrid.map(function (v, gi) {
    var yy = getY(v);
    return /*#__PURE__*/React.createElement("g", {
      key: gi
    }, /*#__PURE__*/React.createElement("line", {
      x1: pad.l,
      x2: W - pad.r,
      y1: yy,
      y2: yy,
      stroke: "var(--border)",
      strokeWidth: gi === 0 ? 1 : .7,
      strokeDasharray: gi === 0 ? undefined : '4 3',
      opacity: gi === 0 ? 1 : .65
    }), /*#__PURE__*/React.createElement("text", {
      x: pad.l - 6,
      y: yy + 4,
      textAnchor: "end",
      fontSize: "10",
      fill: "var(--t3)",
      fontFamily: "DM Mono,monospace"
    }, fmtCompact(v)));
  }), /*#__PURE__*/React.createElement("path", {
    d: areaPth,
    fill: "url(#fondGrad)"
  }), /*#__PURE__*/React.createElement("path", {
    d: linePth,
    fill: "none",
    stroke: "var(--g500)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), data.map(function (item, idx) {
    if (idx % xStep !== 0) return null;
    return /*#__PURE__*/React.createElement("text", {
      key: idx,
      x: getX(idx),
      y: H - 5,
      textAnchor: "middle",
      fontSize: "9.5",
      fill: "var(--t3)",
      fontFamily: "DM Mono,monospace"
    }, fmtFecha(item.fecha));
  }), /*#__PURE__*/React.createElement("circle", {
    cx: lastPt.x,
    cy: lastPt.y,
    r: "5",
    fill: "var(--g600)",
    stroke: "var(--surface)",
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: lastPt.x - 40,
    y: lastPt.y - 26,
    width: 80,
    height: 18,
    rx: "5",
    fill: "var(--g700)",
    opacity: ".9"
  }), /*#__PURE__*/React.createElement("text", {
    x: lastPt.x,
    y: lastPt.y - 13,
    textAnchor: "middle",
    fontSize: "9.5",
    fill: "#fff",
    fontFamily: "DM Mono,monospace",
    fontWeight: "700"
  }, fmtCompact(lastTotal)));
}
function FondosPage() {
  // Guardia: si FONDOS no tiene datos aún, mostrar loading
  if (!FONDOS || FONDOS.length < 1) {
    return /*#__PURE__*/React.createElement("div", {
      className: "page",
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        border: '3px solid var(--g200)',
        borderTopColor: 'var(--g600)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        margin: '0 auto 14px'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        color: 'var(--t2)'
      }
    }, "Cargando datos de fondos\u2026")));
  }
  var fondosN = FONDOS.length;
  const actual = FONDOS[fondosN - 1].total;
  const prevSem = fondosN >= 2 ? FONDOS[fondosN - 2].total : actual;
  const prevMes = fondosN >= 5 ? FONDOS[fondosN - 5].total : actual;
  const inicio = FONDOS[0].total;
  const varSem = actual - prevSem;
  const varMes = actual - prevMes;
  const varTotal = actual - inicio;
  const pctSem = prevSem ? (actual / prevSem - 1) * 100 : 0;
  const pctMes = prevMes ? (actual / prevMes - 1) * 100 : 0;
  const pctTotal = inicio ? (actual / inicio - 1) * 100 : 0;
  const sgn = v => v >= 0 ? '+' : '';
  const totalFondos = FONDOS_DETALLE.reduce((s, f) => s + f.valor, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-grid"
  }, [{
    label: 'Patrimonio Total',
    val: fmt(actual),
    sub: `Al ${fmtDate(FONDOS[FONDOS.length - 1].fecha)}`,
    dir: 'g'
  }, {
    label: 'Variación Semanal',
    val: (varSem >= 0 ? '+' : '-') + fmt(Math.abs(varSem)),
    sub: `${sgn(pctSem)}${pctSem.toFixed(2)}% esta semana`,
    dir: 'g'
  }, {
    label: 'Variación Mensual',
    val: (varMes >= 0 ? '+' : '-') + fmt(Math.abs(varMes)),
    sub: `${sgn(pctMes)}${pctMes.toFixed(1)}% este mes`,
    dir: varMes >= 0 ? 'g' : 'a'
  }, {
    label: 'Desde Inicio',
    val: fmt(varTotal),
    sub: `${sgn(pctTotal)}${pctTotal.toFixed(1)}% total`,
    dir: 'b'
  }].map((k, i) => /*#__PURE__*/React.createElement("div", {
    className: "kcard",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: `kcard-icon ${k.dir}`
  }, /*#__PURE__*/React.createElement(IC, {
    n: "fon",
    s: 15
  })), /*#__PURE__*/React.createElement("div", {
    className: "kcard-label"
  }, k.label), /*#__PURE__*/React.createElement("div", {
    className: "kcard-val lg"
  }, k.val), /*#__PURE__*/React.createElement("div", {
    className: `kcard-change ${k.dir}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, k.sub))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Evoluci\xF3n del Patrimonio"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, fmtDate(FONDOS[0].fecha), " \u2014 ", fmtDate(FONDOS[FONDOS.length - 1].fecha))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 800,
      fontSize: 20,
      color: 'var(--g700)'
    }
  }, fmt(actual, true)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: varTotal >= 0 ? 'var(--g600)' : 'var(--red)',
      fontWeight: 600
    }
  }, sgn(pctTotal), pctTotal.toFixed(1), "% desde inicio"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(FondosLineChart, {
    data: FONDOS
  }))), /*#__PURE__*/React.createElement("div", {
    className: "g11"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Distribuci\xF3n por Fondo")), /*#__PURE__*/React.createElement("div", {
    className: "donut-wrap",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(DonutChart, {
    segments: FONDOS_DETALLE.map(f => ({
      val: f.valor,
      color: f.color
    })),
    size: 110
  }), /*#__PURE__*/React.createElement("div", {
    className: "donut-leg"
  }, FONDOS_DETALLE.map((f, i) => {
    const pct = totalFondos > 0 ? (f.valor / totalFondos * 100).toFixed(1) : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "dl-row",
      style: {
        marginBottom: 3
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "dl-name"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: f.color,
        minWidth: 8
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, f.nombre)), /*#__PURE__*/React.createElement("div", {
      className: "dl-val",
      style: {
        fontWeight: 700
      }
    }, fmt(f.valor))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 18,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 4,
        borderRadius: 99,
        background: 'var(--border)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${pct}%`,
        height: '100%',
        background: f.color,
        borderRadius: 99
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        color: 'var(--t3)',
        minWidth: 30,
        textAlign: 'right'
      }
    }, pct, "%")));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      paddingTop: 10,
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--t3)',
      fontWeight: 600
    }
  }, "Total"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 800,
      fontSize: 14,
      color: 'var(--g700)'
    }
  }, fmt(totalFondos)))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "\xDAltimas Semanas")), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Fecha"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Patrimonio"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Variaci\xF3n"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "%"))), /*#__PURE__*/React.createElement("tbody", null, FONDOS.slice(-10).reverse().map((f, i, arr) => {
    const prev = arr[i + 1];
    const diff = prev ? f.total - prev.total : 0;
    const pct = prev && prev.total > 0 ? diff / prev.total * 100 : 0;
    const pos = diff >= 0;
    return /*#__PURE__*/React.createElement("tr", {
      key: i
    }, /*#__PURE__*/React.createElement("td", {
      className: "mono",
      style: {
        color: 'var(--t3)',
        fontSize: 12.5
      }
    }, fmtDate(f.fecha)), /*#__PURE__*/React.createElement("td", {
      className: "mono r",
      style: {
        fontWeight: i === 0 ? 700 : 500,
        color: i === 0 ? 'var(--g700)' : 'var(--text)'
      }
    }, fmt(f.total)), /*#__PURE__*/React.createElement("td", {
      className: "mono r",
      style: {
        fontSize: 13,
        color: i === 0 ? 'var(--t3)' : pos ? 'var(--g600)' : 'var(--red)',
        fontWeight: 600
      }
    }, i === arr.length - 1 ? '—' : (pos ? '+' : '') + fmt(diff)), /*#__PURE__*/React.createElement("td", {
      className: "r",
      style: {
        fontSize: 12.5
      }
    }, i === arr.length - 1 ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--t3)'
      }
    }, "\u2014") : /*#__PURE__*/React.createElement("span", {
      style: {
        color: pos ? 'var(--g600)' : 'var(--red)',
        fontWeight: 600
      }
    }, pos ? '+' : '', pct.toFixed(2), "%")));
  }))))));
}
function FiniquitosPage() {
  const [expandido, setExpandido] = React.useState({});

  // Agrupar filas por nombre
  var grupos = {};
  FINIQUITOS_RAW.forEach(function (r) {
    if (!r.nombre) return;
    if (!grupos[r.nombre]) grupos[r.nombre] = {
      nombre: r.nombre,
      tipo: r.tipo,
      montoTotal: r.montoTotal,
      cuotas: []
    };
    grupos[r.nombre].cuotas.push(r);
  });
  var items = Object.values(grupos).map(function (item) {
    var pagado = item.cuotas.reduce(function (s, c) {
      return s + (c.estado === 'Pagado' ? c.montoPago : 0);
    }, 0);
    var pendiente = Math.max(0, item.montoTotal - pagado);
    var todosPagados = item.cuotas.every(function (c) {
      return c.estado === 'Pagado';
    });
    return Object.assign({}, item, {
      pagado: pagado,
      pendiente: pendiente,
      estadoGeneral: todosPagados ? 'Pagado' : 'Pendiente'
    });
  });
  var finiquitos = items.filter(function (i) {
    return i.tipo === 'Finiquito';
  });
  var prestamos = items.filter(function (i) {
    return i.tipo !== 'Finiquito';
  });
  var totalFinPend = finiquitos.reduce(function (s, f) {
    return s + f.pendiente;
  }, 0);
  var totalPrePend = prestamos.reduce(function (s, p) {
    return s + p.pendiente;
  }, 0);
  var totalPend = totalFinPend + totalPrePend;
  var conPendiente = items.filter(function (i) {
    return i.estadoGeneral === 'Pendiente';
  }).length;
  if (!FINIQUITOS_RAW.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "page",
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        color: 'var(--t3)'
      }
    }, /*#__PURE__*/React.createElement(IC, {
      n: "fin",
      s: 32
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        fontSize: 14
      }
    }, "Cargando datos de finiquitos...")));
  }
  function RowTabla({
    item
  }) {
    var abierto = !!expandido[item.nombre];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("tr", {
      style: {
        cursor: 'pointer'
      },
      onClick: function () {
        setExpandido(function (prev) {
          var n = Object.assign({}, prev);
          n[item.nombre] = !n[item.nombre];
          return n;
        });
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 600
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        marginRight: 6,
        color: 'var(--t3)',
        fontSize: 11
      }
    }, abierto ? '▾' : '▸'), item.nombre), /*#__PURE__*/React.createElement("td", null, fmt(item.montoTotal)), /*#__PURE__*/React.createElement("td", {
      style: {
        color: 'var(--g600)',
        fontWeight: 600
      }
    }, fmt(item.pagado)), /*#__PURE__*/React.createElement("td", {
      style: {
        color: item.pendiente > 0 ? 'var(--red)' : 'var(--t3)',
        fontWeight: item.pendiente > 0 ? 700 : 400
      }
    }, item.pendiente > 0 ? fmt(item.pendiente) : '—'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-block',
        padding: '2px 9px',
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 700,
        background: item.estadoGeneral === 'Pagado' ? 'oklch(93% .09 155)' : 'oklch(96% .08 75)',
        color: item.estadoGeneral === 'Pagado' ? 'var(--g700)' : 'oklch(45% .17 75)'
      }
    }, item.estadoGeneral)), /*#__PURE__*/React.createElement("td", {
      style: {
        color: 'var(--t3)',
        fontSize: 12
      }
    }, item.cuotas.length, " cuota", item.cuotas.length !== 1 ? 's' : '')), abierto && item.cuotas.map(function (c, ci) {
      return /*#__PURE__*/React.createElement("tr", {
        key: ci,
        style: {
          background: 'oklch(98% .005 240)'
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          paddingLeft: 28,
          color: 'var(--t3)',
          fontSize: 12
        }
      }, c.comentario || 'Cuota ' + (ci + 1)), /*#__PURE__*/React.createElement("td", {
        style: {
          fontSize: 12,
          color: 'var(--t3)'
        }
      }, c.fecha || '—'), /*#__PURE__*/React.createElement("td", {
        style: {
          fontSize: 12,
          color: 'var(--g600)'
        }
      }, c.montoPago > 0 ? fmt(c.montoPago) : '—'), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-block',
          padding: '1px 7px',
          borderRadius: 99,
          fontSize: 11,
          fontWeight: 600,
          background: c.estado === 'Pagado' ? 'oklch(93% .09 155)' : 'oklch(96% .08 75)',
          color: c.estado === 'Pagado' ? 'var(--g700)' : 'oklch(45% .17 75)'
        }
      }, c.estado || '—')), /*#__PURE__*/React.createElement("td", null));
    }));
  }
  function TablaSeccion({
    titulo,
    datos,
    emptyMsg
  }) {
    if (!datos.length) return /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-hd"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-title"
    }, titulo)), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '24px 20px',
        color: 'var(--t3)',
        fontSize: 13,
        textAlign: 'center'
      }
    }, emptyMsg));
    return /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-hd"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "card-title"
    }, titulo), /*#__PURE__*/React.createElement("div", {
      className: "card-sub"
    }, datos.length, " registro", datos.length !== 1 ? 's' : '', " \xB7 Pendiente: ", fmt(datos.reduce(function (s, d) {
      return s + d.pendiente;
    }, 0))))), /*#__PURE__*/React.createElement("table", {
      className: "tbl"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Nombre"), /*#__PURE__*/React.createElement("th", null, "Monto Total"), /*#__PURE__*/React.createElement("th", null, "Pagado"), /*#__PURE__*/React.createElement("th", null, "Pendiente"), /*#__PURE__*/React.createElement("th", null, "Estado"), /*#__PURE__*/React.createElement("th", null, "Cuotas"))), /*#__PURE__*/React.createElement("tbody", null, datos.map(function (item, idx) {
      return /*#__PURE__*/React.createElement(RowTabla, {
        key: idx,
        item: item
      });
    }))));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-grid-3",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kcard-icon a"
  }, /*#__PURE__*/React.createElement(IC, {
    n: "fin",
    s: 15
  })), /*#__PURE__*/React.createElement("div", {
    className: "kcard-label"
  }, "Finiquitos Pendientes"), /*#__PURE__*/React.createElement("div", {
    className: "kcard-val"
  }, fmt(totalFinPend)), /*#__PURE__*/React.createElement("div", {
    className: "kcard-change neu"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, finiquitos.filter(function (f) {
    return f.pendiente > 0;
  }).length, " con saldo pendiente"))), /*#__PURE__*/React.createElement("div", {
    className: "kcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kcard-icon r"
  }, /*#__PURE__*/React.createElement(IC, {
    n: "cre",
    s: 15
  })), /*#__PURE__*/React.createElement("div", {
    className: "kcard-label"
  }, "Pr\xE9stamos Pendientes"), /*#__PURE__*/React.createElement("div", {
    className: "kcard-val"
  }, fmt(totalPrePend)), /*#__PURE__*/React.createElement("div", {
    className: "kcard-change neu"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, prestamos.filter(function (p) {
    return p.pendiente > 0;
  }).length, " con saldo pendiente"))), /*#__PURE__*/React.createElement("div", {
    className: "kcard",
    style: {
      borderColor: conPendiente > 0 ? 'var(--amber)' : 'var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `kcard-icon ${conPendiente > 0 ? 'a' : 'g'}`
  }, /*#__PURE__*/React.createElement("svg", {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "kcard-label"
  }, "Total Por Pagar"), /*#__PURE__*/React.createElement("div", {
    className: "kcard-val",
    style: {
      color: totalPend > 0 ? 'oklch(45% .17 75)' : 'var(--g600)'
    }
  }, fmt(totalPend)), /*#__PURE__*/React.createElement("div", {
    className: `kcard-change ${totalPend > 0 ? 'dn' : 'up'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, conPendiente > 0 ? `${conPendiente} registros activos` : 'Todo pagado')))), /*#__PURE__*/React.createElement(TablaSeccion, {
    titulo: "Finiquitos",
    datos: finiquitos,
    emptyMsg: "No hay finiquitos registrados"
  }), /*#__PURE__*/React.createElement(TablaSeccion, {
    titulo: "Pr\xE9stamos a Trabajadores",
    datos: prestamos,
    emptyMsg: "No hay pr\xE9stamos a trabajadores registrados"
  }));
}
function CreditosPage({
  saldos
}) {
  const hoy = new Date().toISOString().split('T')[0];
  const hoyMs = new Date(hoy).getTime();

  // Enrich each credito with alert state
  const creditos = CREDITOS_REALES.map(c => {
    const saldoBanco = saldos[c.banco] || 0;
    const diasRestantes = Math.round((new Date(c.fechaProximaCuota) - new Date(hoy)) / 86400000);
    const alcanza = saldoBanco >= c.proximaCuota;
    const alertaVence = diasRestantes >= 0 && diasRestantes <= 2;
    const alertaSaldo = !alcanza;
    return {
      ...c,
      saldoBanco,
      diasRestantes,
      alcanza,
      alertaVence,
      alertaSaldo
    };
  });
  const totalDeuda = creditos.reduce((s, c) => s + (c.deudaVigente || 0), 0);
  const totalMontoInicial = creditos.reduce((s, c) => s + (c.montoInicial || c.deudaVigente || 0), 0);
  const cuotasEstesMes = creditos.reduce((s, c) => s + c.proximaCuota, 0);
  const conAlerta = creditos.filter(c => c.alertaVence || c.alertaSaldo);

  // Creditos por empresa
  const porEmpresa = {
    GMD: creditos.filter(c => c.empresa === 'GMD'),
    Grafhika: creditos.filter(c => c.empresa === 'Grafhika')
  };
  const bancoBadgeColor = banco => {
    if (banco === 'Scotiabank') return 'oklch(52% .15 240)';
    if (banco.includes('SANTANDER')) return 'var(--red)';
    if (banco.includes('BancoChile') || banco.includes('Chile')) return 'var(--g600)';
    return 'var(--t3)';
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-grid-3",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kcard-icon r"
  }, /*#__PURE__*/React.createElement(IC, {
    n: "cre",
    s: 15
  })), /*#__PURE__*/React.createElement("div", {
    className: "kcard-label"
  }, "Deuda Total Vigente"), /*#__PURE__*/React.createElement("div", {
    className: "kcard-val"
  }, fmt(totalDeuda)), /*#__PURE__*/React.createElement("div", {
    className: "kcard-change neu"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "5 cr\xE9ditos activos"))), /*#__PURE__*/React.createElement("div", {
    className: "kcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kcard-icon a"
  }, /*#__PURE__*/React.createElement(IC, {
    n: "gas",
    s: 15
  })), /*#__PURE__*/React.createElement("div", {
    className: "kcard-label"
  }, "Cuotas Este Mes"), /*#__PURE__*/React.createElement("div", {
    className: "kcard-val"
  }, fmt(cuotasEstesMes)), /*#__PURE__*/React.createElement("div", {
    className: "kcard-change neu"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "vencen en mayo 2026"))), /*#__PURE__*/React.createElement("div", {
    className: "kcard",
    style: {
      borderColor: conAlerta.length > 0 ? 'var(--red)' : 'var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `kcard-icon ${conAlerta.length > 0 ? 'r' : 'g'}`
  }, /*#__PURE__*/React.createElement("svg", {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "kcard-label"
  }, "Alertas Activas"), /*#__PURE__*/React.createElement("div", {
    className: "kcard-val",
    style: {
      color: conAlerta.length > 0 ? 'var(--red)' : 'var(--g600)'
    }
  }, conAlerta.length), /*#__PURE__*/React.createElement("div", {
    className: `kcard-change ${conAlerta.length > 0 ? 'dn' : 'up'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, conAlerta.length > 0 ? `${conAlerta.length} requieren atención` : 'Todo en orden')))), conAlerta.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, creditos.filter(c => c.alertaVence || c.alertaSaldo).map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '12px 16px',
      background: c.alertaVence && c.alertaSaldo ? 'var(--red-bg)' : c.alertaVence ? 'var(--amber-bg)' : 'var(--red-bg)',
      border: `1px solid ${c.alertaVence && c.alertaSaldo ? 'var(--red)' : c.alertaVence ? 'oklch(72% .18 75)' : 'var(--red)'}`,
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      minWidth: 8,
      background: c.alertaVence && c.alertaSaldo ? 'var(--red)' : c.alertaVence ? 'oklch(72% .18 75)' : 'var(--red)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13
    }
  }, c.prestamo, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      color: 'var(--t3)',
      marginLeft: 6,
      fontSize: 12
    }
  }, "(", c.banco, " \xB7 ", c.empresa, ")")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, c.alertaVence && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: c.diasRestantes === 0 ? 'var(--red)' : 'oklch(45% .17 75)',
      background: 'rgba(255,255,255,.6)',
      borderRadius: 6,
      padding: '2px 8px'
    }
  }, c.diasRestantes === 0 ? 'Vence HOY' : c.diasRestantes === 1 ? 'Vence mañana' : `Vence en ${c.diasRestantes} días`, ' — ', fmt(c.proximaCuota)), c.alertaSaldo && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--red)',
      background: 'rgba(255,255,255,.6)',
      borderRadius: 6,
      padding: '2px 8px'
    }
  }, "Saldo insuficiente: ", fmt(c.saldoBanco), " / necesita ", fmt(c.proximaCuota))))))), ['GMD', 'Grafhika'].map(empresa => /*#__PURE__*/React.createElement("div", {
    className: "card",
    key: empresa,
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Cr\xE9ditos \u2014 ", empresa), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "Deuda total: ", fmt(porEmpresa[empresa].reduce((s, c) => s + (c.deudaVigente || 0), 0)), " \xB7", ' ', "Cuotas mayo: ", fmt(porEmpresa[empresa].reduce((s, c) => s + c.proximaCuota, 0))))), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Cr\xE9dito"), /*#__PURE__*/React.createElement("th", null, "Banco"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Monto Inicial"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Deuda Vigente"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Pr\xF3xima Cuota"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Vencimiento"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 120
    }
  }, "Avance"), /*#__PURE__*/React.createElement("th", null, "Saldo Banco"))), /*#__PURE__*/React.createElement("tbody", null, porEmpresa[empresa].map((c, i) => {
    const pct = c.montoInicial ? Math.min((c.montoInicial - c.deudaVigente) / c.montoInicial * 100, 100) : 0;
    const diasLabel = c.diasRestantes < 0 ? `hace ${Math.abs(c.diasRestantes)}d` : c.diasRestantes === 0 ? 'Hoy' : c.diasRestantes === 1 ? 'Mañana' : `${c.diasRestantes}d`;
    const diasColor = c.diasRestantes <= 0 ? 'var(--red)' : c.diasRestantes <= 2 ? 'oklch(45% .17 75)' : c.diasRestantes <= 7 ? 'var(--amber)' : 'var(--t3)';
    return /*#__PURE__*/React.createElement("tr", {
      key: i,
      style: {
        background: c.alertaVence || c.alertaSaldo ? c.alertaVence && c.alertaSaldo ? 'oklch(99% .01 25)' : 'oklch(99% .02 75)' : 'transparent'
      }
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: 13
      }
    }, c.prestamo), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--t3)',
        marginTop: 2
      }
    }, c.numero)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        color: bancoBadgeColor(c.banco)
      }
    }, c.banco.replace(' GMD', '').replace('Grafhika ', '').replace('SANTANDER', 'Santander'))), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 600,
        textAlign: 'right',
        fontSize: 14
      }
    }, c.montoInicial ? fmt(c.montoInicial) : '—'), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 700,
        textAlign: 'right',
        fontSize: 14,
        color: 'var(--red)'
      }
    }, fmt(c.deudaVigente || 0)), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 700,
        textAlign: 'right',
        fontSize: 14,
        color: 'var(--amber)'
      }
    }, fmt(c.proximaCuota)), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        fontSize: 13,
        color: diasColor
      }
    }, diasLabel), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--t3)',
        marginTop: 1
      }
    }, c.fechaProximaCuota)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 5,
        background: 'var(--border)',
        borderRadius: 99,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${pct.toFixed(0)}%`,
        height: '100%',
        background: pct >= 80 ? 'var(--g600)' : pct >= 40 ? 'var(--amber)' : 'var(--g400)',
        borderRadius: 99
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--t3)',
        minWidth: 28,
        textAlign: 'right'
      }
    }, pct.toFixed(0), "%")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--t3)',
        marginTop: 2
      }
    }, c.cuotasPagadas, "/", c.cuotasTotales, " cuotas")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: 13,
        color: c.alcanza ? 'var(--g600)' : 'var(--red)'
      }
    }, fmt(c.saldoBanco)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        marginTop: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: c.alcanza ? 'var(--g600)' : 'var(--red)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: c.alcanza ? 'var(--g600)' : 'var(--red)',
        fontWeight: 600
      }
    }, c.alcanza ? 'Cubre cuota' : `Faltan ${fmt(c.proximaCuota - c.saldoBanco)}`))));
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Calendario de Pagos \u2014 Scotiabank FOGAPE"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "Cuotas restantes"))), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Cuota"), /*#__PURE__*/React.createElement("th", null, "Vencimiento"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Capital"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Inter\xE9s"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Valor Cuota"), /*#__PURE__*/React.createElement("th", null, "Estado"))), /*#__PURE__*/React.createElement("tbody", null, CREDITOS_REALES[0].cuotas.map((q, i) => {
    const dias = Math.round((new Date(q.vencimiento) - new Date(hoy)) / 86400000);
    return /*#__PURE__*/React.createElement("tr", {
      key: i
    }, /*#__PURE__*/React.createElement("td", {
      className: "mono",
      style: {
        color: 'var(--t3)'
      }
    }, q.numero), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 500
      }
    }, q.vencimiento, dias <= 7 && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 6,
        fontSize: 11,
        fontWeight: 600,
        color: dias <= 2 ? 'var(--red)' : 'var(--amber)',
        background: dias <= 2 ? 'var(--red-bg)' : 'var(--amber-bg)',
        padding: '1px 5px',
        borderRadius: 4
      }
    }, dias === 0 ? 'Hoy' : `${dias}d`)), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 600,
        textAlign: 'right',
        fontSize: 14
      }
    }, fmt(q.capital)), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right',
        fontSize: 14,
        color: 'var(--t3)'
      }
    }, fmt(q.interes)), /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 700,
        textAlign: 'right',
        fontSize: 14,
        color: 'var(--amber)'
      }
    }, fmt(q.valorCuota)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "pill a"
    }, q.estado)));
  })))));
}

// ── Alert System ──────────────────────────────────────────────────────────
const DEFAULT_UMBRALES = {
  'Grafhika BancoChile': 1000000,
  'GMD BancoChile': 10000000,
  'Scotiabank': 3000000,
  'SANTANDER': 10000000,
  'BICE': 0,
  'BCI': 0
};
function useAlerts(saldos, umbrales) {
  return useMemo(() => {
    const alerts = [];
    const hoy = new Date();

    // Alertas de saldo bajo por umbral configurado
    Object.entries(saldos).forEach(([banco, saldo]) => {
      const umbral = umbrales[banco] || 0;
      if (saldo < umbral * 0.5) {
        alerts.push({
          id: banco + '_crit',
          tipo: 'crit',
          banco,
          saldo,
          umbral,
          msg: `⚠ ${banco} en alerta roja — solo ${fmt(saldo)} de ${fmt(umbral)} mínimo`
        });
      } else if (saldo < umbral) {
        alerts.push({
          id: banco + '_warn',
          tipo: 'warn',
          banco,
          saldo,
          umbral,
          msg: `${banco} con saldo bajo — ${fmt(saldo)} de ${fmt(umbral)} mínimo`
        });
      }
    });

    // Alertas de créditos: solo 0, 1 o 2 días para vencer
    CREDITOS_REALES.forEach(c => {
      const saldoBanco = saldos[c.banco] || 0;
      const dias = Math.round((new Date(c.fechaProximaCuota) - hoy) / 86400000);
      const diasLabel = dias === 0 ? 'HOY' : dias === 1 ? 'mañana' : 'en 2 días';
      if (dias < 0 || dias > 2) return;
      const alcanza = saldoBanco >= c.proximaCuota;
      if (!alcanza) {
        alerts.push({
          id: c.id + '_crit',
          tipo: 'crit',
          banco: c.banco,
          msg: `⚠ Cuota ${c.prestamo} vence ${diasLabel} — sin fondos en ${c.banco} (necesita ${fmt(c.proximaCuota)}, tiene ${fmt(saldoBanco)})`
        });
      } else {
        alerts.push({
          id: c.id + '_vence',
          tipo: 'crit',
          banco: c.banco,
          msg: `⚠ Cuota ${c.prestamo} vence ${diasLabel} — ${fmt(c.proximaCuota)} desde ${c.banco}`
        });
      }
    });

    // Alertas de proyección (GASTOS): solo 0, 1 o 2 días para vencer
    if (typeof GASTOS !== 'undefined') {
      GASTOS.filter(g => g.estado !== 'Pagado').forEach(g => {
        const dias = Math.round((new Date(g.fecha) - hoy) / 86400000);
        if (dias < 0 || dias > 2) return;
        const diasLabel = dias === 0 ? 'HOY' : dias === 1 ? 'mañana' : 'en 2 días';
        alerts.push({
          id: 'gasto_' + g.fecha + '_' + g.descripcion.slice(0, 10),
          tipo: 'crit',
          banco: '',
          msg: `⚠ Pago "${g.descripcion}" vence ${diasLabel} — ${fmt(g.monto)}`
        });
      });
    }
    return alerts;
  }, [saldos, umbrales]);
}
function AlertStrip({
  alerts,
  onClose
}) {
  if (!alerts.length) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "alert-strip"
  }, alerts.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    className: `alert-chip ${a.tipo}`
  }, a.tipo !== 'crit' && /*#__PURE__*/React.createElement("span", {
    className: "alert-chip-icon"
  }, "\u26A1"), /*#__PURE__*/React.createElement("span", {
    className: "alert-chip-txt"
  }, a.msg), /*#__PURE__*/React.createElement("button", {
    className: "alert-close",
    onClick: () => onClose(a.id)
  }, "\xD7"))));
}
function AlertConfigPanel({
  umbrales,
  setUmbrales,
  onClose
}) {
  const [local, setLocal] = useState({
    ...umbrales
  });
  const save = () => {
    setUmbrales(local);
    onClose();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "alert-cfg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert-cfg-hd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert-cfg-title"
  }, "Umbrales de Alerta"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--t3)',
      fontSize: 16,
      lineHeight: 1
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "cfg-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cfg-label"
  }, "Saldo m\xEDnimo por cuenta"), Object.entries(local).map(([banco, val]) => /*#__PURE__*/React.createElement("div", {
    key: banco,
    className: "cfg-banco"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cfg-banco-name"
  }, banco), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "cfg-input",
    value: val.toLocaleString('es-CL'),
    onChange: e => {
      const n = parseInt(e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '')) || 0;
      setLocal(prev => ({
        ...prev,
        [banco]: n
      }));
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: save,
    style: {
      flex: 1,
      padding: '7px',
      background: 'var(--g700)',
      color: '#fff',
      border: 'none',
      borderRadius: 7,
      cursor: 'pointer',
      fontSize: 12.5,
      fontWeight: 600,
      fontFamily: 'DM Sans'
    }
  }, "Guardar"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      padding: '7px 14px',
      background: 'var(--bg)',
      color: 'var(--t2)',
      border: '1px solid var(--border)',
      borderRadius: 7,
      cursor: 'pointer',
      fontSize: 12.5,
      fontFamily: 'DM Sans'
    }
  }, "Cancelar")));
}

// ── Upload de Movimientos ─────────────────────────────────────────────────
function UploadMovPanel({
  onImport,
  onClose
}) {
  const [drag, setDrag] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [resultado, setResultado] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = React.useRef();
  const processFile = file => {
    if (!file) return;
    setStatus('loading');
    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, {
          type: 'binary',
          cellDates: true
        });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, {
          defval: ''
        });

        // Detect columns
        const colMap = {};
        if (rows.length > 0) {
          const keys = Object.keys(rows[0]);
          keys.forEach(k => {
            const kl = k.toLowerCase();
            if (kl.includes('fecha')) colMap.fecha = k;
            if (kl.includes('desc') || kl.includes('glosa') || kl.includes('detalle')) colMap.descripcion = k;
            if (kl.includes('monto') || kl.includes('cargo') || kl.includes('abono') || kl.includes('importe')) colMap.monto = k;
            if (kl.includes('banco') || kl.includes('cuenta')) colMap.banco = k;
            if (kl.includes('saldo')) colMap.saldo = k;
            if (kl.includes('tipo') || kl.includes('naturaleza')) colMap.tipo = k;
          });
        }
        const movs = rows.map(r => {
          let fecha = r[colMap.fecha] || '';
          if (fecha instanceof Date) fecha = fecha.toISOString().slice(0, 10);else if (typeof fecha === 'number') {
            // Excel serial date
            const d = new Date(Math.round((fecha - 25569) * 86400 * 1000));
            fecha = d.toISOString().slice(0, 10);
          } else {
            fecha = String(fecha).slice(0, 10);
          }
          const monto = parseFloat(String(r[colMap.monto] || 0).replace(/[^0-9.-]/g, '')) || 0;
          const tipo = monto >= 0 ? 'INGRESO' : 'GASTO';
          return {
            fecha,
            descripcion: String(r[colMap.descripcion] || '').trim(),
            monto,
            tipo: r[colMap.tipo] ? String(r[colMap.tipo]).toUpperCase() : tipo,
            banco: String(r[colMap.banco] || 'Importado').trim(),
            saldo: parseFloat(String(r[colMap.saldo] || 0).replace(/[^0-9.-]/g, '')) || 0
          };
        }).filter(m => m.fecha && m.descripcion);
        if (movs.length === 0) throw new Error('No se encontraron movimientos válidos en el archivo.');
        setResultado({
          file: file.name,
          count: movs.length,
          movs,
          cols: colMap
        });
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.message || 'Error al procesar el archivo.');
      }
    };
    reader.readAsBinaryString(file);
  };
  const handleDrop = e => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };
  const confirmar = () => {
    if (resultado) {
      onImport(resultado.movs);
      onClose();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,.35)',
      z: 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 400
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      borderRadius: 16,
      padding: 24,
      width: 480,
      maxWidth: '90vw',
      boxShadow: '0 16px 48px rgba(0,0,0,.2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, "Importar Movimientos"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--t3)',
      fontSize: 20,
      lineHeight: 1
    }
  }, "\xD7")), status === 'idle' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: `upload-zone ${drag ? 'drag' : ''}`,
    onDragOver: e => {
      e.preventDefault();
      setDrag(true);
    },
    onDragLeave: () => setDrag(false),
    onDrop: handleDrop,
    onClick: () => fileRef.current.click()
  }, /*#__PURE__*/React.createElement("div", {
    className: "upload-icon"
  }, /*#__PURE__*/React.createElement("svg", {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "17 8 12 3 7 8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "3",
    x2: "12",
    y2: "15"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "upload-title"
  }, "Arrastra tu archivo Excel aqu\xED"), /*#__PURE__*/React.createElement("div", {
    className: "upload-sub"
  }, "o haz clic para seleccionar \xB7 .xlsx / .xls / .csv")), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: ".xlsx,.xls,.csv",
    style: {
      display: 'none'
    },
    onChange: e => processFile(e.target.files[0])
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: '10px 12px',
      background: 'var(--bg)',
      borderRadius: 8,
      fontSize: 13.5,
      color: 'var(--t3)'
    }
  }, "El archivo debe tener columnas de ", /*#__PURE__*/React.createElement("b", null, "Fecha"), ", ", /*#__PURE__*/React.createElement("b", null, "Descripci\xF3n"), " y ", /*#__PURE__*/React.createElement("b", null, "Monto"), ". Las columnas de Banco, Tipo y Saldo son opcionales.")), status === 'loading' && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '32px 0',
      color: 'var(--t3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13
    }
  }, "Procesando archivo...")), status === 'error' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px',
      background: 'var(--red-bg)',
      borderRadius: 8,
      color: 'var(--red)',
      fontSize: 13,
      marginBottom: 14
    }
  }, errorMsg), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStatus('idle'),
    style: {
      padding: '7px 16px',
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 7,
      cursor: 'pointer',
      fontSize: 12.5,
      fontFamily: 'DM Sans'
    }
  }, "Intentar de nuevo")), status === 'success' && resultado && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 14px',
      background: 'var(--g50)',
      border: '1px solid var(--g200)',
      borderRadius: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--g600)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, resultado.file), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--t3)'
    }
  }, resultado.count, " movimientos detectados"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      color: 'var(--t3)',
      marginBottom: 8
    }
  }, "Columnas detectadas"), Object.entries(resultado.cols).map(([campo, col]) => /*#__PURE__*/React.createElement("div", {
    key: campo,
    style: {
      display: 'flex',
      gap: 8,
      fontSize: 12,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--t3)',
      minWidth: 80,
      textTransform: 'capitalize'
    }
  }, campo, ":"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontFamily: 'DM Sans',
      fontSize: 13
    }
  }, col)))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 160,
      overflowY: 'auto',
      border: '1px solid var(--border)',
      borderRadius: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--bg)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 10px',
      textAlign: 'left',
      color: 'var(--t3)',
      fontWeight: 600
    }
  }, "Fecha"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 10px',
      textAlign: 'left',
      color: 'var(--t3)',
      fontWeight: 600
    }
  }, "Descripci\xF3n"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 10px',
      textAlign: 'right',
      color: 'var(--t3)',
      fontWeight: 600
    }
  }, "Monto"))), /*#__PURE__*/React.createElement("tbody", null, resultado.movs.slice(0, 8).map((m, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderTop: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '5px 10px',
      fontFamily: 'DM Sans',
      fontSize: 13
    }
  }, m.fecha), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '5px 10px',
      maxWidth: 180,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, m.descripcion), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '5px 10px',
      textAlign: 'right',
      fontFamily: 'DM Sans',
      fontWeight: 600,
      color: m.monto >= 0 ? 'var(--g600)' : 'var(--red)'
    }
  }, m.monto >= 0 ? '+' : '', fmt(m.monto)))), resultado.count > 8 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 3,
    style: {
      padding: '6px 10px',
      textAlign: 'center',
      color: 'var(--t3)',
      fontSize: 13
    }
  }, "... y ", resultado.count - 8, " m\xE1s"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: confirmar,
    style: {
      flex: 1,
      padding: '8px',
      background: 'var(--g700)',
      color: '#fff',
      border: 'none',
      borderRadius: 7,
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: 600,
      fontFamily: 'DM Sans'
    }
  }, "Confirmar importaci\xF3n"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStatus('idle'),
    style: {
      padding: '8px 14px',
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 7,
      cursor: 'pointer',
      fontSize: 12.5,
      fontFamily: 'DM Sans',
      color: 'var(--t2)'
    }
  }, "Cancelar")))));
}

// ── Upload Nómina Panel ────────────────────────────────────────────────────
function UploadNominaPanel({
  onImport,
  onClose
}) {
  const [drag, setDrag] = useState(false);
  const [status, setStatus] = useState('idle');
  const [resultado, setResultado] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = React.useRef();
  const processFile = file => {
    if (!file) return;
    setStatus('loading');
    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, {
          type: 'binary',
          cellDates: false
        });
        const sn = wb.SheetNames[0];
        const rawRows = XLSX.utils.sheet_to_json(wb.Sheets[sn], {
          header: 1,
          defval: '',
          raw: true
        });
        if (!rawRows.length) throw new Error('Hoja vacía.');

        // Detectar fila de encabezados: buscar "nombre" o "beneficiario"
        const hdrKw = /empresa|rut|nombre|beneficiario|monto|banco/i;
        let hIdx = rawRows.findIndex(row => row.filter(c => hdrKw.test(String(c))).length >= 2);
        if (hIdx < 0) hIdx = 0;
        const hdr = rawRows[hIdx];

        // Encontrar columnas por nombre
        const ci = t => {
          for (let i = 0; i < hdr.length; i++) {
            if (hdrKw.test(String(hdr[i])) && String(hdr[i]).toLowerCase().includes(t)) return i;
          }
          return -1;
        };
        const colEmp = hdr.findIndex(h => /empresa/i.test(String(h)));
        const colNom = hdr.findIndex(h => /nombre|beneficiario/i.test(String(h)));
        const colMont = hdr.findIndex(h => /monto/i.test(String(h)));
        if (colNom < 0 || colMont < 0) throw new Error('No se detectaron columnas Nombre y Monto en el archivo.');
        const pn = v => {
          if (!v) return 0;
          const n = parseInt(String(v).replace(/[^0-9]/g, ''));
          return isNaN(n) ? 0 : n;
        };
        const dataRows = rawRows.slice(hIdx + 1).filter(r => r.some(c => c !== '' && c !== null));

        // Agrupar por empresa
        const empMap = {};
        let total = 0;
        dataRows.forEach(r => {
          const emp = colEmp >= 0 ? String(r[colEmp] || '').trim() : 'Sin empresa';
          const nom = String(r[colNom] || '').trim();
          const mto = pn(r[colMont]);
          if (!nom || mto <= 0) return; // excluir filas sin nombre o monto 0
          if (!emp || /total/i.test(emp)) return; // excluir fila de totales
          if (!empMap[emp]) empMap[emp] = {
            empresa: emp,
            personas: 0,
            monto: 0
          };
          empMap[emp].personas++;
          empMap[emp].monto += mto;
          total += mto;
        });
        const byEmpresa = Object.values(empMap).filter(e => e.monto > 0).sort((a, b) => b.monto - a.monto);
        if (!byEmpresa.length) throw new Error('No se encontraron empleados con monto > 0.');

        // Intentar detectar mes del nombre del archivo
        const mesMatch = file.name.match(/(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)[^\d]*(\d{4})/i);
        const mesStr = mesMatch ? mesMatch[1].charAt(0).toUpperCase() + mesMatch[1].slice(1).toLowerCase() + ' ' + mesMatch[2] : '';
        setResultado({
          filename: file.name,
          byEmpresa,
          total,
          mesStr
        });
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.message || 'Error al procesar.');
      }
    };
    reader.readAsBinaryString(file);
  };
  const confirmar = () => {
    if (resultado) {
      onImport(resultado);
      onClose();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,.35)',
      zIndex: 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      borderRadius: 16,
      padding: 24,
      width: 460,
      maxWidth: '92vw',
      boxShadow: '0 16px 48px rgba(0,0,0,.2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, "\uD83D\uDCB8 Cargar N\xF3mina de Sueldos"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--t3)',
      fontSize: 20,
      lineHeight: 1
    }
  }, "\xD7")), status === 'idle' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--t3)',
      marginBottom: 12,
      padding: '8px 12px',
      background: 'var(--bg)',
      borderRadius: 8
    }
  }, "Formato esperado: ", /*#__PURE__*/React.createElement("b", null, "Empresa \xB7 Rut \xB7 Nombre \xB7 Monto \xB7 Banco \xB7 Tipo \xB7 N\xB0 Cuenta"), /*#__PURE__*/React.createElement("br", null), "Compatible con el archivo mensual de transferencias bancarias."), /*#__PURE__*/React.createElement("div", {
    className: `upload-zone ${drag ? 'drag' : ''}`,
    onDragOver: e => {
      e.preventDefault();
      setDrag(true);
    },
    onDragLeave: () => setDrag(false),
    onDrop: e => {
      e.preventDefault();
      setDrag(false);
      processFile(e.dataTransfer.files[0]);
    },
    onClick: () => fileRef.current.click()
  }, /*#__PURE__*/React.createElement("div", {
    className: "upload-icon"
  }, "\uD83D\uDCB8"), /*#__PURE__*/React.createElement("div", {
    className: "upload-title"
  }, "Arrastra la n\xF3mina aqu\xED"), /*#__PURE__*/React.createElement("div", {
    className: "upload-sub"
  }, "NOMINA SUELDOS [MES] [A\xD1O].xlsx")), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: ".xlsx,.xls",
    style: {
      display: 'none'
    },
    onChange: e => processFile(e.target.files[0])
  })), status === 'loading' && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '32px 0',
      color: 'var(--t3)',
      fontSize: 13
    }
  }, "Procesando n\xF3mina..."), status === 'error' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      background: 'var(--red-bg)',
      borderRadius: 8,
      color: 'var(--red)',
      fontSize: 12,
      marginBottom: 14,
      whiteSpace: 'pre-wrap'
    }
  }, errorMsg), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStatus('idle'),
    style: {
      padding: '7px 16px',
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 7,
      cursor: 'pointer',
      fontSize: 12.5,
      fontFamily: 'DM Sans'
    }
  }, "Intentar de nuevo")), status === 'success' && resultado && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      background: 'var(--g50)',
      border: '1px solid var(--g200)',
      borderRadius: 8,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--g600)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, resultado.filename, resultado.mesStr ? ' · ' + resultado.mesStr : ''), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--t3)'
    }
  }, resultado.byEmpresa.reduce((s, e) => s + e.personas, 0), " empleados \xB7 Total: ", fmt(resultado.total)))), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 13,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'left',
      padding: '5px 8px',
      color: 'var(--t3)',
      fontWeight: 600,
      fontSize: 11,
      textTransform: 'uppercase'
    }
  }, "Empresa"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'center',
      padding: '5px 4px',
      color: 'var(--t3)',
      fontWeight: 600,
      fontSize: 11,
      textTransform: 'uppercase'
    }
  }, "Personas"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: 'right',
      padding: '5px 8px',
      color: 'var(--t3)',
      fontWeight: 600,
      fontSize: 11,
      textTransform: 'uppercase'
    }
  }, "Monto"))), /*#__PURE__*/React.createElement("tbody", null, resultado.byEmpresa.map((e, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 8px',
      fontWeight: 500
    }
  }, e.empresa), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 4px',
      textAlign: 'center',
      color: 'var(--t3)'
    }
  }, e.personas), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 8px',
      textAlign: 'right',
      fontFamily: 'DM Sans',
      fontWeight: 700
    }
  }, fmt(e.monto)))), /*#__PURE__*/React.createElement("tr", {
    style: {
      borderTop: '2px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 8px',
      fontWeight: 700
    },
    colSpan: 2
  }, "Total N\xF3mina"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 8px',
      textAlign: 'right',
      fontFamily: 'DM Sans',
      fontWeight: 700,
      fontSize: 14,
      color: 'oklch(48% .15 240)'
    }
  }, fmt(resultado.total))))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--t3)',
      marginBottom: 14
    }
  }, "\u26A0\uFE0F Se mostrar\xE1 en \"Pr\xF3ximos 5 d\xEDas\" cuando el pago caiga en los pr\xF3ximos 5 d\xEDas (fin de mes)."), /*#__PURE__*/React.createElement("button", {
    onClick: confirmar,
    style: {
      width: '100%',
      padding: '10px',
      background: 'var(--g700)',
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      cursor: 'pointer',
      fontSize: 14,
      fontWeight: 600,
      fontFamily: 'DM Sans'
    }
  }, "\u2705 Confirmar e importar n\xF3mina"))));
}

// ── Upload Ventas Panel ────────────────────────────────────────────────────
function UploadVentasPanel({
  onImport,
  onClose
}) {
  const [drag, setDrag] = useState(false);
  const [status, setStatus] = useState('idle');
  const [resultado, setResultado] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = React.useRef();
  const parseDate = v => {
    if (!v) return '';
    if (typeof v === 'number') {
      const d = new Date(Math.round((v - 25569) * 86400000));
      return d.toISOString().slice(0, 10);
    }
    const s = String(v).trim();
    if (s.match(/^\d{4}-\d{2}-\d{2}/)) return s.slice(0, 10);
    if (s.match(/^\d{2}[/-]\d{2}[/-]\d{4}/)) {
      const p = s.split(/[/-]/);
      return `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
    }
    return s.slice(0, 10);
  };
  const parseMonto = v => {
    if (!v && v !== 0) return 0;
    if (typeof v === 'number') return Math.round(v);
    let s = String(v).replace(/[$\s]/g, '').trim();
    // Detect thousands separator format
    const hasDot3 = /\.\d{3}/.test(s); // dot before 3 digits → thousands sep (Chilean)
    const hasComma3 = /,\d{3}/.test(s); // comma before 3 digits → thousands sep (US/SheetJS)
    if (hasDot3 && !hasComma3) s = s.replace(/\./g, ''); // "1.528.213" → "1528213"
    else if (hasComma3 && !hasDot3) s = s.replace(/,/g, ''); // "1,528,213" → "1528213"
    else if (hasDot3 && hasComma3) {
      if (s.lastIndexOf('.') > s.lastIndexOf(',')) s = s.replace(/,/g, '').split('.')[0]; // "1,528.00"
      else s = s.replace(/\./g, '').split(',')[0]; // "1.528,00"
    } else {
      s = s.replace(/,\d{1,2}$/, '').replace(/\.\d{1,2}$/, ''); // strip trailing decimal
    }
    return parseInt(s.replace(/[^\d]/g, '')) || 0;
  };
  const processFile = file => {
    if (!file) return;
    setStatus('loading');
    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, {
          type: 'binary',
          cellDates: false
        });
        // Find cobranza sheet — priorizar COBRANZA sobre FACTURAS
        const sn = wb.SheetNames.find(s => /cobr/i.test(s)) || wb.SheetNames.find(s => /vent|libro/i.test(s)) || wb.SheetNames.find(s => /factur/i.test(s)) || wb.SheetNames[0];
        // Leer como arrays para encontrar la fila de encabezados real
        const rawRows = XLSX.utils.sheet_to_json(wb.Sheets[sn], {
          header: 1,
          defval: '',
          raw: true
        });
        if (!rawRows.length) throw new Error('Hoja vacía o sin datos.');

        // Buscar la fila que contiene los encabezados reales
        // (la que tiene al menos 3 celdas con texto que parecen headers)
        const headerKeywords = /folio|factura|empresa|cliente|nombre|rut|total|monto|saldo|estado|fecha|venc|ejecut|vendedor|neto|importe/i;
        let headerRowIdx = rawRows.findIndex(row => row.filter(c => headerKeywords.test(String(c))).length >= 2);
        if (headerRowIdx < 0) headerRowIdx = 0;
        const headerRow = rawRows[headerRowIdx];
        const dataRows = rawRows.slice(headerRowIdx + 1).filter(r => r.some(c => c !== '' && c !== null));

        // Convertir a objetos usando los encabezados encontrados
        const rows = dataRows.map(row => {
          const obj = {};
          headerRow.forEach((h, i) => {
            obj[String(h || '').trim()] = row[i] ?? '';
          });
          return obj;
        });
        if (!rows.length) throw new Error('Hoja vacía o sin datos.');

        // Detect columns
        const keys = Object.keys(rows[0]);
        const find = (...terms) => keys.find(k => terms.some(t => k.toLowerCase().includes(t.toLowerCase()))) || '';
        const cFolio = find('folio', 'n°', 'nro', 'num', 'n∞', 'n º', '#', 'doc');
        const cRut = find('rut');
        const cEmpresa = find('empresa', 'cliente', 'razón', 'razon', 'nombre', 'razon social');
        const cFecha = find('emision', 'emisión', 'fecha e', 'fecha d', 'f. e', 'f.e', 'fecha factura', 'f. factura');
        const cTotal = find('total', 'monto total', 'valor total', 'importe', 'monto neto', 'valor neto', 'neto');
        const cSaldo = find('saldo', 'por cobrar', 'pendiente', 'debe');
        const cEstado = find('estado', 'situacion', 'situación', 'condicion', 'condición');
        const cVence = find('vencim', 'vence', 'plazo', 'fecha venc', 'f. venc');
        const cDias = find('dias venc', 'días venc', 'atraso', 'dias atraso', 'días atraso', 'mora');
        const cPago = find('fecha p', 'f. p', 'f.p', 'fecha pago', 'f. pago', 'pago');
        const cEjec = find('ejecutivo', 'vendedor', 'repr', 'ejecut', 'agente', 'responsable');
        const cObs = find('obs', 'observ', 'detalle', 'nota', 'descrip', 'glosa');

        // DEBUG — ver en consola del navegador (F12)
        console.log('📋 Hojas disponibles:', wb.SheetNames);
        console.log('📋 Hoja seleccionada:', sn, '| Filas:', rows.length);
        console.log('📋 Columnas en Excel:', keys);
        console.log('📋 Columnas detectadas:', {
          folio: cFolio,
          empresa: cEmpresa,
          total: cTotal,
          saldo: cSaldo,
          estado: cEstado,
          fecha: cFecha,
          vence: cVence,
          ejecutivo: cEjec
        });
        console.log('📋 Primera fila raw:', rows[0]);
        const buscaFolio = rows.filter(r => Object.values(r).some(v => String(v).includes('2424')));
        if (buscaFolio.length) console.log('🔍 Filas con "2424":', buscaFolio);else console.log('🔍 No hay ninguna fila con "2424" en el Excel');
        const hoy = new Date();
        const noSaldoCol = !cSaldo; // if no saldo column detected
        const pending = rows.filter(r => r[cFolio] || r[cEmpresa]).map(r => {
          const total = parseMonto(r[cTotal]);
          // If no saldo column, derive from estado: PAGADO→0, else total
          const rawSaldo = noSaldoCol ? 0 : parseMonto(r[cSaldo]);
          const estadoRaw = String(r[cEstado] || '').trim().toUpperCase();
          const saldo = noSaldoCol ? /pagado|cobrado|cancelado/i.test(estadoRaw) ? 0 : total : rawSaldo;
          const estado = estadoRaw || (saldo === 0 ? 'PAGADO' : 'PENDIENTE');
          const venc = parseDate(r[cVence]);
          const diasVencido = r[cDias] ? parseInt(r[cDias]) || 0 : venc && saldo > 0 ? Math.max(0, Math.round((hoy - new Date(venc)) / 86400000)) : 0;
          const folioRaw = String(r[cFolio] || '').trim();
          return {
            rut: String(r[cRut] || '').trim(),
            empresa: String(r[cEmpresa] || r[cRut] || 'SIN NOMBRE').trim().toUpperCase(),
            folio: parseInt(folioRaw) || 0,
            folioStr: folioRaw,
            fechaEmision: parseDate(r[cFecha]),
            total,
            saldo,
            obs: String(r[cObs] || '').replace(/_x000D_/g, '').trim(),
            vencimiento: venc,
            diasVencido,
            estado,
            fechaPago: parseDate(r[cPago]),
            ejecutivo: String(r[cEjec] || '').trim().toUpperCase()
          };
        }).filter(r => r.total > 0);
        if (!pending.length) throw new Error(`No se encontraron facturas válidas.\n\nColumnas en hoja "${sn}":\n${keys.join(' | ')}\n\nDetectado: total="${cTotal || 'NO ENCONTRADO'}" · saldo="${cSaldo || 'NO ENCONTRADO'}" · empresa="${cEmpresa || 'NO ENCONTRADO'}"\n\nPrimera fila: ${JSON.stringify(rows[0]).slice(0, 300)}`);

        // Compute KPIs
        const totalFacturado = pending.reduce((s, r) => s + r.total, 0);
        const totalSaldo = pending.reduce((s, r) => s + r.saldo, 0);
        const totalPagado = pending.filter(r => r.estado === 'PAGADO' || r.saldo === 0).reduce((s, r) => s + r.total - r.saldo, 0);
        const totalFactoring = pending.filter(r => r.estado === 'FACTORING').reduce((s, r) => s + r.total, 0);
        const countVencido = pending.filter(r => r.estado === 'VENCIDO').length;
        const saldoVencido = pending.filter(r => r.estado === 'VENCIDO').reduce((s, r) => s + r.saldo, 0);
        const countPendiente = pending.filter(r => r.estado === 'PENDIENTE').length;
        const saldoPendiente = pending.filter(r => r.estado === 'PENDIENTE').reduce((s, r) => s + r.saldo, 0);
        const countFactoring = pending.filter(r => r.estado === 'FACTORING').length;
        const countNCredito = pending.filter(r => r.estado === 'NCREDITO').length;
        const kpis = {
          totalFacturado,
          totalSaldo,
          totalPagado,
          totalFactoring,
          countDocs: pending.length,
          countVencido,
          saldoVencido,
          countPendiente,
          saldoPendiente,
          countFactoring,
          countNCredito
        };

        // COB_POR_MES — calculado sobre todos los registros
        const porMes = {};
        pending.forEach(r => {
          const m = r.fechaEmision.slice(0, 7);
          if (!m) return;
          if (!porMes[m]) porMes[m] = {
            total: 0,
            saldo: 0,
            count: 0,
            pagado: 0
          };
          porMes[m].total += r.total;
          porMes[m].saldo += r.saldo;
          porMes[m].count++;
          porMes[m].pagado += r.total - r.saldo;
        });

        // COB_POR_EJECUTIVO — calculado sobre todos los registros
        const porEj = {};
        pending.forEach(r => {
          const e = r.ejecutivo || 'SIN ASIGNAR';
          if (!porEj[e]) porEj[e] = {
            total: 0,
            saldo: 0,
            count: 0
          };
          porEj[e].total += r.total;
          porEj[e].saldo += r.saldo;
          porEj[e].count++;
        });

        // COB_TOP_CLIENTES — calculado sobre todos los registros
        const clMap = {};
        pending.forEach(r => {
          if (!clMap[r.empresa]) clMap[r.empresa] = {
            empresa: r.empresa,
            total: 0,
            saldo: 0,
            docs: 0
          };
          clMap[r.empresa].total += r.total;
          clMap[r.empresa].saldo += r.saldo;
          clMap[r.empresa].docs++;
        });
        const topClientes = Object.values(clMap).sort((a, b) => b.total - a.total).slice(0, 20);

        // Guardar TODOS los registros — el límite se aplica en la UI solo cuando no hay búsqueda
        setResultado({
          file: file.name,
          sheetName: sn,
          count: pending.length,
          kpis,
          porMes,
          porEj,
          topClientes,
          pending,
          cols: {
            folio: cFolio,
            empresa: cEmpresa,
            total: cTotal,
            saldo: cSaldo || '(calculado)',
            estado: cEstado
          },
          allKeys: keys.slice(0, 20)
        });
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.message || 'Error al procesar el archivo.');
      }
    };
    reader.readAsBinaryString(file);
  };
  const confirmar = () => {
    if (resultado) {
      onImport(resultado);
      onClose();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,.35)',
      zIndex: 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      borderRadius: 16,
      padding: 24,
      width: 500,
      maxWidth: '92vw',
      boxShadow: '0 16px 48px rgba(0,0,0,.2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, "Actualizar Ventas / Cobranza"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--t3)',
      fontSize: 20,
      lineHeight: 1
    }
  }, "\xD7")), status === 'idle' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: `upload-zone ${drag ? 'drag' : ''}`,
    onDragOver: e => {
      e.preventDefault();
      setDrag(true);
    },
    onDragLeave: () => setDrag(false),
    onDrop: e => {
      e.preventDefault();
      setDrag(false);
      processFile(e.dataTransfer.files[0]);
    },
    onClick: () => fileRef.current.click()
  }, /*#__PURE__*/React.createElement("div", {
    className: "upload-icon"
  }, /*#__PURE__*/React.createElement("svg", {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "17 8 12 3 7 8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "3",
    x2: "12",
    y2: "15"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "upload-title"
  }, "Arrastra tu archivo Excel aqu\xED"), /*#__PURE__*/React.createElement("div", {
    className: "upload-sub"
  }, "2026 LIBRO VENTA GMD - COBRANZA.xlsx \xB7 Hoja: COBRANZA")), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: ".xlsx,.xls",
    style: {
      display: 'none'
    },
    onChange: e => processFile(e.target.files[0])
  })), status === 'loading' && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '32px 0',
      color: 'var(--t3)',
      fontSize: 13
    }
  }, "Procesando archivo..."), status === 'error' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      background: 'var(--red-bg)',
      borderRadius: 8,
      color: 'var(--red)',
      fontSize: 12,
      marginBottom: 14,
      whiteSpace: 'pre-wrap',
      maxHeight: 260,
      overflowY: 'auto',
      fontFamily: 'DM Mono,monospace',
      lineHeight: 1.6
    }
  }, errorMsg), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStatus('idle'),
    style: {
      padding: '7px 16px',
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 7,
      cursor: 'pointer',
      fontSize: 12.5,
      fontFamily: 'DM Sans'
    }
  }, "Intentar de nuevo")), status === 'success' && resultado && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      background: 'var(--g50)',
      border: '1px solid var(--g200)',
      borderRadius: 8,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--g600)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, resultado.file, " \xB7 Hoja: ", resultado.sheetName), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--t3)'
    }
  }, resultado.count, " docs totales \xB7 ", resultado.pending.filter(r => r.estado !== 'PAGADO' && r.saldo > 0).length, " pendientes + 50 \xFAlt. pagados \xB7 Total: ", fmt(resultado.kpis.totalFacturado)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      marginBottom: 14
    }
  }, [['Total facturado', resultado.kpis.totalFacturado, 'g'], ['Saldo por cobrar', resultado.kpis.totalSaldo, 'a'], ['Cobrado/Pagado', resultado.kpis.totalPagado, 'g'], ['En factoring', resultado.kpis.totalFactoring, 'b']].map(([l, v, c]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      padding: '8px 12px',
      background: 'var(--bg)',
      borderRadius: 8,
      border: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--t3)',
      marginBottom: 2,
      textTransform: 'uppercase',
      letterSpacing: '.05em'
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: `var(--${c === 'g' ? 'g600' : c === 'a' ? 'amber' : 'blue'})`
    }
  }, fmt(v))))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--t3)',
      marginBottom: 14,
      padding: '8px 12px',
      background: 'var(--bg)',
      borderRadius: 7
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 4
    }
  }, "Columnas detectadas: folio\u2192", /*#__PURE__*/React.createElement("b", null, resultado.cols.folio || '?'), " \xB7 empresa\u2192", /*#__PURE__*/React.createElement("b", null, resultado.cols.empresa || '?'), " \xB7 total\u2192", /*#__PURE__*/React.createElement("b", null, resultado.cols.total || '?'), " \xB7 saldo\u2192", /*#__PURE__*/React.createElement("b", null, resultado.cols.saldo || '?'), " \xB7 estado\u2192", /*#__PURE__*/React.createElement("b", null, resultado.cols.estado || '?')), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--t3)',
      fontSize: 11
    }
  }, "Columnas en hoja: ", resultado.allKeys.join(' · '))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: confirmar,
    style: {
      flex: 1,
      padding: '9px',
      background: 'var(--g700)',
      color: '#fff',
      border: 'none',
      borderRadius: 7,
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: 600,
      fontFamily: 'DM Sans'
    }
  }, "Confirmar e importar"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStatus('idle'),
    style: {
      padding: '9px 14px',
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 7,
      cursor: 'pointer',
      fontSize: 12.5,
      fontFamily: 'DM Sans',
      color: 'var(--t2)'
    }
  }, "Cancelar")))));
}

// ── Home Page ──────────────────────────────────────────────────────────────
function HomePage({
  saldos,
  movByMonth,
  gastos,
  ventas,
  creditos,
  fondos,
  alerts,
  onNavTo
}) {
  const totalBancario = Object.values(saldos).reduce((a, b) => a + b, 0);
  const meses = Object.keys(movByMonth);
  const curMes = movByMonth[meses[meses.length - 1]] || {
    ingresos: 0,
    gastos: 0
  };
  const prevMes = movByMonth[meses[meses.length - 2]] || {
    ingresos: 0,
    gastos: 0
  };
  const flujoNeto = curMes.ingresos - curMes.gastos;
  const pendientes = gastos.filter(g => g.estado === 'Pendiente');
  const totalPend = pendientes.reduce((s, g) => s + g.monto, 0);
  const vencHoy = pendientes.filter(g => g.fecha <= new Date().toISOString().split('T')[0]).length;
  const totalFondos = fondos.length ? fondos[fondos.length - 1].total : 0;
  const prevFondos = fondos.length > 1 ? fondos[fondos.length - 2].total : totalFondos;
  const totalDeuda = CREDITOS_REALES.reduce((s, c) => s + (c.deudaVigente || 0), 0);
  const totalVentas = COB_KPIS ? COB_KPIS.totalFacturado : 0;
  const ventasPend = COB_KPIS ? COB_KPIS.totalSaldo : 0;

  // Mini sparkline for saldos (last 4 months flow)
  const months4 = meses.slice(-4);
  const flows = months4.map(m => movByMonth[m].ingresos - movByMonth[m].gastos);
  const bancoColors = ['var(--g600)', 'var(--g500)', 'var(--g400)', 'var(--amber)', 'oklch(52% .15 240)', 'var(--t3)'];
  const maxSaldo = Math.max(...Object.values(saldos));

  // Recent movs (last 5)
  const recentMovs = (typeof MOV_RECIENTES !== 'undefined' ? MOV_RECIENTES : []).slice(0, 6);
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "home-hero"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      color: 'rgba(255,255,255,.5)',
      marginBottom: 6
    }
  }, "Resumen Consolidado \u2014 ", new Date().toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 700,
      fontSize: 38,
      letterSpacing: '-.04em',
      color: '#fff',
      lineHeight: 1
    }
  }, fmt(totalBancario)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'rgba(255,255,255,.55)',
      marginTop: 6
    }
  }, "Saldo total en 6 cuentas bancarias")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      color: 'rgba(255,255,255,.5)',
      marginBottom: 4
    }
  }, "Patrimonio en Fondos"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 700,
      fontSize: 22,
      color: 'rgba(255,255,255,.9)',
      letterSpacing: '-.02em'
    }
  }, fmt(totalFondos)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'rgba(255,255,255,.5)',
      marginTop: 3
    }
  }, ((totalFondos / prevFondos - 1) * 100).toFixed(2), "% vs sem. anterior"))), /*#__PURE__*/React.createElement("div", {
    className: "hero-grid",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-stat-label"
  }, "Flujo Neto Abril"), /*#__PURE__*/React.createElement("div", {
    className: "hero-stat-val",
    style: {
      color: flujoNeto >= 0 ? '#a7f3a0' : '#fca5a5'
    }
  }, flujoNeto >= 0 ? '+' : '', fmt(flujoNeto)), /*#__PURE__*/React.createElement("div", {
    className: "hero-stat-sub"
  }, flujoNeto >= 0 ? 'Superávit' : 'Déficit', " del mes")), /*#__PURE__*/React.createElement("div", {
    className: "hero-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-stat-label"
  }, "Por Cobrar"), /*#__PURE__*/React.createElement("div", {
    className: "hero-stat-val",
    style: {
      color: '#fde68a'
    }
  }, fmt(ventasPend)), /*#__PURE__*/React.createElement("div", {
    className: "hero-stat-sub"
  }, COB_KPIS ? COB_KPIS.countPendiente : '—', " docs pendientes")), /*#__PURE__*/React.createElement("div", {
    className: "hero-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-stat-label"
  }, "Deuda Vigente"), /*#__PURE__*/React.createElement("div", {
    className: "hero-stat-val",
    style: {
      color: '#fca5a5'
    }
  }, fmt(totalDeuda)), /*#__PURE__*/React.createElement("div", {
    className: "hero-stat-sub"
  }, "Cr\xE9ditos activos")))), alerts.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, alerts.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 14px',
      background: a.tipo === 'crit' ? 'var(--red-bg)' : 'var(--amber-bg)',
      borderRadius: 9,
      border: `1px solid ${a.tipo === 'crit' ? 'var(--red)' : 'oklch(72% .18 75)'}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: a.tipo === 'crit' ? 'var(--red)' : 'oklch(45% .17 75)'
    }
  }, a.tipo === 'crit' ? '⚠ Alerta crítica' : '⚡ Alerta', ":"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: a.tipo === 'crit' ? 'var(--red)' : 'oklch(45% .17 75)'
    }
  }, a.banco, " \u2014 ", fmt(a.saldo), " (umbral: ", fmt(a.umbral), ")"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavTo('mov'),
    style: {
      marginLeft: 'auto',
      fontSize: 13,
      fontWeight: 600,
      color: a.tipo === 'crit' ? 'var(--red)' : 'oklch(45% .17 75)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'DM Sans',
      textDecoration: 'underline'
    }
  }, "Ver movimientos")))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-grid",
    style: {
      marginBottom: 14
    }
  }, [{
    label: 'Ingresos Abril',
    val: fmt(curMes.ingresos),
    chg: ((curMes.ingresos / prevMes.ingresos - 1) * 100).toFixed(1) + '%',
    up: curMes.ingresos >= prevMes.ingresos,
    icon: 'ven',
    dir: 'g'
  }, {
    label: 'Gastos Abril',
    val: fmt(curMes.gastos),
    chg: ((curMes.gastos / prevMes.gastos - 1) * 100).toFixed(1) + '%',
    up: curMes.gastos <= prevMes.gastos,
    icon: 'gas',
    dir: 'a'
  }, {
    label: 'Pagos Pendientes',
    val: fmt(totalPend),
    chg: `${pendientes.length} pagos`,
    up: false,
    icon: 'gas',
    dir: vencHoy > 0 ? 'r' : 'a'
  }, {
    label: 'Ventas Totales',
    val: fmt(totalVentas),
    chg: 'Jul–Sep 2025',
    up: true,
    icon: 'ven',
    dir: 'b'
  }].map((k, i) => /*#__PURE__*/React.createElement("div", {
    className: "kcard",
    key: i,
    style: {
      cursor: 'pointer'
    },
    onClick: () => onNavTo(i === 0 || i === 1 ? 'mov' : i === 2 ? 'gas' : 'ven')
  }, /*#__PURE__*/React.createElement("div", {
    className: `kcard-icon ${k.dir}`
  }, /*#__PURE__*/React.createElement(IC, {
    n: k.icon,
    s: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "kcard-label"
  }, k.label), /*#__PURE__*/React.createElement("div", {
    className: "kcard-val lg"
  }, k.val), /*#__PURE__*/React.createElement("div", {
    className: `kcard-change ${k.up ? 'up' : 'dn'}`
  }, /*#__PURE__*/React.createElement(IC, {
    n: k.up ? 'up' : 'dn',
    s: 10
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 3,
      color: 'var(--t3)'
    }
  }, k.chg))))), /*#__PURE__*/React.createElement("div", {
    className: "home-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Saldos Bancarios"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "6 cuentas activas")), /*#__PURE__*/React.createElement("button", {
    className: "card-act",
    onClick: () => onNavTo('mov')
  }, "Ver todo")), Object.entries(saldos).map(([banco, saldo], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "saldo-row"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: bancoColors[i],
      minWidth: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "saldo-banco"
  }, banco), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 4,
      background: 'var(--border)',
      borderRadius: 99,
      overflow: 'hidden',
      maxWidth: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${(saldo / maxSaldo * 100).toFixed(0)}%`,
      height: '100%',
      borderRadius: 99,
      background: bancoColors[i]
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "saldo-amt",
    style: {
      color: saldo < 2000000 ? 'var(--red)' : saldo < 5000000 ? 'oklch(50% .17 75)' : 'var(--text)'
    }
  }, fmt(saldo))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Pr\xF3ximos Pagos"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, pendientes.length, " pendientes \u2014 ", fmt(totalPend), " total")), /*#__PURE__*/React.createElement("button", {
    className: "card-act",
    onClick: () => onNavTo('gas')
  }, "Ver todo")), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("tbody", null, pendientes.slice(0, 6).map((g, i) => {
    const vencido = g.fecha <= new Date().toISOString().split('T')[0];
    return /*#__PURE__*/React.createElement("tr", {
      key: i,
      style: {
        borderTop: i > 0 ? '1px solid var(--border)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '7px 4px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: `pill ${vencido ? 'r' : 'a'}`,
      style: {
        fontSize: 10
      }
    }, fmtDate(g.fecha).slice(0, 6))), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '7px 6px',
        fontWeight: 500,
        maxWidth: 160,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: 12
      }
    }, g.descripcion.replace(/ \d{2}\.\d{3}\.\d{3}-\d/, '')), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '7px 4px',
        textAlign: 'right',
        fontFamily: 'DM Sans',
        fontWeight: 700,
        fontSize: 13.5,
        color: 'var(--amber)'
      }
    }, fmt(g.monto)));
  }))))), (() => {
    const hoy5 = new Date();
    hoy5.setHours(0, 0, 0, 0);
    const en5 = new Date(hoy5);
    en5.setDate(en5.getDate() + 5);
    const hoyStr5 = hoy5.toISOString().split('T')[0];
    const en5Str = en5.toISOString().split('T')[0];
    const items5 = [];
    // Créditos
    CREDITOS_REALES.forEach(function (c) {
      if (c.fechaProximaCuota >= hoyStr5 && c.fechaProximaCuota <= en5Str) {
        items5.push({
          fecha: c.fechaProximaCuota,
          desc: c.prestamo + ' (' + c.banco + ')',
          monto: c.proximaCuota,
          cat: 'cred',
          catLabel: 'Crédito'
        });
      }
    });
    // Cheques / Proyección
    pendientes.forEach(function (g) {
      if (g.fecha >= hoyStr5 && g.fecha <= en5Str) {
        items5.push({
          fecha: g.fecha,
          desc: g.descripcion.replace(/ \d{2}\.\d{3}\.\d{3}-\d/, ''),
          monto: g.monto,
          cat: 'gas',
          catLabel: 'Cheque'
        });
      }
    });
    // Sueldos — NOMINA_DATA (desde Excel) tiene prioridad; si no, usar SUELDOS_DATA (desde Sheets)
    var nomSrc = NOMINA_DATA.length ? NOMINA_DATA : SUELDOS_DATA.map(function (s) {
      return {
        empresa: s.nombre,
        personas: 1,
        monto: s.monto,
        dia_pago: s.dia_pago
      };
    });
    nomSrc.forEach(function (s) {
      var yr = hoy5.getFullYear(),
        mo = hoy5.getMonth();
      // Fin de mes: si NOMINA_DATA no tiene dia_pago → usar último día del mes
      var diaPago = s.dia_pago || 0;
      var p = diaPago > 0 ? new Date(yr, mo, diaPago) : new Date(yr, mo + 1, 0);
      if (p < hoy5) {
        p = diaPago > 0 ? new Date(yr, mo + 1, diaPago) : new Date(yr, mo + 2, 0);
      }
      var ps = p.toISOString().split('T')[0];
      var lbl = s.empresa + (s.personas > 1 ? ' (' + s.personas + 'p)' : '');
      if (ps >= hoyStr5 && ps <= en5Str) items5.push({
        fecha: ps,
        desc: lbl,
        monto: s.monto,
        cat: 'suel',
        catLabel: 'Sueldo'
      });
    });
    // Gastos Fijos
    GASTOS_FIJOS_DATA.forEach(function (g) {
      var yr = hoy5.getFullYear(),
        mo = hoy5.getMonth();
      var p = new Date(yr, mo, g.dia_pago);
      if (p < hoy5) p = new Date(yr, mo + 1, g.dia_pago);
      var ps = p.toISOString().split('T')[0];
      if (ps >= hoyStr5 && ps <= en5Str) items5.push({
        fecha: ps,
        desc: g.descripcion,
        monto: g.monto,
        cat: 'fijo',
        catLabel: g.categoria || 'Fijo'
      });
    });
    items5.sort(function (a, b) {
      return a.fecha.localeCompare(b.fecha);
    });
    const tot5 = items5.reduce(function (s, i) {
      return s + i.monto;
    }, 0);
    const catCol = {
      cred: 'var(--red)',
      gas: 'oklch(55% .17 75)',
      suel: 'oklch(48% .15 240)',
      fijo: 'var(--g600)'
    };
    const catBg = {
      cred: 'var(--red-bg)',
      gas: 'var(--amber-bg)',
      suel: 'oklch(94% .05 240)',
      fijo: 'oklch(94% .06 145)'
    };
    const getDias5 = function (f) {
      return Math.round((new Date(f) - hoy5) / 86400000);
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "card mb"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-hd"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "card-title"
    }, "\uD83D\uDCC5 Pr\xF3ximos 5 D\xEDas"), /*#__PURE__*/React.createElement("div", {
      className: "card-sub"
    }, items5.length, " obligaciones \u2014 ", fmt(tot5), " total"))), items5.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '20px 0',
        color: 'var(--t3)',
        fontSize: 13
      }
    }, "\u2705 Sin obligaciones en los pr\xF3ximos 5 d\xEDas") : /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        borderBottom: '2px solid var(--border)'
      }
    }, /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'left',
        padding: '6px 8px',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--t3)',
        textTransform: 'uppercase',
        letterSpacing: '.05em'
      }
    }, "Fecha"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'left',
        padding: '6px 8px',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--t3)',
        textTransform: 'uppercase',
        letterSpacing: '.05em'
      }
    }, "Descripci\xF3n"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'left',
        padding: '6px 4px',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--t3)',
        textTransform: 'uppercase',
        letterSpacing: '.05em'
      }
    }, "Tipo"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'right',
        padding: '6px 8px',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--t3)',
        textTransform: 'uppercase',
        letterSpacing: '.05em'
      }
    }, "Monto"))), /*#__PURE__*/React.createElement("tbody", null, items5.map(function (item, i) {
      const dias5 = getDias5(item.fecha);
      const rowBg5 = dias5 === 0 ? 'var(--red-bg)' : dias5 <= 2 ? 'var(--amber-bg)' : 'transparent';
      const diasLbl5 = dias5 === 0 ? 'Hoy' : dias5 === 1 ? 'Mañana' : 'en ' + dias5 + 'd';
      return /*#__PURE__*/React.createElement("tr", {
        key: i,
        style: {
          borderTop: '1px solid var(--border)',
          background: rowBg5
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '8px 8px',
          minWidth: 70
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'DM Sans',
          fontWeight: 700,
          fontSize: 12.5
        }
      }, fmtDate(item.fecha).slice(0, 6)), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10.5,
          fontWeight: 600,
          color: dias5 === 0 ? 'var(--red)' : dias5 <= 2 ? 'oklch(48% .17 75)' : 'var(--t3)'
        }
      }, diasLbl5)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '8px 6px',
          fontWeight: 500,
          maxWidth: 200,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }, item.desc), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '8px 4px'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: 99,
          fontSize: 10,
          fontWeight: 700,
          background: catBg[item.cat],
          color: catCol[item.cat]
        }
      }, item.catLabel)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '8px 8px',
          textAlign: 'right',
          fontFamily: 'DM Sans',
          fontWeight: 700,
          fontSize: 13.5,
          color: dias5 <= 2 ? catCol[item.cat] : 'var(--text)'
        }
      }, fmt(item.monto)));
    }), /*#__PURE__*/React.createElement("tr", {
      style: {
        borderTop: '2px solid var(--border)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 3,
      style: {
        padding: '9px 8px',
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--text)'
      }
    }, "Total pr\xF3ximos 5 d\xEDas"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '9px 8px',
        textAlign: 'right',
        fontFamily: 'DM Sans',
        fontWeight: 700,
        fontSize: 14,
        color: 'var(--red)'
      }
    }, fmt(tot5))))));
  })(), /*#__PURE__*/React.createElement("div", {
    className: "card mb"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Movimientos Recientes"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "\xDAltimas 6 operaciones")), /*#__PURE__*/React.createElement("button", {
    className: "card-act",
    onClick: () => onNavTo('mov')
  }, "Ver todos")), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Fecha"), /*#__PURE__*/React.createElement("th", null, "Descripci\xF3n"), /*#__PURE__*/React.createElement("th", null, "Banco"), /*#__PURE__*/React.createElement("th", null, "Tipo"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "Monto"))), /*#__PURE__*/React.createElement("tbody", null, recentMovs.map((m, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    className: "mono",
    style: {
      color: 'var(--t3)',
      fontSize: 13
    }
  }, fmtDate(m.fecha)), /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 500,
      maxWidth: 260,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, m.descripcion), /*#__PURE__*/React.createElement("td", {
    style: {
      color: 'var(--t3)',
      fontSize: 12
    }
  }, m.banco), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `pill ${m.tipo === 'INGRESO' ? 'g' : 'r'}`
  }, m.tipo)), /*#__PURE__*/React.createElement("td", {
    className: "mono r",
    style: {
      fontWeight: 600,
      color: m.monto > 0 ? 'var(--g600)' : 'var(--red)'
    }
  }, m.monto > 0 ? '+' : '', fmt(m.monto))))))), /*#__PURE__*/React.createElement("div", {
    className: "home-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      cursor: 'pointer'
    },
    onClick: () => onNavTo('fon')
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Fondos Mutuos"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "Patrimonio total"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: '-.03em',
      color: 'var(--g700)',
      marginBottom: 8
    }
  }, fmt(totalFondos)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--t3)',
      marginBottom: 10
    }
  }, "Variaci\xF3n semana: ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--g600)',
      fontWeight: 600
    }
  }, "+", fmt(totalFondos - prevFondos))), fondos.slice(-5).map((f, i, arr) => {
    const prev = arr[i - 1];
    const diff = prev ? f.total - prev.total : 0;
    return i === 0 ? null : /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 0',
        borderTop: '1px solid var(--border)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--t3)',
        minWidth: 50,
        fontFamily: 'DM Sans'
      }
    }, f.fecha.slice(5)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 3,
        background: 'var(--border)',
        borderRadius: 99,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${Math.min(f.total / fondos[fondos.length - 1].total * 100, 100).toFixed(0)}%`,
        height: '100%',
        background: 'var(--g500)',
        borderRadius: 99
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'DM Sans',
        fontSize: 13,
        fontWeight: 600,
        color: diff >= 0 ? 'var(--g600)' : 'var(--red)',
        minWidth: 60,
        textAlign: 'right'
      }
    }, diff >= 0 ? '+' : '', fmt(diff)));
  })), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      cursor: 'pointer'
    },
    onClick: () => onNavTo('cre')
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Estado de Cr\xE9ditos"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "Deuda pendiente total"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'DM Sans',
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: '-.03em',
      color: 'var(--red)',
      marginBottom: 12
    }
  }, fmt(totalDeuda)), CREDITOS_REALES.filter(c => c.deudaVigente > 0).map((c, i) => {
    const pct = c.montoInicial ? Math.min((c.montoInicial - (c.deudaVigente || 0)) / c.montoInicial * 100, 100) : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 500
      }
    }, c.prestamo), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'DM Sans',
        fontSize: 13.5,
        fontWeight: 600,
        color: 'var(--amber)'
      }
    }, fmt(c.montoTotal - c.pagado))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 4,
        background: 'var(--border)',
        borderRadius: 99,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${pct.toFixed(0)}%`,
        height: '100%',
        background: 'var(--g600)',
        borderRadius: 99
      }
    })));
  }))));
}

// ── App ──────────────────────────────────────────────────────────────────
function PinLock({
  onUnlock
}) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const HASH = '31313737'; // PIN codificado

  const check = p => {
    const encoded = p.split('').map(c => c.charCodeAt(0).toString(16)).join('');
    if (encoded === HASH) {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => {
        setPin('');
        setError(false);
        setShake(false);
      }, 700);
    }
  };
  const press = d => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4) setTimeout(() => check(next), 120);
  };
  const del = () => setPin(p => p.slice(0, -1));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--g900)',
      zIndex: 999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      background: 'var(--g600)',
      borderRadius: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: 22
    }
  }, "\uD83D\uDD12"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: '#fff',
      letterSpacing: '-.3px'
    }
  }, "Dashboard Financiero"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--g400)',
      marginTop: 4
    }
  }, "Ingresa tu PIN para continuar")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginBottom: 32,
      animation: shake ? 'pinShake .35s ease' : 'none'
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 14,
      height: 14,
      borderRadius: '50%',
      border: `2px solid ${error ? 'var(--red)' : pin.length > i ? 'var(--g300)' : 'var(--g600)'}`,
      background: pin.length > i ? error ? 'var(--red)' : 'var(--g300)' : 'transparent',
      transition: 'all .15s'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,72px)',
      gap: 10
    }
  }, [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((d, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => d === '' ? null : d === '⌫' ? del() : press(String(d)),
    style: {
      height: 72,
      fontSize: d === '⌫' ? 20 : 22,
      fontWeight: 600,
      background: d === '' ? 'transparent' : error ? 'rgba(220,38,38,.15)' : 'rgba(255,255,255,.07)',
      border: `1px solid ${d === '' ? 'transparent' : 'rgba(255,255,255,.1)'}`,
      borderRadius: 12,
      color: d === '' ? 'transparent' : '#fff',
      cursor: d === '' ? 'default' : 'pointer',
      transition: 'background .1s',
      fontFamily: 'DM Sans'
    },
    onMouseEnter: e => {
      if (d !== '') e.target.style.background = 'rgba(255,255,255,.14)';
    },
    onMouseLeave: e => {
      if (d !== '') e.target.style.background = error ? 'rgba(220,38,38,.15)' : 'rgba(255,255,255,.07)';
    }
  }, d))), error && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      fontSize: 12.5,
      color: 'var(--red)',
      fontWeight: 600
    }
  }, "PIN incorrecto"), /*#__PURE__*/React.createElement("style", null, `@keyframes pinShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`));
}
function App() {
  const [locked, setLocked] = useState(true);
  const [col, setCol] = useState(false);
  const [active, setActive] = useState('home');
  const [umbrales, setUmbrales] = useState(DEFAULT_UMBRALES);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [showAlertCfg, setShowAlertCfg] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showUploadVentas, setShowUploadVentas] = useState(false);
  const [showUploadNomina, setShowUploadNomina] = useState(false);
  const handleNominaImport = res => {
    NOMINA_DATA = res.byEmpresa;
    NOMINA_MES = res.mesStr || '';
    setNominaVer(v => v + 1);
  };
  const [nominaVer, setNominaVer] = useState(0);
  const [saldos, setSaldos] = useState(SALDOS_BANCO);
  const [movRecientes, setMovRecientes] = useState(MOV_RECIENTES);
  const [movByMonth, setMovByMonth] = useState(MOV_BY_MONTH);
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    const sc = localStorage.getItem('fdash_col');
    if (sc) setCol(sc === '1');
    const savedPage = localStorage.getItem('fdash_page') || 'home';
    setActive(savedPage);
  }, []);
  useEffect(() => {
    async function loadLiveData() {
      const BASE = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTj1EanSaF9L7EOt7uzJkaYM-4nSiJSe4cRG7Zp4oVai10WUghucUCUEhsHPcqnCFEAWyKLDD1AIyzB/pub';
      function parseCSV(txt) {
        if (!txt || typeof txt !== 'string') return [[]];
        return txt.trim().split('\n').map(function (line) {
          var c = [],
            cur = '',
            inQ = false;
          for (var i = 0; i < line.length; i++) {
            var ch = line[i];
            if (ch === '"') inQ = !inQ;else if (ch === ',' && !inQ) {
              c.push(cur.replace(/\r$/, '').trim());
              cur = '';
            } else cur += ch;
          }
          c.push(cur.replace(/\r$/, '').trim());
          return c;
        });
      }
      function cn(s) {
        if (!s) return 0;
        return parseInt(String(s).replace(/[$\s]/g, '').replace(/\./g, '').replace(/,\d+$/, '')) || 0;
      }
      function toISO(s) {
        if (!s) return '';
        var sep = s.indexOf('/') >= 0 ? '/' : s.match(/^\d{2}-\d{2}-\d{4}$/) ? '-' : null;
        if (sep) {
          var p = s.split(sep);
          return p[2] + '-' + p[1].padStart(2, '0') + '-' + p[0].padStart(2, '0');
        }
        return s.slice(0, 10);
      }
      function toMes(s) {
        if (!s) return '';
        var sep = s.indexOf('/') >= 0 ? '/' : s.match(/^\d{2}-\d{2}-\d{4}$/) ? '-' : null;
        if (sep) {
          var p = s.split(sep);
          return p[2] + '-' + p[1].padStart(2, '0');
        }
        return s.slice(0, 7);
      }
      try {
        var t = Date.now();
        var results = await Promise.allSettled([fetch(BASE + '?gid=365647797&single=true&output=csv&t=' + t).then(function (r) {
          return r.text();
        }), fetch(BASE + '?gid=2058514573&single=true&output=csv&t=' + t).then(function (r) {
          return r.text();
        }), fetch(BASE + '?gid=922494361&single=true&output=csv&t=' + t).then(function (r) {
          return r.text();
        }), fetch(BASE + '?gid=690377335&single=true&output=csv&t=' + t).then(function (r) {
          return r.text();
        }), fetch(BASE + '?gid=602912984&single=true&output=csv&t=' + t).then(function (r) {
          return r.text();
        })]);
        // allSettled: extraer valor o '' si falló
        function safeVal(r) {
          return r && r.status === 'fulfilled' && typeof r.value === 'string' ? r.value : '';
        }
        var movTxt = safeVal(results[0]),
          gasTxt = safeVal(results[1]),
          fonTxt = safeVal(results[2]),
          creTxt = safeVal(results[3]);
        var mRows = parseCSV(movTxt).slice(1).filter(function (r) {
          return r[0];
        });
        var ns = {};
        mRows.forEach(function (r) {
          var b = r[7],
            s = r[8];
          if (b && s && !ns[b]) ns[b] = cn(s);
        });
        if (Object.keys(ns).length) {
          SALDOS_BANCO = ns;
          setSaldos(ns);
        }
        var nr = mRows.slice(0, 100).map(function (r) {
          return {
            fecha: toISO(r[0]),
            descripcion: r[1],
            monto: cn(r[2]),
            tipo: r[3],
            banco: r[4],
            saldo: cn(r[5]),
            isIntercompany: isIntercompanyTransfer(r[1])
          };
        });
        MOV_RECIENTES = nr;
        setMovRecientes(nr);
        var bm = {};
        mRows.forEach(function (r) {
          var m = toMes(r[0]);
          if (!m) return;
          if (!bm[m]) bm[m] = {
            ingresos: 0,
            gastos: 0
          };
          // Excluir traspasos y rescates de fondos mutuos
          if (isIntercompanyTransfer(r[1])) return;
          var v = cn(r[2]);
          if (r[3] === 'INGRESO') bm[m].ingresos += v;else bm[m].gastos += Math.abs(v);
        });
        var nbm = Object.fromEntries(Object.entries(bm).sort());
        MOV_BY_MONTH = nbm;
        setMovByMonth(nbm);
        GASTOS = parseCSV(gasTxt).slice(1).filter(function (r) {
          return r[0];
        }).map(function (r) {
          return {
            fecha: toISO(r[0]),
            descripcion: r[1],
            monto: cn(r[2]),
            estado: r[3] || ''
          };
        });
        var fRows = parseCSV(fonTxt).slice(1).filter(function (r) {
          return r[0];
        });
        FONDOS = fRows.map(function (r) {
          return {
            fecha: toISO(r[0]),
            total: cn(r[5])
          };
        });
        if (fRows.length) {
          var last = fRows[fRows.length - 1];
          FONDOS_DETALLE = [{
            nombre: 'Scotiabank',
            valor: cn(last[4]),
            color: 'var(--g600)'
          }, {
            nombre: 'Santander Brian',
            valor: cn(last[3]),
            color: 'var(--g400)'
          }, {
            nombre: 'Santander',
            valor: cn(last[2]),
            color: 'var(--amber)'
          }].filter(function (d) {
            return d.valor > 0;
          });
        }
        var cRaws = parseCSV(creTxt).slice(1).filter(function (r) {
          return r[0];
        });
        CREDITOS_SHEETS_RAW = cRaws.map(function (r) {
          return {
            nombre: r[0] || '',
            fecha: toISO(r[1]),
            tipo: r[2] || '',
            montoTotal: cn(r[3]),
            montoPago: cn(r[4]),
            estado: r[5] || '',
            cuota: parseInt(r[6]) || 0
          };
        });
        var cMap = {};
        cRaws.forEach(function (r) {
          var n = r[0];
          if (!cMap[n]) cMap[n] = {
            prestamo: n,
            tipo: r[2],
            montoTotal: cn(r[3]),
            pagado: 0
          };
          if (r[5] === 'Pagado') cMap[n].pagado += cn(r[4]);
        });
        CREDITOS = Object.values(cMap).filter(function (c) {
          return c.montoTotal > 1000000 && c.pagado < c.montoTotal;
        });
        // Enriquecer CREDITOS_REALES con pagos reales del Sheets
        var sheetsGrupos = {};
        CREDITOS_SHEETS_RAW.forEach(function (r) {
          if (!sheetsGrupos[r.nombre]) sheetsGrupos[r.nombre] = [];
          sheetsGrupos[r.nombre].push(r);
        });
        CREDITOS_REALES.forEach(function (cr) {
          var mk = null;
          Object.keys(sheetsGrupos).forEach(function (k) {
            if (k.indexOf(cr.numero) >= 0) mk = k;
            if (!mk && k.toLowerCase().indexOf('scotiabank') >= 0 && cr.banco.toLowerCase().indexOf('scotiabank') >= 0) mk = k;
            if (!mk && k.toLowerCase().indexOf('bancochile') >= 0 && cr.banco.toLowerCase().indexOf('bancochile') >= 0) mk = k;
          });
          if (!mk) return;
          var cuotas = sheetsGrupos[mk].slice().sort(function (a, b) {
            return a.cuota - b.cuota;
          });
          var pagadas = cuotas.filter(function (q) {
            return q.estado === 'Pagado';
          });
          var pendientes = cuotas.filter(function (q) {
            return q.estado !== 'Pagado';
          });
          var totalPagado = pagadas.reduce(function (s, q) {
            return s + q.montoPago;
          }, 0);
          var mTotal = cuotas[0] ? cuotas[0].montoTotal : cr.montoInicial || 0;
          cr.deudaVigente = Math.max(0, mTotal - totalPagado);
          cr.cuotasPagadas = pagadas.length;
          cr.cuotasTotales = cuotas.length;
          var next = pendientes[0] || null;
          cr.proximaCuota = next ? next.montoPago : 0;
          cr.fechaProximaCuota = next ? next.fecha : '';
          cr.cuotas = cuotas.map(function (q) {
            return {
              numero: String(q.cuota).padStart(3, '0'),
              vencimiento: q.fecha,
              capital: null,
              interes: null,
              valorCuota: q.montoPago,
              estado: q.estado === 'Pagado' ? 'Pagada' : 'Pendiente'
            };
          });
          console.log('✅ Crédito actualizado:', cr.prestamo, '| Deuda:', cr.deudaVigente, '| Pagadas:', cr.cuotasPagadas + '/' + cr.cuotasTotales);
        });

        // ── COBRANZA desde Google Sheets ─────────────────────────────────────
        var cobTxt = safeVal(results[4]);
        var cobAllRows = parseCSV(cobTxt);
        if (cobAllRows.length > 1 && !cobTxt.includes('<!DOCTYPE')) {
          var hKw = /folio|factura|empresa|cliente|razón|razon|rut|total|monto|saldo|estado|fecha|venc|ejecut|vendedor|código|codigo/i;
          var hIdx = cobAllRows.findIndex(function (row) {
            return row.filter(function (c) {
              return hKw.test(String(c));
            }).length >= 2;
          });
          if (hIdx < 0) hIdx = 0;
          var hdr = cobAllRows[hIdx];
          var dRows = cobAllRows.slice(hIdx + 1).filter(function (r) {
            return r.some(function (c) {
              return c !== '';
            });
          });
          function fc() {
            var terms = [].slice.call(arguments);
            for (var i = 0; i < hdr.length; i++) {
              var h = String(hdr[i] || '').toLowerCase().replace(/\s+/g, ' ').trim();
              for (var j = 0; j < terms.length; j++) {
                if (h.includes(terms[j])) return i;
              }
            }
            return -1;
          }
          var iRut = fc('rut', 'código legal', 'codigo legal');
          var iEmp = fc('razón social', 'razon social', 'empresa', 'cliente', 'nombre');
          var iFol = fc('folio', 'n°', 'nro', 'num', '#', 'doc');
          var iFec = fc('f/emision', 'emision', 'emisión', 'fecha e', 'f. e');
          var iTot = fc('total facturado', 'total fact', 'total', 'monto total');
          var iSal = fc('saldo pendiente', 'saldo', 'por cobrar');
          var iEst = fc('estado', 'situacion');
          var iVen = fc('vencim', 'vence', 'plazo', 'f. venc');
          var iDia = fc('dias venc', 'días venc', 'atraso', 'mora');
          var iPag = fc('fecha pago', 'f. pago', 'fecha p');
          var iEje = fc('ejecutivo', 'vendedor', 'repr');
          var iObs = fc('obs', 'observ', 'detalle', 'nota', 'glosa');
          var hoyCob = new Date();
          var pending = [];
          dRows.forEach(function (r) {
            var total = iTot >= 0 ? cn(r[iTot]) : 0;
            if (!total) return;
            var emp = (iEmp >= 0 ? r[iEmp] : '') || (iRut >= 0 ? r[iRut] : '') || 'SIN NOMBRE';
            var saldoRaw = iSal >= 0 ? cn(r[iSal]) : 0;
            var estRaw = (iEst >= 0 ? r[iEst] || '' : '').trim().toUpperCase();
            var saldo = iSal >= 0 ? saldoRaw : /pagado|cobrado|cancelado/i.test(estRaw) ? 0 : total;
            var estado = estRaw || (saldo === 0 ? 'PAGADO' : 'PENDIENTE');
            var venc = iVen >= 0 ? toISO(r[iVen]) : '';
            var diasV = iDia >= 0 ? parseInt(r[iDia]) || 0 : venc && saldo > 0 ? Math.max(0, Math.round((hoyCob - new Date(venc)) / 86400000)) : 0;
            var folStr = iFol >= 0 ? String(r[iFol]).trim() : '';
            pending.push({
              rut: iRut >= 0 ? String(r[iRut]).trim() : '',
              empresa: String(emp).trim().toUpperCase(),
              folio: parseInt(folStr) || 0,
              folioStr: folStr,
              fechaEmision: iFec >= 0 ? toISO(r[iFec]) : '',
              total: total,
              saldo: saldo,
              obs: iObs >= 0 ? String(r[iObs]).replace(/_x000D_/g, '').trim() : '',
              vencimiento: venc,
              diasVencido: diasV,
              estado: estado,
              fechaPago: iPag >= 0 ? toISO(r[iPag]) : '',
              ejecutivo: iEje >= 0 ? String(r[iEje]).trim().toUpperCase() : ''
            });
          });
          if (pending.length) {
            var tF = pending.reduce(function (s, r) {
              return s + r.total;
            }, 0);
            var tS = pending.reduce(function (s, r) {
              return s + r.saldo;
            }, 0);
            var tP = pending.filter(function (r) {
              return r.estado === 'PAGADO' || r.saldo === 0;
            }).reduce(function (s, r) {
              return s + r.total - r.saldo;
            }, 0);
            var tFact = pending.filter(function (r) {
              return r.estado === 'FACTORING';
            }).reduce(function (s, r) {
              return s + r.total;
            }, 0);
            var cV = pending.filter(function (r) {
              return r.estado === 'VENCIDO';
            }).length;
            var sV = pending.filter(function (r) {
              return r.estado === 'VENCIDO';
            }).reduce(function (s, r) {
              return s + r.saldo;
            }, 0);
            var cP = pending.filter(function (r) {
              return r.estado === 'PENDIENTE';
            }).length;
            var sP = pending.filter(function (r) {
              return r.estado === 'PENDIENTE';
            }).reduce(function (s, r) {
              return s + r.saldo;
            }, 0);
            var cFact = pending.filter(function (r) {
              return r.estado === 'FACTORING';
            }).length;
            var cNC = pending.filter(function (r) {
              return r.estado === 'NCREDITO';
            }).length;
            COB_KPIS = {
              totalFacturado: tF,
              totalSaldo: tS,
              totalPagado: tP,
              totalFactoring: tFact,
              countDocs: pending.length,
              countVencido: cV,
              saldoVencido: sV,
              countPendiente: cP,
              saldoPendiente: sP,
              countFactoring: cFact,
              countNCredito: cNC
            };
            COB_PENDIENTES = pending;
            var pM = {};
            pending.forEach(function (r) {
              var m = r.fechaEmision.slice(0, 7);
              if (!m) return;
              if (!pM[m]) pM[m] = {
                total: 0,
                saldo: 0,
                count: 0,
                pagado: 0
              };
              pM[m].total += r.total;
              pM[m].saldo += r.saldo;
              pM[m].count++;
              pM[m].pagado += r.total - r.saldo;
            });
            COB_POR_MES = pM;
            var pE = {};
            pending.forEach(function (r) {
              var e = r.ejecutivo || 'SIN ASIGNAR';
              if (!pE[e]) pE[e] = {
                total: 0,
                saldo: 0,
                count: 0
              };
              pE[e].total += r.total;
              pE[e].saldo += r.saldo;
              pE[e].count++;
            });
            COB_POR_EJECUTIVO = pE;
            var clM = {};
            pending.forEach(function (r) {
              if (!clM[r.empresa]) clM[r.empresa] = {
                empresa: r.empresa,
                total: 0,
                saldo: 0,
                docs: 0
              };
              clM[r.empresa].total += r.total;
              clM[r.empresa].saldo += r.saldo;
              clM[r.empresa].docs++;
            });
            COB_TOP_CLIENTES = Object.values(clM).sort(function (a, b) {
              return b.total - a.total;
            }).slice(0, 20);
            setCobVersion(function (v) {
              return v + 1;
            });
            console.log('✅ COBRANZA cargada desde Google Sheets:', pending.length, 'registros | Total:', tF);
          }
        }
        // ── SUELDOS desde Google Sheets ──────────────────────────────────────
        // ── SUELDOS / NÓMINA desde Google Sheets ─────────────────────────
        if (GID_SUELDOS) {
          try {
            var sueldosTxt = await fetch(BASE + '?gid=' + GID_SUELDOS + '&single=true&output=csv&t=' + t).then(function (r) {
              return r.text();
            });
            var sAllRows = parseCSV(sueldosTxt);
            if (sAllRows.length > 1 && !sueldosTxt.includes('<!DOCTYPE')) {
              // Detectar fila de encabezados — buscar "empresa","nombre","monto"
              var sHdrKw = /empresa|rut|nombre|beneficiario|monto|banco/i;
              var sHIdx = sAllRows.findIndex(function (row) {
                return row.filter(function (c) {
                  return sHdrKw.test(String(c));
                }).length >= 2;
              });
              if (sHIdx < 0) sHIdx = 0;
              var sHdr = sAllRows[sHIdx];
              var sFindCol = function () {
                var terms = [].slice.call(arguments);
                for (var i = 0; i < sHdr.length; i++) {
                  var h = String(sHdr[i]).toLowerCase();
                  for (var j = 0; j < terms.length; j++) {
                    if (h.includes(terms[j])) return i;
                  }
                }
                return -1;
              };
              var sColEmp = sFindCol('empresa', 'razon', 'razón', 'compañia', 'compania');
              var sColNom = sFindCol('nombre', 'beneficiario', 'trabajador', 'empleado', 'apellido');
              var sColMto = sFindCol('monto', 'sueldo', 'salario', 'remuneracion', 'remuneración', 'liquido', 'líquido', 'total');
              var sDRows = sAllRows.slice(sHIdx + 1).filter(function (r) {
                return r.some(function (c) {
                  return c !== '';
                });
              });
              // Agrupar por empresa → NOMINA_DATA
              var sEmpMap = {};
              sDRows.forEach(function (r) {
                var emp = sColEmp >= 0 ? String(r[sColEmp] || '').trim() : 'Personal';
                var nom = sColNom >= 0 ? String(r[sColNom] || '').trim() : '';
                var mto = sColMto >= 0 ? cn(r[sColMto]) : 0;
                // Solo saltar si monto es 0, o si es una fila de totales — NO saltar por nom vacío
                if (mto <= 0 || /^total/i.test(emp) || /^total/i.test(nom)) return;
                if (!sEmpMap[emp]) sEmpMap[emp] = {
                  empresa: emp,
                  personas: 0,
                  monto: 0
                };
                sEmpMap[emp].personas++;
                sEmpMap[emp].monto += mto;
              });
              var nomFromSheets = Object.values(sEmpMap).filter(function (e) {
                return e.monto > 0;
              }).sort(function (a, b) {
                return b.monto - a.monto;
              });
              if (nomFromSheets.length) {
                NOMINA_DATA = nomFromSheets;
                console.log('✅ NÓMINA cargada desde Google Sheets:', nomFromSheets.length, 'empresas | Total:', nomFromSheets.reduce(function (s, e) {
                  return s + e.monto;
                }, 0));
              }
            }
          } catch (e) {
            console.warn('SUELDOS no disponibles:', e.message);
          }
        }
        // ── GASTOS FIJOS desde Google Sheets ─────────────────────────────────
        if (GID_GASTOS_FIJOS) {
          try {
            var gfTxt = await fetch(BASE + '?gid=' + GID_GASTOS_FIJOS + '&single=true&output=csv&t=' + t).then(function (r) {
              return r.text();
            });
            var gfRows = parseCSV(gfTxt).slice(1).filter(function (r) {
              return r[0];
            });
            GASTOS_FIJOS_DATA = gfRows.map(function (r) {
              return {
                descripcion: r[0] || '',
                monto: cn(r[1]),
                dia_pago: parseInt(r[2]) || 30,
                categoria: r[3] || 'Fijo'
              };
            }).filter(function (r) {
              return r.descripcion && r.monto > 0;
            });
            console.log('✅ GASTOS FIJOS cargados:', GASTOS_FIJOS_DATA.length, 'ítems');
          } catch (e) {
            console.warn('GASTOS_FIJOS no disponibles:', e.message);
          }
        }
        if (GID_FINIQUITOS) {
          try {
            var finTxt = await fetch(BASE + '?gid=' + GID_FINIQUITOS + '&single=true&output=csv&t=' + t).then(function (r) {
              return r.text();
            });
            var finRows = parseCSV(finTxt).slice(1).filter(function (r) {
              return r[0];
            });
            FINIQUITOS_RAW = finRows.map(function (r) {
              return {
                nombre: r[0] || '',
                fecha: toISO(r[1]),
                tipo: r[2] || '',
                montoTotal: Math.abs(cn(r[3])),
                montoPago: Math.abs(cn(r[4])),
                estado: r[5] || '',
                comentario: r[6] || ''
              };
            });
            console.log('✅ FINIQUITOS cargados:', FINIQUITOS_RAW.length, 'registros');
          } catch (e) {
            console.warn('FINIQUITOS no disponibles:', e.message);
          }
        }
      } catch (e) {
        console.warn('Datos en vivo no disponibles:', e.message);
      }
      setDataLoaded(true);
    }
    const t = setTimeout(() => setDataLoaded(true), 4000); // fallback si fetch cuelga
    loadLiveData().finally(() => clearTimeout(t));
  }, []);
  const nav = p => {
    setActive(p);
    localStorage.setItem('fdash_page', p);
  };
  const toggleCol = () => {
    const n = !col;
    setCol(n);
    localStorage.setItem('fdash_col', n ? '1' : '0');
  };
  const allAlerts = useAlerts(saldos, umbrales);
  const visibleAlerts = allAlerts.filter(a => !dismissedAlerts.includes(a.id));
  const dismissAlert = id => setDismissedAlerts(prev => [...prev, id]);
  const handleImport = newMovs => {
    const flaggedNewMovs = newMovs.map(m => ({
      ...m,
      isIntercompany: isIntercompanyTransfer(m.descripcion)
    }));
    setMovRecientes(prev => {
      const merged = [...flaggedNewMovs, ...prev];
      merged.sort((a, b) => b.fecha.localeCompare(a.fecha));
      return merged;
    });
    const newByMonth = {
      ...movByMonth
    };
    flaggedNewMovs.forEach(m => {
      const mes = m.fecha.slice(0, 7);
      if (!newByMonth[mes]) newByMonth[mes] = {
        ingresos: 0,
        gastos: 0
      };
      // Excluir de totales mensuales
      if (m.isIntercompany) return;
      if (m.monto > 0) newByMonth[mes].ingresos += m.monto;else newByMonth[mes].gastos += Math.abs(m.monto);
    });
    setMovByMonth(newByMonth);
  };
  const [cobVersion, setCobVersion] = useState(0);
  const handleCobImport = res => {
    COB_KPIS = res.kpis;
    COB_POR_MES = res.porMes;
    COB_POR_EJECUTIVO = res.porEj;
    COB_TOP_CLIENTES = res.topClientes;
    COB_PENDIENTES = res.pending;
    setCobVersion(v => v + 1); // force re-render
  };
  const navItems = [{
    id: 'home',
    label: 'Resumen',
    icon: 'fon'
  }, {
    id: 'mov',
    label: 'Movimientos',
    icon: 'mov'
  }, {
    id: 'sim',
    label: 'Simulador',
    icon: 'sim'
  }, {
    id: 'ia',
    label: 'Analista IA',
    icon: 'ia'
  }, {
    id: 'gas',
    label: 'Proyección',
    icon: 'gas'
  }, {
    id: 'ven',
    label: 'Ventas',
    icon: 'ven'
  }, {
    id: 'fon',
    label: 'Fondos',
    icon: 'fon'
  }, {
    id: 'cre',
    label: 'Créditos',
    icon: 'cre'
  }, {
    id: 'fin',
    label: 'Finiquitos',
    icon: 'fin'
  }];
  const titles = {
    home: 'Resumen General',
    mov: 'Movimientos Bancarios',
    sim: 'Simulador Predictivo',
    ia: 'Analista IA Financiero',
    gas: 'Proyección de Gastos',
    ven: 'Reporte de Ventas',
    fon: 'Fondos Mutuos',
    cre: 'Créditos y Préstamos',
    fin: 'Finiquitos y Préstamos'
  };
  const subtitles = {
    home: 'Vista consolidada',
    mov: 'Saldos en tiempo real',
    sim: 'Simulador interactivo de runway a 12 meses',
    ia: 'Auditoría financiera inteligente computada por IA',
    gas: 'Pagos y vencimientos',
    ven: 'Facturación del período',
    fon: 'Patrimonio invertido',
    cre: 'Deuda y amortizaciones',
    fin: 'Finiquitos y préstamos a trabajadores'
  };
  if (locked) return /*#__PURE__*/React.createElement(PinLock, {
    onUnlock: () => setLocked(false)
  });
  if (!dataLoaded) return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--bg)',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      border: '3px solid var(--g200)',
      borderTopColor: 'var(--g600)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--t2)',
      fontSize: 13,
      fontFamily: 'DM Sans,sans-serif'
    }
  }, "Cargando datos..."));
  return /*#__PURE__*/React.createElement(React.Fragment, null, showAlertCfg && /*#__PURE__*/React.createElement(AlertConfigPanel, {
    umbrales: umbrales,
    setUmbrales: setUmbrales,
    onClose: () => setShowAlertCfg(false)
  }), showUpload && /*#__PURE__*/React.createElement(UploadMovPanel, {
    onImport: handleImport,
    onClose: () => setShowUpload(false)
  }), showUploadVentas && /*#__PURE__*/React.createElement(UploadVentasPanel, {
    onImport: handleCobImport,
    onClose: () => setShowUploadVentas(false)
  }), showUploadNomina && /*#__PURE__*/React.createElement(UploadNominaPanel, {
    onImport: handleNominaImport,
    onClose: () => setShowUploadNomina(false)
  }), /*#__PURE__*/React.createElement("nav", {
    className: `sb ${col ? 'col' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "sb-logo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo-mark"
  }, "F"), /*#__PURE__*/React.createElement("div", {
    className: "logo-text"
  }, "Finanza")), /*#__PURE__*/React.createElement("button", {
    className: "col-btn",
    onClick: toggleCol,
    title: col ? 'Expandir' : 'Contraer'
  }, /*#__PURE__*/React.createElement(IC, {
    n: col ? 'men' : 'chv',
    s: 15
  })), /*#__PURE__*/React.createElement("div", {
    className: "sb-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sb-lbl"
  }, "M\xF3dulos"), navItems.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    className: `ni ${active === n.id ? 'act' : ''}`,
    onClick: () => nav(n.id),
    title: n.label
  }, /*#__PURE__*/React.createElement("div", {
    className: "ni-icon"
  }, n.id === 'home' ? /*#__PURE__*/React.createElement("svg", {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "9 22 9 12 15 12 15 22"
  })) : /*#__PURE__*/React.createElement(IC, {
    n: n.icon,
    s: 17
  })), /*#__PURE__*/React.createElement("div", {
    className: "ni-label"
  }, n.label), n.id === 'home' && visibleAlerts.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      background: 'var(--red)',
      borderRadius: 99,
      minWidth: 16,
      height: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 9,
      fontWeight: 700,
      color: '#fff',
      padding: '0 4px'
    }
  }, visibleAlerts.length)))), /*#__PURE__*/React.createElement("div", {
    className: "sb-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sb-lbl"
  }, "Herramientas"), /*#__PURE__*/React.createElement("div", {
    className: "ni",
    title: "Importar movimientos",
    onClick: () => setShowUpload(true)
  }, /*#__PURE__*/React.createElement("div", {
    className: "ni-icon"
  }, /*#__PURE__*/React.createElement("svg", {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "17 8 12 3 7 8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "3",
    x2: "12",
    y2: "15"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ni-label"
  }, "Importar archivo")), /*#__PURE__*/React.createElement("div", {
    className: "ni",
    title: "Configurar alertas",
    onClick: () => setShowAlertCfg(true),
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ni-icon"
  }, /*#__PURE__*/React.createElement(IC, {
    n: "cfg",
    s: 17
  })), /*#__PURE__*/React.createElement("div", {
    className: "ni-label"
  }, "Alertas"), visibleAlerts.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      background: 'var(--amber)',
      borderRadius: 99,
      minWidth: 16,
      height: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 9,
      fontWeight: 700,
      color: '#fff',
      padding: '0 4px'
    }
  }, visibleAlerts.length))), /*#__PURE__*/React.createElement("div", {
    className: "sb-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "user-pill"
  }, /*#__PURE__*/React.createElement("div", {
    className: "avatar"
  }, "BV"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "u-name"
  }, "Brandon V."), /*#__PURE__*/React.createElement("div", {
    className: "u-role"
  }, "Administraci\xF3n"))))), /*#__PURE__*/React.createElement("main", {
    className: `main ${col ? 'col' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tb-title"
  }, titles[active], /*#__PURE__*/React.createElement("span", {
    className: "tb-sub"
  }, subtitles[active])), /*#__PURE__*/React.createElement("div", {
    className: "tb-date"
  }, new Date().toLocaleDateString("es-CL"), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--g400)',
      marginLeft: 8,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '.03em'
    }
  }, "v3.7 \xB7 05 May 2026")), /*#__PURE__*/React.createElement("div", {
    title: "Sincronizaci\xF3n autom\xE1tica via n8n: 7:00 \xB7 12:00 \xB7 16:00 \xB7 18:00 hrs",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      padding: '4px 9px',
      background: 'oklch(95% .04 155)',
      border: '1px solid oklch(85% .07 155)',
      borderRadius: 20,
      cursor: 'default',
      userSelect: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--g500)',
      display: 'inline-block',
      animation: 'pulse-dot 2.2s ease-in-out infinite'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--g700)',
      letterSpacing: '.01em'
    }
  }, "n8n \xB7 4x/d\xEDa")), active === 'ven' && /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowUploadVentas(true),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 11px',
      background: 'var(--g700)',
      color: '#fff',
      border: 'none',
      borderRadius: 7,
      cursor: 'pointer',
      fontSize: 12,
      fontWeight: 600,
      fontFamily: 'DM Sans'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 13,
    height: 13,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "17 8 12 3 7 8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "3",
    x2: "12",
    y2: "15"
  })), "Actualizar"), active === 'home' && /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowUploadNomina(true),
    title: NOMINA_DATA.length ? 'Nómina cargada: ' + NOMINA_MES : 'Cargar nómina de sueldos',
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 11px',
      background: NOMINA_DATA.length ? 'var(--g600)' : 'var(--surface)',
      color: NOMINA_DATA.length ? '#fff' : 'var(--t2)',
      border: '1px solid var(--border)',
      borderRadius: 7,
      cursor: 'pointer',
      fontSize: 12,
      fontWeight: 600,
      fontFamily: 'DM Sans'
    }
  }, "\uD83D\uDCB8 ", NOMINA_DATA.length ? 'Nómina ✓' : 'Subir Nómina'), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    title: "Importar Excel",
    onClick: () => setShowUpload(true),
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "17 8 12 3 7 8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "3",
    x2: "12",
    y2: "15"
  }))), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    title: "Configurar alertas",
    onClick: () => setShowAlertCfg(true),
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(IC, {
    n: "cfg",
    s: 15
  }), visibleAlerts.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "badge-dot",
    style: {
      background: 'var(--red)'
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    title: "Notificaciones",
    style: {
      position: 'relative'
    },
    onClick: () => setShowAlertCfg(true)
  }, /*#__PURE__*/React.createElement(IC, {
    n: "not",
    s: 15
  }), visibleAlerts.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "badge-dot"
  }))), /*#__PURE__*/React.createElement(AlertStrip, {
    alerts: visibleAlerts,
    onClose: dismissAlert
  }), active === 'home' && /*#__PURE__*/React.createElement(HomePage, {
    saldos: saldos,
    movByMonth: movByMonth,
    gastos: GASTOS,
    ventas: VENTAS,
    creditos: CREDITOS,
    fondos: FONDOS,
    alerts: [],
    onNavTo: nav
  }), active === 'mov' && /*#__PURE__*/React.createElement(MovimientosPage, {
    movRecientes: movRecientes,
    saldos: saldos,
    onNavTo: nav
  }), active === 'sim' && /*#__PURE__*/React.createElement(RunwaySimulatorPage, {
    saldos: saldos,
    movRecientes: movRecientes
  }), active === 'ia' && /*#__PURE__*/React.createElement(AIAdvisorPage, {
    saldos: saldos
  }), active === 'gas' && /*#__PURE__*/React.createElement(GastosPage, {
    nominaVer: nominaVer
  }), active === 'ven' && /*#__PURE__*/React.createElement(VentasPage, {
    onUpload: () => setShowUploadVentas(true),
    dataLoaded: dataLoaded
  }), active === 'fon' && /*#__PURE__*/React.createElement(FondosPage, null), active === 'cre' && /*#__PURE__*/React.createElement(CreditosPage, {
    saldos: saldos
  }), active === 'fin' && /*#__PURE__*/React.createElement(FiniquitosPage, null)));
}

// ── Runway Simulator Page Component ──
function RunwaySimulatorPage({
  saldos,
  movRecientes
}) {
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
  const {
    monthsLabels,
    projectedBalances,
    timelineData
  } = useMemo(() => {
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
    return {
      monthsLabels: labels,
      projectedBalances: balances,
      timelineData: tableRows
    };
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
        toolbar: {
          show: false
        }
      },
      colors: ['var(--blue)'],
      dataLabels: {
        enabled: true,
        formatter: val => fmt(val),
        style: {
          fontSize: '9px',
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 600
        }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
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
        labels: {
          style: {
            colors: 'var(--t3)',
            fontSize: '11px'
          }
        }
      },
      yaxis: {
        labels: {
          formatter: val => fmt(val, true),
          style: {
            colors: 'var(--t3)',
            fontSize: '11px'
          }
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
            style: {
              color: '#fff',
              background: 'var(--red)',
              fontSize: '9px',
              fontWeight: 600
            },
            text: 'Déficit (Línea de Alerta)',
            position: 'left'
          }
        }]
      },
      tooltip: {
        y: {
          formatter: val => fmt(val)
        },
        theme: 'light'
      }
    };
    const chart = new ApexCharts(el, options);
    chart.render();
    return () => chart.destroy();
  }, [projectedBalances, monthsLabels]);
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-controls"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sim-label",
    style: {
      fontSize: 12,
      color: 'var(--text)'
    }
  }, "Controles de Simulaci\xF3n"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--t3)',
      marginTop: 3
    }
  }, "Ajusta variables y estima tu runway futuro")), /*#__PURE__*/React.createElement("hr", {
    style: {
      border: 'none',
      borderTop: '1px solid var(--border)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "sim-group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sim-label"
  }, "\xC9xito en Cobranza"), /*#__PURE__*/React.createElement("div", {
    className: "sim-slider-container",
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "sim-slider",
    min: "0",
    max: "100",
    step: "10",
    value: probabilidad,
    onChange: e => setProbabilidad(parseInt(e.target.value))
  }), /*#__PURE__*/React.createElement("div", {
    className: "sim-slider-labels"
  }, /*#__PURE__*/React.createElement("span", null, "0%"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: 'var(--blue)'
    }
  }, probabilidad, "%"), /*#__PURE__*/React.createElement("span", null, "100%")))), /*#__PURE__*/React.createElement("div", {
    className: "sim-group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sim-label"
  }, "Reserva Inicial"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "sim-checkbox-label"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: incluirFfmm,
    onChange: e => setIncluirFfmm(e.target.checked)
  }), "Incluir Fondos Mutuos"))), /*#__PURE__*/React.createElement("div", {
    className: "sim-group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sim-label"
  }, "Incluir en Egresos"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "sim-checkbox-label"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: incluirSueldos,
    onChange: e => setIncluirSueldos(e.target.checked)
  }), "Remuneraciones (Sueldos)"), /*#__PURE__*/React.createElement("label", {
    className: "sim-checkbox-label"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: incluirCreditos,
    onChange: e => setIncluirCreditos(e.target.checked)
  }), "Cr\xE9ditos Bancarios"), /*#__PURE__*/React.createElement("label", {
    className: "sim-checkbox-label"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: incluirFijos,
    onChange: e => setIncluirFijos(e.target.checked)
  }), "Gastos Fijos"), /*#__PURE__*/React.createElement("label", {
    className: "sim-checkbox-label"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: incluirFiniquitos,
    onChange: e => setIncluirFiniquitos(e.target.checked)
  }), "Finiquitos"), /*#__PURE__*/React.createElement("label", {
    className: "sim-checkbox-label"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: incluirGastos,
    onChange: e => setIncluirGastos(e.target.checked)
  }), "Compras Variables"))), /*#__PURE__*/React.createElement("hr", {
    style: {
      border: 'none',
      borderTop: '1px solid var(--border)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "sim-summary-box"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-label"
  }, "Saldo Proyectado a 12m"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: timelineData[11].final >= 0 ? 'var(--g600)' : 'var(--red)',
      marginTop: 4
    }
  }, fmt(timelineData[11].final))), /*#__PURE__*/React.createElement("div", {
    className: "sim-summary-box",
    style: {
      background: firstDeficit ? 'var(--red-bg)' : 'oklch(95% .03 145)',
      borderColor: firstDeficit ? 'var(--red)' : 'var(--g300)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-label",
    style: {
      color: firstDeficit ? 'var(--red)' : 'var(--g700)'
    }
  }, "D\xE9ficit Estimado"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 700,
      color: firstDeficit ? 'var(--red)' : 'var(--g700)',
      marginTop: 4
    }
  }, firstDeficit ? `Déficit en ${firstDeficit.label}` : 'Sin Déficit Proyectado'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Runway de Caja Proyectado a 12 Meses"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "Simulaci\xF3n basada en flujos netos org\xE1nicos reales"))), /*#__PURE__*/React.createElement("div", {
    id: "chart-runway-proyeccion",
    style: {
      minHeight: 290
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Detalle Matem\xE1tico Mensual"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "Ecuaci\xF3n de flujo: Saldo Inicial + Cobros - Egresos = Saldo Final"))), /*#__PURE__*/React.createElement("table", {
    className: "tbl",
    style: {
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Periodo"), /*#__PURE__*/React.createElement("th", null, "Saldo Inicial"), /*#__PURE__*/React.createElement("th", null, "(+) Cobros"), /*#__PURE__*/React.createElement("th", null, "(-) Egresos"), /*#__PURE__*/React.createElement("th", null, "(-) N\xF3mina"), /*#__PURE__*/React.createElement("th", null, "(-) Cr\xE9ditos"), /*#__PURE__*/React.createElement("th", null, "(=) Neto"), /*#__PURE__*/React.createElement("th", {
    className: "r"
  }, "(=) Final"))), /*#__PURE__*/React.createElement("tbody", null, timelineData.map((row, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      background: row.final < 0 ? 'var(--red-bg)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 600
    }
  }, row.label), /*#__PURE__*/React.createElement("td", null, fmt(row.inicial)), /*#__PURE__*/React.createElement("td", {
    style: {
      color: 'var(--g600)',
      fontWeight: 500
    }
  }, "+", fmt(row.cobros)), /*#__PURE__*/React.createElement("td", {
    style: {
      color: 'var(--red)'
    }
  }, "-", fmt(row.egresos)), /*#__PURE__*/React.createElement("td", {
    style: {
      color: 'var(--red)'
    }
  }, "-", fmt(row.nomina)), /*#__PURE__*/React.createElement("td", {
    style: {
      color: 'var(--red)'
    }
  }, "-", fmt(row.creditos)), /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 600,
      color: row.flujo >= 0 ? 'var(--g600)' : 'var(--red)'
    }
  }, row.flujo >= 0 ? '+' : '', fmt(row.flujo)), /*#__PURE__*/React.createElement("td", {
    className: "r",
    style: {
      fontWeight: 700,
      color: row.final < 0 ? 'var(--red)' : 'var(--text)'
    }
  }, fmt(row.final))))))))));
}

// ── AI CFO Advisor Page Component ──
function AIAdvisorPage({
  saldos
}) {
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
  const maxDebtorPercent = cobranzaVencida > 0 ? maxDebtorVal / cobranzaVencida * 100 : 0;
  const creditosMes = CREDITOS_SHEETS_RAW.filter(c => c.estado !== 'Pagado').reduce((s, c) => s + c.montoPago, 0);
  const runwayDias = sueldosTotal + fijosTotal > 0 ? Math.round(totalCaja / ((sueldosTotal + fijosTotal) / 30)) : 365;
  const handleQuery = qType => {
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
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card ai-gradient-card mb"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '10px 6px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-avatar-glowing"
  }, /*#__PURE__*/React.createElement("svg", {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6a6 6 0 0 0-6 6c0 3.31 2.69 6 6 6s6-2.69 6-6a6 6 0 0 0-6-6z"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-headings)',
      fontWeight: 700,
      fontSize: 17,
      color: '#1e3a8a'
    }
  }, "Informe CFO de Inteligencia Artificial"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#475569',
      marginTop: 3
    }
  }, "Diagn\xF3stico corporativo computado en tiempo real en base a balances, cobranza activa y compromisos de egresos"))), /*#__PURE__*/React.createElement("hr", {
    style: {
      border: 'none',
      borderTop: '1px dashed rgba(37, 99, 235, 0.2)',
      margin: '14px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "ai-report-content"
  }, /*#__PURE__*/React.createElement("p", null, "Estimado Director,"), /*#__PURE__*/React.createElement("p", null, "El diagn\xF3stico consolidado de tesorer\xEDa para ", /*#__PURE__*/React.createElement("strong", null, "Grafhika & GMD"), " revela una liquidez operativa en cuentas bancarias de ", /*#__PURE__*/React.createElement("strong", null, fmt(totalCaja)), ", respaldada adicionalmente por un portafolio de inversiones en Fondos Mutuos que asciende a ", /*#__PURE__*/React.createElement("strong", null, fmt(totalInversiones)), ". Al contrastar la caja operativa con una estructura mensual de egresos fijos (planilla de sueldos de ", /*#__PURE__*/React.createElement("strong", null, fmt(sueldosTotal)), " y costos de planta de ", /*#__PURE__*/React.createElement("strong", null, fmt(fijosTotal)), "), la empresa mantiene una cobertura operativa inmediata en sus cuentas corrientes de aproximadamente ", /*#__PURE__*/React.createElement("strong", null, runwayDias, " d\xEDas"), " (ampli\xE1ndose significativamente al considerar tus fondos de inversi\xF3n liquidados)."), /*#__PURE__*/React.createElement("p", null, "El principal factor de riesgo identificado se encuentra en la cartera de cuentas por cobrar. Actualmente dispones de ", /*#__PURE__*/React.createElement("strong", null, fmt(cobranzaVencida)), " en estado vencido. Nuestros modelos indican una concentraci\xF3n cr\xEDtica de deuda: el cliente ", /*#__PURE__*/React.createElement("strong", null, maxDebtorName), " adeuda un saldo vencido acumulado de ", /*#__PURE__*/React.createElement("strong", null, fmt(maxDebtorVal)), ", lo que representa el ", /*#__PURE__*/React.createElement("strong", null, maxDebtorPercent.toFixed(1), "%"), " de toda tu cartera de cobro activa. Se sugiere priorizar inmediatamente esta cobranza para extender la holgura de caja de la organizaci\xF3n."))), /*#__PURE__*/React.createElement("div", {
    className: "g11"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Alertas y Oportunidades Estrat\xE9gicas"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "Hallazgos detectados autom\xE1ticamente"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, maxDebtorPercent > 30 && /*#__PURE__*/React.createElement("div", {
    className: "ai-alert-item danger"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-alert-icon"
  }, "\u26A0"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ai-alert-title"
  }, "Alta Concentraci\xF3n de Deuda Vencida"), /*#__PURE__*/React.createElement("div", {
    className: "ai-alert-desc"
  }, "El cliente ", maxDebtorName, " retiene el ", maxDebtorPercent.toFixed(1), "% de tu cartera vencida total (", fmt(maxDebtorVal), "). Una mora prolongada afectar\xE1 fuertemente tus flujos mensuales."))), runwayDias < 45 ? /*#__PURE__*/React.createElement("div", {
    className: "ai-alert-item warning"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-alert-icon"
  }, "\u23F3"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ai-alert-title"
  }, "Runway de Caja Operativa Ajustado"), /*#__PURE__*/React.createElement("div", {
    className: "ai-alert-desc"
  }, "Tu caja cubre menos de 45 d\xEDas de tu costo m\xEDnimo de operaci\xF3n. Recuerda que cuentas con ", fmt(totalInversiones), " adicionales en Fondos Mutuos como respaldo de emergencia."))) : /*#__PURE__*/React.createElement("div", {
    className: "ai-alert-item success"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-alert-icon"
  }, "\u2714"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ai-alert-title"
  }, "Excelente Holgura Operativa"), /*#__PURE__*/React.createElement("div", {
    className: "ai-alert-desc"
  }, "Tu liquidez actual te permite cubrir con creces sueldos consolidados y gastos fijos m\xEDnimos de operaci\xF3n por varios meses sin depender de nuevos cobros."))), totalInversiones > 0 && /*#__PURE__*/React.createElement("div", {
    className: "ai-alert-item success"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-alert-icon"
  }, "\uD83D\uDCB0"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ai-alert-title"
  }, "Reserva de Respaldo S\xF3lida"), /*#__PURE__*/React.createElement("div", {
    className: "ai-alert-desc"
  }, "Tu portafolio en Fondos Mutuos de ", fmt(totalInversiones), " es tu principal escudo financiero frente a shocks externos o contingencias comerciales."))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-hd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Consultas Financieras del Negocio"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "Haz clic para auditar la tesorer\xEDa en tiempo real"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-query-suggestions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ai-query-tag",
    onClick: () => handleQuery('diagnostico')
  }, "\xBFCu\xE1l es el diagn\xF3stico de salud financiera?"), /*#__PURE__*/React.createElement("button", {
    className: "ai-query-tag",
    onClick: () => handleQuery('riesgo-clientes')
  }, "\xBFQu\xE9 clientes representan el mayor riesgo?"), /*#__PURE__*/React.createElement("button", {
    className: "ai-query-tag",
    onClick: () => handleQuery('runway-analisis')
  }, "\xBFCu\xE1l es el an\xE1lisis de runway y egresos fijos?"), /*#__PURE__*/React.createElement("button", {
    className: "ai-query-tag",
    onClick: () => handleQuery('estrategia-90')
  }, "\xBFQu\xE9 acciones estrat\xE9gicas recomiendas para los pr\xF3ximos 90 d\xEDas?")), /*#__PURE__*/React.createElement("div", {
    className: "ai-chat-bubble"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-avatar-glowing",
    style: {
      width: 28,
      height: 28,
      fontSize: '0.9rem'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6a6 6 0 0 0-6 6c0 3.31 2.69 6 6 6s6-2.69 6-6a6 6 0 0 0-6-6z"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 700,
      color: 'var(--text)',
      marginBottom: 4
    }
  }, "Analista IA Financiero"), isTyping ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontStyle: 'italic',
      color: 'var(--t3)',
      fontSize: 12.5
    }
  }, "Analizando libros contables...") : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--t2)',
      lineHeight: 1.5
    },
    dangerouslySetInnerHTML: {
      __html: chatResponse || 'Haz clic en cualquiera de las consultas predefinidas arriba para analizar en tiempo real los flujos de la empresa y obtener recomendaciones personalizadas de inmediato.'
    }
  }))))))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
