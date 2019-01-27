import {
  TopicName,
  OperationType,
  IOperation,
  ITaskConfig,
} from '../interfaces';
import { GAME_MAP_STRUCTURE } from '../gameMapStructure';

export interface ITaskGenerationResult {
  operations: IOperation[];
  answer: number[];
}

type CanDoTable = {
  value: number,
  minLevelId: number,
}[][];

declare type AbacusState = number[];

declare type FormulaTest = (
  abacus1: AbacusState,
  abacus2: AbacusState,
  ind: number,
  operation: OperationType,
  formulas?: Formula[],
) => boolean;

interface Formula {
  test: FormulaTest;
  minLevelId: number;
}

const MAX_CELL_CNT = 4;
const MAX_NUMBER = 1000;

let minLevelForOperation: number;
let formulas: Formula[] = [];
const canAddTable: CanDoTable = [];
const canSubTable: CanDoTable = [];

function getStructureForTopic(topic: TopicName) {
  return GAME_MAP_STRUCTURE.find(t => t.topicName === topic);
}

function simpleFormulaTestGenerator(
  maxDigit: number,
): FormulaTest {
  return (
    abacus1: AbacusState,
    abacus2: AbacusState,
    ind: number,
    operation: OperationType,
  ) => {
    const d1 = abacus1[ind];
    const d2 = abacus2[ind];
    if (d1 > maxDigit || d2 > maxDigit) {
      return false;
    }
    if (operation === OperationType.PLUS) {
      return (
        d1 + d2 <= maxDigit &&
        topPart(d1) + topPart(d2) <= topPart(maxDigit) &&
        bottomPart(d1) + bottomPart(d2) <= Math.min(4, maxDigit)
      );
    }
    return (
      topPart(d1) >= topPart(d2) &&
      bottomPart(d1) >= bottomPart(d2)
    );
  };
}

function brotherFormulaTestGenerator(
  digit: number,
): FormulaTest {
  return (
    abacus1: AbacusState,
    abacus2: AbacusState,
    ind: number,
    operation: OperationType,
  ) => {
    const d1 = abacus1[ind];
    const d2 = abacus2[ind];
    if (d2 !== digit) {
      return false;
    }
    const c = 5 - digit;
    if (operation === OperationType.PLUS) {
      return topPart(d1) === 0 && bottomPart(d1) - c >= 0;
    }
    return topPart(d1) === 1 && bottomPart(d1) + c <= 4;
  };
}

function selectAllFormulasBeforeTopic(
  topic: TopicName,
  formulas: Formula[],
): Formula[] {
  const firstTopicFormulaId = getStructureForTopic(topic).levels[0].order;
  return formulas.filter(formula => formula.minLevelId < firstTopicFormulaId);
}

function friendFormulaTestGenerator(
  digit: number,
): FormulaTest {
  return (
    abacus1: AbacusState,
    abacus2: AbacusState,
    ind: number,
    operation: OperationType,
    formulas: Formula[],
  ) => {
    const d2 = abacus2[ind];
    if (d2 !== digit) {
      return false;
    }
    if (ind + 1 === MAX_CELL_CNT) {
      return false;
    }
    const inversedOperation =
      operation === OperationType.PLUS ? OperationType.MINUS : OperationType.PLUS;
    const simpleFormulas = selectAllFormulasBeforeTopic(TopicName.BROTHER, formulas);
    const canDoNext = canDoOperation(
      abacus1,
      abacusFromNumber(Math.pow(10, ind + 1)),
      ind + 1,
      operation,
      formulas,
    );
    const canDoCurrent = canDoOperation(
      abacus1,
      abacusFromNumber(Math.pow(10, ind) * (10 - digit)),
      ind,
      inversedOperation,
      simpleFormulas,
    );
    return canDoCurrent && canDoNext;
  };
}

function friendPlusBrotherFormulaTestGenerator(
  digit: number,
): FormulaTest {
  return (
    abacus1: AbacusState,
    abacus2: AbacusState,
    ind: number,
    operation: OperationType,
    formulas: Formula[],
  ) => {
    const d2 = abacus2[ind];
    if (d2 !== digit) {
      return false;
    }
    if (ind + 1 === MAX_CELL_CNT) {
      return false;
    }
    const inversedOperation =
      operation === OperationType.PLUS ? OperationType.MINUS : OperationType.PLUS;
    const brotherFormulas = selectAllFormulasBeforeTopic(TopicName.FRIEND, formulas);
    const canDoNext = canDoOperation(
      abacus1,
      abacusFromNumber(Math.pow(10, ind + 1)),
      ind + 1,
      operation,
      formulas,
    );
    const canDoCurrent = canDoOperation(
      abacus1,
      abacusFromNumber(Math.pow(10, ind) * (10 - digit)),
      ind,
      inversedOperation,
      brotherFormulas,
    );
    return canDoCurrent && canDoNext;
  };
}

