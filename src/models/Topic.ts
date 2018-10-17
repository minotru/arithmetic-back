import mongoose from 'mongoose';
import { ITopic, ILevel, OperationType, IRule } from '../interfaces';

const rangeSchema = new mongoose.Schema({
  from: Number,
  to: Number,
});

const ruleSchema = new mongoose.Schema({
  value: rangeSchema,
  ranges: [rangeSchema],
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
