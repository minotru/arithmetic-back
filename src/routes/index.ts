import { Router, Request, Response, RequestHandler } from 'express';
import { default as adminRoutes } from './admin';
import { default as studentRoutes } from './student';
import { NextFunction } from 'connect';
import { IUser, UserRole } from '../interfaces';
import passport from 'passport';

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

router.post('/auth/login', passport.authenticate('local'), (req, res) => res.json(req.user));
router.get('/auth/logout', (req, res) => {
  req.logOut();
  res.send('logged out');
});
router.use('/api/admin', isAdmin, adminRoutes);
router.use('/api/student', isAuthenticated, studentRoutes);
router.use((req, res) => res.status(404).send('sorry, not found'));
