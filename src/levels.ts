import {
  GameMap,
  TopicName,
  ILevel,
  OperationType,
  IOperation,
  RestrictionsType,
} from './interfaces/task';

let gameMap: GameMap = null;

export function setGameMap(newGameMap: GameMap) {
  gameMap = newGameMap;
}

export function getGameMap(): GameMap {
  return gameMap;
}

function getLevel(topicName: TopicName, levelName: string): ILevel {
  if (!gameMap[topicName]) {
    throw Error(`There is no topic ${topicName} in game map`);
  }
  if (!gameMap[topicName][levelName]) {
    throw Error(`There is no level ${levelName} in ${topicName} in game map`);
  }
  return gameMap[topicName][levelName];
}

function isInRange(value: number, range: string): boolean {
  const rangeParts: number[] = range.split('-').map(part => Number.parseInt(part));
  if (rangeParts.length === 1 && rangeParts[0] === value) {
    return true;
  }
  if (value >= rangeParts[0] && value <= rangeParts[1]) {
    return true;
  }
  return false;
}

export function isAllowedOperation(
  topicName: TopicName,
  levelName: string,
  currentValue: number,
  operation: OperationType,
  operand: number,
): boolean {
  const level: ILevel = getLevel(topicName, levelName);
  if (!level[operation]) {
    return false;
  }
  if (!level[operation][currentValue]) {
    return true;
  }
  const restrictionsType = level[operation][currentValue].restrictionsType;
  const restrictions = level[operation][currentValue].restrictions;
  switch (restrictionsType) {
    case RestrictionsType.ALLOWED:
      return restrictions.some(range => isInRange(operand, range));
    case RestrictionsType.FORBIDDEN:
      return !restrictions.some(range => isInRange(operand, range));
  }
}
