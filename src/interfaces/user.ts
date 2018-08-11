export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

export interface IUser {
  login: string;
  passwordHash: string;
  role: UserRole;
  name: string;
  surname: string;
  isActive: boolean;
  phoneNumber: string;
}
