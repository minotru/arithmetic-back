import {
  TopicName,
  OperationType,
  IOperation,
  ITask,
  ITaskConfig,
  ILevel,
  IRulesByOperation,
  RulesType,
  IRule,
  IRange,
  IGameMap,
} from '../interfaces';
import { getLevel, getGameMap } from './gameMap';

export interface ITaskGenerationResult {
  operations: IOperation[];
  answer: number;
}

type CanDoTable = {
  [ind: number]: number[],
};

function createTable(n: number) {
  const table = [];
  for (let i = 1; i <= n; i += 1) {
    const row = [];
    for (let j = 1; j <= n; j += 1) {
      row.push(true);
    }
    table.push(row);
  }
  return table;
}

function forEachInRange(range: IRange, cb: Function) {
  for (let i = range.from; i <= range.to; i += 1) {
    cb(i);
  }
}

function forEachInRages(ranges: IRange[], cb: Function) {
  ranges.forEach(range => forEachInRange(range, cb));
}

function computeAllPossible(value, digitsCnt, maxDigit, operation) {
  const allPossible = new Set();
  const minNumber = Math.pow(10, digitsCnt - 1);
  const maxNumber = Math.pow(10, digitsCnt);
  for (let j = minNumber; j < maxNumber; j += 1) {
    const correctNumber = isCorrectNumber(j, digitsCnt, maxDigit);
    const result = doOperation(value, j, operation);
    const correctResult = result >= minNumber && result < maxNumber;
    if (correctNumber && correctResult) {
      allPossible.add(j);
    }
  }
  return allPossible;
}

function computeAllAllowed(
  levels: ILevel[],
  currentLevel: ILevel,
  digitsCnt: number,
  operation: OperationType,
) {
  const maxLevelOrder = currentLevel.order;
  const maxDigit = currentLevel.maxDigit;
  const allowedRules = {};
  const forbiddenRules = {};

  levels.forEach((level) => {
    if (level.order > maxLevelOrder) {
      return;
    }

    const rulesByOperation: IRulesByOperation = level[operation];
    rulesByOperation.rules.forEach((rule) => {
      forEachInRages(rule.values, (value) => {
        if (rulesByOperation.rulesType === RulesType.ALLOWED) {
          allowedRules[value] = allowedRules[value] || [];
          allowedRules[value] = allowedRules[value].concat(rule.ranges);
        } else {
          forbiddenRules[value] = rule.ranges;
        }
      });
    });
  });

  const minNumber = Math.pow(10, digitsCnt - 1);
  const maxNumber = Math.pow(10, digitsCnt);
  const resultObject = {};
  for (let i = minNumber; i < maxNumber; i += 1) {
    const allAllowed = computeAllPossible(i, digitsCnt, maxDigit, operation);
    forEachInRages(forbiddenRules[i] || [], (value) => {
      allAllowed.delete(value);
    });
    forEachInRages(allowedRules[i] || [], (value) => {
      if (isCorrectNumber(value, digitsCnt, maxDigit)) {
        allAllowed.add(value);
      }
    });
    resultObject[i] = [...allAllowed.values()];
  }

  return resultObject;
}

// function createAllowedTable(
//   operation: OperationType,
//   levels: ILevel[],
//   maxLevelOrder: number,
// ) {
//   const table = {};
//   levels.forEach((level) => {
//     if (level.order > maxLevelOrder) {
//       return;
//     }
//     const rulesType: RulesType = level[operation].rulesType;
//     const rules: IRule[] = level[operation].rules;
//     rules.forEach((rule) => {
//       rule.values.forEach(value => forEachInRange(value, (i) => {
//         rule.ranges.forEach(range => forEachInRange(range, (j) => {
//           table[i] = table[i] || {};
//           table[i][j] = rulesType === RulesType.ALLOWED;
//         }));
//       }));
//     });
//   });
//   return table;
// }

function isCorrectNumber(n: number, digitsCnt: number, maxDigit: number): boolean {
  if (n <= 0) {
    return false;
  }
  const s = n.toString();
  if (s.length !== digitsCnt) {
    return false;
  }
  for (let i = maxDigit + 1; i <= 9; i += 1) {
    if (s.includes(i.toString())) {
      return false;
    }
  }
  return true;
}

