# Compte rendu — Module Node.js (Séances 1 et 2)
### Projet : Calculatrice REST (nodejs-calculator)

## 1. Objectif des séances

Ces deux premières séances avaient pour but de découvrir les bases de
Node.js à travers un projet fil rouge : une calculatrice, d'abord
exécutée en local (exercice I), puis exposée comme un micro-service
REST accessible via HTTP (exercices II et III).

## 2. Ce que nous avons appris

### 2.1 Les modules ES (ECMAScript Modules)

Nous avons utilisé l'extension `.mjs` et la syntaxe `import` / `export`
plutôt que l'ancien système `require` / `module.exports` (CommonJS).
Cela nous a permis de séparer clairement :
- la **logique métier** (la classe `Calculator`, dans `calculator.mjs`),
- la **couche serveur** (`server.mjs`), qui importe et utilise cette classe.

Cette séparation est une bonne pratique : la classe `Calculator` ne sait
rien du réseau ou de HTTP, elle est donc facilement testable et
réutilisable ailleurs (CLI, autre serveur, tests unitaires...).

### 2.2 Les classes JavaScript

La classe `Calculator` nous a permis de revoir la syntaxe des classes en
JavaScript (méthodes d'instance, `this`, gestion des erreurs avec
`throw new Error(...)`). Nous avons notamment protégé la méthode
`divide()` contre une division par zéro.

### 2.3 Le module `http` natif de Node.js

Sans utiliser de framework comme Express, nous avons créé un serveur
HTTP avec `http.createServer()`. Cela nous a obligés à comprendre ce
qu'un framework comme Express fait « sous le capot » :
- **le routage manuel** : comparer `req.method` et `req.url` pour
  décider quel code exécuter (ex: `POST /add`, `GET /operations`) ;
- **la lecture du corps (body) d'une requête** : contrairement à
  Express, le module `http` ne parse pas automatiquement le JSON. Il a
  fallu écouter les événements `data` et `end` du flux (`stream`) de la
  requête pour reconstituer le body morceau par morceau, puis le passer
  à `JSON.parse()` ;
- **la construction des réponses** : définir manuellement le code de
  statut HTTP et l'en-tête `Content-Type: application/json` avec
  `res.writeHead()`, puis envoyer le corps avec `res.end()`.

### 2.4 La conception d'une API REST

Nous avons appris à distinguer les verbes HTTP selon l'usage :
- **POST** pour les opérations qui reçoivent des paramètres et
  effectuent un calcul (`/add`, `/subtract`, `/multiply`, `/divide`,
  `/sum`, `/mean`) ;
- **GET** pour la simple consultation d'informations, sans effet de
  bord (`/operations`, `/operations/:name`).

Nous avons également découvert la notion de **route dynamique**
(`/operations/:name`), où une partie de l'URL est une variable. Sans
framework, cela demande de découper manuellement l'URL (`req.url.split('/')`)
pour en extraire le paramètre.

### 2.5 Gestion des erreurs

Chaque route est encapsulée dans un bloc `try/catch` : les erreurs
métier (division par zéro, opération inconnue, liste vide pour la
moyenne) ou de format (JSON invalide) sont interceptées et renvoyées au
client sous forme d'un message JSON avec un code HTTP `400`, plutôt que
de faire planter le serveur.

### 2.6 Asynchrone et Promises

La lecture du body HTTP est asynchrone : nous l'avons enveloppée dans
une `Promise`, puis utilisée avec `async`/`await` dans le gestionnaire
de requêtes (`http.createServer(async (req, res) => {...})`). Cela nous
a permis de manipuler du code asynchrone de façon lisible, comme du
code synchrone.

## 3. Difficultés rencontrées

- Comprendre qu'avec le module `http` natif, **rien n'est automatique** :
  ni le parsing JSON, ni le routage, ni la gestion des erreurs — tout ce
  qu'un framework comme Express fait habituellement doit être écrit à la main.
- Bien distinguer les routes qui se ressemblent (ex: `/operations` en
  GET simple vs `/operations/:name` avec un paramètre dynamique), et
  éviter les conflits entre elles dans l'ordre des conditions.

## 4. Ce que cela nous apprend pour la suite

Ce travail « à la main » avec le module `http` natif donne une bonne
compréhension des mécanismes de base avant d'utiliser des frameworks
plus haut niveau (comme Express, déjà entrevu dans l'énoncé, ou Fastify).
Il permet aussi de mieux comprendre l'intérêt d'outils comme Vite ou
NPM (introduits à l'exercice IV) pour fluidifier le développement
(rechargement à chaud, gestion des dépendances).

## 5. Structure du rendu

```
nodejs-calculator/
├── exercice-1/
│   ├── calculator.mjs   # Classe Calculator : add, subtract, multiply, divide
│   └── server.mjs       # Tests en console des 4 opérations
├── exercice-2/
│   ├── calculator.mjs   # Même classe Calculator
│   └── server.mjs       # Micro-service REST : POST /add, /subtract, /multiply, /divide
├── exercice-3/
│   ├── calculator.mjs   # Calculator enrichie : sum, mean, operations, operation(name)
│   └── server.mjs       # Endpoints supplémentaires : POST /sum, /mean + GET /operations, /operations/:name
└── compte-rendu.md
```

Chaque exercice a été testé manuellement (via `curl`) et les réponses
obtenues correspondent exactement à celles attendues dans l'énoncé.
