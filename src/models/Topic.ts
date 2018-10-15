import mongoose from 'mongoose';
import { ITopic, ILevel, OperationType } from '../interfaces';

export type ILevelModel = mongoose.Document & ILevel;
const levelSchema = new mongoose.Schema({
  levelName: String,
  rules: [String],
  order: Number,
  maxDigit: Number,
  [OperationType.MINUS]: mongoose.SchemaTypes.Mixed,
  [OperationType.PLUS]: mongoose.SchemaTypes.Mixed,
});
export const Level = mongoose.model<ILevelModel>('level', levelSchema);

export type ITopicModel = mongoose.Document & ITopic;
const topicSchema = new mongoose.Schema({
  topicName: String,
  levels: [levelSchema],
});
export const Topic = mongoose.model<ITopicModel>('topic', topicSchema);
