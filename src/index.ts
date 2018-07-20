// import { TaskGenerator, TaskGeneratorConfig } from './tasks';
import { readFileSync } from 'fs';
// import { inspect } from 'util';
// import { Level, LevelTopic, }

// const taskGeneratorConfig: TaskGeneratorConfig = {
//   digitsCnt: 2,
//   topic: 'simple',
//   operationsCnt: 5,
//   level: 3,
// };

function loadLevelsMap(): Object {
  const content: string = readFileSync('levelsMap.json').toString();
  return JSON.parse(content);
}

// const taskGenerator = new TaskGenerator(taskGeneratorConfig);

// console.log('hello from ts');
// console.log(inspect(loadLevelsMap(), false, null));

// process.stdout.write(loadLevelsMap().to);

// console.log(levels);
