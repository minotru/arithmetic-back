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

router.post(
  '/auth/login',
  // passport.authenticate('local'),
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        if (info.message === 'no_user') {
          return res.status(401).json({ error: 'credentials' });
        }
        return res.status(401).json({ error: 'inactive' });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json(user);
      });
    })(req, res, next);
  },
  (req, res) => res.json(req.user),
);
router.get('/auth/logout', (req, res) => {
  req.logOut();
  res.json('logged out');
});
router.use('/api/admin', isAdmin, adminRoutes);
router.use('/api/student', isAuthenticated, studentRoutes);

// router.use((req, res) => res.status(404).send('sorry, not found'));
