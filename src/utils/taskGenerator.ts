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
} from '../interfaces';
import { getLevel, getGameMap } from './gameMap';

export interface ITaskGenerationResult {
  operations: IOperation[];
  answer: number;
}

declare type RulesTable = boolean[][];

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

const TABLE_SIZE = 1001;
const canAddTable = createTable(TABLE_SIZE);
const canSubTable = createTable(TABLE_SIZE);

// function isInRange(value: number, rage: IRange) {
//   return rage.from <= value && value <= rage.to;
// }

function fillAllowedTable(
  table,
  operation: OperationType,
  levels: ILevel[],
  maxLevelOrder: number,
) {
  levels.forEach((level) => {
    if (level.order > maxLevelOrder) {
      return;
    }
    const rulesType: RulesType = level[operation].rulesType;
    const rules: IRule[] = level[operation].rules;
    rules.forEach((rule) => {
      for (let i = rule.value.from; i <= rule.value.to; i += 1) {
        rule.ranges.forEach((range) => {
          for (let j = range.from; j <= range.to; j += 1) {
            table[i][j] = rulesType === RulesType.ALLOWED;
          }
        });
      }
    });
  });
}

function isCorrectNumber(n: number, digitsCnt: number, maxDigit: number): boolean {
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
  rulesTable: RulesTable,
  digitsCnt: number,
  maxDigit: number,
  currentValue: number,
): number {
  const allowedList = rulesTable[currentValue].reduce(
    (prev, isAllowed, ind) => {
      if (isAllowed && isCorrectNumber(ind, digitsCnt, maxDigit)) {
        prev.push(ind);
        return prev;
      }
      return prev;
    },
    []);
  if (!allowedList.length) {
    return null;
  }

  const operandOrder = Math.round(Math.random() * allowedList.length);
  return allowedList[operandOrder];
}

function generateOperation(
  canAddTable: RulesTable,
  canSubTable: RulesTable,
  digitsCnt: number,
  maxDigit: number,
  currentValue: number,
): IOperation {
  const plusOrMinus: OperationType[] = [OperationType.PLUS, OperationType.MINUS];
  const addOrSubTable: RulesTable[] = [canAddTable, canSubTable];
  let operationIndex = Math.round(Math.random());
  let operand: number;

  operand = generateOperand(addOrSubTable[operationIndex], digitsCnt, maxDigit, currentValue);
  if (operand) {
    return {
      operand,
      operationType: plusOrMinus[operationIndex],
    };
  }

  operationIndex = 1 - operationIndex;
  operand = generateOperand(addOrSubTable[operationIndex], digitsCnt, maxDigit, currentValue);
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

  fillAllowedTable(canAddTable, OperationType.PLUS, allLevels, maxLevelOrder);
  fillAllowedTable(canSubTable, OperationType.MINUS, allLevels, maxLevelOrder);

  operations.push({
    operand: generateNumber(taskConfig.digitsCnt, maxDigit),
    operationType: OperationType.PLUS,
  });
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
