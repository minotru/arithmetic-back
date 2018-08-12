import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import connectMongo from 'connect-mongo';
import passport from 'passport';
import morgan from 'morgan';

import { router } from './routes';
import { User, IUserModel } from './models/User';

import './config/passport';
import { IGameMap } from './interfaces';
import { readFileSync } from 'fs';
import { setGameMap } from './utils/gameMap';

function loadGameMap(): IGameMap {
  const content: string = readFileSync('gameMap.json').toString();
  return <IGameMap>JSON.parse(content);
}

mongoose.Promise = Promise;
const MongoStore = connectMongo(expressSession);
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
const mongooseConnection = mongoose.connection;
const logger = morgan('dev');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    mongooseConnection,
  }),
  resave: true,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger);
app.use(router);

setGameMap(loadGameMap());

app.listen(process.env.SERVER_PORT, () => {
  console.log(`server is listening on ${process.env.SERVER_PORT}`);
});
