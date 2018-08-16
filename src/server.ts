import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import connectMongo from 'connect-mongo';
import passport from 'passport';
import morgan from 'morgan';
import cors from 'cors';

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
// app.options('*', cors({
//   credentials: true,
//   origin: 'http://localhost:4200',
// }));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', '*');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });
app.use(cors({
  credentials: true,
  origin: 'http://localhost:4200',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    mongooseConnection,
  }),
  resave: false,
  saveUninitialized: false,
}));
// app.use(cors({
//   credentials: true,
// }));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger);

app.use(router);

setGameMap(loadGameMap());

app.listen(process.env.SERVER_PORT, () => {
  console.log(`server is listening on ${process.env.SERVER_PORT}`);
});
