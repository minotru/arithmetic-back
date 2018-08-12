import { Document, Schema, Model, model, SchemaType } from 'mongoose';
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
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Task: Model<ITaskModel> = model<ITaskModel>('Task', taskSchema);
export default Task;
