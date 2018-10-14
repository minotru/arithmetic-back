import { Router, Request, Response, RequestHandler } from 'express';
import { NextFunction } from 'connect';
import passport from 'passport';

import { IUser, UserRole } from '../interfaces';
import { default as adminRoutes } from './admin';
import { default as studentRoutes } from './student';
import { default as authRoutes } from './auth';


export const router = Router();

function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!(<any>req).isAuthenticated()) {
    return res.sendStatus(401);
  }
  const user = <IUser>req.user;
  if (user.role === UserRole.ADMIN) {
    return next();
  }
  return res.status(401).send('Not admin');
}

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
}

router.use('/auth', authRoutes);
router.use('/api/admin', isAdmin, adminRoutes);
router.use('/api/student', isAuthenticated, studentRoutes);
