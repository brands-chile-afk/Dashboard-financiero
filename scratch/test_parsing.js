import fetch from 'node-fetch'; // Wait, let's use a native fetch if node 18+, or a simpler HTTP request in Node

// Let's write a simpler script using native https to fetch and parse the CSV
import https from 'https';

const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTj1EanSaF9L7EOt7uzJkaYM-4nSiJSe4cRG7Zp4oVai10WUghucUCUEhsHPcqnCFEAWyKLDD1AIyzB/pub?output=csv&gid=365647797";

function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentValue = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentValue += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentValue.trim());
      currentValue = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(currentValue.trim());
      lines.push(row);
      row = [];
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  if (currentValue || row.length > 0) {
    row.push(currentValue.trim());
    lines.push(row);
  }
  return lines;
}

function isIntercompanyTransfer(description) {
  if (!description) return false;
  const desc = description.toLowerCase();
  
  const isTransfer = desc.includes('traspaso') || desc.includes('transf') || desc.includes('transfe') || desc.includes('tef') || desc.includes('trasp');
  if (isTransfer) {
    const hasGmd = desc.includes('gmd') || desc.includes('grupo marketing digital') || desc.includes('grupo marketing');
    const hasGrafhika = desc.includes('grafhika') || desc.includes('copy center') || desc.includes('copycenter');
    if (hasGmd || hasGrafhika) return true;
  }
  
  const isRescate = desc.includes('rescate') && (desc.includes('fondo') || desc.includes('ffmm') || desc.includes('mutuo'));
  if (isRescate) return true;
  
  return false;
}

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const rows = parseCSV(data);
    console.log("Total rows:", rows.length);
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 2) continue;
      const desc = row[1];
      if (desc.toLowerCase().includes('rescate')) {
        const isInter = isIntercompanyTransfer(desc);
        console.log(`Row ${i}: Desc='${desc}' | isIntercompanyTransfer=${isInter} | RawRow=${JSON.stringify(row)}`);
      }
    }
  });
}).on('error', (err) => {
  console.log("Error:", err.message);
});
