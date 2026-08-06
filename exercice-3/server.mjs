// server.mjs
// ----------------------------------------------------------------------------
// Exercice III - Approfondissement
// On ajoute aux endpoints existants (add, subtract, multiply, divide) :
//   POST /sum                -> Calculator.sum([...])
//   POST /mean                -> Calculator.mean([...])
//   GET  /operations          -> Calculator.operations()
//   GET  /operations/:name    -> Calculator.operation(name)
// La route /operations/:name est une route "dynamique" : le nom de
// l'opération fait partie de l'URL elle-même (ex: /operations/add).
// ----------------------------------------------------------------------------

import http from 'http';
import Calculator from './calculator.mjs';

const calculator = new Calculator();
const hostname = '127.0.0.1';
const port = 3000;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(new Error("Corps de requête JSON invalide"));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  try {
    // On découpe l'URL en segments (ex: "/operations/add" -> ["operations", "add"])
    // afin de pouvoir gérer la route dynamique /operations/:name.
    // filter(Boolean) supprime les chaînes vides issues du split.
    const urlParts = req.url.split('/').filter(Boolean);

    // --- POST /add ---
    if (req.method === 'POST' && req.url === '/add') {
      const { a, b } = await readBody(req);
      return sendJson(res, 200, {
        operation: 'add',
        params: { a, b },
        result: calculator.add(a, b),
      });
    }

    // --- POST /subtract ---
    if (req.method === 'POST' && req.url === '/subtract') {
      const { a, b } = await readBody(req);
      return sendJson(res, 200, {
        operation: 'subtract',
        params: { a, b },
        result: calculator.subtract(a, b),
      });
    }

    // --- POST /multiply ---
    if (req.method === 'POST' && req.url === '/multiply') {
      const { a, b } = await readBody(req);
      return sendJson(res, 200, {
        operation: 'multiply',
        params: { a, b },
        result: calculator.multiply(a, b),
      });
    }

    // --- POST /divide ---
    if (req.method === 'POST' && req.url === '/divide') {
      const { a, b } = await readBody(req);
      return sendJson(res, 200, {
        operation: 'divide',
        params: { a, b },
        result: calculator.divide(a, b),
      });
    }

    // --- POST /sum ---
    // Ici le body de la requête est directement un tableau, ex: [2, 3, 5]
    if (req.method === 'POST' && req.url === '/sum') {
      const terms = await readBody(req);
      return sendJson(res, 200, {
        operation: 'sum',
        params: terms,
        result: calculator.sum(terms),
      });
    }

    // --- POST /mean ---
    if (req.method === 'POST' && req.url === '/mean') {
      const terms = await readBody(req);
      return sendJson(res, 200, {
        operation: 'mean',
        params: terms,
        result: calculator.mean(terms),
      });
    }

    // --- GET /operations ---
    if (req.method === 'GET' && req.url === '/operations') {
      return sendJson(res, 200, calculator.operations());
    }

    // --- GET /operations/:name ---
    // On vérifie que le premier segment est "operations" et qu'il y a
    // bien un second segment (le nom de l'opération demandée).
    if (req.method === 'GET' && urlParts[0] === 'operations' && urlParts.length === 2) {
      const name = urlParts[1];
      return sendJson(res, 200, calculator.operation(name));
    }

    // Aucune route ne correspond
    sendJson(res, 404, { error: 'Route non trouvée' });
  } catch (err) {
    sendJson(res, 400, { error: err.message });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Pour lancer ce fichier : node server.mjs
// Exemples de test :
//   POST http://127.0.0.1:3000/sum   body: [2, 3, 5]
//   POST http://127.0.0.1:3000/mean  body: [7, -3, 5]
//   GET  http://127.0.0.1:3000/operations
//   GET  http://127.0.0.1:3000/operations/add
