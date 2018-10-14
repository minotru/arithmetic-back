import { Router }  from 'express';
import passport from 'passport';

import { IUser } from '../interfaces';

const router = Router();

router.post(
  '/login',
  (req, res, next) => {
    passport.authenticate('local', (err, user: IUser, info) => {
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
        delete user.password;
        return res.json(user);
      });
    })(req, res, next);
  },
  (req, res) => res.json(req.user),
);

router.get('/logout', (req, res) => {
  req.logOut();
  res.sendStatus(200);
});

export default router;
