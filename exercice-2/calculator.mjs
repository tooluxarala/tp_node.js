// calculator.mjs
// ----------------------------------------------------------------------------
// Exercice II - Micro-service de calcul
// Même classe Calculator que l'exercice I : elle contient la logique
// métier (les 4 opérations de base). On la réutilise telle quelle,
// car dans un vrai projet on sépare toujours la logique métier (ce fichier)
// de la couche réseau/serveur (server.mjs).
// ----------------------------------------------------------------------------

class Calculator {
  add(a, b) {
    return a + b;
  }

  subtract(a, b) {
    return a - b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    if (b === 0) {
      throw new Error("Division par zéro impossible");
    }
    return a / b;
  }
}

export default Calculator;
