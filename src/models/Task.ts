import { Document, Schema, Model, Types, model } from 'mongoose';
import { ITask } from '../interfaces';

export type ITaskModel = Document & ITask;

const taskSchema = new Schema({
  config: {
    digitsCnt: Number,
    topic: String,
    level: Number,
    operationsCnt: Number,
    speed: Number,
  },
  isCorrect: Boolean,
  answer: Number,
  userId: Types.ObjectId,
});

const Task: Model<ITaskModel> = model<ITaskModel>('Task', taskSchema);
export default Task;
