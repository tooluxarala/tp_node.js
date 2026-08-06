// server.mjs
// ----------------------------------------------------------------------------
// Exercice I - Logique combinatoire
// Point d'entrée du programme : on importe la classe Calculator et on
// affiche dans la console le résultat de chaque opération pour vérifier
// que la logique métier fonctionne correctement.
// ----------------------------------------------------------------------------

import Calculator from './calculator.mjs';

// On instancie la calculatrice une seule fois, réutilisée pour tous les calculs
const calculator = new Calculator();

// Chaque log correspond à un test manuel demandé par l'énoncé
console.log("Add: 2 + 3 = " + calculator.add(2, 3));       // Attendu : 5
console.log("Sub: 7 - 3 = " + calculator.subtract(7, 3));  // Attendu : 4
console.log("Mul: 5 x 3 = " + calculator.multiply(5, 3));  // Attendu : 15
console.log("Div: 9 / 3 = " + calculator.divide(9, 3));    // Attendu : 3

// Pour lancer ce fichier : node server.mjs
