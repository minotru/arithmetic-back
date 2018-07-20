export enum OperationType {
  PLUS = '+',
  MINUS = '-',
  MULTIPLY = '*',
  DIVIDE = '/',
}

export enum TopicName {
  SIMPLE = 'simple',
  BROTHER = 'brother',
  FRIEND_AND_BROTHER = 'friend-plus-brother',
  MULTIPLICATION = 'multiplication',
  DIVISION = 'division',
}

export declare type Level = {
  [operation: string]: {
    [leftValue: string]: string[],
  },
};
export declare type Topic = { [levelName: string]: Level };
export declare type GameMap = { [topic: string]: Topic };

let gameMap: GameMap = null;

function setGameMap(newGameMap: GameMap) {
  gameMap = newGameMap;
}

function getGameMap(): GameMap {
  return gameMap;
}

function getLevel(topicName: TopicName, levelName: string): Level {
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

export function isFitsRange(value: number, range: string): boolean {
  const isInverted: boolean = range[0] === '!';
  const isInRangeFlag: boolean =
    isInRange(value, isInverted ? range.substr(1) : range);
  if (isInverted) {
    return !isInRangeFlag;
  }
  return isInRangeFlag;
}

function isAllowedOperation(
  topicName: TopicName,
  levelName: string,
  currentValue: number,
  operation: OperationType,
  operand: number,
): boolean {
  const level: Level = getLevel(topicName, levelName);
  if (!level[operation]) {
    return false;
  }
  if (!level[operation][currentValue]) {
    return true;
  }
  return level[operation][currentValue]
    .every(range => isFitsRange(operand, range));
}
