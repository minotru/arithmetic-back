import { TopicName } from './interfaces';

export type IGameMapStructure = {
  topicName: TopicName,
  levels: {
    levelName: number,
    order: number,
    maxDigit?: number,
  }[],
}[];

export const GAME_MAP_STRUCTURE: IGameMapStructure = [
  {
    topicName: TopicName.SIMPLE,
    levels: [
      {
        levelName: 2,
        order: 1,
        maxDigit: 2,
      },
      {
        levelName: 3,
        order: 2,
        maxDigit: 3,
      },
      {
        levelName: 4,
        order: 3,
        maxDigit: 4,
      },
      {
        levelName: 5,
        order: 4,
        maxDigit: 5,
      },
      {
        levelName: 6,
        order: 5,
        maxDigit: 6,
      },
      {
        levelName: 7,
        order: 6,
        maxDigit: 7,
      },
      {
        levelName: 8,
        order: 7,
        maxDigit: 8,
      },
      {
        levelName: 9,
        order: 8,
        maxDigit: 8,
      },
    ],
  },
  {
    topicName: TopicName.BROTHER,
    levels: [
      {
        levelName: 4,
        order: 11,
      },
      {
        levelName: 3,
        order: 12,
      },
      {
        levelName: 2,
        order: 13,
      },
      {
        levelName: 1,
        order: 14,
      },
    ],
  },
  {
    topicName: TopicName.FRIEND,
    levels: [
      {
        levelName: 9,
        order: 21,
      },
      {
        levelName: 8,
        order: 22,
      },
      {
        levelName: 7,
        order: 23,
      },
      {
        levelName: 6,
        order: 24,
      },
      {
        levelName: 5,
        order: 25,
      },
      {
        levelName: 4,
        order: 26,
      },
      {
        levelName: 3,
        order: 27,
      },
      {
        levelName: 2,
        order: 28,
      },
      {
        levelName: 1,
        order: 29,
      },
    ],
  },
  {
    topicName: TopicName.FRIEND_PLUS_BROTHER,
    levels: [
      {
        levelName: 6,
        order: 31,
      },
      {
        levelName: 7,
        order: 32,
      },
      {
        levelName: 8,
        order: 33,
      },
      {
        levelName: 9,
        order: 34,
      },
    ],
  },
];
