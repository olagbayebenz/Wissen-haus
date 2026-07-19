#!/usr/bin/env node

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/grade') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { apiKey, gradingPrompt } = JSON.parse(body);

        if (!apiKey) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'API key required' }));
          return;
        }

        const payload = JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 300,
          messages: [{
            role: 'user',
            content: gradingPrompt
          }]
        });

        const options = {
          hostname: 'api.anthropic.com',
          path: '/v1/messages',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          }
        };

        const anthropicReq = https.request(options, (anthropicRes) => {
          let data = '';
          anthropicRes.on('data', chunk => data += chunk);
          anthropicRes.on('end', () => {
            if (anthropicRes.statusCode === 200) {
              try {
                const result = JSON.parse(data);
                const content = result.content[0].text.trim();
                const gradeResult = JSON.parse(content);
                res.writeHead(200);
                res.end(JSON.stringify(gradeResult));
              } catch (e) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Parsing error: ' + e.message }));
              }
            } else {
              res.writeHead(anthropicRes.statusCode);
              res.end(JSON.stringify({ error: `API error: ${anthropicRes.statusCode}` }));
            }
          });
        });

        anthropicReq.on('error', (e) => {
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Request failed: ' + e.message }));
        });

        anthropicReq.write(payload);
        anthropicReq.end();
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid request: ' + e.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`🎓 Grading server running on http://localhost:${PORT}`);
  console.log('Ready to grade exercises!');
});
