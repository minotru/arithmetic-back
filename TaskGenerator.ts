export interface TaskGeneratorConfig {
  digitsCnt: number;
  section: string;
  level: number;
  operationsCnt: number;
}

export class TaskGenerator {
  constructor(private config: TaskGeneratorConfig) {

  }
}
