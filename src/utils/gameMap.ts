import {
  IGameMap,
  TopicName,
  ILevel,
  OperationType,
  IOperation,
  RulesType,
  IRulesByOperation,
  ITopic,
  IRange,
} from '../interfaces/task';

let gameMap: IGameMap = null;

function parseRange(str: string): IRange {
  const parts = str.split('-').map(part => Number.parseInt(part));
  return {
    from: parts[0],
    to: parts[1] || parts[0],
  };
}

function mapRulesByOperation(rulesByOperation: IRulesByOperation): IRulesByOperation {
  rulesByOperation.rules.forEach((rule) => {
    rule.values = (rule.values as any[]).map(parseRange);
    rule.ranges = (rule.ranges as any[]).map(parseRange);
  });
  return rulesByOperation;
}

function mapStringToRangesInMap(newGameMap: IGameMap) {
  newGameMap.forEach((topic) => {
    topic.levels.forEach((level) => {
      mapRulesByOperation(level[OperationType.PLUS]);
      mapRulesByOperation(level[OperationType.MINUS]);
    });
  });
  return newGameMap;
}

export function setGameMap(newGameMap: IGameMap) {
  gameMap = mapStringToRangesInMap(newGameMap);
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
