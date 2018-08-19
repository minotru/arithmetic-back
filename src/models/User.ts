import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { UserRole, IUser } from '../interfaces';
import { NextFunction } from 'express';

type ComparePasswordFunction = (
  candidatePassword: string,
  cb: (err: any, isMatch: boolean) => void,
) => void;

export declare type IUserModel = mongoose.Document & IUser & {
  comparePassword: ComparePasswordFunction,
};

const userSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      unique: true,
    },
    password: String,
    role: {
      type: String,
      enum: [UserRole.STUDENT, UserRole.ADMIN],
    },
    name: String,
    surname: String,
    isActive: Boolean,
    phoneNumber: String,
  },
  {
    toJSON: {
      transform (doc, ret) {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

const comparePassword: ComparePasswordFunction = function (candidatePassword, cb) {
  // bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    // cb(err, isMatch);
  // });
  return cb(null, candidatePassword === this.password);
};

userSchema.methods.comparePassword = comparePassword;
// userSchema.pre('save', function (next: NextFunction) {
//   if (!this.isModified('password')) {
//     return next();
//   }
//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) {
//       return next(err);
//     }
//     bcrypt.hash((<IUserModel>this).password, salt, (err: mongoose.Error, hash) => {
//       if (err) {
//         return next(err);
//       }
//       (<IUserModel>this).password = hash;
//       next();
//     });
//   });
// });

export const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>('User', userSchema);
