import { Router } from 'express';
import { User, IUserModel, Task } from '../models';
import { IUser } from '../interfaces';

const router = Router();

router.post('/users', (req, res) => {
  const user: IUserModel = new User(req.body);
  user
    .save()
    .then(() => {
      res.status(200);
    })
    .catch(err => res.status(400).send({
      error: 'User exists',
    }));
});

router.get('/users', (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(err => res.send(err));
});

router.delete('/users/:id', (req, res) => {
  const userId = <string>req.params['id'];
  User.findByIdAndRemove(userId)
    .then(() => res.send('Deleted'))
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

export default router;
