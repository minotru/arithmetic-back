import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, IUserModel } from '../models/User';

passport.serializeUser<IUserModel, string>((user, done) => {
  done(null, user.id);
});

passport.deserializeUser<IUserModel, string>((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

passport.use(new LocalStrategy(
  { usernameField: 'login' },
  (login, password, done) => {
    User.findOne({ login }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: `No user with login ${login}` });
      }
      if (!user.isActive) {
        return done(null, false, { message: `User ${login} is not active` });
      }
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false);
      });
    });
  }));
