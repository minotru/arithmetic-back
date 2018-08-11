import mongoose from 'mongoose';
import { UserRole, IUser } from '../interfaces';
const secret = process.env.SESSION_SECRET;

export declare type IUserModel = mongoose.Document & IUser;

const userSchema = new mongoose.Schema({
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

const User: mongoose.Model<IUserModel> =  mongoose.model<IUserModel>('User', userSchema);
export default User;
