// import { TaskGenerator, TaskGeneratorConfig } from './tasks';
import { readFileSync } from 'fs';
import {
  GameMap,
  OperationType,
  TopicName,
  setGameMap,
}  from './levels';
import { generateTask, TaskConfig, Task } from './tasks';

function loadGameMap(): GameMap {
  const content: string = readFileSync('gameMap.json').toString();
  return <GameMap>JSON.parse(content);
}

setGameMap(loadGameMap());

const taskConfig: TaskConfig = {
  digitsCnt: 2,
  topic: TopicName.SIMPLE,
  operationsCnt: 5,
  level: 3,
  speed: 0.8,
};
const task: Task = generateTask(taskConfig);
console.log('operations:');
console.log(JSON.stringify(task.operations));
console.log('answer:', task.answer);
