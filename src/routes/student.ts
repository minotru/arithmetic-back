import { Router } from 'express';
import { ITaskConfig } from '../interfaces';
import { Task, ITaskModel } from '../models';

const router = Router();

router.post('/tasks', (req, res) => {
  const taskConfig: ITaskConfig = req.body;
  const userId = <string>req.user.id;
  const task = new Task({
    userId,
    config: taskConfig,
  });
});

export default router;
