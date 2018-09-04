import { Router } from 'express';
import { ITaskConfig } from '../interfaces';
import { Task, ITaskModel } from '../models';
import { generateTaskOperations } from '../utils/taskGenerator';

const router = Router();

router.post('/tasks', (req, res) => {
  const taskConfig: ITaskConfig = req.body;
  const userId = <string>req.user.id;
  const { operations, answer } = generateTaskOperations(taskConfig);
  const task = new Task({
    userId,
    answer,
    config: taskConfig,
    isCorrect: false,
  });
  task.save()
    .then((task) => {
      res.json({
        task,
        operations,
      });
    })
    .catch(err => res.send(err));
});

router.post('/tasks/:taskId', (req, res) => {
  const taskId = req.params['taskId'];
  const userAnswer = req.body['answer'];
  Task.findById(taskId)
    .then((task) => {
      if (!task) {
        return res.sendStatus(404);
      }
      task.isCorrect = task.answer === userAnswer;
      return task
        .save()
        .then(
          task => res.json(task),
        );
    })
    .catch(err => res.send(err));
});

export default router;
