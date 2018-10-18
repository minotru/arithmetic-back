import mongoose from 'mongoose';
import { ITopic, ILevel, OperationType, IRule } from '../interfaces';

const ruleSchema = new mongoose.Schema({
  values: [String],
  ranges: [String],
});

const levelSchema = new mongoose.Schema({
  levelName: String,
  order: Number,
  maxDigit: Number,
  [OperationType.MINUS]: mongoose.SchemaTypes.Mixed,
  [OperationType.PLUS]: mongoose.SchemaTypes.Mixed,
});

export type ITopicModel = mongoose.Document & ITopic;
const topicSchema = new mongoose.Schema({
  topicName: String,
  levels: [levelSchema],
});
export const Topic = mongoose.model<ITopicModel>('topic', topicSchema);
