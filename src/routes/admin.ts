import { Router } from 'express';
import { User, IUserModel, Task } from '../models';
import { IUser, UserRole, TopicName, TopicType } from '../interfaces';

function getTopicType(topicName: TopicName): TopicType {
  if (topicName === TopicName.MULTIPLICATION) {
    return TopicType.MULTIPLICATION;
  }
  if (topicName === TopicName.DIVISION) {
    return TopicType.DIVISION;
  }
  return TopicType.PLUS_MINUS;
}

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
  const topicType = req.query['topicType'];
  const tasksPerPage = 100;
  if (!userId) {
    return res.status(400).send('userId is not present');
  }

  return Task
    // .find({
    //   userId,
    //   $or: [
    //     { topicType },
    //     {
    //       topicType: {
    //         $exists: topicType !== TopicType.PLUS_MINUS,
    //       },
    //     }
    //   ]
    // })
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(tasksPerPage)
    .then(tasks => res.json(tasks));
});

export default router;