function topPart(x: number): number {
  return Math.trunc(x / 5);
}

function bottomPart(x: number): number {
  return x % 5;
}

function abacusFromNumber(num: number): AbacusState {
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

function abacusToNumber(abacusState: AbacusState): number {
  return abacusState.reduceRight((prev, cell) => 10 * prev + cell, 0);
}

function canDoOperation(
  abacus1: AbacusState,
  abacus2: AbacusState,
  ind: number,
  operation: OperationType,
  formulas: Formula[],
): boolean {
  const d1 = abacus1[ind];
  const d2 = abacus2[ind];
  if (d1 === 0 && d2 === 0) {
    return true;
  }
  const formula = formulas.find(
    formula => formula.test(abacus1, abacus2, ind, operation, formulas),
  );
  if (formula) {
    minLevelForOperation = Math.max(minLevelForOperation, formula.minLevelId);
    return true;
  }
  return false;
}

function doOperation(
  left: number,
  right: number,
  operationType: OperationType,
): number {
  switch (operationType) {
    case OperationType.PLUS:
      return left + right;
    case OperationType.MINUS:
      return left - right;
    case OperationType.MULTIPLY:
      return left * right;
    case OperationType.DIVIDE: {
      const quotient = Math.floor(left / right);
      const residual = left - right * quotient;
      return quotient;
    }
  }
}

function findMinLevelToDoOperation(
  number1: number,
  number2: number,
  operation: OperationType,
  formulas: Formula[],
): number {
  let abacus1 = abacusFromNumber(number1);
  const abacus2 = abacusFromNumber(number2);

  minLevelForOperation = 0;
  for (let ind = 0; ind < MAX_CELL_CNT; ind += 1) {
    if (!canDoOperation(abacus1, abacus2, ind, operation, formulas)) {
      return 0;
    }
    const n1 = abacusToNumber(abacus1);
    const n2 = Math.pow(10, ind) * abacus2[ind];
    abacus1 = abacusFromNumber(doOperation(n1, n2, operation));
  }
  return minLevelForOperation;
}

function generateTopicFormulas(
  topic: TopicName,
  testFunctionGenerator: (number) => FormulaTest,
): Formula[] {
  return getStructureForTopic(topic).levels
    .map(l => ({
      test: testFunctionGenerator(l.levelName),
      minLevelId: l.order,
    }));
}

function initCanDoTables() {
  const simpleFormulas = generateTopicFormulas(TopicName.SIMPLE, simpleFormulaTestGenerator);
  const brotherFormulas = generateTopicFormulas(TopicName.BROTHER, brotherFormulaTestGenerator);
  const friendFormulas = generateTopicFormulas(TopicName.FRIEND, friendFormulaTestGenerator);
  const friendPlusBrotherFormulas = generateTopicFormulas(
    TopicName.FRIEND_PLUS_BROTHER,
    friendPlusBrotherFormulaTestGenerator,
  );
  formulas = [].concat(simpleFormulas, brotherFormulas, friendFormulas, friendPlusBrotherFormulas);
  for (let i = 0; i < MAX_NUMBER; i += 1) {
    canAddTable.push([]);
    canSubTable.push([]);
    for (let j = 1; j < MAX_NUMBER; j += 1) {
      if (findMinLevelToDoOperation(i, j, OperationType.PLUS, formulas)) {
        canAddTable[i].push({
          value: j,
          minLevelId: minLevelForOperation,
        });
      }
      if (findMinLevelToDoOperation(i, j, OperationType.MINUS, formulas)) {
        canSubTable[i].push({
          value: j,
          minLevelId: minLevelForOperation,
        });
      }
    }
  }
}

export function generateTaskOperations(taskConfig: ITaskConfig): ITaskGenerationResult {
  if (taskConfig.topic === TopicName.MULTIPLICATION) {
    return generateMulTaskOperations(taskConfig);
  }
  if (taskConfig.topic === TopicName.DIVISION) {
    return generateDivTaskOperations(taskConfig);
  }
  return generatePlusMinusTaskOperations(taskConfig);
}

function extractDigitsCntFromLevel(level: number): {
  leftCnt: number,
  rightCnt: number,
} {
  return {
    leftCnt: +level.toString()[0],
    rightCnt: +level.toString()[1],
  };
}

function generateRandomNumber(digitsCnt: number): number {
  return Math.max(
    Math.min(
      Math.trunc(Math.random() * Math.pow(10, digitsCnt)),
      Math.pow(10, digitsCnt + 1) - 1,
    ),
    1,
  );
}

function generateMulTaskOperations(taskConfig: ITaskConfig): ITaskGenerationResult {
  const { leftCnt, rightCnt } = extractDigitsCntFromLevel(taskConfig.level);
  const left = generateRandomNumber(leftCnt);
  const right = generateRandomNumber(rightCnt);
  return {
    operations: [
      {
        operand: left,
        operationType: OperationType.PLUS,
      },
      {
        operand: right,
        operationType: OperationType.MULTIPLY,
      },
    ],
    answer: [left * right],
  };
}

function generateDivTaskOperations(taskConfig: ITaskConfig): ITaskGenerationResult {
  const { leftCnt, rightCnt } = extractDigitsCntFromLevel(taskConfig.level);
  let left = generateRandomNumber(leftCnt);
  let right = generateRandomNumber(rightCnt);
  if (left < right) {
    const tmp = left;
    left = right;
    right = tmp;
  }
  const quotient = Math.trunc(left / right);
  const remainder = left - quotient * right;
  let answer: number[];
  if (taskConfig.withRemainder) {
    answer = [quotient, remainder];
  } else {
    left = left - remainder;
    answer = [quotient];
  }
  return {
    answer,
    operations: [
      {
        operand: left,
        operationType: OperationType.PLUS,
      },
      {
        operand: right,
        operationType: OperationType.DIVIDE,
      },
    ],
  };
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.trunc(Math.random() * arr.length)];
}

