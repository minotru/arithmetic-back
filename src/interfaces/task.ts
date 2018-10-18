export interface ITaskConfig {
  digitsCnt: number;
  topic: TopicName;
  level: string;
  operationsCnt: number;
  speed: number;
  withRemainder: boolean;
}

export interface IOperation {
  operationType: OperationType;
  operand: number;
}

export interface ITask {
  userId?: string;
  config: ITaskConfig;
  answer: number;
  isCorrect?: boolean;
  createdAt: Date;
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

export enum RulesType {
  ALLOWED = 'allowed',
  FORBIDDEN = 'forbidden',
}

export interface IRange {
  from: number;
  to: number;
}

export interface IRule {
  values: IRange[];
  ranges: IRange[];
}

export interface IRulesByOperation {
  rulesType: RulesType;
  rules: IRule[];
}

export interface ILevel {
  levelName: string;
  order: number;
  maxDigit: number;
  [OperationType.MINUS]: IRulesByOperation;
  [OperationType.PLUS]: IRulesByOperation;
}

export interface ITopic {
  topicName: TopicName;
  levels: ILevel[];
}

export type IGameMap = ITopic[];
