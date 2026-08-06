// server.mjs
// ----------------------------------------------------------------------------
// Exercice II - Micro-service de calcul
// On utilise le module natif "http" de Node.js (aucune librairie externe,
// pas encore d'Express) pour créer un serveur qui expose les 4 opérations
// de la calculatrice sous forme d'endpoints REST en POST :
//   POST /add        POST /subtract
//   POST /multiply    POST /divide
// ----------------------------------------------------------------------------

import http from 'http';
import Calculator from './calculator.mjs';

const calculator = new Calculator();
const hostname = '127.0.0.1';
const port = 3000;

// Petits tests en console, comme à l'exercice I, pour vérifier que la
// logique métier fonctionne toujours avant même de lancer le serveur.
console.log("Add: 2 + 3 = " + calculator.add(2, 3));
console.log("Sub: 7 - 3 = " + calculator.subtract(7, 3));
console.log("Mul: 5 x 3 = " + calculator.multiply(5, 3));
console.log("Div: 9 / 3 = " + calculator.divide(9, 3));

// ----------------------------------------------------------------------------
// Fonctions utilitaires
// ----------------------------------------------------------------------------

// readBody() lit le corps (body) d'une requête HTTP morceau par morceau
// (event "data"), puis le transforme en objet JavaScript une fois la
// requête terminée (event "end"). C'est nécessaire car avec le module http
// natif, contrairement à Express, il n'y a pas de parsing JSON automatique.
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

// sendJson() factorise l'envoi d'une réponse JSON avec le bon header
// et le bon code de statut HTTP.
function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

// ----------------------------------------------------------------------------
// Création du serveur HTTP
// ----------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  try {
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

    // Aucune route ne correspond : on renvoie une 404
    sendJson(res, 404, { error: 'Route non trouvée' });
  } catch (err) {
    // On attrape les erreurs métier (ex: division par zéro) et les erreurs
    // de parsing JSON, et on renvoie un code 400 (mauvaise requête).
    sendJson(res, 400, { error: err.message });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Pour lancer ce fichier : node server.mjs
// Pour tester : envoyer une requête POST (ex: avec curl, Postman ou Thunder Client)
// vers http://127.0.0.1:3000/add avec le body JSON: { "a": 2, "b": 3 }
