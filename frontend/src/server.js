import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const candidatePaths = [
  path.join(__dirname, '..', 'dist'),
  path.join(__dirname, '..', '..', 'dist'),
  path.join(__dirname, '..', '..', 'frontend', 'dist'),
  '/opt/render/project/src/frontend/dist',
  '/opt/render/project/src/dist',
];

let DIST_DIR = candidatePaths.find(p => fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html')));

if (!DIST_DIR) {
  DIST_DIR = candidatePaths.find(p => fs.existsSync(p)) || path.join(__dirname, '..', 'dist');
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
      <head><title>CivicPulse AI - Deployment Diagnostics</title></head>
      <body style="font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem;">
        <h1 style="color: #38bdf8;">CivicPulse AI Server Active (Src)</h1>
        <p>The server is running, but static build output (<code>dist/index.html</code>) was not found.</p>
        <h3>Checked Paths:</h3>
        <ul>${candidatePaths.map(p => `<li>${p} - <strong>${fs.existsSync(p) ? 'EXISTS' : 'NOT FOUND'}</strong></li>`).join('')}</ul>
        <hr/>
        <p><strong>Fix on Render:</strong> Ensure Build Command is set to: <code>cd frontend && npm install && npm run build</code></p>
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
