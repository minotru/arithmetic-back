import { Router } from 'express';
import { ITaskConfig } from '../interfaces';
import { Task } from '../models';
import { generateTaskOperations } from '../utils/taskGenerator';

const router = Router();

router.post('/tasks', (req, res) => {
  const taskConfig: ITaskConfig = req.body;
  const userId = <string>req.user.id;
  const { operations, answer } = generateTaskOperations(taskConfig);
  const task = new Task({
    userId,
    config: taskConfig,
    isCorrect: false,
  });
  task.save()
    .then((task) => {
      res.json(Object.assign(
        {},
        task.toObject(),
        {
          operations,
          answer,
        },
      ));
    })
    .catch(err => res.send(err));
});

router.post('/tasks/:taskId', (req, res) => {
  const taskId = req.params['taskId'];
  const { isCorrect } = req.body;
  Task.findById(taskId)
    .then((task) => {
      if (!task) {
        return res.sendStatus(404);
      }
      task.isCorrect = isCorrect;
      return task
        .save()
        .then(() => res.json());
    })
    .catch(err => res.send(err));
});

export default router;
