const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

const server = http.createServer((req, res) => {
  // Remove query parameters
  const urlPath = req.url.split('?')[0];

  // ── ENDPOINT DE AUTO-INTEGRACIÓN DESARROLLADOR ──
  if (req.method === 'POST' && urlPath === '/api/save-config-to-disk') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const config = JSON.parse(body);
        if (!config.apiKey || !config.projectId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Configuración inválida. Falta apiKey o projectId.' }));
          return;
        }

        const htmlPath = path.join(__dirname, 'index.html');
        let html = fs.readFileSync(htmlPath, 'utf8');

        // Localizar el bloque de la constante DEFAULT_FIREBASE_CONFIG
        const startPattern = 'const DEFAULT_FIREBASE_CONFIG = {';
        const endPattern = '};';

        const startIndex = html.indexOf(startPattern);
        if (startIndex === -1) {
          throw new Error('No se encontró el bloque DEFAULT_FIREBASE_CONFIG en index.html');
        }

        // Buscar el cierre del objeto }; después del startPattern
        const afterStart = html.substring(startIndex);
        const relativeEndIndex = afterStart.indexOf(endPattern);
        if (relativeEndIndex === -1) {
          throw new Error('No se encontró el cierre de DEFAULT_FIREBASE_CONFIG en index.html');
        }

        const endIndex = startIndex + relativeEndIndex + endPattern.length;

        const replacement = `const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "${config.apiKey}",
  authDomain: "${config.authDomain || ''}",
  projectId: "${config.projectId}",
  storageBucket: "${config.storageBucket || ''}",
  messagingSenderId: "${config.messagingSenderId || ''}",
  appId: "${config.appId || ''}"
};`;

        html = html.substring(0, startIndex) + replacement + html.substring(endIndex);
        fs.writeFileSync(htmlPath, html, 'utf8');

        console.log(`\n======================================================`);
        console.log(`🎉 ¡ÉXITO: Firebase Config integrada en index.html!`);
        console.log(`👉 Proyecto: ${config.projectId}`);
        console.log(`======================================================\n`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error('Error al guardar config:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  let filePath = urlPath === '/' ? './index.html' : '.' + urlPath;
  
  // Prevent directory traversal
  filePath = path.normalize(filePath);
  if (filePath.startsWith('..')) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }
  
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('File Not Found');
      } else {
        res.statusCode = 500;
        res.end('Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Servidor local de desarrollo iniciado exitosamente!`);
  console.log(`👉 Abre tu navegador e ingresa a: http://localhost:${PORT}/`);
  console.log(`======================================================\n`);
});
