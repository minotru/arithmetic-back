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
  Topic.find().lean().then(topics => setGameMap(topics));
}

function fillTopics() {
  const map = loadGameMap();
  Topic.create(map);
}

function processMap() {
  const oldMap: any[] = JSON.parse(readFileSync('gameMap.json').toString());
  const skeleton = generateGameMapSkeleton();
  const mapRules = (oldRules: any[]) => {
  };
  oldMap.forEach((topic, index) => {
  });

  function parseRange(str) { return str.split('-').map(s => Number.parseInt(s)); }
  function rangeToObj(str) { let a = parseRange(str); return { from: a[0], to: a[1] || a[0] }; }
  function parseAllRanges(str) { return str.replace(' ', '').split(',').map(s => rangeToObj(s)); }
  function doAll(text) { return JSON.stringify(parseAllRanges(text)); }
}

if (!isProd) {
  const config = dotenv.parse('./.env');
  dotenv.config(config);
}

mongoose.Promise = Promise;
const MongoStore = connectMongo(expressSession);
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(async () => {
    // await fillGameMapSkeleton();
    console.log('MongoDB connected');
    loadGameMapFromDB();
    // fillTopics();
    // console.log(JSON.stringify(generateGameMapSkeleton()));
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
