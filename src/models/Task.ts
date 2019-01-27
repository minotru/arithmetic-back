import { Document, Schema, Model, model, SchemaType } from 'mongoose';
import { ITask } from '../interfaces';

export type ITaskModel = Document & ITask;

function taskTransform(doc, ret) {
  ret.id = doc._id;
  delete ret._id;
  delete ret.updatedAt;
  delete ret.__v;
  ret.date = doc.createdAt;
  delete ret.createdAt;
  return ret;
}

const taskSchema = new Schema(
  {
    config: {
      digitsCnt: Number,
      topic: String,
      level: Number,
      operationsCnt: Number,
      speed: Number,
      withRemainder: Boolean,
    },
    isCorrect: Boolean,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: taskTransform,
    },
    toObject: {
      transform: taskTransform,
    },
  },
);

export const Task: Model<ITaskModel> = model<ITaskModel>('Task', taskSchema);
