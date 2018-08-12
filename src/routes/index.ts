import { Router, Request, Response, RequestHandler } from 'express';
import { default as adminRoutes } from './admin';
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

router.post('/login', passport.authenticate('local'), (req, res) => res.send('logged in'));
router.use('/api/admin', isAdmin, adminRoutes);
router.use((req, res) => res.status(404).send('sory, not found'));
