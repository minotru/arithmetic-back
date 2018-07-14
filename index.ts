import { TaskGenerator, TaskGeneratorConfig } from './TaskGenerator';

const taskGeneratorConfig: TaskGeneratorConfig = {
  digitsCnt: 2,
  section: 'simple',
  operationsCnt: 5,
  level: 3,
};

const taskGenerator = new TaskGenerator(taskGeneratorConfig);

console.log('Hello from ts');
