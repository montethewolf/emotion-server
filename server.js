const http = require('http');

const PORT = 18790;
let currentEmotion = null;
let currentMode = 'listening'; // 'listening' | 'relaxing'

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/emotion') {
    if (req.method === 'POST') {
      // Set emotion
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.emotion) {
            currentEmotion = data.emotion;
            console.log(`[${new Date().toISOString()}] Emotion set: ${currentEmotion}`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, emotion: currentEmotion }));
          } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing emotion field' }));
          }
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else if (req.method === 'GET') {
      // Read + clear (one-shot)
      const emotion = currentEmotion;
      currentEmotion = null;
      if (emotion) {
        console.log(`[${new Date().toISOString()}] Emotion consumed: ${emotion}`);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ emotion }));
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
  } else if (req.url === '/mode') {
    if (req.method === 'POST') {
      // Set mode
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.mode && ['listening', 'relaxing', 'off'].includes(data.mode)) {
            const oldMode = currentMode;
            currentMode = data.mode;
            console.log(`[${new Date().toISOString()}] Mode changed: ${oldMode} → ${currentMode}`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, mode: currentMode }));
          } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid mode. Use: listening, relaxing, off' }));
          }
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else if (req.method === 'GET') {
      // Read mode (persistent, not consumed)
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ mode: currentMode }));
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
  } else if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', currentEmotion, currentMode }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Emotion server running on http://0.0.0.0:${PORT}`);
  console.log('Endpoints:');
  console.log('  POST /emotion - Set emotion {"emotion": "cheerful1"}');
  console.log('  GET  /emotion - Read + clear (one-shot)');
  console.log('  POST /mode    - Set mode {"mode": "listening|relaxing|off"}');
  console.log('  GET  /mode    - Read mode (persistent)');
  console.log('  GET  /health  - Health check');
});
