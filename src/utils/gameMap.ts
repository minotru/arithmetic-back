import {
  IGameMap,
  TopicName,
  ILevel,
  OperationType,
  IOperation,
  RulesType,
  IRulesByOperation,
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
  let rulesByOperation: IRulesByOperation;
  if (operation === OperationType.PLUS) {
    rulesByOperation = level.plus;
  } else if (operation === OperationType.MINUS) {
    rulesByOperation = level.minus;
  } else {
    throw new Error('map rules support only plus and minus operations');
  }

  const rulesForValue = rulesByOperation.rules.find(rule => rule.value === currentValue);
  if (!rulesForValue) {
    return true;
  }
  const ranges = rulesForValue.ranges;
  const rulesType = rulesByOperation.rulesType;

  switch (rulesType) {
    case RulesType.ALLOWED:
      return ranges.some(range => isInRange(operand, range));
    case RulesType.FORBIDDEN:
      return !ranges.some(range => isInRange(operand, range));
  }
}
