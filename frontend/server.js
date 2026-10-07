import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

function findDistDir() {
  const candidatePaths = [
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

if (!DIST_DIR) {
  console.log('Vite dist/ directory missing in frontend. Triggering auto-build...');
  try {
    execSync('npm install && npm run build', { cwd: __dirname, stdio: 'inherit' });
    DIST_DIR = findDistDir();
  } catch (buildErr) {
    console.error('Auto-build failed:', buildErr.message);
  }
}

if (!DIST_DIR) {
  DIST_DIR = path.join(__dirname, 'dist');
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
  const targetFile = req.url === '/' ? 'index.html' : req.url;
  let filePath = path.join(DIST_DIR, targetFile);

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>CivicPulse AI - Building App</title></head>
      <body style="font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem;">
        <h1 style="color: #38bdf8;">CivicPulse AI Server Active (Frontend)</h1>
        <p>The static build (<code>dist/index.html</code>) is currently being generated or was not found.</p>
        <p>Please refresh the page in a few seconds once building completes.</p>
      </body>
      </html>
    `);
    return;
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

server.listen(PORT, () => {
  console.log(`CivicPulse Server running on port ${PORT}`);
  console.log(`Serving dist from: ${DIST_DIR}`);
});
