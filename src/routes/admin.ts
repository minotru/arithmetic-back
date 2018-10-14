import { Router } from 'express';
import { User, IUserModel, Task } from '../models';
import { IUser, UserRole, ILevel } from '../interfaces';
import { setGameMap } from '../utils/gameMap';
import { Topic } from '../models/Topic';

const router = Router();

router.post('/users', (req, res) => {
  const user: IUserModel = new User(req.body);
  user
    .save()
    .then(user => res.json(user))
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        error: 'User exists',
      });
    });
});

router.get('/users', (req, res) => {
  User.find({ role: UserRole.STUDENT })
    .then((users) => {
      res.send(users);
    })
    .catch(err => res.send(err));
});

router.delete('/users/:id', (req, res) => {
  const userId = <string>req.params['id'];
  User.findByIdAndRemove(userId)
    .then(() => Task.remove({ userId }))
    .then(() => res.sendStatus(200))
    .catch(err => res.send(err));
});

router.get('/users/:id', (req, res) => {
  const userId = <string>req.params['id'];
  User.findById(userId)
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      res.sendStatus(404);
    })
    .catch(err => res.send(err));
});

router.put('/users/:id', (req, res) => {
  const changes = <IUser>req.body;
  const userId = <string>req.params['id'];
  console.log(changes);
  User.findByIdAndUpdate(userId, changes, { new: true })
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      res.sendStatus(404);
    })
    .catch(err => res.send(err));
});

router.get('/tasks', (req, res) => {
  const userId = req.query['userId'];
  if (!userId) {
    return res.status(400).send('userId is not present');
  }
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(400).send(`No user with id ${userId}`);
      }
      return Task.find({ userId })
        .then(tasks => res.json(tasks));
    })
    .catch(err => res.send(err));
});

router.get('/map/:topicName/:levelName', async(req, res) => {
  const topicName = req.params['topicName'];
  const levelName = req.params['levelName'];
  const topic = await Topic.findOne({ topicName });
  if (topic) {
    const level = topic.levels.find(l => l.levelName === levelName);
    if (!level) {
      res.sendStatus(404);
    } else {
      res.json(level);
    }
  } else {
    res.sendStatus(404);
  }
});

router.put('/map/:topicName/:levelName', async(req, res) => {
  const level: ILevel = <ILevel>req.body;
  const topicName = req.params['topicName'];
  const levelName = req.params['levelName'];
  const topic = await Topic.findOne({ topicName });
  if (!topic) {
    return res.sendStatus(404);
  }
  const levelInd = topic.levels.findIndex(level => level.levelName === levelName);
  if (levelInd === -1) {
    return res.sendStatus(404);
  }
  topic.levels[levelInd] = level;
  await Topic.findOneAndUpdate({ topicName }, topic);
  await Topic.find({}, topics => setGameMap(topics));
  res.json(level);
});

export default router;
