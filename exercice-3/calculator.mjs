// calculator.mjs
// ----------------------------------------------------------------------------
// Exercice III - Approfondissement
// On enrichit la classe Calculator avec :
//  - sum(terms)   : la somme des éléments d'un tableau
//  - mean(terms)  : la moyenne des éléments d'un tableau
//  - operations() : la liste des noms des opérations supportées
//  - operation(name) : les informations détaillées sur une opération donnée
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

  // Additionne tous les éléments d'un tableau de nombres.
  // On utilise reduce() pour cumuler la somme, en partant de 0.
  sum(terms) {
    if (!Array.isArray(terms)) {
      throw new Error("sum attend un tableau de nombres");
    }
    return terms.reduce((total, current) => total + current, 0);
  }

  // Calcule la moyenne des éléments d'un tableau de nombres
  // (somme des éléments divisée par leur nombre), quel que soit leur signe.
  mean(terms) {
    if (!Array.isArray(terms) || terms.length === 0) {
      throw new Error("mean attend un tableau de nombres non vide");
    }
    return this.sum(terms) / terms.length;
  }

  // Renvoie la liste des noms des opérations supportées par la calculatrice.
  operations() {
    return ['add', 'subtract', 'multiply', 'divide', 'sum', 'mean'];
  }

  // Renvoie les informations décrivant une opération donnée : son nom,
  // le type des paramètres attendus et le type du résultat renvoyé.
  // On stocke ces informations dans un dictionnaire (objet) pour éviter
  // une longue série de if/else.
  operation(name) {
    const descriptions = {
      add: { operation: 'add', params: 'int a, b', result: 'integer' },
      subtract: { operation: 'subtract', params: 'int a, b', result: 'integer' },
      multiply: { operation: 'multiply', params: 'int a, b', result: 'integer' },
      divide: { operation: 'divide', params: 'int a, b', result: 'integer' },
      sum: { operation: 'sum', params: 'int array', result: 'integer' },
      mean: { operation: 'mean', params: 'int array', result: 'double' },
    };

    const info = descriptions[name];
    if (!info) {
      throw new Error(`Opération inconnue : ${name}`);
    }
    return info;
  }
}

export default Calculator;
