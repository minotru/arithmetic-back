import express from 'express';
// import { generateTask, TaskConfig } from '../tasks';

export const router = express.Router();

router.get('/',  (req, res) => {
  res.send('hello');
});

// router.get('/tasks/', (req, res) => {
//   res.send(generateTask(<TaskConfig>req.query).operations);
// });
