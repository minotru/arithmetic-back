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

function loadGameMap(): IGameMap {
  const content: string = readFileSync('gameMap.json').toString();
  return <IGameMap>JSON.parse(content);
}

async function loadGameMapFromDB() {
  const map: IGameMap = <IGameMap>await Topic.find({});
  setGameMap(map);
}

function fillTopics() {
  const map = loadGameMap();
  Topic.create(map).then(x => console.log(x));
}

if (process.env.NODE_ENV !== 'production') {
  const config = dotenv.parse('./.env');
  dotenv.config(config);
}

// mongoose.Promise = Promise;
// const MongoStore = connectMongo(expressSession);
// mongoose
//   .connect(process.env.MONGODB_URI, { useMongoClient: true })
//   .then(() => loadGameMapFromDB());
// const mongooseConnection = mongoose.connection;
const logger = morgan('dev');

const app = express();
app.use(cors({
  credentials: true,
  origin: 'http://localhost:4200',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressSession({
//   secret: process.env.SESSION_SECRET,
//   store: new MongoStore({
//     mongooseConnection,
//   }),
//   resave: false,
//   saveUninitialized: false,
// }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(logger);

app.use(express.static('public'));
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`server is listening on ${process.env.PORT}`);
});

// const map: IGameMap = [];
// const structure = GAME_MAP_STRUCTURE;
// structure.forEach((topic) => {
//   const mapTopic: ITopic = {
//     topicName: topic.topicName,
//     levels: [],
//   };
//   topic.levels.forEach((levelName) => {
//     mapTopic.levels.push({
//       levelName,
//       minus: {
//         rulesType: RulesType.ALLOWED,
//         rules: [],
//       },
//       plus: {
//         rulesType: RulesType.ALLOWED,
//         rules: [],
//       },
//     });
//   });
//   map.push(mapTopic);
// });

// writeFileSync('gameMapUpdate.json', JSON.stringify(map));