function generateOperation(
  currentValue: number,
  maxLevelId: number,
  digitsCnt: number,
  currentLevelProbability: number,
): IOperation {
  const plusOrMinus = [OperationType.PLUS, OperationType.MINUS];
  const canDoTables = [canAddTable, canSubTable];
  let operationIndex = Math.round(Math.random());
  let tryCnt = 0;
  while (tryCnt < 2) {
    const operation = plusOrMinus[operationIndex];
    const canDoTable = canDoTables[operationIndex];
    const maxOperationResult = Math.min(Math.pow(10, digitsCnt + 1), MAX_NUMBER);
    const maxOperandValue = Math.pow(10, digitsCnt);
    const operationsForValue = canDoTable[currentValue]
      .filter(o =>
        o.minLevelId <= maxLevelId &&
        o.value < maxOperandValue &&
        doOperation(currentValue, o.value, operation) < maxOperationResult,
      );
    if (operationsForValue.length) {
      if (Math.random() <= currentLevelProbability) {
        const operationsForLevel = operationsForValue.filter(o => o.minLevelId === maxLevelId);
        if (operationsForLevel.length) {
          return {
            operand: getRandomElement(operationsForLevel).value,
            operationType: operation,
          };
        }
      }
      const operand = getRandomElement(operationsForValue);
      return {
        operand: operand.value,
        operationType: operation,
      };
    }

    operationIndex = 1 - operationIndex;
    tryCnt += 1;
  }
  return null;
}

// @todo: limit lower bound for operation
function generatePlusMinusTaskOperations(
  taskConfig: ITaskConfig,
): ITaskGenerationResult {
  const operations: IOperation[] = [];
  const maxLevelId = GAME_MAP_STRUCTURE
    .find(t => taskConfig.topic === t.topicName).levels
    .find(l => l.levelName === taskConfig.level)
    .order;
  const currentLevelProbability: number = +process.env.CURRENT_LEVEL_PROBABILITY;
  let currentValue = 0;
  for (let i = 0; i < taskConfig.operationsCnt; i += 1) {
    const operation = generateOperation(
      currentValue,
      maxLevelId,
      taskConfig.digitsCnt,
      currentLevelProbability,
    );
    if (!operation) {
      throw new Error(`Can not generate task.
          value: ${currentValue},
          config: ${taskConfig}`);
    }
    currentValue = doOperation(currentValue, operation.operand, operation.operationType);
    operations.push(operation);
  }

  return {
    operations,
    answer: [currentValue],
  };
}

initCanDoTables();
