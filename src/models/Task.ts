import { Document, Schema, Model, model, SchemaType } from 'mongoose';
import { ITask } from '../interfaces';

export type ITaskModel = Document & ITask;

const taskSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
    toJSON: {
      transform (doc, ret) {
        ret.id = doc._id;
        delete ret._id;
        delete ret.updatedAt;
        delete ret.__v;
      },
    },
  },
);

export const Task: Model<ITaskModel> = model<ITaskModel>('Task', taskSchema);
