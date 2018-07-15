export interface TaskGeneratorConfig {
  digitsCnt: number;
  topic: string;
  level: number;
  operationsCnt: number;
}

export enum OperationType {
  PLUS = '+',
  MINUS = '-',
  MULTIPLY = '*',
  DIVIDE = '/',
}

export interface Task {
  pipe: number[];
}

// function checkTask(task: Task, answer: number, remainder: number = 0): boolean {
//   switch (task.operation) {
//     case OperationType.PLUS:
//       return task.number1 + task.number2 === answer;
//     case OperationType.MINUS:
//       return task.number1 - task.number2 === answer;
//     case OperationType.MULTIPLY:
//       return task.number1 * task.number2 === answer;
//     case OperationType.DIVIDE:
//       return Math.floor(task.number1 / task.number2) === answer &&
//         task.number1 % task.number2 === remainder;
//   }
// }

export class TaskGenerator {
  constructor(private config: TaskGeneratorConfig) {
  }

}
