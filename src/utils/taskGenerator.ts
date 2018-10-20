import {
  TopicName,
  OperationType,
  IOperation,
  ITaskConfig,
  ILevel,
  IRulesByOperation,
  RulesType,
  IRange,
} from '../interfaces';
import { getLevel, getGameMap } from './gameMap';

export interface ITaskGenerationResult {
  operations: IOperation[];
  answer: number;
}

type CanDoTable = {
  [ind: number]: number[],
};

function forEachInRange(range: IRange, cb: Function) {
  for (let i = range.from; i <= range.to; i += 1) {
    cb(i);
  }
}

function forEachInRages(ranges: IRange[], cb: Function) {
  ranges.forEach(range => forEachInRange(range, cb));
}

function isInRange(value: number, range: IRange): boolean {
  return range.from <= value && value <= range.to;
}

function generateMaxCombination(digit: number, cnt: number) {
  let tmp = 0;
  for (let i = 0; i < cnt; i += 1) {
    tmp = tmp * 10 + digit;
  }
  return tmp;
}

function computeAllPossible(
  value: number,
  digitsCnt: number,
  maxDigit: number,
  operation: OperationType,
) {
  const allPossible = new Set();
  const minNumber = Math.pow(10, digitsCnt - 1);
  const maxNumber = generateMaxCombination(maxDigit, digitsCnt);
  for (let j = minNumber; j < maxNumber; j += 1) {
    const correctNumber = isCorrectNumber(j, digitsCnt, maxDigit);
    const result = doOperation(value, j, operation);
    const correctResult = result >= minNumber && result <= maxNumber;
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
  const maxNumber = generateMaxCombination(maxDigit, digitsCnt);
  const resultObject = {};
  for (let i = minNumber; i <= maxNumber; i += 1) {
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

function generateOperandBasic(
  canDoTable: CanDoTable,
  currentValue: number,
): number {
  const allowed = canDoTable[currentValue];
  return (allowed && allowed.length) ? allowed[Math.floor(allowed.length * Math.random())] : null;
}

function generateOperandForLevel(
  canDoTable: CanDoTable,
  currentValue: number,
  rulesByOperation: IRulesByOperation,
  maxDigit: number,
  digitsCnt: number,
) {
  if (rulesByOperation.rulesType === RulesType.FORBIDDEN) {
    return null;
  }

  const allowedValues: number[] = [];
  rulesByOperation.rules.forEach((rule) => {
    if (rule.values.some(valueRange => isInRange(currentValue, valueRange))) {
      forEachInRages(rule.ranges, (ruleValue) => {
        if (isCorrectNumber(ruleValue, digitsCnt, maxDigit)) {
          allowedValues.push(ruleValue);
        }
      });
    }
  });
  if (!allowedValues.length) {
    return null;
  }

  return allowedValues[Math.trunc(allowedValues.length * Math.random())];
}

function generateOperand(
  canDoTable: CanDoTable,
  currentValue,
  rulesByOperation: IRulesByOperation,
  maxDigit: number,
  digitsCnt: number,
  currentLevelProbability: number,
): number {
  if (Math.random() < currentLevelProbability) {
    const operand = generateOperandForLevel(
      canDoTable,
      currentValue,
      rulesByOperation,
      maxDigit,
      digitsCnt,
    );
    if (operand) {
      return operand;
    }
  }
  return generateOperandBasic(canDoTable, currentValue);
}

function generateOperation(
  canAddTable: CanDoTable,
  canSubTable: CanDoTable,
  currentValue: number,
  level: ILevel,
  maxDigit: number,
  digitsCnt: number,
  currentLevelProbability: number,
): IOperation {
  const plusOrMinus: OperationType[] = [OperationType.PLUS, OperationType.MINUS];
  const addOrSubTable: CanDoTable[] = [canAddTable, canSubTable];
  let operationIndex = Math.round(Math.random());
  let operand: number;

  for (let i = 0; i < 2; i += 1) {
    operand = generateOperand(
      addOrSubTable[operationIndex],
      currentValue,
      level[plusOrMinus[operationIndex]],
      maxDigit,
      digitsCnt,
      currentLevelProbability,
    );
    if (operand) {
      return {
        operand,
        operationType: plusOrMinus[operationIndex],
      };
    }
    operationIndex = 1 - operationIndex;
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
      generateOperation(
        canAddTable,
        canSubTable,
        currentValue,
        currentLevel,
        taskConfig.digitsCnt,
        maxDigit,
        CURRENT_LEVEL_PROBABILITY,
      );
    currentValue = doOperation(currentValue, nextOperation.operand, nextOperation.operationType);
    operations.push(nextOperation);
  }

  return {
    operations,
    answer: currentValue,
  };
}
