export interface ITaskConfig {
  topic: TopicName;
  level: number;
  digitsCnt?: number;
  operationsCnt?: number;
  speed?: number;
  withRemainder?: boolean;
  topicType?: TopicType;
}

export interface IOperation {
  operationType: OperationType;
  operand: number;
}

export interface ITask {
  userId?: string;
  config: ITaskConfig;
  isCorrect?: boolean;
  createdAt: Date;
}

export enum TopicType {
  PLUS_MINUS = 'plus_minus',
  MULTIPLICATION = 'multiplication',
  DIVISION = 'division',
}

export enum OperationType {
  PLUS = 'plus',
  MINUS = 'minus',
  MULTIPLY = 'mul',
  DIVIDE = 'div',
}

export enum TopicName {
  SIMPLE = 'simple',
  BROTHER = 'brother',
  FRIEND = 'friend',
  FRIEND_PLUS_BROTHER = 'friend-plus-brother',
  MULTIPLICATION = 'multiplication',
  DIVISION = 'division',
}
