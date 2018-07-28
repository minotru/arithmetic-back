import { readFileSync } from 'fs';
import {
  GameMap,
  OperationType,
  TopicName,
  setGameMap,
}  from './levels';
import { generateTask, TaskConfig, Task } from './tasks';
import express from 'express';
import { router } from './routes';

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

const app = express();
app.use(router);
app.listen(process.env.PORT);
