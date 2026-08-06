// calculator.mjs
// ----------------------------------------------------------------------------
// Exercice I - Logique combinatoire
// Ce fichier définit la classe Calculator, qui contient les opérations
// mathématiques de base (add, subtract, multiply, divide).
// On utilise la syntaxe ES Modules (import/export), d'où l'extension .mjs.
// ----------------------------------------------------------------------------

class Calculator {
  // Additionne deux nombres entiers a et b
  add(a, b) {
    return a + b;
  }

  // Soustrait b à a (calcule a - b)
  subtract(a, b) {
    return a - b;
  }

  // Multiplie a par b
  multiply(a, b) {
    return a * b;
  }

  // Divise a par b
  // On protège la méthode contre une division par zéro en levant une erreur
  divide(a, b) {
    if (b === 0) {
      throw new Error("Division par zéro impossible");
    }
    return a / b;
  }
}

// On exporte la classe par défaut afin de pouvoir l'importer
// dans server.mjs avec: import Calculator from './calculator.mjs'
export default Calculator;