function generateNumber(digitsCnt: number, maxDigit: number) {
  let res: number = 0;
  for (let i = 0; i < digitsCnt; i += 1) {
    let nextDigit = Math.round(Math.random() * maxDigit);
    if (nextDigit === 0 && i === 0) {
      nextDigit += 1;
    }
    res = res * 10 + nextDigit;
  }
  return res;
}

function generateOperand(
  canDoTable: CanDoTable,
  currentValue: number,
): number {
  const allowed = canDoTable[currentValue];
  return (allowed && allowed.length) ? allowed[Math.floor(allowed.length * Math.random())] : null;
}

function generateOperation(
  canAddTable: CanDoTable,
  canSubTable: CanDoTable,
  digitsCnt: number,
  maxDigit: number,
  currentValue: number,
): IOperation {
  const plusOrMinus: OperationType[] = [OperationType.PLUS, OperationType.MINUS];
  const addOrSubTable: CanDoTable[] = [canAddTable, canSubTable];
  let operationIndex = Math.round(Math.random());
  let operand: number;

  operand = generateOperand(
    addOrSubTable[operationIndex],
    currentValue);
  if (operand) {
    return {
      operand,
      operationType: plusOrMinus[operationIndex],
    };
  }

  operationIndex = 1 - operationIndex;
  operand = generateOperand(
    addOrSubTable[operationIndex],
    currentValue);
  if (operand) {
    return {
      operand,
      operationType: plusOrMinus[operationIndex],
    };
  }

  return null;
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

export function generateTaskOperations(taskConfig: ITaskConfig): ITaskGenerationResult {
  if (taskConfig.topic === TopicName.MULTIPLICATION) {
    return generateMulTaskOperations(taskConfig);
  }
  if (taskConfig.topic === TopicName.DIVISION) {
    return generateDivTaskOperations(taskConfig);
  }
  return generatePlusMinusTaskOperations(taskConfig);
}

function generateMulTaskOperations(taskConfig: ITaskConfig): ITaskGenerationResult {
  return {} as ITaskGenerationResult;
}

function generateDivTaskOperations(taskConfig: ITaskConfig): ITaskGenerationResult {
  return {} as ITaskGenerationResult;
}

function getAllLevelsAsSortedArray(): ILevel[] {
  const map = getGameMap();
  const levels = map
    .map(topic => topic.levels)
    .reduce((prev, levels) => prev.concat(levels))
    .sort((l1, l2) => l1.order - l2.order);
  return levels;
}

function generatePlusMinusTaskOperations(
  taskConfig: ITaskConfig,
): ITaskGenerationResult {
  const operations: IOperation[] = [];
  const currentLevel = getLevel(taskConfig.topic, taskConfig.level);
  const maxLevelOrder = currentLevel.order;
  const maxDigit = currentLevel.maxDigit;
  const allLevels = getAllLevelsAsSortedArray();

  let currentValue: number = 0;
  const CURRENT_LEVEL_PROBABILITY: number = +process.env.CURRENT_LEVEL_PROBABILITY || 0.4;

  const canAddTable = computeAllAllowed(
    allLevels,
    currentLevel,
    taskConfig.digitsCnt,
    OperationType.PLUS);
  const canSubTable = computeAllAllowed(
    allLevels,
    currentLevel,
    taskConfig.digitsCnt,
    OperationType.MINUS);

  operations.push({
    operand: generateNumber(taskConfig.digitsCnt, maxDigit),
    operationType: OperationType.PLUS,
  });
  currentValue = operations[0].operand;
  for (let i = 1; i < taskConfig.operationsCnt; i += 1) {
    const nextOperation =
      generateOperation(canAddTable, canSubTable, taskConfig.digitsCnt, maxDigit, currentValue);
    currentValue = doOperation(currentValue, nextOperation.operand, nextOperation.operationType);
    operations.push(nextOperation);
  }

  return {
    operations,
    answer: currentValue,
  };
}
