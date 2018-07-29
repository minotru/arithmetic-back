import { Document, Schema, Model, model } from 'mongoose';
const secret = process.env.SESSION_SECRET;

export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

export interface UserModel extends Document {
  login?: string;
  passwordHash?: string;
  role?: UserRole;
  name?: string;
  surname?: string;
  isActive?: boolean;
  phoneNumber?: string;
}

const userSchema = new Schema({
  login: {
    type: String,
    unique: true,
  },
  passwordHash: String,
  role: {
    type: String,
    enum: [UserRole.STUDENT, UserRole.ADMIN],
  },
  name: String,
  surname: String,
  isActive: Boolean,
  phoneNumber: String,
});

export const User: Model<UserModel> =  model<UserModel>('User', userSchema);
