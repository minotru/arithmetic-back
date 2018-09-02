import mongoose from 'mongoose';
import { ITopic, ILevel } from '../interfaces';

export type ITopicModel = mongoose.Document & ITopic;
const topicSchema = new mongoose.Schema({
  topicName: String,
  levels: [mongoose.SchemaTypes.Mixed],
});
export const Topic = mongoose.model<ITopicModel>('topic', topicSchema);
