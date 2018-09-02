import mongoose from 'mongoose';

export type IGameMapModel = mongoose.Document & {
  mapJson: string,
};

const gameMapSchema = new mongoose.Schema({
  mapJson: String,
});

export const GameMap =
  mongoose.model<IGameMapModel>('GameMap', gameMapSchema);
