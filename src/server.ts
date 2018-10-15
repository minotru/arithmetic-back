import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import connectMongo from 'connect-mongo';
import passport from 'passport';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import { router } from './routes';
import { User, IUserModel } from './models/User';

import './config/passport';
import { IGameMap } from './interfaces';
import { readFileSync } from 'fs';
import { Topic } from './models/Topic';
import { setGameMap } from './utils/gameMap';
import { generateGameMapSkeleton } from './gameMapStructure';

const isProd = process.env.NODE_ENV === 'production';

function loadGameMap(): IGameMap {
  const content: string = readFileSync('gameMap.json').toString();
  return <IGameMap>JSON.parse(content);
}

async function fillGameMapSkeleton() {
  const topics = generateGameMapSkeleton();
  return Topic.create(topics);
}

async function loadGameMapFromDB() {
  const map: IGameMap = <IGameMap>await Topic.find({});
  setGameMap(map);
}

function fillTopics() {
  const map = loadGameMap();
  Topic.create(map);
}

if (!isProd) {
  const config = dotenv.parse('./.env');
  dotenv.config(config);
}

mongoose.Promise = Promise;
const MongoStore = connectMongo(expressSession);
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(async() => {
    // await fillGameMapSkeleton();
    console.log('MongoDB connected');
    loadGameMapFromDB();
  })
  .catch((err) => {
    console.error('MongoDB connection error');
    console.error(err);
  });
const mongooseConnection = mongoose.connection;

const logger = morgan('dev');

const app = express();
if (!isProd) {
  app.use(cors({
    credentials: true,
    origin: 'http://localhost:4200',
  }));
}
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
app.use(passport.initialize());
app.use(passport.session());
app.use(logger);

app.use(express.static('public'));
app.use(router);
app.use((req, res) => res.redirect('/'));

app.listen(process.env.PORT, () => {
  console.log(`server is listening on ${process.env.PORT}`);
});
