import {
  TopicName,
  OperationType,
  IOperation,
  ITask,
  ITaskConfig,
} from '../interfaces';
import { isAllowedOperation } from './gameMap';

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
  topicName: TopicName,
  level: number,
  digitsCnt: number,
  currentValue: number,
): IOperation {
  let operationType: OperationType;
  let operand: number;
  const plusOrMinus: OperationType[] = [OperationType.PLUS, OperationType.MINUS];
  const mulOrDiv: OperationType[] = [OperationType.MULTIPLY, OperationType.DIVIDE];
  let isMapAllowedOperation: boolean;
  let isAllowedResult: boolean;
  do {
    const wildcard = Math.round(Math.random());
    if (topicName in [TopicName.MULTIPLICATION, TopicName.DIVISION]) {
      operationType = mulOrDiv[wildcard];
    } else {
      operationType = plusOrMinus[wildcard];
    }
    operand = generateNumber(digitsCnt, level);

    isMapAllowedOperation = isAllowedOperation(
      topicName,
      level.toString(),
      currentValue,
      operationType,
      operand,
    );
    const result = doOperation(currentValue, operand, operationType);
    isAllowedResult = result > 0 && result.toString().length === digitsCnt;
  } while (!isMapAllowedOperation || !isAllowedResult);

  return {
    operationType,
    operand,
  };
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

function generatePlusMinusTaskOperations(
  taskConfig: ITaskConfig,
): ITaskGenerationResult {
  const operations: IOperation[] = [];
  let currentValue: number = 0;
  operations.push({
    operationType: OperationType.PLUS,
    operand: generateNumber(taskConfig.digitsCnt, taskConfig.level),
  });
  currentValue = operations[0].operand;
  for (let i = 1; i < taskConfig.operationsCnt; i += 1) {
    const nextOperation = generateOperation(
      taskConfig.topic,
      taskConfig.level,
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
