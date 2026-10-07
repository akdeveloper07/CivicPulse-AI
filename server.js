const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 3000;

function findDistDir() {
  const candidatePaths = [
    path.join(__dirname, 'frontend', 'dist'),
    path.join(__dirname, 'dist'),
    path.join(__dirname, '..', 'dist'),
    path.join(__dirname, '..', 'frontend', 'dist'),
    '/opt/render/project/src/frontend/dist',
    '/opt/render/project/src/dist',
    '/opt/render/project/dist',
    '/opt/render/project/frontend/dist'
  ];
  return candidatePaths.find(p => fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html')));
}

let DIST_DIR = findDistDir();
let isBuilding = false;
let buildError = null;

function triggerAsyncBuild() {
  if (isBuilding) return;
  isBuilding = true;
  console.log('Vite dist/ directory missing. Triggering non-blocking background build...');

  const frontendDir = fs.existsSync(path.join(__dirname, 'frontend'))
    ? path.join(__dirname, 'frontend')
    : __dirname;

  exec('npm run build', { cwd: frontendDir }, (err, stdout, stderr) => {
    isBuilding = false;
    if (err) {
      console.error('Async build failed:', err.message);
      buildError = err.message;
    } else {
      console.log('Async build completed successfully!');
      DIST_DIR = findDistDir();
    }
  });
}

if (!DIST_DIR) {
  triggerAsyncBuild();
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  DIST_DIR = DIST_DIR || findDistDir();

  if (!DIST_DIR) {
    if (!isBuilding && !buildError) {
      triggerAsyncBuild();
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>CivicPulse AI - Initializing App</title>
        <meta http-equiv="refresh" content="5">
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0b0f19; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .card { background: #1e293b; padding: 2.5rem; border-radius: 1rem; border: 1px solid #334155; text-align: center; max-width: 480px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          .spinner { width: 40px; height: 40px; border: 4px solid #334155; border-top-color: #38bdf8; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1.5rem; }
          @keyframes spin { to { transform: rotate(360deg); } }
          h2 { color: #38bdf8; margin-top: 0; }
          p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="spinner"></div>
          <h2>CivicPulse AI Initializing...</h2>
          <p>Compiling static frontend bundle. This page will automatically refresh every 5 seconds.</p>
          ${buildError ? `<p style="color:#ef4444; font-size:0.85rem;">Build status: ${buildError}</p>` : ''}
        </div>
      </body>
      </html>
    `);
    return;
  }

  const targetFile = req.url === '/' ? 'index.html' : req.url;
  let filePath = path.join(DIST_DIR, targetFile);

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (readErr, content) => {
    if (readErr) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`500 Internal Server Error: ${readErr.message}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

// Immediately bind to PORT so Render port scanner succeeds instantly!
server.listen(PORT, () => {
  console.log(`CivicPulse Server running on port ${PORT}`);
});
