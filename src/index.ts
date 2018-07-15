import { config } from 'dotenv';
config();
import { TaskGenerator, TaskGeneratorConfig } from './tasks';
import { levels } from './levels';

const taskGeneratorConfig: TaskGeneratorConfig = {
  digitsCnt: 2,
  topic: 'simple',
  operationsCnt: 5,
  level: 3,
};

const taskGenerator = new TaskGenerator(taskGeneratorConfig);

console.log('hello from ts');

console.log(levels);
