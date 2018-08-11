import { readFileSync } from 'fs';
import express from 'express';
import { router } from './routes';
import mongoose from 'mongoose';
import { default as User, IUserModel } from './models/User';
import { IUser, UserRole } from './interfaces';

// function loadGameMap(): GameMap {
//   const content: string = readFileSync('gameMap.json').toString();
//   return <GameMap>JSON.parse(content);
// }

// setGameMap(loadGameMap());

// const app = express();
// app.use(router);
// app.listen(process.env.SERVER_PORT);

mongoose.connect(process.env.MONGODB_URI);
const userObj: IUser = {
  login: 'user1',
  passwordHash: '12345678',
  name: 'Simon',
  surname: 'Karasik',
  phoneNumber: '+375298735450',
  role: UserRole.ADMIN,
  isActive: true,
};
