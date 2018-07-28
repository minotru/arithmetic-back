import { TopicName, isAllowedOperation, OperationType } from './levels';

export interface TaskConfig {
  digitsCnt: number;
  topic: TopicName;
  level: number;
  operationsCnt: number;
  speed: number;
}

export interface Operation {
  operationType: OperationType;
  operand: number;
}

export interface Task {
  taskConfig: TaskConfig;
  operations: Operation[];
  answer: number;
  isCorrect?: boolean;
}

function generateNumber(digitsCnt: number, maxDigit: number) {
  let res: number = 0;
  for (let i = 0; i < digitsCnt; i += 1) {
    let nextDigit = Math.ceil(Math.random() * maxDigit);
    if (nextDigit === 0 && i === 0 && digitsCnt === 1) {
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
): Operation {
  let operationType: OperationType;
  let operand: number;
  const plusOrMinus: OperationType[] = [OperationType.PLUS, OperationType.MINUS];
  const mulOrDiv: OperationType[] = [OperationType.MULTIPLY, OperationType.DIVIDE];
  let isMapAllowedOperation: boolean;
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
  } while (!isMapAllowedOperation || doOperation(currentValue, operand, operationType) < 0);

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

export function generateTask(taskConfig: TaskConfig): Task {
  const operations: Operation[] = [];
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
    taskConfig,
    operations,
    answer: currentValue,
  };
}
