import { OperationType } from '../interfaces';

declare type AbacusState = number[];

interface FormulaResult {
  result: AbacusState;
  maxFormulaIndex: number;
}

declare type Formula = (
  number: AbacusState,
  digit: number,
  ind: number,
  operation: OperationType,
  formulas: Formula[],
  maxFormulaIndex: number,
) => FormulaResult;

const MAX_CELL_CNT = 4;

function doOperation(number1, number2, operation) {
  if (operation === OperationType.PLUS) {
    return number1 + number2;
  }
  if (operation === OperationType.MINUS) {
    return number1 - number2;
  }
  throw new Error('unknown operation type');
}

function doBasicOperation(
  number: AbacusState,
  digit: number,
  ind: number,
  operation: OperationType,
): AbacusState {
  const number2 = Math.pow(10, ind) * digit;
  return abacusDecompose(doOperation(abacusCompose(number), number2, operation));
}

function generateSimpleFormula(maxDigit: number, formulaIndex: number): Formula {
  return (
    abacus: AbacusState,
    digit: number,
    ind: number,
    operation: OperationType,
    formulas: Formula[],
    maxFormulaIndex: number,
  ) => {
    const d1 = abacus[ind];
    const d2 = digit;
    if (
      (operation === OperationType.PLUS && d1 + d2 <= maxDigit) ||
      (operation === OperationType.MINUS && d1 - d2 >= 0)
    ) {
      return {
        result: doBasicOperation(abacus, digit, ind, operation),
        maxFormulaIndex: Math.max(formulaIndex, maxFormulaIndex),
      };
    }
    return null;
  };
}

export const simpleFormulas = [2, 3, 4, 5, 6, 7, 8, 9].map(
  (maxDigit, ind) => generateSimpleFormula(maxDigit, ind),
);

function topPart(x: number): number {
  return Math.trunc(x / 5);
}

function bottomPart(x: number): number {
  return x % 5;
}

function abacusDecompose(num: number): AbacusState {
  const abacusState: AbacusState = [];
  let n = num;
  while (n) {
    abacusState.push(n % 10);
    n = Math.trunc(n / 10);
  }
  while (abacusState.length < MAX_CELL_CNT) {
    abacusState.push(0);
  }
  return abacusState;
}

function abacusCompose(abacusState: AbacusState): number {
  return abacusState.reduceRight((prev, cell) => 10 * prev + cell, 0);
}

function tryToApplyFormula(
  number: AbacusState,
  digit: number,
  ind: number,
  operation: OperationType,
  formulas: Formula[],
  maxFormulaIndex: number,
): FormulaResult {
  const formula = formulas.find(
    formula => !!formula(number, digit, ind, operation, formulas, maxFormulaIndex),
  );
  console.log(formula);
  if (!formula) {
    return null;
  }
  return formula(number, digit, ind, operation, formulas, maxFormulaIndex);
}

// returns maxFormulaIndex
export function canDoOperation(
  number1: number,
  number2: number,
  operation: OperationType,
  formulas: Formula[],
): number {
  const operand1 = abacusDecompose(number1);
  const operand2 = abacusDecompose(number2);
  let abacusResult: FormulaResult = {
    result: operand1,
    maxFormulaIndex: -1,
  };
  for (let ind = 0; ind < MAX_CELL_CNT; ind += 1) {
    if (operand2[ind] === 0) {
      continue;
    }
    abacusResult = tryToApplyFormula(
      abacusResult.result,
      operand2[ind],
      ind,
      operation,
      formulas,
      abacusResult.maxFormulaIndex,
    );
    if (!abacusResult) {
      return null;
    }
  }
  return abacusResult.maxFormulaIndex;
}
