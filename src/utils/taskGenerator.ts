import {
  TopicName,
  OperationType,
  IOperation,
  ITask,
  ITaskConfig,
  ILevel,
  IRulesByOperation,
  RulesType,
} from '../interfaces';
import { getLevel, getGameMap } from './gameMap';

export interface ITaskGenerationResult {
  operations: IOperation[];
  answer: number;
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

function generateOperation(
  level: ILevel,
  digitsCnt: number,
  currentValue: number,
): IOperation {
  let operationType: OperationType;
  let operand: number;
  const plusOrMinus: OperationType[] = [OperationType.PLUS, OperationType.MINUS];
  let isAllowedOperationFlag: boolean;
  let isAllowedResult: boolean;
  do {
    const wildcard = Math.round(Math.random());
    operationType = plusOrMinus[wildcard];
    operand = generateNumber(digitsCnt, level.maxDigit);

    isAllowedOperationFlag = isAllowedOperation(
      level,
      currentValue,
      operationType,
      operand,
    );
    const result = doOperation(currentValue, operand, operationType);
    isAllowedResult = result > 0 && result.toString().length === digitsCnt;
  } while (!isAllowedOperationFlag || !isAllowedResult);

  return {
    operationType,
    operand,
  };
}

function isInRange(value: number, range: string): boolean {
  const rangeParts: number[] = range.split('-').map(part => Number.parseInt(part));
  if (rangeParts.length === 1 && rangeParts[0] === value) {
    return true;
  }
  if (value >= rangeParts[0] && value <= rangeParts[1]) {
    return true;
  }
  return false;
}

export function isAllowedOperation(
  level: ILevel,
  currentValue: number,
  operation: OperationType,
  operand: number,
): boolean {
  let rulesByOperation: IRulesByOperation;
  if (operation === OperationType.PLUS) {
    rulesByOperation = level.plus;
  } else if (operation === OperationType.MINUS) {
    rulesByOperation = level.minus;
  } else {
    throw new Error('map rules support only plus and minus operations');
  }

  const rulesForValue = rulesByOperation.rules.find(rule => rule.value === currentValue);
  if (!rulesForValue) {
    return rulesByOperation.rulesType === RulesType.FORBIDDEN;
  }
  const ranges = rulesForValue.ranges;
  const rulesType = rulesByOperation.rulesType;

  switch (rulesType) {
    case RulesType.ALLOWED:
      return ranges.some(range => isInRange(operand, range));
    case RulesType.FORBIDDEN:
      return !ranges.some(range => isInRange(operand, range));
  }
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

function getRandomLevel(
  allLevels: ILevel[],
  maxLevelOrder: number,
  currentLevelProbability: number,
): ILevel {
  const maxLevelIndex = allLevels.findIndex(level => level.order === maxLevelOrder);
  if (Math.random() < currentLevelProbability) {
    return allLevels[maxLevelIndex];
  }
  return allLevels[Math.trunc(maxLevelIndex * Math.random())];
}

function generatePlusMinusTaskOperations(
  taskConfig: ITaskConfig,
): ITaskGenerationResult {
  const operations: IOperation[] = [];
  const maxLevelOrder = getLevel(taskConfig.topic, taskConfig.level).order;
  const allLevels = getAllLevelsAsSortedArray();
  let currentValue: number = 0;
  const CURRENT_LEVEL_PROBABILITY: number = +process.env.CURRENT_LEVEL_PROBABILITY || 0.4;

  let cnt = 0;
  for (let i = 0; i < taskConfig.operationsCnt; i += 1) {
    const level = getRandomLevel(allLevels, maxLevelOrder, CURRENT_LEVEL_PROBABILITY);
    cnt += +(level.order === maxLevelOrder);
    const nextOperation = generateOperation(
      level,
      taskConfig.digitsCnt,
      currentValue,
    );
    currentValue = doOperation(currentValue, nextOperation.operand, nextOperation.operationType);
    operations.push(nextOperation);
  }

  return {
    operations,
    answer: currentValue,
  };
}
