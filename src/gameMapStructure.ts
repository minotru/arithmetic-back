import { TopicName } from './interfaces';

export type IGameMapStructure = {
  topicName: TopicName,
  levels: string[],
}[];

export const GAME_MAP_STRUCTURE: IGameMapStructure = [
  {
    topicName: TopicName.SIMPLE,
    levels: ['2', '3', '4', '5', '6', '7', '8', '9'],
  },
  {
    topicName: TopicName.BROTHER,
    levels:  ['4', '3', '2', '1'],
  },
  {
    topicName: TopicName.FRIEND,
    levels:  ['9', '8', '7', '6', '5', '4', '3', '2', '1'],
  },
  {
    topicName: TopicName.FRIEND_PLUS_BROTHER,
    levels:  ['6', '7', '8', '9'],
  },
];
