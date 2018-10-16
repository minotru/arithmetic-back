import {
  IGameMap,
  TopicName,
  ILevel,
  OperationType,
  IOperation,
  RulesType,
  IRulesByOperation,
  ITopic,
} from '../interfaces/task';

let gameMap: IGameMap = null;

export function setGameMap(newGameMap: IGameMap) {
  gameMap = newGameMap;
}

export function getGameMap(): IGameMap {
  return gameMap;
}

export function getLevel(topicName: TopicName, levelName: string): ILevel {
  const topic = gameMap.find(t => t.topicName === topicName);
  if (!topic) {
    throw Error(`There is no topic ${topicName} in game map`);
  }
  const level = topic.levels.find(l => l.levelName === levelName);
  if (!level) {
    throw Error(`There is no level ${levelName} in ${topicName} in game map`);
  }
  return level;
}
